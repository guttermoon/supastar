import SideBar from './_PageSections/SideBar';
import Header from './_PageSections/Header';
import { SupabaseSession } from '@/lib/API/Services/supabase/user';
import { GetProfileByUserId } from '@/lib/API/Database/profile/queries';
import { redirect } from 'next/navigation';
import config from '@/lib/config/auth';
import { ProfileT } from '@/lib/types/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { LayoutProps } from '@/lib/types/types';

export default async function DashboardLayout({ children }: LayoutProps) {
  const { data: userData, error } = await SupabaseSession();

  // Auth Guard
  if (error || !userData?.user) {
    redirect(config.redirects.requireAuth);
  }

  const user = userData.user;
  let profile: ProfileT | null = null;
  if (user) {
    const res = await GetProfileByUserId(user.id);
    profile = res.data?.[0] || null;
  }

  const display_name = profile?.display_name;
  const email = user.email;
  const avatar_url = user.user_metadata?.avatar_url;



  return (
    <main className="grid md:grid-cols-[auto_1fr]">
      <SideBar />
      <div>
        <Header email={email} display_name={display_name} avatar_url={avatar_url} />
        <div className="m-6">{children}</div>
      </div>
    </main>
  );
}
