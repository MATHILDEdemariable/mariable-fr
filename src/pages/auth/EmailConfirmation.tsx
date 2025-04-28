
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import { Mail } from 'lucide-react';

const EmailConfirmation = () => {
  return (
    <div className="min-h-screen bg-wedding-cream/10">
      <SEO
        title="Confirmation d'inscription | Mariable"
        description="Confirmez votre email pour accéder à votre espace personnel Mariable."
      />
      <Header />
      
      <main className="container max-w-md mx-auto py-12 px-4">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-wedding-olive" />
            </div>
            <CardTitle className="text-2xl font-serif text-center">Vérifiez votre email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Un email de confirmation a été envoyé à votre adresse email.
            </p>
            <p className="text-muted-foreground">
              Veuillez cliquer sur le lien dans l'email pour activer votre compte et accéder à votre espace personnel.
            </p>
            <p className="text-sm text-muted-foreground mt-6">
              Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier spam.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmailConfirmation;
