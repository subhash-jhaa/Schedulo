import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appointments, users } from '@/lib/schema';
import { createCalendarEvent } from '@/lib/calendar';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { appointmentId, hostUserId, guestName, guestEmail, startTime, endTime } = await req.json();

    // Fetch host's tokens from database
    const [host] = await db.select().from(users).where(eq(users.id, hostUserId));
    
    if (!host || !host.googleAccessToken) {
      return NextResponse.json({ error: 'Host token not found' }, { status: 400 });
    }

    // Call calendar logic
    const { eventId, hangoutLink } = await createCalendarEvent({
      accessToken: host.googleAccessToken,
      title: `Meeting with ${guestName}`,
      description: `Appointment booked via Schedulo. Guest: ${guestName} (${guestEmail}).`,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      guestEmail,
      guestName
    });

    // Save back to database
    await db.update(appointments)
      .set({ googleEventId: eventId })
      .where(eq(appointments.id, appointmentId));

    return NextResponse.json({ success: true, eventId, meetLink: hangoutLink });
  } catch (error) {
    console.error('[API_CALENDAR_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
  }
}
