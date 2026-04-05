import { db } from "@/lib/db";
import { appointments, users } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, desc, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createCalendarEvent } from "@/lib/calendar";
import { sendBookingConfirmation } from "@/lib/email";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let [user] = await db.select().from(users).where(eq(users.supabaseId, supabaseUser.id));
    
    // Auto-create/sync user if missing
    if (!user) {
      // Check if user exists with the same email first
      const [byEmail] = await db.select().from(users).where(eq(users.email, supabaseUser.email));
      if (byEmail) {
        // Link the existing user record to this new Supabase ID
        const [updated] = await db.update(users).set({ supabaseId: supabaseUser.id }).where(eq(users.id, byEmail.id)).returning();
        user = updated;
      } else {
        const [newUser] = await db.insert(users).values({
          supabaseId: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
          username: (supabaseUser.user_metadata?.username || supabaseUser.email.split('@')[0]).replace(/[^a-z0-9]/gi, '').toLowerCase() + Math.floor(Math.random() * 1000)
        }).returning();
        user = newUser;
      }
    }

    const userAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.hostUserId, user.id))
      .orderBy(desc(appointments.startTime));

    return NextResponse.json(userAppointments);
  } catch (error) {
    console.error("GET /api/appointments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { hostUsername, guestName, guestEmail, guestNote, startTime, endTime, timezone } = body;

    const [host] = await db.select().from(users).where(eq(users.username, hostUsername));
    if (!host) {
      return NextResponse.json({ error: "Host not found" }, { status: 404 });
    }

    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    // Conflict check
    const conflicts = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.hostUserId, host.id),
          eq(appointments.status, "confirmed")
        )
      );

    const hasConflict = conflicts.some(
      (a) => newStart < new Date(a.endTime) && newEnd > new Date(a.startTime)
    );

    if (hasConflict) {
      return NextResponse.json({ error: "Slot no longer available" }, { status: 409 });
    }

    const [newAppointment] = await db.insert(appointments).values({
      hostUserId: host.id,
      guestName,
      guestEmail,
      guestNote: guestNote || null,
      startTime: newStart,
      endTime: newEnd,
      timezone,
      status: "confirmed",
    }).returning();

    // Create Google Calendar event directly (no relative fetch)
    let meetLink = null;
    if (host.googleAccessToken) {
      try {
        const { eventId, hangoutLink } = await createCalendarEvent({
          accessToken: host.googleAccessToken,
          refreshToken: host.googleRefreshToken,
          hostUserId: host.id,
          title: `Meeting with ${guestName}`,
          description: `Appointment booked via Schedulo. Guest: ${guestName} (${guestEmail}).`,
          startTime: newStart,
          endTime: newEnd,
          guestEmail,
          guestName,
        });

        await db.update(appointments)
          .set({ googleEventId: eventId, meetLink: hangoutLink })
          .where(eq(appointments.id, newAppointment.id));

        meetLink = hangoutLink;
      } catch (calError) {
        console.error("Calendar event creation failed:", calError);
        // Non-fatal: appointment is still created
      }
    }

    // Send confirmation emails directly (no relative fetch)
    try {
      await sendBookingConfirmation({
        hostName: host.name,
        guestName,
        guestEmail,
        hostEmail: host.email,
        startTime: newStart,
        endTime: newEnd,
        timezone,
        meetLink,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Non-fatal
    }

    return NextResponse.json({ success: true, appointment: { ...newAppointment, meetLink } });
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
