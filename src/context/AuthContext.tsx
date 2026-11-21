import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminProfile } from '../types';
import { DataService, isSupabaseConfigured, supabase } from '../lib/supabase';

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

    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            const { data: profile } = await supabase
              .from('admin_profiles')
              .select('*')
              .eq('auth_user_id', session.user.id)
              .single();

            if (profile) {
              setAdmin(profile as AdminProfile);
            } else {
              setAdmin({
                id: session.user.id,
                auth_user_id: session.user.id,
                username: session.user.email?.split('@')[0] || 'admin',
                role: 'admin',
                must_change_password: false,
                created_at: new Date().toISOString(),
              });
            }
          }
        } else {
          // Check local mock storage
          const localAdmin = DataService.getCurrentLocalAdmin();
          if (localAdmin && mounted) {
            setAdmin(localAdmin);
          }
        }
      } catch (err) {
        console.error('Error during auth init:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth state if configured
    let subscription: { unsubscribe: () => void } | null = null;
    const client = supabase;
    if (isSupabaseConfigured && client) {
      const { data } = client.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await client
            .from('admin_profiles')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single();

          if (profile) {
            setAdmin(profile as AdminProfile);
          }
        } else {
          setAdmin(null);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const signIn = async (username: string, pass: string) => {
    const profile = await DataService.signIn(username, pass);
    setAdmin(profile);
  };

  const signOut = async () => {
    await DataService.signOut();
    setAdmin(null);
  };

  const changePassword = async (newPass: string): Promise<boolean> => {
    if (!admin) return false;
    const success = await DataService.changePassword(admin.username, newPass);
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
