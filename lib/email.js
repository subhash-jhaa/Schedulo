import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends booking confirmation emails to both guest and host.
 */
export async function sendBookingConfirmation({
  hostName,
  guestName,
  guestEmail,
  hostEmail,
  startTime,
  endTime,
  timezone,
  meetLink
}) {
  const dateStr = new Date(startTime).toLocaleDateString();
  const timeStr = `${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const emailStyle = `
    font-family: 'Inter', sans-serif;
    color: #ffffff;
    background-color: #080C10;
    padding: 40px;
    border-radius: 16px;
    border: 1px solid #111820;
  `;

  const accentColor = "#00D4AA";

  // Guest Email
  const guestResult = await resend.emails.send({
    from: 'Schedulo <noreply@schedulo.app>',
    to: guestEmail,
    subject: `Your meeting with ${hostName} is confirmed`,
    html: `
      <div style="${emailStyle}">
        <h2 style="color: ${accentColor}">Booking Confirmed!</h2>
        <p>Hi ${guestName}, your meeting with <strong>${hostName}</strong> is all set.</p>
        <div style="background: #111820; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>📅 <strong>Date:</strong> ${dateStr}</p>
          <p>⏰ <strong>Time:</strong> ${timeStr} (${timezone})</p>
          ${meetLink ? `<p>🔗 <strong>Meet Link:</strong> <a href="${meetLink}" style="color: ${accentColor}">${meetLink}</a></p>` : ''}
        </div>
        <p style="font-size: 12px; color: #555;">To cancel or reschedule, please contact ${hostName} directly via ${hostEmail}.</p>
      </div>
    `,
  });

  // Host Email
  const hostResult = await resend.emails.send({
    from: 'Schedulo <noreply@schedulo.app>',
    to: hostEmail,
    subject: `New booking from ${guestName}`,
    html: `
      <div style="${emailStyle}">
        <h2 style="color: ${accentColor}">New Booking Received!</h2>
        <p>Good news! <strong>${guestName}</strong> just scheduled a meeting with you.</p>
        <div style="background: #111820; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>👤 <strong>Guest:</strong> ${guestName} (${guestEmail})</p>
          <p>📅 <strong>Date:</strong> ${dateStr}</p>
          <p>⏰ <strong>Time:</strong> ${timeStr}</p>
          ${meetLink ? `<p>🔗 <strong>Meet Link:</strong> <a href="${meetLink}" style="color: ${accentColor}">${meetLink}</a></p>` : ''}
        </div>
      </div>
    `,
  });

  return { guestResult, hostResult };
}
