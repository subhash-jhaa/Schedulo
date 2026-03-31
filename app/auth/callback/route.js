import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: { session, user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user && session) {
      // Sync user to database
      const supabaseId = user.id;
      const [existing] = await db.select().from(users).where(eq(users.supabaseId, supabaseId));

      if (!existing) {
        await db.insert(users).values({
          supabaseId,
          name: user.user_metadata.full_name || user.email.split('@')[0],
          email: user.email,
          username: user.user_metadata.username || user.email.split('@')[0],
          googleAccessToken: session.provider_token || null,
          googleRefreshToken: session.provider_refresh_token || null,
        });
      } else {
        // Update tokens if they exist in the session
        const updates = {};
        if (session.provider_token) updates.googleAccessToken = session.provider_token;
        if (session.provider_refresh_token) updates.googleRefreshToken = session.provider_refresh_token;
        
        if (Object.keys(updates).length > 0) {
          await db.update(users).set(updates).where(eq(users.supabaseId, supabaseId));
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // Hello, Vercel
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no proxy in between
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
