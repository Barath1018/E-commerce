import { supabase } from '../supabase/client';

const ADMIN_SESSION_KEY = 'aesthify-admin-auth';

export const isAdminHost = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const host = window.location.hostname.toLowerCase();
  const configuredHost = (import.meta.env.VITE_ADMIN_HOST as string | undefined)?.toLowerCase();

  if (configuredHost) {
    return host === configuredHost;
  }

  return host.startsWith('admin.');
};

export const isAdminEmail = async (email?: string | null): Promise<boolean> => {
  if (!email) return false;

  const { data, error } = await supabase
    .from('admin_emails')
    .select('email')
    .eq('email', email)
    .single();

  return !error && !!data;
};

export const getAdminSession = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
};

export const setAdminSession = (enabled: boolean) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (enabled) {
    window.localStorage.setItem(ADMIN_SESSION_KEY, 'true');
  } else {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
  }
};
