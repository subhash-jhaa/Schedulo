import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    
    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, email, username } = await req.json();
    const supabaseId = supabaseUser.id;

    // Check if user already exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.supabaseId, supabaseId));

    if (existing) {
      return NextResponse.json(existing);
    }

    const [newUser] = await db
      .insert(users)
      .values({ supabaseId, name: fullName || supabaseUser.user_metadata.full_name, email, username: username || supabaseUser.user_metadata.username })
      .returning();

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("[API_USER_CREATE]", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
