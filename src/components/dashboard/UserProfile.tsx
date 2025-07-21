
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Crown, Calendar, Mail, Key } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import StripeButton from '@/components/premium/StripeButton';

const UserProfile: React.FC = () => {
  const { profile, isPremium, loading } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showStripeButton, setShowStripeButton] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnecté",
        description: "Vous êtes maintenant déconnecté",
        duration: 3000,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erreur",
        description: "Problème lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    if (isPremium) {
      return (
        <Badge className="bg-green-500 text-white hover:bg-green-600">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-gray-500 text-white hover:bg-gray-600">
        Gratuit
      </Badge>
    );
  };

  const formatExpirationDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUpgradeToPremium = () => {
    setShowStripeButton(true);
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, []);

  const handlePasswordReset = async () => {
    if (!userEmail) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer votre email",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Un email de réinitialisation a été envoyé à votre adresse",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={20} /> Profil utilisateur
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
          </div>
        ) : profile ? (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Prénom</p>
                  <p className="font-medium">{profile.first_name || 'Non défini'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">{profile.last_name || 'Non défini'}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Informations de connexion</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{userEmail || 'Non disponible'}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePasswordReset}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Key className="w-4 h-4" />
                    Changer le mot de passe
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Statut d'abonnement</span>
                {getStatusBadge()}
              </div>
              
              {isPremium && profile.subscription_expires_at && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Expire le {formatExpirationDate(profile.subscription_expires_at)}</span>
                </div>
              )}
            </div>

            {profile.wedding_date && (
              <div>
                <p className="text-sm text-gray-500">Date de mariage</p>
                <p className="font-medium">{formatExpirationDate(profile.wedding_date)}</p>
              </div>
            )}

            {profile.guest_count && (
              <div>
                <p className="text-sm text-gray-500">Nombre d'invités</p>
                <p className="font-medium">{profile.guest_count}</p>
              </div>
            )}

            <div className="pt-4 space-y-2">
              {!isPremium && (
                <div className="mb-3">
                  {showStripeButton ? (
                    <StripeButton />
                  ) : (
                    <Button 
                      onClick={handleUpgradeToPremium}
                      className="bg-wedding-olive hover:bg-wedding-olive/90 text-white w-full"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Passer au Premium
                    </Button>
                  )}
                </div>
              )}
              
              <Button 
                onClick={handleLogout} 
                className="flex items-center gap-2 bg-wedding-olive hover:bg-wedding-olive/80 w-full"
              >
                <LogOut size={16} /> Se déconnecter
              </Button>
            </div>
          </div>
        ) : (
          <p>Aucune information disponible</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
