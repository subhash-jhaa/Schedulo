import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function createCalendarEvent({
  accessToken,
  refreshToken,
  hostUserId,
  title,
  description,
  startTime,
  endTime,
  guestEmail,
  guestName,
}) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Auto-save refreshed tokens back to the database
    oauth2Client.on('tokens', async (tokens) => {
      if (tokens.access_token && hostUserId) {
        await db
          .update(users)
          .set({ googleAccessToken: tokens.access_token })
          .where(eq(users.id, hostUserId));
      }
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: title,
      description: description,
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: 'UTC',
      },
      attendees: [{ email: guestEmail, displayName: guestName }],
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    return {
      eventId: response.data.id,
      hangoutLink: response.data.hangoutLink,
    };
  } catch (error) {
    console.error('[CALENDAR_CREATE_ERROR]', error);
    throw error;
  }
}

export async function deleteCalendarEvent({ accessToken, refreshToken, eventId }) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
    return { success: true };
  } catch (error) {
    console.error('[CALENDAR_DELETE_ERROR]', error);
    throw error;
  }
}
