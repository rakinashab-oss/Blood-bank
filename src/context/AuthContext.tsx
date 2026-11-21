import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminProfile } from '../types';
import { auth, FirebaseDataService } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  admin: AdminProfile | null;
  loading: boolean;
  signIn: (username: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (newPass: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    // Listen to real-time Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && mounted) {
        try {
          const profile = await FirebaseDataService.getCurrentAdminProfile(user);
          setAdmin(profile);
        } catch (err) {
          console.error('Error fetching admin profile from Firebase:', err);
          setAdmin({
            id: user.uid,
            auth_user_id: user.uid,
            username: user.email?.split('@')[0] || 'admin',
            role: 'admin',
            must_change_password: false,
            created_at: new Date().toISOString(),
          });
        }
      } else if (mounted) {
        const local = FirebaseDataService.getLocalAdminSession();
        if (local) {
          setAdmin(local);
        } else {
          setAdmin(null);
        }
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (username: string, pass: string) => {
    const profile = await FirebaseDataService.signIn(username, pass);
    setAdmin(profile);
  };

  const signOut = async () => {
    await FirebaseDataService.signOut();
    setAdmin(null);
  };

  const changePassword = async (newPass: string): Promise<boolean> => {
    if (!admin) return false;
    const success = await FirebaseDataService.changePassword(newPass);
    if (success) {
      setAdmin((prev) => (prev ? { ...prev, must_change_password: false } : null));
    }
    return success;
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        signIn,
        signOut,
        changePassword,
        isAuthenticated: Boolean(admin),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
