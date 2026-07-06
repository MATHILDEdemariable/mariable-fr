import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface InstagramHighlight {
  id: string;
  instagram_url: string;
  image_url: string;
  caption: string | null;
  prestataire_id: string | null;
  context: 'blog' | 'professionnels' | 'both';
  display_order: number;
  active: boolean;
  prestataire?: { slug: string | null; nom: string } | null;
}

type Context = 'blog' | 'professionnels' | 'homepage';

export const useInstagramHighlights = (context: Context) => {
  return useQuery({
    queryKey: ['instagram-highlights', context],
    queryFn: async (): Promise<InstagramHighlight[]> => {
      let query = supabase
        .from('instagram_highlights')
        .select('id, instagram_url, image_url, caption, prestataire_id, context, display_order, active, prestataire:prestataires_rows(slug, nom)')
        .eq('active', true)
        .order('display_order', { ascending: true })
        .limit(20);

      if (context !== 'homepage') {
        query = query.in('context', [context, 'both']);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data || []) as any;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
