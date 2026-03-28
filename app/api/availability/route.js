import { NextResponse } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { availability, users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const availabilitySchema = z.array(z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  slotDuration: z.number().int().positive().default(30),
  bufferTime: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
}));

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const data = await db.select().from(availability).where(eq(availability.userId, parseInt(userId)));
    return NextResponse.json(data);
  } catch (error) {
    console.error('[AVAILABILITY_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = availabilitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data', details: result.error.format() }, { status: 400 });
    }

    // Get the internal database ID for the user
    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Use a transaction or simple sequence: delete existing then insert new
    await db.transaction(async (tx) => {
      await tx.delete(availability).where(eq(availability.userId, user.id));
      
      const newRows = result.data.map(row => ({
        ...row,
        userId: user.id
      }));

      if (newRows.length > 0) {
        await tx.insert(availability).values(newRows);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[AVAILABILITY_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
