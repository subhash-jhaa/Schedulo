import { db } from "@/lib/db";
import { appointments, users } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    // Find host by username
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

    // Fire and forget — calendar + email
    fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId: newAppointment.id,
        hostUserId: host.id,
        guestName,
        guestEmail,
        startTime,
        endTime,
      }),
    });

    fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: newAppointment.id }),
    });

    return NextResponse.json({ success: true, appointment: newAppointment });
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
