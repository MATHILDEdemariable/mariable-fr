import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Bell, CreditCard } from 'lucide-react';

const PaiementsHeroSection = () => {
  const scrollToForm = () => {
    document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-6xl mx-auto mb-16">
      {/* Badge urgent */}
      <div className="text-center mb-6">
        <Badge className="bg-green-500 text-white text-base px-6 py-2 hover:bg-green-600">
          🎁 Testez gratuitement pendant 1 mois
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Gauche : Texte + CTA */}
        <div>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            Simplifiez vos paiements mariage en un clic.
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Acomptes, soldes et échéanciers automatiques. Un seul espace, zéro relance. 
            Pensé pour les pros de l'événementiel, sécurisé par Stripe.
          </p>

          {/* 3 Bullet benefits */}
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0" />
              <span>Acomptes/solde automatisés</span>
            </li>
            <li className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-wedding-olive shrink-0" />
              <span>Relances et reçus automatiques</span>
            </li>
            <li className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-wedding-olive shrink-0" />
              <span>Un virement regroupé, clair</span>
            </li>
          </ul>

          {/* 2 CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="bg-wedding-olive hover:bg-wedding-olive/90"
              onClick={() => window.open('https://cal.com/mathilde-mariable/30min?overlayCalendar=true&date=2025-10-21', '_blank')}
            >
              📅 Prendre RDV avec Mathilde
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={scrollToForm}
            >
              Demander une démo
            </Button>
          </div>

          {/* Badges sécurité */}
          <div className="flex gap-4 mt-6 items-center">
            <Badge variant="outline" className="text-xs">Sécurisé par Stripe</Badge>
            <Badge variant="outline" className="text-xs">DSP2 compliant</Badge>
          </div>
        </div>

        {/* Droite : Mockup Dashboard */}
        <div>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Tableau de bord</span>
                <Badge className="bg-green-500 text-white">✅ Paiement reçu</Badge>
              </div>
              <div className="border-t pt-4">
                <p className="text-2xl font-bold text-wedding-black">1 200 €</p>
                <p className="text-sm text-muted-foreground">Couple Dupont • Acompte 30%</p>
                <p className="text-xs text-muted-foreground mt-2">Mariage prévu le 15 juin 2025</p>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="flex-1 bg-green-100 rounded p-2 text-center">
                  <p className="text-xs text-muted-foreground">Reçu</p>
                  <p className="text-sm font-semibold">1 200 €</p>
                </div>
                <div className="flex-1 bg-gray-100 rounded p-2 text-center">
                  <p className="text-xs text-muted-foreground">Solde à venir</p>
                  <p className="text-sm font-semibold">2 800 €</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PaiementsHeroSection;
