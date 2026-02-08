import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TrackedVendor {
  id: string;
  vendor_name: string;
  prestataire_id: string | null;
}

/**
 * Hook centralisé pour charger TOUS les prestataires suivis par l'utilisateur en une seule requête.
 * Évite les appels individuels par carte (N+1 problem).
 */
export const useVendorTrackingList = () => {
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['vendor-tracking-list', user?.id],
    queryFn: async (): Promise<TrackedVendor[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('vendors_tracking_preprod')
        .select('id, vendor_name, prestataire_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ useVendorTrackingList: Failed to fetch', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Créer un Set pour des lookups O(1)
  const trackedVendorNames = new Set(data?.map(v => v.vendor_name) || []);
  const trackedVendorIds = new Set(data?.map(v => v.prestataire_id).filter(Boolean) || []);

  const isTracked = (vendorName: string): boolean => {
    return trackedVendorNames.has(vendorName);
  };

  const isTrackedById = (vendorId: string): boolean => {
    return trackedVendorIds.has(vendorId);
  };

  return {
    trackedVendors: data || [],
    trackedVendorNames,
    trackedVendorIds,
    isTracked,
    isTrackedById,
    isLoading,
    refetch,
  };
};

export default useVendorTrackingList;
