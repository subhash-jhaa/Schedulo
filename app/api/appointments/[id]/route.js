import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { appointments, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { deleteCalendarEvent } from "@/lib/calendar";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(req, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    const { id } = await params;
    const body = await req.json();

    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db.select().from(users).where(eq(users.supabaseId, supabaseUser.id));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [existing] = await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.id, parseInt(id)), eq(appointments.hostUserId, user.id)));

    if (!existing) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(appointments)
      .set({
        status: body.status,
        ...(body.startTime && { startTime: new Date(body.startTime) }),
        ...(body.endTime && { endTime: new Date(body.endTime) }),
      })
      .where(and(eq(appointments.id, parseInt(id)), eq(appointments.hostUserId, user.id)))
      .returning();

    // If cancelling, delete the Google Calendar event and email the guest
    if (body.status === "cancelled") {
      if (existing.googleEventId && user.googleAccessToken) {
        try {
          await deleteCalendarEvent({
            accessToken: user.googleAccessToken,
            refreshToken: user.googleRefreshToken,
            eventId: existing.googleEventId,
          });
        } catch (e) {
          console.error("Failed to delete calendar event:", e);
        }
      }

      try {
        await resend.emails.send({
          from: "Schedulo <noreply@schedulo.app>",
          to: existing.guestEmail,
          subject: `Your meeting with ${user.name} has been cancelled`,
          html: `
            <div style="font-family: sans-serif; padding: 32px; background: #080C10; color: #fff; border-radius: 12px;">
              <h2 style="color: #FF6B6B;">Meeting Cancelled</h2>
              <p>Hi ${existing.guestName}, your meeting with <strong>${user.name}</strong> scheduled for 
              <strong>${new Date(existing.startTime).toLocaleString()}</strong> has been cancelled.</p>
              <p style="color: #aaa; font-size: 13px;">Please reach out to ${user.name} directly to reschedule.</p>
            </div>
          `,
        });
      } catch (e) {
        console.error("Failed to send cancellation email:", e);
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[APPOINTMENT_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
