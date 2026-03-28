import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a Google Calendar event for a confirmed appointment.
 */
export async function createCalendarEvent({
  accessToken,
  title,
  description,
  startTime,
  endTime,
  guestEmail,
  guestName
}) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    oauth2Client.setCredentials({ access_token: accessToken });
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
      attendees: [
        { email: guestEmail, displayName: guestName },
      ],
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
