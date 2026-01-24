import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { CheckCircle, Search, Shield, FileText, Gift, Camera, Building2, UtensilsCrossed, Music, Flower2, Sparkles, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalRegistrationForm from '@/components/forms/ProfessionalRegistrationForm';
import SEO from '@/components/SEO';

const Professionnels = () => {
  const scrollToExamples = () => {
    const element = document.getElementById('exemples-avantages');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Référencement gratuit jusqu'en juin 2025* • Commission fixe de 200€ par couple signé
          </p>
        </section>

        {/* Contenu principal */}
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            
            {/* Section fusionnée : Notre modèle (conditions + tarifs) */}
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
                    <p className="text-xs text-wedding-olive mt-2 font-medium">Gratuit jusqu'en juin 2025</p>
                  </div>
                  <div className="text-center p-6 border rounded-xl bg-white border-wedding-olive/20">
                    <div className="text-4xl font-bold text-wedding-olive mb-2">200€</div>
                    <h3 className="font-medium text-wedding-black mb-1">Commission fixe</h3>
                    <p className="text-sm text-muted-foreground">Par couple signé venant de Mariable</p>
                  </div>
                  <div 
                    className="text-center p-6 border rounded-xl bg-white border-wedding-olive/20 cursor-pointer hover:border-wedding-olive transition-colors group"
                    onClick={scrollToExamples}
                  >
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
                  * Les frais d'entrée pourraient évoluer après cette période. Voir les conditions générales pour plus de détails.
                </p>
              </div>
            </section>

            {/* Section Comment ça fonctionne - 4 étapes */}
            <section className="mb-12">
              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <h2 className="text-2xl font-serif mb-6 text-wedding-black text-center">
                  Comment ça fonctionne
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-wedding-olive text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg mb-3">1</div>
                    <h3 className="font-medium text-wedding-black text-sm">Vous complétez le formulaire ci-dessous</h3>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-wedding-olive text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg mb-3">2</div>
                    <h3 className="font-medium text-wedding-black text-sm">Nous vous transmettons un code unique correspondant à votre activité</h3>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-wedding-olive text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg mb-3">3</div>
                    <h3 className="font-medium text-wedding-black text-sm">Le couple l'utilise lors de sa réservation</h3>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-wedding-olive text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg mb-3">4</div>
                    <h3 className="font-medium text-wedding-black text-sm">Vous nous rétrocédez la commission après validation de l'acompte</h3>
                  </div>
                </div>
              </div>
            </section>

            {/* Section double colonnes : Avantages + Formulaire */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Colonne Avantages */}
              <div className="space-y-6">
                <h3 className="text-2xl font-serif text-wedding-black">Pourquoi rejoindre Mariable ?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Visibilité ciblée</h4>
                      <p className="text-sm text-muted-foreground">Touchez des futurs mariés activement à la recherche de prestataires de qualité.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Label d'excellence</h4>
                      <p className="text-sm text-muted-foreground">Différenciez-vous avec le label Mariable qui rassure les couples.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Zéro risque financier</h4>
                      <p className="text-sm text-muted-foreground">Aucun frais d'entrée, vous ne payez que si vous signez un couple Mariable.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Commission fixe et prévisible</h4>
                      <p className="text-sm text-muted-foreground">200€ HT par couple signé, quel que soit le montant de votre prestation.</p>
                    </div>
                  </li>
                </ul>

                <div className="pt-4">
                  <Button asChild variant="outline" className="border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10">
                    <Link to="/professionnelsmariable" className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Voir la sélection actuelle
                    </Link>
                  </Button>
                </div>

                {/* Note sur les photos Instagram */}
                <div className="p-4 bg-premium-warm rounded-lg border border-premium-light">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note :</strong> Mariable se réserve le droit d'utiliser des photos de votre site Instagram 
                    pour sublimer votre fiche si les photos fournies ne respectent pas notre ligne éditoriale.
                  </p>
                </div>
              </div>

              {/* Colonne Formulaire */}
              <div className="border rounded-lg p-6 bg-white shadow-sm">
                <h2 className="text-2xl font-serif mb-4">Formulaire d'inscription</h2>
                <ProfessionalRegistrationForm />
              </div>
            </div>

            {/* Section Exemples d'avantages (après le formulaire) */}
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
                          Upgrade floral
                        </li>
                      </ul>
                    </div>

                    {/* Option intelligente */}
                    <div className="border-2 border-dashed border-wedding-olive/40 rounded-lg p-4 bg-wedding-cream/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">Option intelligente</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Proposez un avantage à <strong>forte valeur perçue</strong> mais à <strong>faible coût réel</strong> pour vous. 
                        L'objectif : créer un effet "wow" pour le couple sans impacter vos marges.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact alternatif */}
            <section className="text-center py-8">
              <p className="text-muted-foreground">
                Des questions ? Contactez-nous à{" "}
                <a href="mailto:contact@mariable.fr" className="text-wedding-olive hover:underline">
                  contact@mariable.fr
                </a>
              </p>
            </section>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};

export default Professionnels;