
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Search, CheckCircle2 } from 'lucide-react';

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
          
          <h1 className="text-3xl md:text-4xl font-serif mt-4 mb-2">Démonstration de Mariable</h1>
          <p className="text-muted-foreground max-w-3xl">
            Découvrez comment Mariable va vous aider à organiser le mariage de vos rêves
          </p>
        </div>
        
        <div className="aspect-w-16 aspect-h-9 mb-12 rounded-xl overflow-hidden shadow-lg">
          <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Mariable Démonstration" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full rounded-xl"
          ></iframe>
        </div>
        
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
            <CardTitle className="text-wedding-olive">Envie d'aller plus loin ?</CardTitle>
            <CardDescription>
              Contactez-nous pour bénéficier d'un accompagnement personnalisé
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
