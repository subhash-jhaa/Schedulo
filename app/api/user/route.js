import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, username } = await req.json();

    // Check if user already exists (handles double-submit)
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId));

    if (existing) {
      return NextResponse.json(existing);
    }

    const [user] = await db
      .insert(users)
      .values({ clerkId, name, email, username })
      .returning();

    return NextResponse.json(user);
  } catch (error) {
    console.error("[API_USER_CREATE]", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
