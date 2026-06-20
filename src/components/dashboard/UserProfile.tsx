
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Crown, Mail, Key } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import StripeButton from '@/components/premium/StripeButton';

const UserProfile: React.FC = () => {
  const { t, i18n } = useTranslation('dashboard');
  const { profile, isPremium, loading } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showStripeButton, setShowStripeButton] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: t('profile.loggedOut'),
        description: t('profile.loggedOutDesc'),
        duration: 3000,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: t('profile.errorTitle'),
        description: t('profile.logoutError'),
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    if (isPremium) {
      return (
        <Badge className="bg-green-500 text-white hover:bg-green-600">
          <Crown className="w-3 h-3 mr-1" />
          {t('profile.premium')}
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-gray-500 text-white hover:bg-gray-600">
        {t('profile.free')}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const locale = i18n.language.startsWith('en') ? 'en-US' : 'fr-FR';
    return new Date(dateString).toLocaleDateString(locale, {
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
        title: t('profile.errorTitle'),
        description: t('profile.emailUnavailable'),
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
        title: t('profile.emailSent'),
        description: t('profile.emailSentDesc'),
        duration: 5000,
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast({
        title: t('profile.errorTitle'),
        description: t('profile.resetError'),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={20} /> {t('profile.title')}
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
                  <p className="text-sm text-gray-500">{t('profile.firstName')}</p>
                  <p className="font-medium">{profile.first_name || t('profile.notSet')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('profile.lastName')}</p>
                  <p className="font-medium">{profile.last_name || t('profile.notSet')}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">{t('profile.loginInfo')}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">{t('profile.email')}</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{userEmail || t('profile.notAvailable')}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePasswordReset}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Key className="w-4 h-4" />
                    {t('profile.changePassword')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{t('profile.accountStatus')}</span>
                {getStatusBadge()}
              </div>
              
              {isPremium ? (
                <p className="text-sm text-green-600 font-medium">
                  {t('profile.premiumActive')}
                </p>
              ) : (
                <div className="pt-2 space-y-2">
                  {showStripeButton ? (
                    <StripeButton />
                  ) : (
                    <Button 
                      onClick={handleUpgradeToPremium}
                      className="w-full bg-wedding-olive hover:bg-wedding-olive/80"
                      size="sm"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      {t('profile.upgradeCta')}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {profile.wedding_date && (
              <div>
                <p className="text-sm text-gray-500">{t('profile.weddingDate')}</p>
                <p className="font-medium">{formatDate(profile.wedding_date)}</p>
              </div>
            )}

            {profile.guest_count && (
              <div>
                <p className="text-sm text-gray-500">{t('profile.guestCount')}</p>
                <p className="font-medium">{profile.guest_count}</p>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <Button 
                onClick={handleLogout} 
                className="flex items-center gap-2 bg-wedding-olive hover:bg-wedding-olive/80 w-full"
              >
                <LogOut size={16} /> {t('profile.logout')}
              </Button>
            </div>
          </div>
        ) : (
          <p>{t('profile.noInfo')}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
