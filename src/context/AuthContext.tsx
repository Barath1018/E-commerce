// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import { isAdminEmail, isAdminHost, getAdminSession, setAdminSession } from '../lib/adminAuth';
import CartLoadingAnimation from '../components/CartLoadingAnimation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  needsOnboarding: boolean;
  setNeedsOnboarding: (v: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  needsOnboarding: false,
  setNeedsOnboarding: () => {},
  logout: async () => {},
});

async function checkNeedsOnboardingAsync(user: User | null): Promise<boolean> {
  if (!user) return false;

  // Check if onboarding was just completed (prevents race condition with onAuthStateChange)
  const completedKey = `onboarding_done_${user.id}`;
  if (sessionStorage.getItem(completedKey)) {
    console.log('[Auth] Onboarding already completed this session');
    return false;
  }

  // Fast path: check user_metadata first
  if (user.user_metadata?.username) {
    console.log('[Auth] Username found in user_metadata:', user.user_metadata.username);
    return false;
  }

  // Fallback: check profiles table directly (source of truth)
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle();
    console.log('[Auth] profiles lookup:', data, 'error:', error);
    if (data?.username) {
      console.log('[Auth] Username found in profiles table:', data.username);
      return false;
    }
  } catch (err) {
    console.error('[Auth] profiles lookup error:', err);
  }

  console.log('[Auth] needsOnboarding = true (no username found anywhere)');
  return true;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let mounted = true;

    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    // Use getUser() to fetch fresh user data from server (not cached session)
    supabase.auth.getUser()
      .then(async ({ data: { user: freshUser } }) => {
        if (!mounted) return;
        clearTimeout(timeout);

        // Also get session for token
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        console.log('[Auth] freshUser:', freshUser?.id, 'metadata:', freshUser?.user_metadata);
        console.log('[Auth] session user:', currentSession?.user?.id);

        setSession(currentSession);
        setUser(freshUser ?? currentSession?.user ?? null);

        const needs = await checkNeedsOnboardingAsync(freshUser ?? currentSession?.user ?? null);
        console.log('[Auth] needsOnboarding result:', needs);
        if (mounted) setNeedsOnboarding(needs);

        if (freshUser ?? currentSession?.user) {
          const u = freshUser ?? currentSession!.user;
          isAdminEmail(u.email).then((admin) => {
            const hostIsAdmin = isAdminHost();
            const adminStatus = hostIsAdmin && admin;
            setIsAdmin(adminStatus);
            setAdminSession(adminStatus);
          });
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('AuthSessionCheckError:', err);
        clearTimeout(timeout);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      // Fetch fresh user data from server
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      const user = freshUser ?? newSession?.user ?? null;

      setSession(newSession);
      setUser(user);

      const needs = await checkNeedsOnboardingAsync(user);
      setNeedsOnboarding(needs);

      if (user) {
        try {
          const admin = await isAdminEmail(user.email);
          const hostIsAdmin = isAdminHost();
          const adminStatus = hostIsAdmin && admin;
          setIsAdmin(adminStatus);
          setAdminSession(adminStatus);
        } catch {
          setIsAdmin(false);
          setAdminSession(false);
        }
      } else {
        setIsAdmin(false);
        setAdminSession(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setNeedsOnboarding(false);
      setAdminSession(false);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CartLoadingAnimation />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, needsOnboarding, setNeedsOnboarding, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
