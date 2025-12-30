'use server';
import { SupabaseServerClient as supabase, SupabaseComponentClient } from '@/lib/API/Services/init/supabase';
import config from '@/lib/config/auth';
import { SupabaseAuthError } from '@/lib/utils/error';
import { redirect } from 'next/navigation';


export const SupabaseSignUp = async (email: string, password: string) => {
  const res = await supabase().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}${config.redirects.callback}`
    }
  });

  if (!res.error) {
    if (res.data.session) {
      redirect(config.redirects.toDashboard);
    } else {
      // If no session, it means email confirmation is required
      redirect(config.redirects.authConfirm);
    }
  }

  return res;
};




export const SupabaseSignIn = async (email: string, password: string) => {
  const res = await supabase().auth.signInWithPassword({
    email,
    password
  });

  if (!res.error) {
    redirect(config.redirects.toDashboard);
  }

  return res;
};


export const SupabaseSignOut = async () => {
  const res = await supabase().auth.signOut();
  if (res.error) SupabaseAuthError(res.error);

  redirect('/');
};


export const SupabaseSignInWithGoogle = async () => {
  const res = await supabase().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}${config.redirects.callback}`
    }
  });
  return res;
};


export const SupabaseSignInWithMagicLink = async (email: string) => {
  const res = await supabase().auth.signInWithOtp({
    email: `${email}`,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}${config.redirects.callback}`
    }
  });
  return res;
};

export const SupabaseUpdateEmail = async (email: string) => {
  const res = await supabase().auth.updateUser({ email });
  return res;
};

export const SupabaseUpdatePassword = async (password: string) => {
  const res = await supabase().auth.updateUser({ password });
  return res;
};

export const SupabaseResetPasswordEmail = async (email: string) => {
  const redirectTo = `${process.env.NEXT_PUBLIC_DOMAIN}${config.redirects.toProfile}`;
  const res = await supabase().auth.resetPasswordForEmail(email, {
    redirectTo
  });
  return res;
};
