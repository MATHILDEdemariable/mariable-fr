
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CharteContent = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif mb-6">La Charte Mariable</h1>
        <p className="text-lg text-muted-foreground">
          Le Label Mariable distingue les prestataires du mariage qui se démarquent par leur professionnalisme, 
          leur passion et leur engagement à offrir des prestations haut de gamme.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          {
            title: "Confiance",
            description: "Créer une relation transparente avec les mariés grâce à des tarifs clairs et des services définis."
          },
          {
            title: "Passion",
            description: "Offrir des prestations personnalisées et marquées par l'excellence et la créativité."
          },
          {
            title: "Relationnel humain",
            description: "Accompagner les clients de manière flexible, attentive et bienveillante."
          },
          {
            title: "Excellence",
            description: "Maintenir des standards élevés, notamment en termes de service, de logistique et de rendu final."
          }
        ].map((value, index) => (
          <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="absolute top-0 left-0 w-1 h-full bg-wedding-olive transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
              <h2 className="text-xl font-serif font-medium mb-3">{value.title}</h2>
              <p className="text-muted-foreground">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="bg-wedding-cream/20 border-wedding-olive/20 max-w-2xl mx-auto mb-16">
        <CardContent className="pt-8 pb-8">
          <h3 className="text-2xl font-serif text-center mb-6">
            Nos prestataires s'engagent à...
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Transparence des informations</h4>
              <p className="text-muted-foreground">
                Présenter leurs services selon un format standardisé et afficher les tarifs.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Audit d'excellence</h4>
              <p className="text-muted-foreground">
                Accepter l'évaluation des clients et l'audit annuel de Mariable sur la base de critères précis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-wedding-olive text-white max-w-2xl mx-auto">
        <CardContent className="pt-8 pb-8 text-center">
          <h3 className="text-3xl font-serif mb-6">Rejoignez l'excellence</h3>
          <p className="mb-8 text-lg opacity-90">
            Que vous soyez un professionnel du mariage ou un futur marié, 
            découvrez l'univers Mariable et son engagement pour l'excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary"
              size="lg"
              className="bg-white text-wedding-olive hover:bg-gray-100"
              onClick={() => navigate('/login-frame')}
            >
              Espace professionnel <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="secondary"
              size="lg"
              className="bg-white text-wedding-olive hover:bg-gray-100"
              onClick={() => navigate('/login-frame')}
            >
              Espace futurs mariés <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const Charte = () => {
  return (
    <ServiceTemplate 
      title="Notre charte"
      description="Notre engagement pour des prestations de qualité"
      content={<CharteContent />}
    />
  );
};

export default Charte;
