import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import { Mail } from 'lucide-react';

const EmailConfirmation = () => {
  const { i18n } = useTranslation();
  const tr = (frText: string, enText: string) => (i18n.language?.startsWith('en') ? enText : frText);

  return (
    <div className="min-h-screen bg-wedding-cream/10">
      <SEO
        title={tr("Confirmation d'inscription | Mariable", 'Sign-up confirmation | Mariable')}
        description={tr('Confirmez votre email pour accéder à votre espace personnel Mariable.', 'Confirm your email to access your Mariable space.')}
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
            <section lang="fr" className="space-y-4">
              <p className="text-muted-foreground">Un email de confirmation a été envoyé à votre adresse email.</p>
              <p className="text-muted-foreground">Veuillez cliquer sur le lien dans l'email pour activer votre compte et accéder à votre espace personnel.</p>
              <p className="text-sm text-muted-foreground">Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier spam.</p>
            </section>
            <hr className="border-dashed border-border my-6" />
            <section lang="en" className="space-y-4">
              <h2 className="text-2xl font-serif">Check your email</h2>
              <p className="text-muted-foreground">A confirmation email has been sent to your address.</p>
              <p className="text-muted-foreground">Please click the link in the email to activate your account and access your space.</p>
              <p className="text-sm text-muted-foreground">If you don't receive the email within a few minutes, check your spam folder.</p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmailConfirmation;
