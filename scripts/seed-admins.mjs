/**
 * BLOOD BANK — ADMIN INITIALIZATION SEED SCRIPT
 * Creates exactly 10 predefined administrator accounts:
 * Usernames: admin1 to admin10
 * Initial Password: admin1234
 * 
 * Usage:
 * node --env-file=.env scripts/seed-admins.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  console.error('   Please ensure your .env file contains these keys before running seeding.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

console.log('--- SEEDING 10 BLOOD BANK ADMINISTRATORS ---');

for (let i = 1; i <= 10; i++) {
  const username = `admin${i}`;
  const email = `${username}@bloodbank.local`;
  const password = 'admin1234';

  try {
    // 1. Create or retrieve auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, role: 'admin' },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`ℹ️ ${username} (${email}) already registered.`);
        continue;
      }
      console.error(`❌ Failed to create ${username}:`, error.message);
      continue;
    }

    const authUserId = data.user.id;

    // 2. Insert into admin_profiles
    const { error: profileError } = await supabase
      .from('admin_profiles')
      .upsert(
        {
          auth_user_id: authUserId,
          username,
          role: 'admin',
          must_change_password: true,
        },
        { onConflict: 'username' }
      );

    if (profileError) {
      console.error(`❌ Profile creation failed for ${username}:`, profileError.message);
    } else {
      console.log(`✅ Successfully initialized ${username} (${email})`);
    }
  } catch (err) {
    console.error(`Error processing ${username}:`, err);
  }
}

console.log('--- ADMIN SEEDING COMPLETE ---');
