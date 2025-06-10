
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AdminAccessProps {
  onAccessGranted: () => void;
}

const AdminAccess: React.FC<AdminAccessProps> = ({ onAccessGranted }) => {
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    try {
      const { data, error } = await supabase
        .from('admin_access_tokens')
        .select('id')
        .eq('token', password)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast({
          title: "Accès refusé",
          description: "Mot de passe incorrect",
          variant: "destructive"
        });
        return;
      }

      // Store access in localStorage for session
      localStorage.setItem('admin_access', 'granted');
      
      toast({
        title: "Accès accordé",
        description: "Bienvenue dans l'administration"
      });
      
      onAccessGranted();
    } catch (error) {
      console.error('Error checking password:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Accès Administration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isChecking}>
              {isChecking ? 'Vérification...' : 'Accéder'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccess;
