import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CGV = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Contrat de mise en relation et commission | Mariable"
        description="Consultez les conditions contractuelles de partenariat entre Mariable et les professionnels de l'événementiel."
        canonical="/cgv"
      />
      <Header />
      <main className="min-h-screen bg-white pt-32 pb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-serif mb-4 text-wedding-black">
            CONTRAT DE MISE EN RELATION ET COMMISSION
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Entre professionnels de l'événementiel et la plateforme Mariable.fr
          </p>
          
          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 1 – Identification des Parties</h2>
              <p className="text-muted-foreground mb-4">
                <strong>MARIABLE</strong>, SASU au capital de 8000 €, immatriculée au RCS de Nanterre, dont le siège social est situé 99 avenue Achille Peretti représentée par sa Présidente, Madame Mathilde Lambert, ci-après dénommée <strong>« la Plateforme »</strong>,
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>ET</strong>
              </p>
              <p className="text-muted-foreground mb-4">
                ______________________, immatriculée au RCS de____, dont le siège social est situé à ___________, représentée par __________________, ci-après dénommée <strong>« le Prestataire »</strong>,
              </p>
              <p className="text-muted-foreground">
                Ensemble dénommés <strong>« les Parties »</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 2 – Objet du contrat</h2>
              <p className="text-muted-foreground mb-4">
                Le présent contrat a pour objet de définir les conditions dans lesquelles :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>La Plateforme référence gratuitement le Prestataire sur son site internet <strong>www.mariable.fr</strong>, et met en relation ce dernier avec des couples organisant leur mariage (<strong>les « Couples Mariable »</strong>).</li>
                <li>En contrepartie, le Prestataire s'engage à verser à la Plateforme une <strong>commission de 8% HT</strong> sur le montant total des prestations (Hors frais de livraison) effectivement réglées par les couples issus de cette mise en relation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 3 – Définition d'un Couple Mariable</h2>
              <p className="text-muted-foreground mb-4">
                Est considéré comme <strong>Couple Mariable</strong> tout couple ayant :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>été mis en relation via la plateforme Mariable.fr (formulaire, email redirigé, espace membre)</li>
                <li>ou mentionné Mariable lors de son premier contact avec le Prestataire,</li>
                <li>ou identifié par un identifiant lead unique généré par Mariable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 4 – Modalités de la commission</h2>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
                <li><strong>Base de calcul</strong> : la commission est calculée sur le montant total <strong>HT du contrat signé</strong> entre le Prestataire et le Couple Mariable.</li>
                <li><strong>Exigibilité</strong> : la commission est due <strong>15 jours après réception</strong> par le Prestataire de l'acompte</li>
                <li><strong>Déclaration</strong> : le Prestataire déclare à Mariable tout contrat signé avec un Couple Mariable dans un délai de <strong>7 jours</strong> via le formulaire dédié (voir annexe mode opératoire Mariable)</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 5 – Programme Partenaires Mariable</h2>
              <p className="text-muted-foreground mb-4">
                Dans le cadre du partenariat, Mariable met en place un programme d'incentives destiné à récompenser la fidélité des Prestataires :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>À partir de 5 couples signés</strong> : Mariable vous offre une mise en avant premium sur les réseaux sociaux avec notamment un <strong>pack Content Creator</strong> comprenant la création de contenus visuels : 1H de tournage pour 3 vidéos adaptées aux réseaux sociaux</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Tout manquement avéré à l'obligation de déclaration (cf. article 4) entraîne la perte des avantages liés au programme partenaire.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 6 – Clause de non-contournement</h2>
              <p className="text-muted-foreground mb-4">
                Le Prestataire s'interdit de conclure ou maintenir une relation commerciale directe avec un Couple Mariable dans le but d'éluder le paiement de la commission.
              </p>
              <p className="text-muted-foreground mb-4">
                Cette obligation s'applique pendant la durée du présent contrat et pour une période de <strong>12 mois après sa cessation</strong>.
              </p>
              <p className="text-muted-foreground">
                Toute violation pourra entraîner la résiliation immédiate du contrat et le paiement de dommages et intérêts égaux au montant de la commission éludée, majoré de 50 %.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 7 – Obligations du Prestataire</h2>
              <p className="text-muted-foreground mb-4">
                Le Prestataire s'engage à :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>fournir des informations exactes et à jour (tarifs, disponibilités, descriptifs, photos, etc.),</li>
                <li>assurer les prestations selon les règles de l'art et la réglementation applicable,</li>
                <li>déclarer avec exactitude toute réservation issue de la Plateforme,</li>
                <li>autoriser la Plateforme à utiliser ses photos, logos et contenus à des fins de référencement et de communication.</li>
                <li>mettre en place, sur son site internet un lien actif vers la page officielle www.mariable.fr, en tant que gage de partenariat et de référencement.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 8 – Obligations de la Plateforme</h2>
              <p className="text-muted-foreground mb-4">
                La Plateforme s'engage à :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>référencer le Prestataire sur Mariable.fr,</li>
                <li>transmettre des leads qualifiés et identifier clairement les Couples Mariable,</li>
                <li>assurer la transparence des conditions de commission.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 9 – Durée et résiliation</h2>
              <p className="text-muted-foreground mb-4">
                Le présent contrat est conclu pour une durée de <strong>3 ans</strong>, renouvelable tacitement par périodes de même durée.
              </p>
              <p className="text-muted-foreground mb-4">
                Chaque Partie peut y mettre fin à tout moment avec un <strong>préavis d'un 1 mois</strong>, notifié par écrit.
              </p>
              <p className="text-muted-foreground">
                La Plateforme pourra déréférencer immédiatement le Prestataire en cas de manquement grave.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 10 – Confidentialité et données</h2>
              <p className="text-muted-foreground">
                Les Parties s'engagent à garder confidentielles les données échangées. Les données personnelles des couples seront traitées conformément à la réglementation applicable (RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 11 – Droit applicable et juridiction compétente</h2>
              <p className="text-muted-foreground mb-4">
                Le présent contrat est soumis au <strong>droit français</strong>.
              </p>
              <p className="text-muted-foreground">
                Tout litige relatif à son interprétation ou à son exécution sera porté devant les juridictions compétentes du ressort de la Cour d'appel de Paris.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 12 – Modalités de collaboration</h2>
              <p className="text-muted-foreground mb-4">
                Les modalités pratiques de mise en relation, de suivi des couples et de transmission des devis sont décrites dans le <strong>mode opératoire Mariable (Annexe envoyée dès demande clients)</strong>
              </p>
              <p className="text-muted-foreground mb-4">
                Cette annexe n'altère pas les obligations contractuelles définies aux articles précédents, mais a pour objet de préciser le processus opérationnel de collaboration entre Mariable et le Prestataire.
              </p>
              <p className="text-muted-foreground">
                Mariable se réserve la possibilité de mettre à jour cette annexe en fonction de l'évolution de ses outils ou services, sous réserve d'en informer le Prestataire par tout moyen écrit (email suffisant).
              </p>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CGV;