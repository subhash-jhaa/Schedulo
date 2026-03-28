import { NextResponse } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { appointments, users } from '@/lib/schema';
import { eq, and, ne, lt, gt, asc } from 'drizzle-orm';
import { z } from 'zod';

const appointmentSchema = z.object({
  hostUsername: z.string().min(1),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestNote: z.string().optional(),
  startTime: z.string().datetime(), // ISO string from frontend
  endTime: z.string().datetime(),
  timezone: z.string().min(1),
});

export async function GET(req) {
  try {
    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.hostUserId, user.id), ne(appointments.status, 'cancelled')))
      .orderBy(asc(appointments.startTime));

    return NextResponse.json(data);
  } catch (error) {
    console.error('[APPOINTMENTS_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const result = appointmentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data', details: result.error.format() }, { status: 400 });
    }

    const { hostUsername, guestName, guestEmail, guestNote, startTime, endTime, timezone } = result.data;
    const start = new Date(startTime);
    const end = new Date(endTime);

    const [host] = await db.select().from(users).where(eq(users.username, hostUsername));
    if (!host) {
      return NextResponse.json({ error: 'Host not found' }, { status: 404 });
    }

    // Conflict check logic: newStart < existing.endTime AND newEnd > existing.startTime
    const conflicts = await db.select().from(appointments).where(
      and(
        eq(appointments.hostUserId, host.id),
        ne(appointments.status, 'cancelled'),
        lt(appointments.startTime, end),
        gt(appointments.endTime, start)
      )
    );

    if (conflicts.length > 0) {
      return NextResponse.json({ error: 'Slot no longer available' }, { status: 409 });
    }

    const [newAppointment] = await tx.insert(appointments).values({
      hostUserId: host.id,
      guestName,
      guestEmail,
      guestNote,
      startTime: start,
      endTime: end,
      timezone,
    }).returning({ id: appointments.id });

    // Fire-and-forget triggers (async but no await)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/calendar`, {
      method: 'POST',
      body: JSON.stringify({ appointmentId: newAppointment.id })
    }).catch(err => console.error('Calendar trigger failed', err));

    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
      method: 'POST',
      body: JSON.stringify({ appointmentId: newAppointment.id })
    }).catch(err => console.error('Email trigger failed', err));

    return NextResponse.json({ success: true, appointmentId: newAppointment.id });
  } catch (error) {
    console.error('[APPOINTMENTS_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
