
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Heart, MapPin } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PublicProfile {
  first_name: string | null;
  last_name: string | null;
  wedding_date: string | null;
  guest_count: number | null;
}

const ReaderView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicData = async () => {
      if (!token) {
        setError('Token manquant');
        setLoading(false);
        return;
      }

      try {
        // Validate token and get user_id
        const { data: tokenData, error: tokenError } = await supabase
          .rpc('validate_share_token', { token_value: token });

        if (tokenError || !tokenData || tokenData.length === 0 || !tokenData[0].is_valid) {
          setError('Lien invalide ou expiré');
          setLoading(false);
          return;
        }

        const userId = tokenData[0].user_id;

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, wedding_date, guest_count')
          .eq('id', userId)
          .single();

        if (profileError) {
          setError('Impossible de charger les données');
          setLoading(false);
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching public data:', error);
        setError('Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wedding-cream/20 to-wedding-olive/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wedding-cream/20 to-wedding-olive/10 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-serif mb-2 text-wedding-olive">Lien non disponible</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const weddingDate = profile?.wedding_date ? new Date(profile.wedding_date) : null;
  const daysUntilWedding = weddingDate ? differenceInDays(weddingDate, new Date()) : null;
  const coupleName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Le couple';

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-cream/20 to-wedding-olive/10">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-wedding-olive mb-2">
              Mariage de {coupleName}
            </h1>
            <p className="text-gray-600">Tableau de bord partagé</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Wedding Details Card */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-serif text-wedding-olive flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Informations du mariage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weddingDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-wedding-olive" />
                <div>
                  <p className="font-medium">
                    {format(weddingDate, 'EEEE d MMMM yyyy', { locale: fr })}
                  </p>
                  {daysUntilWedding !== null && (
                    <p className="text-sm text-muted-foreground">
                      {daysUntilWedding > 0 
                        ? `Dans ${daysUntilWedding} jours`
                        : daysUntilWedding === 0 
                        ? "C'est aujourd'hui !"
                        : `Il y a ${Math.abs(daysUntilWedding)} jours`
                      }
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {profile?.guest_count && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-wedding-olive" />
                <div>
                  <p className="font-medium">{profile.guest_count} invités</p>
                  <p className="text-sm text-muted-foreground">Nombre d'invités prévus</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Planning Status */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-serif text-wedding-olive">
              Avancement des préparatifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-wedding-cream/20 rounded-lg">
                <div className="text-2xl font-bold text-wedding-olive mb-1">25%</div>
                <div className="text-sm text-gray-600">Planning</div>
              </div>
              <div className="text-center p-4 bg-wedding-cream/20 rounded-lg">
                <div className="text-2xl font-bold text-wedding-olive mb-1">40%</div>
                <div className="text-sm text-gray-600">Budget</div>
              </div>
              <div className="text-center p-4 bg-wedding-cream/20 rounded-lg">
                <div className="text-2xl font-bold text-wedding-olive mb-1">60%</div>
                <div className="text-sm text-gray-600">Prestataires</div>
              </div>
              <div className="text-center p-4 bg-wedding-cream/20 rounded-lg">
                <div className="text-2xl font-bold text-wedding-olive mb-1">15%</div>
                <div className="text-sm text-gray-600">Démarches</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Tableau de bord en lecture seule • Powered by{' '}
            <span className="font-medium text-wedding-olive">Mariable</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReaderView;
