import { NextResponse } from 'next/server';
import { sendBookingConfirmation } from '@/lib/email';
import { db } from '@/lib/db';
import { appointments, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { appointmentId } = await req.json();

    // Fetch full details
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, appointmentId));
    if (!appointment) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });

    const [host] = await db.select().from(users).where(eq(users.id, appointment.hostUserId));
    if (!host) return NextResponse.json({ error: 'Host not found' }, { status: 404 });

    // Send emails
    await sendBookingConfirmation({
      hostName: host.name,
      guestName: appointment.guestName,
      guestEmail: appointment.guestEmail,
      hostEmail: host.email,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      timezone: appointment.timezone,
      meetLink: appointment.meetLink || null
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API_EMAIL_ERROR]', error);
    return NextResponse.json({ error: 'Failed to send confirmation emails' }, { status: 500 });
  }
}
