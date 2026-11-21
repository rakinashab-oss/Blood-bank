// Direct verification of core 90-day blood donation logic
import { getAvailability, addDays, todayInDhaka, toBengaliNumerals, formatDate } from '../src/lib/availability.js';
import assert from 'node:assert';

console.log('--- RUNNING BLOOD BANK AVAILABILITY TESTS ---');

// 1. Prompt check: Last Donation Date: 2026-11-01. On 2026-11-21, 90 days -> 2027-01-30 -> 70 days remaining (Unavailable)
const check1 = getAvailability('2026-11-01', 90, '2026-11-21');
console.log('Test 1 (Prompt Example):', check1);
assert.strictEqual(check1.nextEligible, '2027-01-30');
assert.strictEqual(check1.daysRemaining, 70);
assert.strictEqual(check1.isAvailable, false);

// 2. Exact match date: on 2027-01-30, should be Available (0 days remaining)
const check2 = getAvailability('2026-11-01', 90, '2027-01-30');
console.log('Test 2 (Exact Eligibility Day):', check2);
assert.strictEqual(check2.daysRemaining, 0);
assert.strictEqual(check2.isAvailable, true);

// 3. Past eligible date: on 2027-02-15, should be Available (0 days remaining)
const check3 = getAvailability('2026-11-01', 90, '2027-02-15');
console.log('Test 3 (Past Eligibility Day):', check3);
assert.strictEqual(check3.daysRemaining, 0);
assert.strictEqual(check3.isAvailable, true);

// 4. Leap Year test: 2028 (February has 29 days)
// 2028-01-15 + 90 days -> Jan (16 days left) + Feb (29 days) + Mar (31 days) + Apr (14 days) = 90 days -> 2028-04-14
const check4 = addDays('2028-01-15', 90);
console.log('Test 4 (Leap Year 2028 math):', check4);
assert.strictEqual(check4, '2028-04-14');

// 5. Month boundaries (30-day month -> 31-day month)
// 2026-09-15 + 90 days -> Sep (15 days) + Oct (31 days) + Nov (30 days) + Dec (14 days) = 90 days -> 2026-12-14
const check5 = addDays('2026-09-15', 90);
console.log('Test 5 (Month boundaries):', check5);
assert.strictEqual(check5, '2026-12-14');

// 6. Bangladesh Timezone verification:
const dhakaNow = todayInDhaka();
console.log('Test 6 (Dhaka Date String):', dhakaNow);
assert.match(dhakaNow, /^\d{4}-\d{2}-\d{2}$/);

// 7. Bengali Numerals & Date formatting
const bnNum = toBengaliNumerals(70);
console.log('Test 7 (Bengali Numerals for 70):', bnNum);
assert.strictEqual(bnNum, '৭০');

const formattedBn = formatDate('2027-01-30', 'bn');
console.log('Test 8 (Bengali Date Format):', formattedBn);
assert.strictEqual(formattedBn, '৩০ জানুয়ারি ২০২৭');

console.log('✅ ALL AVAILABILITY & TIMEZONE TESTS PASSED PERFECTLY!');
