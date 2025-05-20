
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email,
            firstName: user.user_metadata?.first_name || '',
            lastName: user.user_metadata?.last_name || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
        ) : user ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Prénom</p>
                <p className="font-medium">{user.firstName || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-medium">{user.lastName || 'Non défini'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <Button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-wedding-olive hover:bg-wedding-olive/80 w-full mt-4"
            >
              <LogOut size={16} /> Se déconnecter
            </Button>
          </div>
        ) : (
          <p>Aucune information disponible</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
