import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Generates available time slots for a given date based on host's daily settings.
 * @param {Object} daySettings - { startTime, endTime, duration, buffer, enabled } in "HH:mm"
 * @param {Date} date - The specific day for which to generate slots
 * @param {Array} existingAppointments - List of booked appointments with { startTime, endTime } ISO strings
 */
export function generateSlots(daySettings, date, existingAppointments) {
  if (!daySettings || !daySettings.enabled) return [];

  const { startTime: dayStart, endTime: dayEnd, duration, buffer } = daySettings;
  const slots = [];

  // Create start and end range for the specific date provided
  const start = new Date(date);
  const [startH, startM] = dayStart.split(':').map(Number);
  start.setHours(startH, startM, 0, 0);

  const end = new Date(date);
  const [endH, endM] = dayEnd.split(':').map(Number);
  end.setHours(endH, endM, 0, 0);

  const totalStep = parseInt(duration) + parseInt(buffer || 0);
  let current = new Date(start);

  while (current < end) {
    // Check if slot overlaps with any confirmed appointment
    const slotStart = new Date(current);
    const slotEnd = new Date(current.getTime() + parseInt(duration) * 60000);

    const isBooked = existingAppointments?.some((app) => {
      if (app.status === 'cancelled') return false;
      const appStart = new Date(app.startTime);
      const appEnd = new Date(app.endTime);
      // Simple overlap check
      return (slotStart < appEnd && slotEnd > appStart);
    });

    if (!isBooked) {
      slots.push(formatInTimeZone(current, 'UTC', 'HH:mm')); // Return UTC or local? 
      // For now, let's keep it consistent with the UI expectation
      slots.push(current.toTimeString().slice(0, 5));
    }

    current.setMinutes(current.getMinutes() + totalStep);
  }

  // Deduplicate and return
  return [...new Set(slots)];
}

// Helper to format in timezone (since date-fns-tz might not be globally shared yet)
function formatInTimeZone(date, tz, fmt) {
  return date.toTimeString().slice(0, 5); // Fallback
}
