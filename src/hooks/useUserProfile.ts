
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  wedding_date: string | null;
  guest_count: number | null;
  subscription_type: string;
  subscription_expires_at: string | null;
  subscription_status: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  updated_at: string | null;
  notify_club_mariable: boolean | null;
}

const fetchOrCreateProfile = async (userId: string, userMetadata?: any): Promise<UserProfile> => {
  console.log('🔄 Fetching user profile...');

  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, wedding_date, guest_count, subscription_type, subscription_expires_at, subscription_status, stripe_customer_id, stripe_subscription_id, updated_at, notify_club_mariable')
    .eq('id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  if (!data) {
    console.log('🆕 Creating new profile...');
    const newProfile = {
      id: userId,
      first_name: userMetadata?.first_name || null,
      last_name: userMetadata?.last_name || null,
      wedding_date: null,
      guest_count: null,
      subscription_type: 'free',
      subscription_expires_at: null
    };

    const { data: insertedProfile, error: insertError } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select('id, first_name, last_name, wedding_date, guest_count, subscription_type, subscription_expires_at, subscription_status, stripe_customer_id, stripe_subscription_id, updated_at, notify_club_mariable')
      .single();

    if (insertError) throw insertError;
    console.log('✅ Profile created');
    return insertedProfile as UserProfile;
  }

  console.log('✅ Profile loaded:', { subscription_type: data.subscription_type });
  return data as UserProfile;
};

export const useUserProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile = null, isLoading: loading, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => fetchOrCreateProfile(user!.id, user!.user_metadata),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive"
        });
      }
    }
  });

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select('id, first_name, last_name, wedding_date, guest_count, subscription_type, subscription_expires_at, subscription_status, stripe_customer_id, stripe_subscription_id, updated_at, notify_club_mariable')
        .single();

      if (error) throw error;

      console.log('✅ Profile updated');
      queryClient.setQueryData(['user-profile', user.id], data);
      return data;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
        variant: "destructive"
      });
    }
  };

  const isPremium = (() => {
    if (!profile) return false;
    if (profile.subscription_type !== 'premium') return false;
    if (profile.subscription_expires_at === null) return true;
    const expiresAt = new Date(profile.subscription_expires_at);
    return expiresAt > new Date();
  })();

  return {
    profile,
    loading,
    updateProfile,
    refetch,
    isPremium
  };
};
