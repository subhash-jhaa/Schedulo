import { addDays, format, isAfter, isBefore, parse, startOfDay } from 'date-fns';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

/**
 * Generates available time slots for the next 14 days based on host availability and existing bookings.
 * 
 * @param {Array} availability - Array of availability rows for each day of the week.
 * @param {Array} existingAppointments - Array of already booked appointments.
 * @param {string} timezone - The guest's target timezone string.
 * @returns {Array} Array of objects containing date and its available slots.
 */
export function generateSlots(availability, existingAppointments, timezone) {
  const slotsByDate = [];
  const today = startOfDay(new Date());

  for (let i = 0; i < 14; i++) {
    const currentDate = addDays(today, i);
    const dayOfWeek = currentDate.getDay();
    const dayAvailability = availability.find(a => a.dayOfWeek === dayOfWeek && a.isActive);

    if (!dayAvailability) continue;

    const { startTime, endTime, slotDuration, bufferTime } = dayAvailability;
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Create base date objects for start and end times in the host's logic
    // We assume startTime/endTime are strings like "09:00"
    const daySlots = [];
    let currentSlotStart = parse(`${dateStr} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
    const dayEnd = parse(`${dateStr} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());

    while (isBefore(currentSlotStart, dayEnd)) {
      const currentSlotEnd = new Date(currentSlotStart.getTime() + slotDuration * 60000);
      
      if (isAfter(currentSlotEnd, dayEnd)) break;

      // Check for conflicts with existing appointments
      const hasConflict = checkConflict(currentSlotStart, currentSlotEnd, existingAppointments);

      if (!hasConflict) {
        // Convert the slot (assumed to be in host context, typically UTC in DB) to guest timezone
        // If DB stores as UTC, we treat currentSlotStart as UTC
        const zonedStart = utcToZonedTime(currentSlotStart, timezone);
        const zonedEnd = utcToZonedTime(currentSlotEnd, timezone);

        daySlots.push({
          start: zonedStart,
          end: zonedEnd,
          label: formatSlotLabel(zonedStart, timezone)
        });
      }

      // Move to next slot including buffer
      currentSlotStart = new Date(currentSlotEnd.getTime() + bufferTime * 60000);
    }

    if (daySlots.length > 0) {
      slotsByDate.push({
        date: dateStr,
        slots: daySlots
      });
    }
  }

  return slotsByDate;
}

/**
 * Detects the user's local timezone.
 * @returns {string} Timezone string (e.g., "America/New_York").
 */
export function detectTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Formats a date into a readable time string in a specific timezone.
 * @param {Date} date - The date to format.
 * @param {string} timezone - The target timezone.
 * @returns {string} Formatted time string (e.g., "10:00 AM").
 */
export function formatSlotLabel(date, timezone) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone
  }).format(date);
}

/**
 * Checks if a requested time slot overlaps with any existing appointments.
 * @param {Date} newStart - Proposed start time.
 * @param {Date} newEnd - Proposed end time.
 * @param {Array} existingAppointments - Array of booked appointments.
 * @returns {boolean} True if a conflict exists.
 */
export function checkConflict(newStart, newEnd, existingAppointments) {
  return existingAppointments.some(appointment => {
    const existingStart = new Date(appointment.startTime);
    const existingEnd = new Date(appointment.endTime);
    return newStart < existingEnd && newEnd > existingStart;
  });
}

/**
 * Converts a local time string and timezone to a UTC Date object.
 * @param {string} localDateString - Date string (e.g., "2024-01-01 10:00").
 * @param {string} timezone - The local timezone.
 * @returns {Date} UTC Date object.
 */
export function toUTC(localDateString, timezone) {
  return zonedTimeToUtc(localDateString, timezone);
}
