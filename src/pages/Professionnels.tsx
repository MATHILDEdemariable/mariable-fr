import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalRegistrationForm from '@/components/forms/ProfessionalRegistrationForm';
import SEO from '@/components/SEO';

const Professionnels = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PremiumHeader />
      
      <SEO 
        title="Référencement Gratuit | Prestataires Mariage Mariable"
        description="Rejoignez notre sélection de prestataires de mariage d'excellence. Référencement gratuit avec commission uniquement sur les clients signés."
        canonical="/professionnels"
      />
      
      <main className="flex-grow pb-12 page-content">
        {/* Hero principal */}
        <section className="container mx-auto px-4 pt-8 pb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-serif mb-4 text-wedding-black">
            Rejoignez notre sélection de prestataires d'excellence
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Référencement gratuit avec commission uniquement sur les clients signés
          </p>
        </section>

        {/* Contenu principal */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Badge for free service */}
            <div className="bg-green-50 text-green-800 px-4 py-2 rounded-full inline-flex items-center mb-8">
              <span className="font-medium">Un partenariat gagnant-gagnant</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-serif">Pourquoi rejoindre Mariable ?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Visibilité ciblée</h4>
                      <p className="text-sm text-muted-foreground">Touchez des futurs mariés activement à la recherche de prestataires de qualité.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Un gage de qualité</h4>
                      <p className="text-sm text-muted-foreground">Différenciez-vous avec le label d'excellence Mariable.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Service de référencement gratuit</h4>
                      <p className="text-sm text-muted-foreground">Bénéficiez d'un référencement sans frais avec un système de commission uniquement si vous signez un client provenant de Mariable.</p>
                    </div>
                  </li>
                </ul>
                
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-serif">Comment nous rejoindre ?</h3>
                <p>Deux options s'offrent à vous pour intégrer notre réseau de prestataires de mariage d'excellence :</p>
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-wedding-cream rounded-full h-8 w-8 flex items-center justify-center text-wedding-black font-medium shrink-0">1</div>
                    <div>
                      <h4 className="text-base font-medium">Complétez le formulaire ci-dessous</h4>
                      <p className="text-sm text-muted-foreground">Remplissez tous les champs pour nous permettre d'évaluer votre candidature.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-wedding-cream rounded-full h-8 w-8 flex items-center justify-center text-wedding-black font-medium shrink-0">2</div>
                    <div>
                      <h4 className="text-base font-medium">Envoyez-nous un email</h4>
                      <p className="text-sm text-muted-foreground">
                        Contactez-nous directement à{' '}
                        <a 
                          href="mailto:mathilde@mariable.fr" 
                          className="text-wedding-olive hover:underline"
                        >
                          mathilde@mariable.fr
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Bouton "Voir la sélection" */}
                <div className="pt-4">
                  <Button 
                    asChild
                    variant="outline"
                    className="border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10"
                  >
                    <Link to="/selection" className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Voir la sélection
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <h2 className="text-2xl font-serif mb-4">Formulaire d'inscription prestataire mariage</h2>
              <div className="mb-4 p-4 bg-premium-warm rounded-lg border border-premium-light">
                <p className="text-sm text-muted-foreground">
                  En soumettant ce formulaire, vous acceptez nos{' '}
                  <Link 
                    to="/cgv" 
                    className="text-premium-sage hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Conditions Générales d'Utilisation
                  </Link>
                  {' '}et vous engagez à respecter notre charte qualité pour garantir une expérience premium.
                </p>
              </div>
              <ProfessionalRegistrationForm />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Professionnels;
