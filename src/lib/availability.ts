// Date-only math in UTC avoids timezone off-by-one errors; "today" comes from Asia/Dhaka.
const DAY_MS = 86_400_000;

/**
 * Returns today's calendar date string (YYYY-MM-DD) in Bangladesh Standard Time (Asia/Dhaka).
 */
export function todayInDhaka(now: Date = new Date()): string {
  // en-CA outputs YYYY-MM-DD format reliably
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(now);
}

/**
 * Converts a YYYY-MM-DD string into a pure UTC timestamp at 00:00:00.
 */
export const toUtc = (iso: string): number => {
  const parts = iso.split('-').map(Number);
  const y = parts[0];
  const m = parts[1] || 1;
  const d = parts[2] || 1;
  return Date.UTC(y, m - 1, d);
};

/**
 * Adds an integer number of calendar days to an ISO date (YYYY-MM-DD) using UTC math.
 * Correctly accounts for leap years, month lengths (28, 29, 30, 31 days), and year rollovers.
 */
export function addDays(iso: string, days: number): string {
  const utc = toUtc(iso) + days * DAY_MS;
  const date = new Date(utc);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export interface AvailabilityResult {
  nextEligible: string; // YYYY-MM-DD
  daysRemaining: number;
  isAvailable: boolean;
}

/**
 * Core 90-day Blood Donation Availability Calculation.
 * Next Eligible Donation Date = Last Donation Date + Interval (default: 90 days)
 * Today >= Next Eligible Date => AVAILABLE (daysRemaining = 0)
 * Today < Next Eligible Date => UNAVAILABLE (daysRemaining > 0)
 */
export function getAvailability(
  lastDonation: string,
  intervalDays = 90,
  today: string = todayInDhaka()
): AvailabilityResult {
  if (!lastDonation) {
    return {
      nextEligible: today,
      daysRemaining: 0,
      isAvailable: true,
    };
  }

  const nextEligible = addDays(lastDonation, intervalDays);
  const diffTime = toUtc(nextEligible) - toUtc(today);
  const daysRemaining = Math.max(0, Math.round(diffTime / DAY_MS));
  const isAvailable = daysRemaining === 0;

  return {
    nextEligible,
    daysRemaining,
    isAvailable,
  };
}

/**
 * Converts Western digits (0-9) to Bengali numerals (০-৯).
 */
export function toBengaliNumerals(input: string | number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(input).replace(/[0-9]/g, (w) => bengaliDigits[parseInt(w, 10)]);
}

/**
 * Formats a YYYY-MM-DD date into localized human-readable string.
 * Example (EN): 30 Jan 2027
 * Example (BN): ৩০ জানুয়ারি ২০২৭
 */
export function formatDate(iso: string, lang: 'en' | 'bn' = 'en'): string {
  if (!iso) return '—';
  const parts = iso.split('-').map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];

  const date = new Date(Date.UTC(y, m - 1, d));

  if (lang === 'bn') {
    const bnMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    return `${toBengaliNumerals(d)} ${bnMonths[m - 1]} ${toBengaliNumerals(y)}`;
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
