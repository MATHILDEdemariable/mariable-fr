import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { CheckCircle, Search, Shield, FileText, Gift, Camera, Building2, UtensilsCrossed, Music, Flower2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalRegistrationForm from '@/components/forms/ProfessionalRegistrationForm';
import SEO from '@/components/SEO';
const Professionnels = () => {
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
            Référencement gratuit • Commission fixe de 200€ par couple signé
          </p>
        </section>

        {/* Contenu principal */}
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            
            {/* Section Conditions de référencement */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-wedding-cream to-premium-warm rounded-xl p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-serif mb-6 text-wedding-black flex items-center gap-3">
                  <Shield className="h-7 w-7 text-wedding-olive" />
                  Conditions de référencement
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
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
              </div>
            </section>

            {/* Section Notre modèle */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-serif mb-6 text-wedding-black text-center">
                Notre modèle : simple et transparent
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-xl bg-green-50 border-green-200">
                  <div className="text-4xl font-bold text-green-700 mb-2">0€</div>
                  <h3 className="font-medium text-wedding-black mb-1">Référencement gratuit</h3>
                  <p className="text-sm text-muted-foreground">Aucun frais d'entrée ni abonnement</p>
                </div>
                <div className="text-center p-6 border rounded-xl bg-wedding-cream border-wedding-olive/30">
                  <div className="text-4xl font-bold text-wedding-olive mb-2">200€</div>
                  <h3 className="font-medium text-wedding-black mb-1">Commission fixe</h3>
                  <p className="text-sm text-muted-foreground">Par couple signé venant de Mariable</p>
                </div>
                <div className="text-center p-6 border rounded-xl bg-blue-50 border-blue-200">
                  <div className="text-4xl font-bold text-blue-700 mb-2">∞</div>
                  <h3 className="font-medium text-wedding-black mb-1">​Avantage exclusif </h3>
                  <p className="text-sm text-muted-foreground">Pas de plafond de leads</p>
                </div>
              </div>
            </section>

            {/* Section Avantage Exclusif Mariable */}
            <section className="mb-12">
              <div className="border-2 border-wedding-olive/20 rounded-xl overflow-hidden">
                <div className="bg-wedding-olive text-white p-6">
                  <h2 className="text-2xl md:text-3xl font-serif flex items-center gap-3">
                    <Gift className="h-7 w-7" />
                    🎁 L'Avantage Exclusif Mariable
                  </h2>
                  <p className="mt-2 text-white/90">
                    Proposez un avantage exclusif aux couples venant de Mariable
                  </p>
                </div>
                
                <div className="p-6 bg-white">
                  <div className="bg-premium-warm rounded-lg p-4 mb-6">
                    <p className="text-sm text-wedding-black">
                      <strong>👉 Pas une remise obligatoire</strong> — mais un <strong>bonus intelligent</strong> à forte valeur perçue et faible coût réel pour vous.
                    </p>
                  </div>

                  <h3 className="font-semibold text-lg mb-4 text-wedding-black">Exemples d'avantages par catégorie :</h3>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Photographes */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Camera className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">Photographes / Vidéastes</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Album imprimé offert</li>
                        <li>• Séance engagement incluse</li>
                        <li>• Heures supplémentaires offertes</li>
                        <li>• Livraison accélérée</li>
                      </ul>
                    </div>

                    {/* Lieux */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">Lieux de réception</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Brunch du lendemain offert</li>
                        <li>• Nuit des mariés incluse</li>
                        <li>• Salle supplémentaire offerte</li>
                        <li>• Early check-in / late check-out</li>
                      </ul>
                    </div>

                    {/* Traiteurs */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <UtensilsCrossed className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">Traiteurs</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 1h de service supplémentaire</li>
                        <li>• Cocktail premium inclus</li>
                        <li>• Atelier culinaire offert</li>
                        <li>• Upgrade de menu</li>
                      </ul>
                    </div>

                    {/* DJ / Musiciens */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Music className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">DJ / Musiciens</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Heure de soirée offerte</li>
                        <li>• Sonorisation cérémonie incluse</li>
                        <li>• Playlist personnalisée + call prépa</li>
                      </ul>
                    </div>

                    {/* Fleuristes */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Flower2 className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">Fleuristes / Décorateurs</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Arche ou élément signature offert</li>
                        <li>• Installation/désinstallation incluse</li>
                        <li>• Upgrade floral</li>
                      </ul>
                    </div>

                    {/* Option intelligente */}
                    <div className="border-2 border-dashed border-wedding-olive/40 rounded-lg p-4 bg-wedding-cream/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-wedding-olive" />
                        <h4 className="font-medium">Option intelligente</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Avantage conditionné à un panier minimum (ex : prestations &gt; 3 000€ ou 5 000€)
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-wedding-olive">
                    <p className="text-sm text-wedding-black italic">
                      "Mariable ne se positionne pas comme une plateforme de remise, mais comme un <strong>facilitateur de décision</strong>. L'avantage exclusif sert de déclencheur, la commission fixe sert de cadre clair et équitable."
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Code Promo */}
            <section className="mb-12">
              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <h2 className="text-2xl font-serif mb-4 text-wedding-black">
                  🔐 Comment ça fonctionne ?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-wedding-olive text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium shrink-0">1</div>
                    <div>
                      <h3 className="font-medium text-wedding-black">Vous recevez un code promo unique Mariable</h3>
                      <p className="text-sm text-muted-foreground">Ce code identifie les couples provenant de notre plateforme</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-wedding-olive text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium shrink-0">2</div>
                    <div>
                      <h3 className="font-medium text-wedding-black">Le couple utilise ce code lors de sa réservation</h3>
                      <p className="text-sm text-muted-foreground">Sur votre site internet ou à mentionner sur le devis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-wedding-olive text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium shrink-0">3</div>
                    <div>
                      <h3 className="font-medium text-wedding-black">Le couple bénéficie de l'avantage exclusif</h3>
                      <p className="text-sm text-muted-foreground">Et vous réglez la commission fixe de 200€ HT à Mariable</p>
                    </div>
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
              </div>

              {/* Colonne Formulaire */}
              <div className="border rounded-lg p-6 bg-white shadow-sm">
                <h2 className="text-2xl font-serif mb-4">Formulaire d'inscription</h2>
                <div className="mb-4 p-4 bg-premium-warm rounded-lg border border-premium-light">
                  <p className="text-sm text-muted-foreground">
                    En soumettant ce formulaire, vous acceptez nos{' '}
                    <Link to="/cgv" className="text-premium-sage hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                      Conditions Générales d'Utilisation
                    </Link>
                    {' '}et vous engagez à proposer un Avantage Exclusif Mariable.
                  </p>
                </div>
                <ProfessionalRegistrationForm />
              </div>
            </div>

            {/* Contact alternatif */}
            <div className="text-center text-muted-foreground">
              <p>
                Vous préférez nous contacter directement ? Envoyez un email à{' '}
                <a href="mailto:mathilde@mariable.fr" className="text-wedding-olive hover:underline font-medium">
                  mathilde@mariable.fr
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Professionnels;