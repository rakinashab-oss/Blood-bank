export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Donor {
  id: string;
  full_name: string;
  phone_number: string;
  blood_group: BloodGroup;
  last_donation_date: string; // ISO date 'YYYY-MM-DD'
  comments?: string | null;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
}

export interface DonorWithAvailability extends Donor {
  next_eligible_date: string;
  days_remaining: number;
  is_available: boolean;
}

export interface AdminProfile {
  id: string;
  auth_user_id: string;
  username: string;
  role: string;
  must_change_password: boolean;
  created_at: string;
}

export interface AppSettings {
  id: number;
  donation_interval_days: number;
  updated_at?: string;
}

export interface DonorStats {
  total: number;
  available: number;
  unavailable: number;
  byGroup: Record<BloodGroup, number>;
  availableByGroup: Record<BloodGroup, number>;
}

export type Language = 'en' | 'bn';
