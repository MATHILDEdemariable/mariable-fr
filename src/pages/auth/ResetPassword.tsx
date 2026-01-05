import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setHasValidSession(true);
      } else {
        setHasValidSession(false);
        toast({
          title: "Lien invalide ou expiré",
          description: "Ce lien de réinitialisation n'est plus valide. Veuillez en demander un nouveau.",
          variant: "destructive",
        });
      }
    };

    checkSession();
  }, [toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du mot de passe.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (hasValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-editorial-beige">
        <Loader2 className="h-8 w-8 animate-spin text-editorial-olive" />
      </div>
    );
  }

  // Show error state if no valid session
  if (hasValidSession === false) {
    return (
      <>
        <Helmet>
          <title>Lien invalide - Mariable</title>
          <meta name="description" content="Le lien de réinitialisation a expiré ou est invalide" />
        </Helmet>
        
        <div className="min-h-screen flex items-center justify-center bg-editorial-beige px-4">
          <Card className="w-full max-w-md border-editorial-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-serif text-editorial-noir">Lien invalide ou expiré</CardTitle>
              <CardDescription className="text-editorial-gray">
                Ce lien de réinitialisation n'est plus valide. Veuillez en demander un nouveau.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-editorial-olive hover:bg-editorial-noir text-white rounded-none"
              >
                Retour à la connexion
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Nouveau mot de passe - Mariable</title>
        <meta name="description" content="Définissez votre nouveau mot de passe pour votre compte Mariable" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-editorial-beige px-4">
        <Card className="w-full max-w-md border-editorial-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-editorial-noir">Nouveau mot de passe</CardTitle>
            <CardDescription className="text-editorial-gray">
              Choisissez un nouveau mot de passe sécurisé pour votre compte
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-editorial-noir">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre nouveau mot de passe"
                    required
                    minLength={6}
                    className="pr-10 border-editorial-border rounded-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-editorial-gray" />
                    ) : (
                      <Eye className="h-4 w-4 text-editorial-gray" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-editorial-noir">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre nouveau mot de passe"
                    required
                    minLength={6}
                    className="pr-10 border-editorial-border rounded-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-editorial-gray" />
                    ) : (
                      <Eye className="h-4 w-4 text-editorial-gray" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-editorial-olive hover:bg-editorial-noir text-white rounded-none" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour en cours...
                  </>
                ) : (
                  'Mettre à jour le mot de passe'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button 
                variant="link" 
                onClick={() => navigate('/login')}
                className="text-sm text-editorial-olive hover:text-editorial-noir"
              >
                Retour à la connexion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResetPassword;
