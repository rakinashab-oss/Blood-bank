import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Donor, DonorWithAvailability, AppSettings, AdminProfile } from '../types';
import { getAvailability, todayInDhaka } from './availability';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  !rawUrl.includes('YOUR-PROJECT') &&
  rawUrl.startsWith('https://')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured && rawUrl && rawKey
  ? createClient(rawUrl, rawKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ==========================================
// LOCAL STORAGE MOCK ENGINE (ZERO-CONFIG RUNTIME)
// Enables complete end-to-end functionality right out of the box,
// while being fully ready for real Supabase deployment.
// ==========================================

const STORAGE_KEYS = {
  DONORS: 'bloodbank_donors',
  SETTINGS: 'bloodbank_settings',
  ADMINS: 'bloodbank_admins',
  CURRENT_ADMIN: 'bloodbank_current_admin',
};

// Initial Seed Data (Representative Bangladeshi donors with verified realistic dates)
const INITIAL_SEED_DONORS: Donor[] = [
  {
    id: 'd1-rahim',
    full_name: 'Mohammad Rahim Ullah',
    phone_number: '01711223344',
    blood_group: 'O+',
    last_donation_date: '2026-07-15', // Over 90 days ago -> Available
    comments: 'Dhanmondi, Dhaka. Ready for emergency calls anytime.',
    is_public: true,
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'd2-tanvir',
    full_name: 'Tanvir Hossain',
    phone_number: '01819876543',
    blood_group: 'A+',
    last_donation_date: '2026-11-01', // On 2026-11-21, 20 days elapsed -> 70 days remaining (Unavailable)
    comments: 'Mirpur-10, Dhaka. Donated at National Blood Bank recently.',
    is_public: true,
    created_at: '2026-11-01T12:00:00Z',
  },
  {
    id: 'd3-nusrat',
    full_name: 'Nusrat Jahan',
    phone_number: '01912345678',
    blood_group: 'B+',
    last_donation_date: '2026-08-10', // Over 90 days -> Available
    comments: 'Uttara Sector 7, Dhaka. Regular donor.',
    is_public: true,
    created_at: '2026-08-10T14:30:00Z',
  },
  {
    id: 'd4-ashraf',
    full_name: 'Dr. Ashraf Ali',
    phone_number: '01671122445',
    blood_group: 'AB+',
    last_donation_date: '2026-10-25', // Donated recently -> Unavailable
    comments: 'Chittagong Medical area. Call after 2 PM.',
    is_public: true,
    created_at: '2026-10-25T09:00:00Z',
  },
  {
    id: 'd5-kamal',
    full_name: 'Kamal Pasha',
    phone_number: '01552345678',
    blood_group: 'O-', // Rare group
    last_donation_date: '2026-06-20', // Available
    comments: 'Sylhet Sadar. Rare O- donor, available for urgent cases.',
    is_public: true,
    created_at: '2026-06-20T11:00:00Z',
  },
  {
    id: 'd6-sadia',
    full_name: 'Sadia Afrin',
    phone_number: '01799887766',
    blood_group: 'A-', // Rare group
    last_donation_date: '2026-11-15', // Very recently donated -> Unavailable
    comments: 'Mohakhali, Dhaka.',
    is_public: true,
    created_at: '2026-11-15T08:00:00Z',
  },
  {
    id: 'd7-farhan',
    full_name: 'Farhan Kabir',
    phone_number: '01311223388',
    blood_group: 'B-',
    last_donation_date: '2026-07-01', // Available
    comments: 'Rajshahi City. Available on weekends.',
    is_public: true,
    created_at: '2026-07-01T15:00:00Z',
  },
  {
    id: 'd8-zaman',
    full_name: 'Zaman Chowdhury',
    phone_number: '01401234567',
    blood_group: 'AB-', // Rare group
    last_donation_date: '2026-08-05', // Available
    comments: 'Barishal. Verified voluntary donor.',
    is_public: true,
    created_at: '2026-08-05T16:00:00Z',
  },
  {
    id: 'd9-hasan',
    full_name: 'Hasan Mahmud',
    phone_number: '01722334455',
    blood_group: 'O+',
    last_donation_date: '2026-10-10', // Donated ~42 days ago -> ~48 days remaining (Unavailable)
    comments: 'Banani, Dhaka.',
    is_public: true,
    created_at: '2026-10-10T10:00:00Z',
  },
  {
    id: 'd10-sharmin',
    full_name: 'Sharmin Sultana',
    phone_number: '01833445566',
    blood_group: 'A+',
    last_donation_date: '2026-05-18', // Available
    comments: 'Khulna. Experienced donor.',
    is_public: true,
    created_at: '2026-05-18T10:00:00Z',
  },
  {
    id: 'd11-anwar',
    full_name: 'Anwar Parvez',
    phone_number: '01944556677',
    blood_group: 'B+',
    last_donation_date: '2026-11-10', // Unavailable
    comments: 'Rampura, Dhaka.',
    is_public: true,
    created_at: '2026-11-10T10:00:00Z',
  },
  {
    id: 'd12-mahbub',
    full_name: 'Mahbubur Rahman',
    phone_number: '01655667788',
    blood_group: 'O+',
    last_donation_date: '2026-08-18', // Available (>90 days)
    comments: 'Old Dhaka (Lalbagh). Emergency volunteer.',
    is_public: true,
    created_at: '2026-08-18T10:00:00Z',
  }
];

// Predefined 10 Administrator Accounts (admin1 to admin10, default password: admin1234)
function getInitialAdmins(): Record<string, { username: string; passwordHash: string; mustChange: boolean }> {
  const admins: Record<string, { username: string; passwordHash: string; mustChange: boolean }> = {};
  for (let i = 1; i <= 10; i++) {
    const u = `admin${i}`;
    admins[u] = {
      username: u,
      passwordHash: 'admin1234',
      mustChange: true,
    };
  }
  return admins;
}

// Storage helpers
function getLocalDonors(): Donor[] {
  const stored = localStorage.getItem(STORAGE_KEYS.DONORS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_SEED_DONORS));
    return INITIAL_SEED_DONORS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_SEED_DONORS;
  }
}

