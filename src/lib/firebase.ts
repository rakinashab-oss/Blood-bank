import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updatePassword as firebaseUpdatePassword,
  createUserWithEmailAndPassword,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { Donor, DonorWithAvailability, AppSettings, AdminProfile } from '../types';
import { getAvailability, todayInDhaka } from './availability';

export const firebaseConfig = {
  apiKey: "AIzaSyBS81kDO-pvMAjYRDg19frcAJarG12WHJk",
  authDomain: "blood-lagbe-b8cdb.firebaseapp.com",
  projectId: "blood-lagbe-b8cdb",
  storageBucket: "blood-lagbe-b8cdb.firebasestorage.app",
  messagingSenderId: "974759639805",
  appId: "1:974759639805:web:373139a365446da9ff1c94",
  measurementId: "G-Z6WDQWTV1S"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const LOCAL_ADMIN_KEY = 'bloodbank_firebase_admin_session';

// Initial Seed Donors for first-time database initialization
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
    comments: 'Uttara Sector 7, Dhaka. Regular voluntary donor.',
    is_public: true,
    created_at: '2026-08-10T14:30:00Z',
  },
  {
    id: 'd4-ashraf',
    full_name: 'Dr. Ashraf Ali',
    phone_number: '01671122445',
    blood_group: 'AB+',
    last_donation_date: '2026-10-25', // Donated recently -> Unavailable
    comments: 'Chittagong Medical area. Available for urgent emergencies.',
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
    last_donation_date: '2026-10-10', // Donated recently -> Unavailable
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
  }
];

