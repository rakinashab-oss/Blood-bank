// Local only: node --env-file=.env.local scripts/seed-admins.mjs
import { createClient } from '@supabase/supabase-js';
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } });
for (let i = 1; i <= 10; i++) {
  const username = `admin${i}`;
  const { data, error } = await sb.auth.admin.createUser({
    email: `${username}@bloodbank.local`, password: 'admin1234', email_confirm: true });
  if (error) { console.error(username, error.message); continue; }
  await sb.from('admin_profiles').insert({ auth_user_id: data.user.id, username, must_change_password: true });
  console.log('created', username);
}
