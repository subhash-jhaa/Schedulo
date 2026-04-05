import { db } from "@/lib/db";
import { availability, users } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    const body = await req.json();
    const { days, duration, buffer, timezone } = body;

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
      timezone: timezone || 'UTC',
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
