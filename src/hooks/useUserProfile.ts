
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  wedding_date: string | null;
  guest_count: number | null;
  subscription_type: string;
  subscription_expires_at: string | null;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      console.log('🔄 Fetching user profile...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ No user found');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        console.log('🆕 Creating new profile...');
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          first_name: user.user_metadata?.first_name || null,
          last_name: user.user_metadata?.last_name || null,
          wedding_date: null,
          guest_count: null,
          subscription_type: 'free',
          subscription_expires_at: null
        };

        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (insertError) throw insertError;
        console.log('✅ Profile created:', insertedProfile);
        setProfile(insertedProfile);
      } else {
        console.log('✅ Profile loaded:', data.subscription_type);
        setProfile(data);
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Profile updated:', data);
      setProfile(data);
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const isPremium = profile?.subscription_type === 'premium' && 
    (!profile?.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());

  console.log('🔍 Current profile status:', { 
    subscription_type: profile?.subscription_type, 
    isPremium,
    loading 
  });

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
    isPremium
  };
};
