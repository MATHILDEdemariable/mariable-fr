import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import SimpleHeader from '@/components/SimpleHeader';

const CGV = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Conditions Générales - Mariable"
        description="Conditions générales d'utilisation pour les professionnels du mariage sur la plateforme Mariable."
        keywords="conditions générales, CGV, professionnels mariage, Mariable"
      />
      
      <SimpleHeader />
      
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-muted-foreground text-center mb-12">
            Conditions applicables aux professionnels du mariage
          </p>

          <div className="space-y-8 text-foreground">
            
            {/* Article 1 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-premium-sage">Article 1 - Objet</h2>
              <p className="leading-relaxed mb-4">
                Les présentes conditions générales d'utilisation (CGU) régissent les modalités d'inscription et d'utilisation de la plateforme Mariable par les professionnels du secteur du mariage.
              </p>
              <p className="leading-relaxed">
                Mariable propose un service de <strong>référencement gratuit</strong> permettant aux professionnels qualifiés d'être mis en relation avec de futurs mariés à la recherche de prestataires d'exception.
              </p>
            </section>

            {/* Article 2 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-premium-sage">Article 2 - Processus de sélection</h2>
              <p className="leading-relaxed mb-4">
                L'inscription sur la plateforme Mariable est soumise à un processus de sélection rigoureux. <strong>L'équipe de Mariable se réserve le droit exclusif</strong> de décider de l'acceptation ou du refus de publication des profils des prestataires candidats.
              </p>
              <p className="leading-relaxed">
                Cette sélection s'effectue selon des critères d'excellence, de professionnalisme et d'adéquation avec les valeurs de la plateforme, garantissant ainsi une expérience premium à nos utilisateurs.
              </p>
            </section>

            {/* Article 3 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-premium-sage">Article 3 - Obligations du prestataire</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">3.1 Respect de la charte qualité</h3>
                  <p className="leading-relaxed">
                    Le prestataire s'engage à respecter la charte qualité Mariable et à <strong>garantir une expérience premium</strong> à chaque client. Cela inclut le respect des délais, la qualité du service et la courtoisie professionnelle.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">3.2 Service de qualité irréprochable</h3>
                  <p className="leading-relaxed">
                    Le prestataire s'engage à fournir des <strong>services de qualité irréprochable</strong>, conformes aux standards d'excellence attendus par la clientèle Mariable et en accord avec sa réputation sur la plateforme.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3.3 Transparence tarifaire</h3>
                  <p className="leading-relaxed">
                    Le prestataire s'engage à la <strong>transparence tarifaire obligatoire</strong> et accepte de <strong>partager ses prix</strong> de manière claire et honnête. Cette transparence est une condition sine qua non pour rejoindre la communauté Mariable et ses valeurs d'authenticité.
                  </p>
                </div>
              </div>
            </section>

            {/* Article 4 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-premium-sage">Article 4 - Droits de Mariable</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">4.1 Création et gestion des fiches</h3>
                  <p className="leading-relaxed">
                    Mariable se charge de la <strong>création et de la gestion des fiches prestataires</strong>. En contrepartie de cette prise en charge complète, Mariable dispose d'un <strong>droit de regard</strong> sur le contenu publié et les informations diffusées.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">4.2 Mise en valeur des prestataires</h3>
                  <p className="leading-relaxed">
                    Mariable <strong>s'engage à mettre en valeur</strong> les prestataires sélectionnés à travers diverses actions promotionnelles, tout en conservant la maîtrise éditoriale de leur présentation sur la plateforme.
                  </p>
                </div>
              </div>
            </section>

            {/* Article 5 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-premium-sage">Article 5 - Modèle économique</h2>
              <p className="leading-relaxed mb-4">
                Mariable applique un système de <strong>commission sur les réservations</strong> réalisées grâce à la plateforme. Le taux de commission sera communiqué lors de l'acceptation du prestataire.
              </p>
              <p className="leading-relaxed">
                Cette commission ne s'applique que sur les contrats effectivement conclus et rémunérés suite à une mise en relation via Mariable.
              </p>
            </section>

            {/* Article 6 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-premium-sage">Article 6 - Résiliation et exclusion</h2>
              <p className="leading-relaxed mb-4">
                Mariable se réserve le droit d'exclure du réseau tout prestataire qui ne respecterait pas les présentes conditions générales, la charte qualité ou qui porterait atteinte à l'image de la plateforme.
              </p>
              <p className="leading-relaxed">
                Cette exclusion peut intervenir sans préavis en cas de manquement grave et entraîne la suppression immédiate du profil sur la plateforme.
              </p>
            </section>

            {/* Article 7 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-premium-sage">Article 7 - Acceptation</h2>
              <p className="leading-relaxed">
                L'inscription sur la plateforme Mariable vaut acceptation pleine et entière des présentes conditions générales d'utilisation. Le prestataire reconnaît les avoir lues, comprises et acceptées sans réserve.
              </p>
            </section>

          </div>

          <div className="mt-16 p-6 bg-premium-warm rounded-lg border border-premium-light">
            <p className="text-sm text-muted-foreground text-center">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CGV;