function saveLocalDonors(donors: Donor[]): void {
  localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
}

function getLocalSettings(): AppSettings {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) {
    const def: AppSettings = { id: 1, donation_interval_days: 90 };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(def));
    return def;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return { id: 1, donation_interval_days: 90 };
  }
}

function saveLocalSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function getLocalAdmins() {
  const stored = localStorage.getItem(STORAGE_KEYS.ADMINS);
  if (!stored) {
    const initial = getInitialAdmins();
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return getInitialAdmins();
  }
}

function saveLocalAdmins(admins: ReturnType<typeof getInitialAdmins>) {
  localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
}

// ==========================================
// UNIFIED DATA SERVICE (Supabase + Local Mock)
// ==========================================

export const DataService = {
  /**
   * Fetch current app settings (donation interval)
   */
  async getSettings(): Promise<AppSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 1)
          .single();
        if (data && !error) return data as AppSettings;
      } catch (err) {
        console.warn('Supabase fetch settings failed, using local fallback:', err);
      }
    }
    return getLocalSettings();
  },

  /**
   * Update donation interval (admin only)
   */
  async updateSettings(donation_interval_days: number): Promise<AppSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('app_settings')
        .update({ donation_interval_days, updated_at: new Date().toISOString() })
        .eq('id', 1)
        .select()
        .single();
      if (error) throw error;
      return data as AppSettings;
    }
    const current = getLocalSettings();
    const updated: AppSettings = {
      ...current,
      donation_interval_days,
      updated_at: new Date().toISOString(),
    };
    saveLocalSettings(updated);
    return updated;
  },

  /**
   * Fetch all approved public donors with computed availability
   */
  async getDonors(intervalDays?: number): Promise<DonorWithAvailability[]> {
    const interval = intervalDays ?? (await this.getSettings()).donation_interval_days;
    const today = todayInDhaka();

    if (isSupabaseConfigured && supabase) {
      try {
        // Query the donors table or donors_public view
        const { data, error } = await supabase
          .from('donors')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((d: Donor) => {
            const avail = getAvailability(d.last_donation_date, interval, today);
            return {
              ...d,
              next_eligible_date: avail.nextEligible,
              days_remaining: avail.daysRemaining,
              is_available: avail.isAvailable,
            };
          });
        }
      } catch (err) {
        console.warn('Supabase getDonors failed, fallback to local store:', err);
      }
    }

    // Local Store
    const local = getLocalDonors();
    return local
      .filter((d) => d.is_public !== false)
      .map((d) => {
        const avail = getAvailability(d.last_donation_date, interval, today);
        return {
          ...d,
          next_eligible_date: avail.nextEligible,
          days_remaining: avail.daysRemaining,
          is_available: avail.isAvailable,
        };
      });
  },

  /**
   * Add a new donor record (Admin only)
   */
  async addDonor(
    donor: Omit<Donor, 'id' | 'created_at' | 'updated_at'>,
    adminId?: string
  ): Promise<Donor> {
    // Validate phone uniqueness
    const existing = await this.getDonors();
    if (existing.some((d) => d.phone_number.trim() === donor.phone_number.trim())) {
      throw new Error('DUPLICATE_PHONE');
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('donors')
        .insert({
          full_name: donor.full_name.trim(),
          phone_number: donor.phone_number.trim(),
          blood_group: donor.blood_group,
          last_donation_date: donor.last_donation_date,
          comments: donor.comments?.trim() || null,
          is_public: donor.is_public ?? true,
          created_by: adminId || null,
        })
        .select()
        .single();
      if (error) {
        if (error.code === '23505') throw new Error('DUPLICATE_PHONE');
        throw error;
      }
      return data as Donor;
    }

    // Local store
    const donors = getLocalDonors();
    const newDonor: Donor = {
      id: 'd-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      full_name: donor.full_name.trim(),
      phone_number: donor.phone_number.trim(),
      blood_group: donor.blood_group,
      last_donation_date: donor.last_donation_date,
      comments: donor.comments?.trim() || null,
      is_public: donor.is_public ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: adminId || 'admin-local',
    };
    donors.unshift(newDonor);
    saveLocalDonors(donors);
    return newDonor;
  },

  /**
   * Update donor record (Admin only)
   */
  async updateDonor(id: string, updates: Partial<Donor>): Promise<Donor> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('donors')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        if (error.code === '23505') throw new Error('DUPLICATE_PHONE');
        throw error;
      }
      return data as Donor;
    }

    // Local store
    const donors = getLocalDonors();
    const idx = donors.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Donor not found');

    if (updates.phone_number && updates.phone_number !== donors[idx].phone_number) {
      if (donors.some((d) => d.id !== id && d.phone_number === updates.phone_number)) {
        throw new Error('DUPLICATE_PHONE');
      }
    }

    const updated = {
      ...donors[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    donors[idx] = updated;
    saveLocalDonors(donors);
    return updated;
  },

  /**
   * Delete a donor record (Admin only)
   */
  async deleteDonor(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('donors').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const donors = getLocalDonors();
    const filtered = donors.filter((d) => d.id !== id);
    saveLocalDonors(filtered);
    return true;
  },

  /**
   * Admin Authentication
   * Validates credentials against Supabase Auth (or Local Mock Store)
   */
  async signIn(usernameInput: string, password: string): Promise<AdminProfile> {
    const rawUsername = usernameInput.trim().toLowerCase();
    const email = rawUsername.includes('@')
      ? rawUsername
      : `${rawUsername}@bloodbank.local`;
    const username = rawUsername.includes('@')
      ? rawUsername.split('@')[0]
      : rawUsername;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Fetch admin profile
      const { data: profile, error: pError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('auth_user_id', data.user.id)
        .single();

      if (pError || !profile) {
        // Create or return basic profile
        const adminProf: AdminProfile = {
          id: data.user.id,
          auth_user_id: data.user.id,
          username,
          role: 'admin',
          must_change_password: false,
          created_at: new Date().toISOString(),
        };
        return adminProf;
      }
      return profile as AdminProfile;
    }

    // Local Mock Validation
    const admins = getLocalAdmins();
    const found = admins[username];
    if (!found || found.passwordHash !== password) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const adminProfile: AdminProfile = {
      id: `admin-id-${username}`,
      auth_user_id: `auth-${username}`,
      username: found.username,
      role: 'admin',
      must_change_password: found.mustChange,
      created_at: '2026-01-01T00:00:00Z',
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(adminProfile));
    return adminProfile;
  },

  /**
   * Sign out current admin
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
  },

  /**
   * Change admin password
   */
  async changePassword(username: string, newPassword: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      // Update must_change_password in profile
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        await supabase
          .from('admin_profiles')
          .update({ must_change_password: false })
          .eq('auth_user_id', u.user.id);
      }
      return true;
    }

    // Local store
    const admins = getLocalAdmins();
    if (admins[username]) {
      admins[username].passwordHash = newPassword;
      admins[username].mustChange = false;
      saveLocalAdmins(admins);

      const curr = this.getCurrentLocalAdmin();
      if (curr && curr.username === username) {
        curr.must_change_password = false;
        localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(curr));
      }
      return true;
    }
    return false;
  },

  getCurrentLocalAdmin(): AdminProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};
