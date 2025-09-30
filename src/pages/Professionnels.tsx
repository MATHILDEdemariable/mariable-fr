
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { FileDown, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalRegistrationForm from '@/components/forms/ProfessionalRegistrationForm';
import SEO from '@/components/SEO';

const Professionnels = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <SEO 
        title="Rejoignez Mariable | Prestataires de mariage d'excellence"
        description="Devenez un prestataire de mariage référencé sur Mariable. Bénéficiez d'une visibilité auprès de futurs mariés ciblés et développez votre activité."
        canonical="/professionnels"
      />
      
      <main className="flex-grow py-12 md:py-16 container bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-4 text-wedding-black">Rejoignez notre guide de professionnels du mariage premium</h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Faites partie de notre sélection et développez votre activité avec des clients qualifiés
          </p>

          {/* Badge for free service */}
          <div className="bg-green-50 text-green-800 px-4 py-2 rounded-full inline-flex items-center mb-8">
            <span className="font-medium">Un partenariat gagnant-gagnant</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-serif">Pourquoi rejoindre Mariable ?</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Visibilité ciblée</h3>
                    <p className="text-sm text-muted-foreground">Touchez des futurs mariés activement à la recherche de prestataires de qualité.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Un gage de qualité</h3>
                    <p className="text-sm text-muted-foreground">Différenciez-vous avec le label d'excellence Mariable.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Service de référencement gratuit</h3>
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
              <h2 className="text-2xl font-serif">Comment nous rejoindre ?</h2>
              <p>Deux options s'offrent à vous pour intégrer notre réseau de prestataires de mariage d'excellence :</p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="bg-wedding-cream rounded-full h-8 w-8 flex items-center justify-center text-wedding-black font-medium shrink-0">1</div>
                  <div>
                    <h3 className="text-base font-medium">Complétez le formulaire ci-dessous</h3>
                    <p className="text-sm text-muted-foreground">Remplissez tous les champs pour nous permettre d'évaluer votre candidature.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-wedding-cream rounded-full h-8 w-8 flex items-center justify-center text-wedding-black font-medium shrink-0">2</div>
                  <div>
                    <h3 className="text-base font-medium">Envoyez-nous un email</h3>
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
              
              {/* Bouton "Voir la sélection" ajouté ici */}
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Professionnels;
