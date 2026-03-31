import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { appointments, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

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

    const [updated] = await db
      .update(appointments)
      .set({ status: body.status })
      .where(and(eq(appointments.id, parseInt(id)), eq(appointments.hostUserId, user.id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Appointment not found or not owned by user" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[APPOINTMENT_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
