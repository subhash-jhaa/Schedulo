import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').unique().notNull(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  googleAccessToken: text('google_access_token'),
  googleRefreshToken: text('google_refresh_token'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const availability = pgTable('availability', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  dayOfWeek: integer('day_of_week'), // 0=Sun, 6=Sat
  startTime: text('start_time'), // e.g. "09:00"
  endTime: text('end_time'), // e.g. "17:00"
  slotDuration: integer('slot_duration').default(30),
  bufferTime: integer('buffer_time').default(0),
  isActive: boolean('is_active').default(true),
});

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  hostUserId: integer('host_user_id').references(() => users.id),
  guestName: text('guest_name').notNull(),
  guestEmail: text('guest_email').notNull(),
  guestNote: text('guest_note'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  timezone: text('timezone').notNull(),
  googleEventId: text('google_event_id'),
  meetLink: text('meet_link'),
  status: text('status').default('confirmed'), // confirmed|cancelled|rescheduled
  createdAt: timestamp('created_at').defaultNow(),
});
