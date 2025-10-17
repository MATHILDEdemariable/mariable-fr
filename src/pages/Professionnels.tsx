import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { FileDown, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalRegistrationForm from '@/components/forms/ProfessionalRegistrationForm';
import SEO from '@/components/SEO';
import { Badge } from '@/components/ui/badge';

// Import nouveaux composants Paiements
import PaiementsHeroSection from '@/components/professionnels/PaiementsHeroSection';
import PainSolutionSection from '@/components/professionnels/PainSolutionSection';
import HowItWorksSection from '@/components/professionnels/HowItWorksSection';
import FeaturesGrid from '@/components/professionnels/FeaturesGrid';
import SecuritySection from '@/components/professionnels/SecuritySection';
import SocialProofSection from '@/components/professionnels/SocialProofSection';
import DemoRequestForm from '@/components/professionnels/DemoRequestForm';
import PaymentsFAQ from '@/components/professionnels/PaymentsFAQ';

const Professionnels = () => {
  const [activeTab, setActiveTab] = useState('referencement');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PremiumHeader />
      
      <SEO 
        title="Partenaires Mariable | Référencement & Paiements pour pros du mariage"
        description="Rejoignez Mariable : référencement gratuit avec commission ou solution de paiements simplifiés. Deux offres complémentaires pour développer votre activité."
        canonical="/professionnels"
      />
      
      <main className="flex-grow pt-16 pb-12">
        {/* Hero principal */}
        <section className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-6xl font-serif mb-4 text-wedding-black">
            Développez votre activité de mariage avec Mariable
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Deux solutions complémentaires pour booster votre visibilité et simplifier votre gestion
          </p>
          <Badge variant="outline" className="text-base px-4 py-2 bg-green-50 text-green-700 border-green-200">
            💡 Offres cumulables : référencement + paiements = synergie maximale
          </Badge>
        </section>

        {/* Tabs Navigation Sticky */}
        <div className="sticky top-16 z-20 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-2 h-auto p-2">
                <TabsTrigger value="referencement" className="text-base py-3">
                  🔍 Référencement gratuit
                </TabsTrigger>
                <TabsTrigger value="paiements" className="text-base py-3">
                  💳 Paiements simplifiés
                </TabsTrigger>
              </TabsList>
              
              {/* TAB 1 : Référencement (contenu actuel conservé) */}
              <TabsContent value="referencement" className="py-12">
                <div className="max-w-4xl mx-auto px-4">
                  <h2 className="text-3xl md:text-4xl font-serif mb-4 text-wedding-black">
                    Rejoignez notre guide de professionnels du mariage premium
                  </h2>
                  
                  <p className="text-xl text-muted-foreground mb-8">
                    Faites partie de notre sélection et développez votre activité avec des clients qualifiés
                  </p>

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
                      
                      <div className="pt-4">
                        <Button className="flex items-center gap-2 bg-wedding-olive hover:bg-wedding-olive/80">
                          <FileDown size={18} />
                          <a 
                            href="https://gamma.app/docs/Rejoignez-la-reference-des-prestataires-dexcellence-3y3w6gbb1cowg2z" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white"
                          >
                            Télécharger notre plaquette commerciale
                          </a>
                        </Button>
                      </div>
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
              </TabsContent>
              
              {/* TAB 2 : Paiements (nouveau) */}
              <TabsContent value="paiements" className="py-12">
                <div className="container mx-auto px-4">
                  <PaiementsHeroSection />
                  <PainSolutionSection />
                  <HowItWorksSection />
                  <FeaturesGrid />
                  <SecuritySection />
                  <SocialProofSection />
                  
                  <DemoRequestForm />
                  
                  {/* CTA Principal Calendly */}
                  <section className="max-w-4xl mx-auto py-12 text-center">
                    <h2 className="text-3xl font-serif mb-4">Prêt à simplifier votre gestion de paiements ?</h2>
                    <Button 
                      size="lg"
                      className="bg-wedding-olive hover:bg-wedding-olive/90 text-lg px-8 py-6 mb-4"
                      onClick={() => window.open('https://cal.com/mathilde-mariable/30min?overlayCalendar=true&date=2025-10-21', '_blank')}
                    >
                      📅 Prendre RDV avec Mathilde (30 min)
                    </Button>
                  </section>
                  
                  <PaymentsFAQ />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Professionnels;
