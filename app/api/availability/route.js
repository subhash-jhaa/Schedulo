import { db } from "@/lib/db";
import { availability } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userAvailability = await db
      .select()
      .from(availability)
      .where(eq(availability.userId, userId));

    return NextResponse.json(userAvailability);
  } catch (error) {
    console.error("GET /api/availability error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { days, timezone, duration, buffer } = body;

    // Delete existing availability for this user to perform a clean update
    await db.delete(availability).where(eq(availability.userId, userId));

    // Insert new availability records
    const insertData = days.map(day => ({
      userId,
      day: day.day,
      startTime: day.startTime,
      endTime: day.endTime,
      enabled: day.enabled,
      timezone,
      duration: duration.toString(),
      buffer: buffer.toString(),
      createdAt: new Date(),
    }));

    if (insertData.length > 0) {
      await db.insert(availability).values(insertData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/availability error:", error);
    return NextResponse.json({ error: "Failed to save availability" }, { status: 500 });
  }
}
