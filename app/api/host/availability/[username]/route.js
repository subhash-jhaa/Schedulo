import { db } from "@/lib/db";
import { users, availability, appointments } from "@/lib/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { username } = await params;

  try {
    // 1. Get host info
    const host = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!host) {
      return NextResponse.json({ error: "Host not found" }, { status: 404 });
    }

    // 2. Get host's availability settings
    const hostAvailability = await db
      .select()
      .from(availability)
      .where(eq(availability.userId, host.id));

    // 3. Get existing appointments (to filter out booked slots)
    // For simplicity, fetching all non-cancelled appointments. 
    // In production, we'd filter by date range.
    const hostAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.hostUserId, host.id),
          eq(appointments.status, "confirmed")
        )
      );

    return NextResponse.json({
      host: {
        id: host.id,
        name: host.name,
        email: host.email,
        username: host.username,
      },
      availability: hostAvailability,
      appointments: hostAppointments,
    });
  } catch (error) {
    console.error("GET /api/host/availability/[username] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
