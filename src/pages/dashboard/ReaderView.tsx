
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Heart, MapPin, Eye, ExternalLink } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PublicProfile {
  first_name: string | null;
  last_name: string | null;
  wedding_date: string | null;
  guest_count: number | null;
}

interface DashboardData {
  profile: PublicProfile;
  // Add other dashboard data as needed
}

const ReaderView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError('Token manquant');
        setLoading(false);
        return;
      }

      try {
        console.log('Validating token:', token);
        
        // Validate token and get user_id
        const { data: tokenData, error: tokenError } = await supabase
          .rpc('validate_share_token', { token_value: token });

        console.log('Token validation result:', tokenData, tokenError);

        if (tokenError) {
          console.error('Token validation error:', tokenError);
          setError('Erreur lors de la validation du token');
          setLoading(false);
          return;
        }

        if (!tokenData || tokenData.length === 0 || !tokenData[0].is_valid) {
          setError('Lien invalide ou expiré');
          setLoading(false);
          return;
        }

        const userId = tokenData[0].user_id;
        console.log('Valid token for user:', userId);

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, wedding_date, guest_count')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          setError('Impossible de charger les données du profil');
          setLoading(false);
          return;
        }

        setDashboardData({
          profile: profileData
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Une erreur est survenue lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  const { profile } = dashboardData!;
  const weddingDate = profile?.wedding_date ? new Date(profile.wedding_date) : null;
  const daysUntilWedding = weddingDate ? differenceInDays(weddingDate, new Date()) : null;
  const coupleName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Le couple';

  // Mock progress data - in a real implementation, this would come from the database
  const progressData = [
    { label: 'Planning personnalisé', completed: false, percentage: 25 },
    { label: 'Budget défini', completed: false, percentage: 40 },
    { label: 'Prestataires contactés', completed: false, percentage: 60 },
    { label: 'Wishlist créée', completed: false, percentage: 75 },
    { label: 'Tâches planifiées', completed: false, percentage: 15 }
  ];

  const averageProgress = progressData.reduce((acc, item) => acc + item.percentage, 0) / progressData.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-cream/20 to-wedding-olive/10">
      {/* Public Banner */}
      <div className="bg-wedding-olive/10 border-b border-wedding-olive/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-wedding-olive" />
            <span className="text-sm font-medium text-wedding-olive">Version publique – visible par tous</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => window.open('https://mariable.fr', '_blank')}
          >
            Visiter Mariable <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

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

        {/* Progress Overview */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-serif text-wedding-olive">
              Avancement des préparatifs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Progression globale
                </span>
                <span className="text-sm font-medium">{Math.round(averageProgress)}%</span>
              </div>
              <Progress value={averageProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {progressData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-wedding-cream/20 rounded-lg">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-wedding-olive font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
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
