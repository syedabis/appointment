/**
 * All session slots belong to the mentor's local clock in Karachi, so every
 * "has this slot passed?" decision is made against Pakistan time regardless of
 * where the visitor's device happens to be.
 */
export const PAKISTAN_TIME_ZONE = "Asia/Karachi";

/** A slot must start at least this many minutes from now to still be bookable. */
export const BOOKING_BUFFER_MINUTES = 30;

export interface PakistanNow {
  year: number;
  /** 1-12 */
  month: number;
  day: number;
  /** Minutes elapsed since midnight in Karachi. */
  minutesSinceMidnight: number;
}

export function getPakistanNow(reference: Date = new Date()): PakistanNow {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PAKISTAN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(reference);

  const part = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");

  return {
    year: part("year"),
    month: part("month"),
    day: part("day"),
    // h23 still emits 24 at midnight in some engines, so fold it back to 0.
    minutesSinceMidnight: (part("hour") % 24) * 60 + part("minute"),
  };
}

/**
 * Minutes since midnight for the START of a slot label such as
 * "09:30 AM - 09:45 AM". Returns NaN if the label cannot be parsed.
 */
export function getSlotStartMinutes(slotLabel: string): number {
  const match = slotLabel.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return Number.NaN;

  const hour = Number(match[1]) % 12;
  const minute = Number(match[2]);
  const isAfternoon = match[3].toUpperCase() === "PM";

  return (hour + (isAfternoon ? 12 : 0)) * 60 + minute;
}
