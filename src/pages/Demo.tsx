
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Search, CheckCircle2, Mail, Linkedin } from 'lucide-react';

const Demo = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container py-12">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-wedding-olive hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-serif mt-4 mb-2">Merci pour votre intérêt !</h1>
          <p className="text-muted-foreground max-w-3xl">
            Nous vous remercions de votre confiance. L'application définitive est actuellement en cours de développement, 
            mais nous sommes ravis de vous présenter cette démonstration.
          </p>
        </div>
        
        <Card className="mb-12 border-wedding-olive/20 bg-wedding-olive/5">
          <CardHeader>
            <CardTitle className="text-wedding-olive">Nous vous recontactons pour le lancement officiel</CardTitle>
            <CardDescription>
              Vous pouvez toujours nous contacter ou consulter notre guide de prestataires à l'adresse suivante : <a href="https://www.mariable.fr/selectionmariable" className="text-wedding-olive hover:underline" target="_blank" rel="noopener noreferrer">www.mariable.fr/selectionmariable</a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              En attendant le lancement de l'application complète, voici un aperçu en démo. Si vous avez des questions ou besoin d'aide, 
              n'hésitez pas à nous contacter par email à <a href="mailto:mathilde@mariable.fr" className="text-wedding-olive hover:underline">mathilde@mariable.fr</a> ou 
              via notre <Link to="/contact/nous-contacter" className="text-wedding-olive hover:underline">formulaire de contact</Link>.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Card>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-wedding-olive/10 rounded-full flex items-center justify-center mb-4">
                <Search className="text-wedding-olive" />
              </div>
              <CardTitle>Trouvez les meilleurs prestataires</CardTitle>
              <CardDescription>
                Accédez à notre base de données de prestataires sélectionnés avec soin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Mariable vous aide à trouver les prestataires qui correspondent exactement à vos critères :
                style, budget, localisation et disponibilité.
              </p>
              <Button variant="outline" asChild>
                <Link to="/services/prestataires">En savoir plus</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-wedding-olive/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-wedding-olive" />
              </div>
              <CardTitle>Planifiez sans stress</CardTitle>
              <CardDescription>
                Utilisez notre outil de planification pour ne rien oublier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Notre rétroplanning personnalisé vous guide étape par étape, avec des rappels
                et conseils pour chaque phase de l'organisation.
              </p>
              <Button variant="outline" asChild>
                <Link to="/services/planification">Voir le planning</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-wedding-olive/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="text-wedding-olive" />
              </div>
              <CardTitle>Obtenez des conseils d'experts</CardTitle>
              <CardDescription>
                Bénéficiez de l'expérience de vrais wedding planners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Des conseils personnalisés, des astuces et des inspirations pour créer
                un mariage unique qui vous ressemble.
              </p>
              <Button variant="outline" asChild>
                <Link to="/services/conseils">Découvrir les conseils</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-12 bg-wedding-olive/5 border-wedding-olive/20">
          <CardHeader>
            <CardTitle className="text-wedding-olive">Nous vous recontacterons bientôt</CardTitle>
            <CardDescription>
              Notre équipe est en train d'analyser votre demande pour vous proposer les meilleurs prestataires
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/contact/nous-contacter">Nous contacter</Link>
            </Button>
            <Button variant="outline">
              <Link to="/">Revenir à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          © 2025 Mariable - Merci de votre confiance
        </div>
      </footer>
    </div>
  );
};

export default Demo;
