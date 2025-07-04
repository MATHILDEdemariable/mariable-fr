
import React from 'react';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Linkedin } from 'lucide-react';

const CGV = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container py-16">
        <h1 className="text-4xl font-serif mb-8">Conditions Générales de Vente</h1>
        <Separator className="mb-8" />
        
        <div className="prose max-w-3xl">
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Article 1 - Objet</h2>
            <p>Les présentes conditions générales de vente régissent les relations contractuelles entre la société Mariable SAS, ci-après dénommée "le Prestataire", et toute personne physique ou morale souhaitant bénéficier des services proposés sur le site mariable.fr, ci-après dénommée "le Client".</p>
            <p>Elles précisent notamment les conditions de commande, de paiement, de livraison et de gestion des éventuels retours des services commandés par les Clients.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Article 2 - Services proposés</h2>
            <p>Mariable propose des services d'aide à l'organisation de mariage, notamment :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Mise en relation avec des prestataires de services liés au mariage</li>
              <li>Consultation et conseil personnalisés</li>
              <li>Outils de planification en ligne</li>
              <li>Gestion de budget</li>
            </ul>
            <p>Les détails spécifiques de chaque service sont précisés dans les descriptions disponibles sur le site.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Article 3 - Tarifs</h2>
            <p>Les prix des services sont indiqués en euros toutes taxes comprises (TTC).</p>
            <p>Le Prestataire se réserve le droit de modifier ses prix à tout moment, étant toutefois entendu que le prix figurant sur le site le jour de la commande sera le seul applicable au Client.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Article 4 - Commande</h2>
            <p>Les informations contractuelles sont présentées en langue française et font l'objet d'une confirmation au plus tard au moment de la validation de la commande par le Client.</p>
            <p>Pour passer commande, le Client suit les différentes étapes de commande en ligne, à savoir :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Sélection des services sur le site</li>
              <li>Création d'un compte client ou identification si le Client possède déjà un compte</li>
              <li>Validation des informations de facturation</li>
              <li>Choix du mode de paiement</li>
              <li>Confirmation de la commande en cliquant sur "Commander"</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Article 5 - Paiement</h2>
            <p>Le règlement des achats s'effectue via l'une des solutions de paiement suivantes :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Carte bancaire (Visa, MasterCard, American Express)</li>
              <li>PayPal</li>
              <li>Virement bancaire (pour certains services uniquement)</li>
            </ul>
            <p>Les informations transmises sont chiffrées et ne peuvent être lues au cours du transport sur le réseau.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Article 6 - Droit de rétractation</h2>
            <p>Conformément aux dispositions légales en vigueur, le Client dispose d'un délai de 14 jours à compter de la conclusion du contrat de prestation de services pour exercer son droit de rétractation auprès du Prestataire, sans avoir à justifier de motifs ni à payer de pénalité.</p>
            <p>Pour exercer son droit de rétractation, le Client doit notifier sa décision de rétractation au moyen d'une déclaration dénuée d'ambiguïté par email à contact@mariable.fr ou par courrier à l'adresse du siège social.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Article 7 - Responsabilité</h2>
            <p>Mariable s'engage à mettre en œuvre tous les moyens nécessaires à la bonne exécution de ses obligations contractuelles. Toutefois, sa responsabilité ne pourra être engagée en cas d'inexécution ou de mauvaise exécution due soit au fait du Client, soit au fait insurmontable et imprévisible d'un tiers, soit à un cas de force majeure.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Article 8 - Loi applicable et juridiction compétente</h2>
            <p>Les présentes conditions générales de vente sont soumises à la loi française. En cas de litige, les tribunaux français seront seuls compétents.</p>
          </section>
        </div>
      </main>
      
      <footer className="py-8 md:py-12 bg-white text-wedding-black">
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-10 md:h-12 w-auto" />
              </div>
              <p className="mb-4 text-wedding-black/70 text-sm">
                Mariable est votre partenaire privilégié pour créer le mariage de vos rêves, en simplifiant chaque étape de l'organisation.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/mariable.fr/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-wedding-black hover:text-wedding-black/70 transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-0">
              <h3 className="font-serif text-base md:text-lg mb-3 md:mb-4">Liens Rapides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Accueil</Link></li>
                <li><Link to="/services/prestataires" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Prestataires</Link></li>
                <li><Link to="/services/planification" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Planification</Link></li>
                <li><Link to="/services/budget" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Budget</Link></li>
                <li><Link to="/services/conseils" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Conseils</Link></li>
              </ul>
            </div>
            
            <div className="mt-6 sm:mt-0">
              <h3 className="font-serif text-base md:text-lg mb-3 md:mb-4">À Propos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about/histoire" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Histoire</Link></li>
                <li><Link to="/about/approche" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Approche</Link></li>
                <li><Link to="/about/temoignages" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Témoignages</Link></li>
                <li><Link to="/contact" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Nous Contacter</Link></li>
              </ul>
            </div>
            
            <div className="mt-6 lg:mt-0">
              <h3 className="font-serif text-base md:text-lg mb-3 md:mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 md:h-5 md:w-5 text-wedding-black shrink-0" />
                  <a href="mailto:mathilde@mariable.fr" className="text-wedding-black/70 hover:text-wedding-black transition-colors">
                    mathilde@mariable.fr
                  </a>
                </li>
                <li className="flex items-center">
                  <Linkedin className="mr-2 h-4 w-4 md:h-5 md:w-5 text-wedding-black shrink-0" />
                  <a href="https://www.linkedin.com/in/lambertmathilde/" target="_blank" rel="noopener noreferrer" className="text-wedding-black/70 hover:text-wedding-black transition-colors">
                    LinkedIn Professionnel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 md:mt-12 pt-6 border-t border-wedding-black/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs md:text-sm text-wedding-black/70 mb-4 md:mb-0 text-center md:text-left">
              © 2025 Mariable - Tous droits réservés
            </p>
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
              <Link to="/mentions-legales" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mentions Légales</Link>
              <Link to="/politique-confidentialite" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Politique de Confidentialité</Link>
              <Link to="/cgv" className="text-wedding-black/70 hover:text-wedding-black transition-colors">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CGV;
