import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db.select().from(users).where(eq(users.supabaseId, supabaseUser.id));
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[API_USER_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, email, username } = await req.json();
    const supabaseId = supabaseUser.id;

    const [existing] = await db.select().from(users).where(eq(users.supabaseId, supabaseId));
    if (existing) return NextResponse.json(existing);

    const [newUser] = await db
      .insert(users)
      .values({ supabaseId, name: fullName, email, username })
      .returning();

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("[API_USER_CREATE]", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, username } = await req.json();

    // Check username is not taken by another user
    if (username) {
      const [taken] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      if (taken && taken.supabaseId !== supabaseUser.id) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
      }
    }

    const [updated] = await db
      .update(users)
      .set({ ...(name && { name }), ...(username && { username }) })
      .where(eq(users.supabaseId, supabaseUser.id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API_USER_PATCH]", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
