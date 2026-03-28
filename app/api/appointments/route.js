import { db } from "@/lib/db";
import { appointments } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.hostId, userId))
      .orderBy(desc(appointments.date));

    return NextResponse.json(userAppointments);
  } catch (error) {
    console.error("GET /api/appointments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = await auth();
    
    // For manual booking, we might not have a userId in the session 
    // if a guest is booking. In that case, hostId should be in the body.
    const newAppointment = await db.insert(appointments).values({
      ...body,
      status: "scheduled",
      createdAt: new Date(),
    }).returning();

    return NextResponse.json(newAppointment[0]);
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
