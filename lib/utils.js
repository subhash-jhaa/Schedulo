import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateSlots(daySettings, existingAppointments) {
  if (!daySettings || !daySettings.enabled) return [];

  const { startTime, endTime, duration, buffer } = daySettings;
  const slots = [];

  let current = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);

  const totalStep = parseInt(duration) + parseInt(buffer || 0);

  while (current < end) {
    const slotTime = current.toTimeString().slice(0, 5);

    // FIX: compare against the time portion of startTime (was wrongly using app.time)
    const isBooked = existingAppointments?.some((app) => {
      if (app.status === 'cancelled') return false;
      const appTime = new Date(app.startTime).toTimeString().slice(0, 5);
      return appTime === slotTime;
    });

    if (!isBooked) {
      slots.push(slotTime);
    }

    current.setMinutes(current.getMinutes() + totalStep);
  }

  return slots;
}
