// Date-only math in UTC avoids timezone off-by-one errors; "today" comes from Asia/Dhaka.
const DAY_MS = 86_400_000;

function todayInDhaka(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(now);
}

const toUtc = (iso) => {
  const parts = iso.split('-').map(Number);
  const y = parts[0];
  const m = parts[1] || 1;
  const d = parts[2] || 1;
  return Date.UTC(y, m - 1, d);
};

function addDays(iso, days) {
  const utc = toUtc(iso) + days * DAY_MS;
  const date = new Date(utc);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getAvailability(lastDonation, intervalDays = 90, today = todayInDhaka()) {
  if (!lastDonation) {
    return { nextEligible: today, daysRemaining: 0, isAvailable: true };
  }
  const nextEligible = addDays(lastDonation, intervalDays);
  const diffTime = toUtc(nextEligible) - toUtc(today);
  const daysRemaining = Math.max(0, Math.round(diffTime / DAY_MS));
  const isAvailable = daysRemaining === 0;
  return { nextEligible, daysRemaining, isAvailable };
}

function toBengaliNumerals(input) {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(input).replace(/[0-9]/g, (w) => bengaliDigits[parseInt(w, 10)]);
}

function formatDate(iso, lang = 'en') {
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

import assert from 'node:assert';

console.log('--- RUNNING 90-DAY BLOOD DONATION AVAILABILITY VERIFICATION ---');

// 1. Exact prompt test: 2026-11-01 + 90 days = 2027-01-30; on 2026-11-21 -> 70 days remaining.
const test1 = getAvailability('2026-11-01', 90, '2026-11-21');
console.log('Test 1 (Prompt Requirement):', test1);
assert.strictEqual(test1.nextEligible, '2027-01-30');
assert.strictEqual(test1.daysRemaining, 70);
assert.strictEqual(test1.isAvailable, false);

// 2. Day of eligibility: 2027-01-30 -> Available
const test2 = getAvailability('2026-11-01', 90, '2027-01-30');
console.log('Test 2 (Day of Eligibility):', test2);
assert.strictEqual(test2.daysRemaining, 0);
assert.strictEqual(test2.isAvailable, true);

// 3. Past eligibility: 2027-02-10 -> Available
const test3 = getAvailability('2026-11-01', 90, '2027-02-10');
console.log('Test 3 (Past Eligibility):', test3);
assert.strictEqual(test3.daysRemaining, 0);
assert.strictEqual(test3.isAvailable, true);

// 4. Leap year 2028:
const leapYear = addDays('2028-01-15', 90);
console.log('Test 4 (Leap Year 2028 Math):', leapYear);
assert.strictEqual(leapYear, '2028-04-14');

// 5. Bengali numerals and formatting
const bn = toBengaliNumerals(70);
console.log('Test 5 (Bengali Numerals for 70):', bn);
assert.strictEqual(bn, '৭০');

const formatted = formatDate('2027-01-30', 'bn');
console.log('Test 6 (Bengali Date):', formatted);
assert.strictEqual(formatted, '৩০ জানুয়ারি ২০২৭');

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
