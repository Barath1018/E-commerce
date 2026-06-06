import { supabase } from '../supabase/client';

export const isAdminEmail = async (email?: string | null): Promise<boolean> => {
  if (!email) return false;

  const { data, error } = await supabase
    .from('admin_emails')
    .select('email')
    .eq('email', email)
    .single();

  return !error && !!data;
};
