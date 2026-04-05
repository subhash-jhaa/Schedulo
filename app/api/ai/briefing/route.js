import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { appointments } from "@/lib/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ status: "no_key", summary: null });
    }

    // 1. Fetch today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tonight = new Date(today);
    tonight.setHours(23, 59, 59, 999);

    const todayAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.hostUserId, user.id),
          eq(appointments.status, "confirmed"),
          gte(appointments.startTime, today.toISOString()),
          lte(appointments.startTime, tonight.toISOString())
        )
      );

    if (todayAppointments.length === 0) {
      return NextResponse.json({ 
        summary: "Your schedule is clear for today! Take some time for yourself or focus on deep work. 🚀" 
      });
    }

    // 2. Prepare data for Gemini
    const apptList = todayAppointments.map(a => 
      `${a.guestName} at ${new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    ).join(", ");

    // 3. Call Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a professional executive assistant for a scheduling platform called Schedulo. 
    Here are the user's appointments for today: ${apptList}.
    Provide a friendly, very concise (2-3 sentences), and encouraging daily briefing for this user. 
    Mention how many meetings they have and highlight the busiest time. Be enthusiastic!`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error("AI Briefing Error:", error);
    return NextResponse.json({ error: "Failed to generate AI briefing" }, { status: 500 });
  }
}
