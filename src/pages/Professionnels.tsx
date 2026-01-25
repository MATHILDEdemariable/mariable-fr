import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { CheckCircle, Search, Shield, FileText, Gift, Camera, Building2, UtensilsCrossed, Music, Flower2, Sparkles, ArrowDown, ClipboardList, Tag, Mail, Send, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalRegistrationForm from '@/components/forms/ProfessionalRegistrationForm';
import SEO from '@/components/SEO';

const Professionnels = () => {
  const scrollToExamples = () => {
    const element = document.getElementById('exemples-avantages');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const scrollToForm = () => {
    const element = document.getElementById('formulaire-inscription');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return <div className="min-h-screen flex flex-col bg-white">
      <PremiumHeader />
      
      <SEO title="Référencement Gratuit | Prestataires Mariage Mariable" description="Rejoignez notre sélection de prestataires de mariage d'excellence. Référencement gratuit, commission fixe de 200€ par couple signé." canonical="/professionnels" />
      
      <main className="flex-grow pb-12 page-content">
        {/* Hero principal */}
        <section className="container mx-auto px-4 pt-8 pb-12 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-4 text-wedding-black">
            Rejoignez notre sélection de prestataires d'excellence
          </h1>
        </section>

        {/* Contenu principal */}
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            
            {/* Section 1 : Pourquoi rejoindre Mariable ? */}
            <section className="mb-12">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-serif text-wedding-black text-center">Pourquoi rejoindre Mariable ?</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-premium-warm rounded-lg">
                    <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Visibilité ciblée</h4>
                      <p className="text-sm text-muted-foreground">Touchez des futurs mariés activement à la recherche de prestataires de qualité.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-premium-warm rounded-lg">
                    <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Label d'excellence</h4>
                      <p className="text-sm text-muted-foreground">Différenciez-vous avec le label Mariable qui rassure les couples.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-premium-warm rounded-lg">
                    <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Zéro risque financier</h4>
                      <p className="text-sm text-muted-foreground">Aucun frais d'entrée, vous ne payez que si vous signez un couple Mariable.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-premium-warm rounded-lg">
                    <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Commission fixe et prévisible</h4>
                      <p className="text-sm text-muted-foreground">200€ HT par couple signé, quel que soit le montant de votre prestation.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button asChild variant="outline" className="border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10">
                    <Link to="/professionnelsmariable" className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Voir la sélection actuelle
                    </Link>
                  </Button>
                </div>

              </div>
            </section>

            {/* Section 2 : Notre modèle (conditions + tarifs) */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-wedding-cream to-premium-warm rounded-xl p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-serif mb-6 text-wedding-black flex items-center gap-3">
                  <Shield className="h-7 w-7 text-wedding-olive" />
                  Notre modèle : simple et transparent
                </h2>
                
                {/* Conditions */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-wedding-black">Être un professionnel assuré</h3>
                      <p className="text-sm text-muted-foreground">Assurance responsabilité civile professionnelle obligatoire</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 flex items-start gap-3">
                    <FileText className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-wedding-black">Posséder un numéro de SIRET</h3>
                      <p className="text-sm text-muted-foreground">Entreprise immatriculée en règle</p>
                    </div>
                  </div>
                </div>
                
                {/* Modèle - toutes les cartes en beige/blanc */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-xl bg-white border-wedding-olive/20">
                    <div className="text-4xl font-bold text-wedding-olive mb-2">0€</div>
                    <h3 className="font-medium text-wedding-black mb-1">Référencement gratuit*</h3>
                    <p className="text-sm text-muted-foreground">Aucun frais d'entrée ni abonnement</p>
                    
                  </div>
                  <div className="text-center p-6 border rounded-xl bg-white border-wedding-olive/20">
                    <div className="text-4xl font-bold text-wedding-olive mb-2">200€</div>
                    <h3 className="font-medium text-wedding-black mb-1">Commission fixe</h3>
                    <p className="text-sm text-muted-foreground">Par couple signé venant de Mariable</p>
                  </div>
                  <div className="text-center p-6 border rounded-xl bg-white border-wedding-olive/20 cursor-pointer hover:border-wedding-olive transition-colors group" onClick={scrollToExamples}>
                    <div className="flex justify-center mb-2">
                      <Gift className="h-10 w-10 text-wedding-olive" />
                    </div>
                    <h3 className="font-medium text-wedding-black mb-1">Avantage Exclusif</h3>
                    <p className="text-sm text-muted-foreground">Proposez un avantage aux couples Mariable</p>
                    <p className="text-xs text-wedding-olive mt-2 font-medium flex items-center justify-center gap-1 group-hover:underline">
                      Voir des exemples <ArrowDown className="h-3 w-3" />
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  * Les frais d'entrée pourront évoluer. Voir les conditions générales pour plus de détails.
                </p>
              </div>
            </section>

            {/* Section 3 : Comment ça fonctionne - 5 étapes */}
            <section className="mb-12">
              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <h2 className="text-2xl font-serif mb-6 text-wedding-black text-center">
                  Comment ça fonctionne
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                  <div className="flex flex-col items-center text-center p-3 md:p-4 cursor-pointer hover:bg-white rounded-lg transition-colors" onClick={scrollToForm}>
                    <div className="bg-wedding-olive text-white rounded-full h-10 w-10 md:h-12 md:w-12 flex items-center justify-center font-bold text-base md:text-lg mb-2 md:mb-3">1</div>
                    <ClipboardList className="h-5 w-5 text-wedding-olive mb-1" />
                    <h3 className="font-medium text-wedding-black text-xs md:text-sm">Formulaire</h3>
                    <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Complétez ci-dessous en 3 clics</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 md:p-4">
                    <div className="bg-wedding-olive text-white rounded-full h-10 w-10 md:h-12 md:w-12 flex items-center justify-center font-bold text-base md:text-lg mb-2 md:mb-3">2</div>
                    <Tag className="h-5 w-5 text-wedding-olive mb-1" />
                    <h3 className="font-medium text-wedding-black text-xs md:text-sm">Code Avantage</h3>
                    <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Nous créons un code unique pour envoi aux couples via la messagerie</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 md:p-4">
                    <div className="bg-wedding-olive text-white rounded-full h-10 w-10 md:h-12 md:w-12 flex items-center justify-center font-bold text-base md:text-lg mb-2 md:mb-3">3</div>
                    <Mail className="h-5 w-5 text-wedding-olive mb-1" />
                    <h3 className="font-medium text-wedding-black text-xs md:text-sm">Contact Couple</h3>
                    <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Le couple vous contacte par mariable.fr, vous recevez la demande par mail</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 md:p-4">
                    <div className="bg-wedding-olive text-white rounded-full h-10 w-10 md:h-12 md:w-12 flex items-center justify-center font-bold text-base md:text-lg mb-2 md:mb-3">4</div>
                    <Send className="h-5 w-5 text-wedding-olive mb-1" />
                    <h3 className="font-medium text-wedding-black text-xs md:text-sm">Envoi Devis</h3>
                    <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Vous ou le couple nous envoyez le devis en copie avec le code</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 md:p-4 col-span-2 sm:col-span-1">
                    <div className="bg-wedding-olive text-white rounded-full h-10 w-10 md:h-12 md:w-12 flex items-center justify-center font-bold text-base md:text-lg mb-2 md:mb-3">5</div>
                    <Receipt className="h-5 w-5 text-wedding-olive mb-1" />
                    <h3 className="font-medium text-wedding-black text-xs md:text-sm">Facturation</h3>
                    <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Nous vous facturons les frais de commissions</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 : Formulaire d'inscription */}
            <section className="mb-12" id="formulaire-inscription">
              <div className="border rounded-lg p-6 bg-white shadow-sm max-w-2xl mx-auto">
                <h2 className="text-2xl font-serif mb-4 text-center">Formulaire d'inscription</h2>
                <ProfessionalRegistrationForm />
              </div>
              
              {/* Note sur les photos Instagram - EN BAS DU FORMULAIRE */}
              <div className="p-4 bg-premium-warm rounded-lg border border-premium-light max-w-2xl mx-auto mt-4">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Note :</strong> Mariable se réserve le droit d'utiliser des photos de votre site Instagram 
                  pour sublimer votre fiche si les photos fournies ne respectent pas notre ligne éditoriale.
                </p>
              </div>
            </section>

            {/* Section 5 : Exemples d'avantages (après le formulaire) */}
            <section className="mb-12" id="exemples-avantages">
              <div className="border-2 border-wedding-olive/20 rounded-xl overflow-hidden">
                <div className="bg-wedding-olive text-white p-6">
                  <h2 className="text-2xl md:text-3xl font-serif flex items-center gap-3">
                    <Gift className="h-7 w-7" />
                    Exemples d'avantages
                  </h2>
                  <p className="mt-2 text-white/90">
                    Proposez un avantage aux couples du Club Mariable
                  </p>
                </div>
                
                <div className="p-6 bg-white">
                  <div className="bg-premium-warm rounded-lg p-4 mb-6">
                    <p className="text-sm text-wedding-black">
                      <strong>À vous de choisir parmi ces idées ou proposer autre chose</strong> — un bonus intelligent à forte valeur perçue et faible coût réel pour vous.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Photographes */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Camera className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">Photographes / Vidéastes</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Album imprimé offert
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Séance engagement incluse
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Heures supplémentaires offertes
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Livraison accélérée
                        </li>
                      </ul>
                    </div>

                    {/* Lieux */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">Lieux de réception</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Brunch du lendemain offert
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Nuit des mariés incluse
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Salle supplémentaire offerte
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Early check-in / late check-out
                        </li>
                      </ul>
                    </div>

                    {/* Traiteurs */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <UtensilsCrossed className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">Traiteurs</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          1h de service supplémentaire
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Cocktail premium inclus
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Atelier culinaire offert
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Upgrade de menu
                        </li>
                      </ul>
                    </div>

                    {/* DJ / Musiciens */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Music className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">DJ / Musiciens</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Heure de soirée offerte
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Sonorisation cérémonie incluse
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Playlist personnalisée + call prépa
                        </li>
                      </ul>
                    </div>

                    {/* Fleuristes */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Flower2 className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">Fleuristes / Décorateurs</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Arche ou élément signature offert
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Installation/désinstallation incluse
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Bouquet de mariée supplémentaire
                        </li>
                      </ul>
                    </div>

                    {/* Autres prestataires */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">Autres prestataires</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Heure supplémentaire offerte
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Option ou upgrade incluse
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-1" />
                          Bonus personnalisé
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact alternatif */}
            <section className="text-center py-8 border-t">
              <p className="text-muted-foreground mb-4">Une question avant de vous inscrire ?</p>
              <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90">
                <Link to="/contact" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contactez-nous
                </Link>
              </Button>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};

export default Professionnels;
