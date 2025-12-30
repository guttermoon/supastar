'use server';

import {
  SupabaseServerClient as actionClient,
  SupabaseComponentClient as componentClient
} from '@/lib/API/Services/init/supabase';
import { SupabaseAuthError } from '@/lib/utils/error';

export const SupabaseSession = async () => {
  const res = await componentClient().auth.getUser();
  if (res.error) {
    console.error('Supabase session error:', res.error);
    return { data: { user: null }, error: res.error };
  }
  return res;
};

export const SupabaseUser = async () => {
  const res = await componentClient().auth.getUser();
  if (res.error) return null;
  return res?.data?.user;
};


// Alias for backward compatibility
export const getUser = SupabaseUser;
