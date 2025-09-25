import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, Calendar, MessageCircle } from 'lucide-react';
import SEO from '@/components/SEO';

const NotFound: React.FC = () => {
  return (
    <>
      <SEO 
        title="Page non trouvée - Erreur 404 | Mariable"
        description="La page que vous recherchez n'existe pas. Retournez à l'accueil pour planifier votre mariage avec Mariable."
        canonical="/404"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
              <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
              <p className="text-muted-foreground mb-8">
                Oups ! La page que vous recherchez semble avoir disparu comme les confettis après la cérémonie...
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Link to="/">
                <Button variant="default" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Button>
              </Link>
              
              <Link to="/selection">
                <Button variant="outline" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher des prestataires
                </Button>
              </Link>
              
              <Link to="/conseilsmariage">
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Lire le blog
                </Button>
              </Link>
              
              <Link to="/contact">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Nous contacter
                </Button>
              </Link>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Pages populaires :</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Link to="/checklist-mariage" className="text-primary hover:underline">
                  Checklist Mariage
                </Link>
                <span>•</span>
                <Link to="/budget" className="text-primary hover:underline">
                  Calculateur Budget
                </Link>
                <span>•</span>
                <Link to="/coordinateurs-mariage" className="text-primary hover:underline">
                  Coordinateurs
                </Link>
                <span>•</span>
                <Link to="/jeunes-maries" className="text-primary hover:underline">
                  Témoignages
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NotFound;
