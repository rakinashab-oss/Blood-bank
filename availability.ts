// Date-only math in UTC avoids timezone off-by-one errors; "today" comes from Asia/Dhaka.
const DAY = 86_400_000;

export function todayInDhaka(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(now); // YYYY-MM-DD
}
const toUtc = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};
export function addDays(iso: string, days: number): string {
  return new Date(toUtc(iso) + days * DAY).toISOString().slice(0, 10);
}
export function getAvailability(lastDonation: string, intervalDays = 90, today = todayInDhaka()) {
  const nextEligible = addDays(lastDonation, intervalDays);
  const daysRemaining = Math.max(0, Math.round((toUtc(nextEligible) - toUtc(today)) / DAY));
  return { nextEligible, daysRemaining, isAvailable: daysRemaining === 0 };
}
// Check: 2026-11-01 + 90 = 2027-01-30; on 2026-11-21 -> 70 days remaining.
