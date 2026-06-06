import { supabase } from '../supabase/client';

export const isAdminEmail = async (email?: string | null): Promise<boolean> => {
  if (!email) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', email)
    .maybeSingle();

  return !error && data?.role === 'admin';
};
