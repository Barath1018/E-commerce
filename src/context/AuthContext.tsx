// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import { isAdminEmail } from '../lib/adminAuth';
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

        const resolvedUser = freshUser ?? currentSession?.user ?? null;
        const needs = await checkNeedsOnboardingAsync(resolvedUser);
        console.log('[Auth] needsOnboarding result:', needs);

        let admin = false;
        if (resolvedUser) {
          admin = await isAdminEmail(resolvedUser.email);
        }

        if (mounted) {
          setSession(currentSession);
          setUser(resolvedUser);
          setNeedsOnboarding(needs);
          setIsAdmin(admin);
          setLoading(false);
        }
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

      // Compute all state before setting anything so React batches updates
      const needs = await checkNeedsOnboardingAsync(user);
      let admin = false;
      if (user) {
        try {
          admin = await isAdminEmail(user.email);
        } catch {
          admin = false;
        }
      }

      setSession(newSession);
      setUser(user);
      setNeedsOnboarding(needs);
      setIsAdmin(admin);
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
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setNeedsOnboarding(false);
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