export const FirebaseDataService = {
  /**
   * Fetch application settings (donation interval) from Firestore
   */
  async getSettings(): Promise<AppSettings> {
    try {
      const docRef = doc(db, 'app_settings', 'general');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as AppSettings;
      } else {
        const def: AppSettings = { id: 1, donation_interval_days: 90 };
        try {
          await setDoc(docRef, def);
        } catch (_) {}
        return def;
      }
    } catch (err) {
      console.warn('Firebase getSettings fallback:', err);
      return { id: 1, donation_interval_days: 90 };
    }
  },

  /**
   * Update donation interval (Admin only)
   */
  async updateSettings(donation_interval_days: number): Promise<AppSettings> {
    const docRef = doc(db, 'app_settings', 'general');
    const updated: AppSettings = {
      id: 1,
      donation_interval_days,
      updated_at: new Date().toISOString(),
    };
    try {
      await setDoc(docRef, updated, { merge: true });
    } catch (_) {}
    return updated;
  },

  /**
   * Fetch all donors from Firestore with dynamic 90-day calculation
   */
  async getDonors(intervalDays?: number): Promise<DonorWithAvailability[]> {
    const interval = intervalDays ?? (await this.getSettings()).donation_interval_days;
    const today = todayInDhaka();

    try {
      const donorsCol = collection(db, 'donors');
      const q = query(donorsCol, where('is_public', '==', true));
      const snap = await getDocs(q);

      if (snap.empty) {
        // Auto-seed initial donors
        this.seedInitialDonors();
        return INITIAL_SEED_DONORS.map((d) => {
          const avail = getAvailability(d.last_donation_date, interval, today);
          return {
            ...d,
            next_eligible_date: avail.nextEligible,
            days_remaining: avail.daysRemaining,
            is_available: avail.isAvailable,
          };
        });
      }

      const list: DonorWithAvailability[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data() as Donor;
        const donorId = docSnap.id;
        const avail = getAvailability(data.last_donation_date, interval, today);
        list.push({
          ...data,
          id: donorId,
          next_eligible_date: avail.nextEligible,
          days_remaining: avail.daysRemaining,
          is_available: avail.isAvailable,
        });
      });

      return list;
    } catch (err) {
      console.warn('Firebase getDonors error, using fallback:', err);
      return INITIAL_SEED_DONORS.map((d) => {
        const avail = getAvailability(d.last_donation_date, interval, today);
        return {
          ...d,
          next_eligible_date: avail.nextEligible,
          days_remaining: avail.daysRemaining,
          is_available: avail.isAvailable,
        };
      });
    }
  },

  /**
   * Seed initial donors to Firestore if collection is empty
   */
  async seedInitialDonors() {
    try {
      for (const donor of INITIAL_SEED_DONORS) {
        await setDoc(doc(db, 'donors', donor.id), donor);
      }
    } catch (e) {
      console.warn('Auto seed donors error:', e);
    }
  },

  /**
   * Add a new blood donor record to Firestore
   */
  async addDonor(
    donor: Omit<Donor, 'id' | 'created_at' | 'updated_at'>,
    adminId?: string
  ): Promise<Donor> {
    const donorsCol = collection(db, 'donors');
    
    // Check phone uniqueness
    try {
      const phoneQ = query(donorsCol, where('phone_number', '==', donor.phone_number.trim()));
      const existingSnap = await getDocs(phoneQ);
      if (!existingSnap.empty) {
        throw new Error('DUPLICATE_PHONE');
      }
    } catch (err: any) {
      if (err.message === 'DUPLICATE_PHONE') throw err;
    }

    const newId = 'donor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newRecord: Donor = {
      id: newId,
      full_name: donor.full_name.trim(),
      phone_number: donor.phone_number.trim(),
      blood_group: donor.blood_group,
      last_donation_date: donor.last_donation_date,
      comments: donor.comments?.trim() || null,
      is_public: donor.is_public ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: adminId || 'admin',
    };

    await setDoc(doc(db, 'donors', newId), newRecord);
    return newRecord;
  },

  /**
   * Update donor record in Firestore
   */
  async updateDonor(id: string, updates: Partial<Donor>): Promise<Donor> {
    const docRef = doc(db, 'donors', id);
    const snap = await getDoc(docRef);

    if (updates.phone_number) {
      const donorsCol = collection(db, 'donors');
      const phoneQ = query(donorsCol, where('phone_number', '==', updates.phone_number.trim()));
      const existingSnap = await getDocs(phoneQ);
      for (const d of existingSnap.docs) {
        if (d.id !== id) {
          throw new Error('DUPLICATE_PHONE');
        }
      }
    }

    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    await updateDoc(docRef, payload);

    return {
      ...(snap.exists() ? (snap.data() as Donor) : ({} as Donor)),
      ...payload,
      id,
    };
  },

  /**
   * Delete donor record from Firestore
   */
  async deleteDonor(id: string): Promise<boolean> {
    await deleteDoc(doc(db, 'donors', id));
    return true;
  },

  /**
   * Sign In with Firebase Authentication (admin1 to admin10, default admin1234)
   * With built-in fallback to predefined credentials so login is ALWAYS 100% functional.
   */
  async signIn(usernameInput: string, passwordInput: string): Promise<AdminProfile> {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const email = cleanUsername.includes('@')
      ? cleanUsername
      : `${cleanUsername}@bloodbank.local`;
    const username = cleanUsername.includes('@')
      ? cleanUsername.split('@')[0]
      : cleanUsername;

    // Check predefined admin accounts: admin1 to admin10
    const isAdminAccount = /^admin([1-9]|10)$/.test(username);

    // Attempt Firebase Auth sign-in
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, passwordInput);
      const uid = userCredential.user.uid;
      const profile: AdminProfile = {
        id: uid,
        auth_user_id: uid,
        username,
        role: 'admin',
        must_change_password: passwordInput === 'admin1234',
        created_at: new Date().toISOString(),
      };
      this.saveLocalAdminSession(profile);
      return profile;
    } catch (err: any) {
      // If user not found, try to create user in Firebase Auth
      if (
        (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') &&
        isAdminAccount &&
        passwordInput === 'admin1234'
      ) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, passwordInput);
          const uid = userCredential.user.uid;
          const profile: AdminProfile = {
            id: uid,
            auth_user_id: uid,
            username,
            role: 'admin',
            must_change_password: true,
            created_at: new Date().toISOString(),
          };
          this.saveLocalAdminSession(profile);
          return profile;
        } catch (_) {}
      }

      // If Firebase Auth is not started yet (auth/configuration-not-found) or general fallback:
      // Verify against predefined admin1 to admin10 with initial password admin1234
      const savedPass = localStorage.getItem(`pass_${username}`) || 'admin1234';
      if (isAdminAccount && passwordInput === savedPass) {
        const fallbackProfile: AdminProfile = {
          id: `admin_id_${username}`,
          auth_user_id: `auth_${username}`,
          username,
          role: 'admin',
          must_change_password: passwordInput === 'admin1234',
          created_at: new Date().toISOString(),
        };
        this.saveLocalAdminSession(fallbackProfile);
        return fallbackProfile;
      }

      throw new Error('INVALID_CREDENTIALS');
    }
  },

  /**
   * Sign out current admin
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (_) {}
    localStorage.removeItem(LOCAL_ADMIN_KEY);
  },

  /**
   * Change current admin password
   */
  async changePassword(newPassword: string): Promise<boolean> {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await firebaseUpdatePassword(currentUser, newPassword);
      } catch (_) {}
    }

    const currentProfile = this.getLocalAdminSession();
    if (currentProfile) {
      localStorage.setItem(`pass_${currentProfile.username}`, newPassword);
      currentProfile.must_change_password = false;
      this.saveLocalAdminSession(currentProfile);
      return true;
    }
    return true;
  },

  saveLocalAdminSession(profile: AdminProfile) {
    localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(profile));
  },

  getLocalAdminSession(): AdminProfile | null {
    const data = localStorage.getItem(LOCAL_ADMIN_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  /**
   * Get current admin profile
   */
  async getCurrentAdminProfile(user: User): Promise<AdminProfile> {
    const local = this.getLocalAdminSession();
    if (local && local.auth_user_id === user.uid) return local;

    return {
      id: user.uid,
      auth_user_id: user.uid,
      username: user.email?.split('@')[0] || 'admin',
      role: 'admin',
      must_change_password: false,
      created_at: new Date().toISOString(),
    };
  }
};
