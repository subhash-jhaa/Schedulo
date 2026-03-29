import { db } from "@/lib/db";
import { availability, users } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    if (!user) return NextResponse.json([]);

    const userAvailability = await db
      .select()
      .from(availability)
      .where(eq(availability.userId, user.id));

    return NextResponse.json(userAvailability);
  } catch (error) {
    console.error("GET /api/availability error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { days, duration, buffer } = body;

    // Clean delete and re-insert
    await db.delete(availability).where(eq(availability.userId, user.id));

    const insertData = days.map((day) => ({
      userId: user.id,
      dayOfWeek: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(day.day),
      startTime: day.startTime,
      endTime: day.endTime,
      isActive: day.enabled,
      slotDuration: parseInt(duration),
      bufferTime: parseInt(buffer),
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
