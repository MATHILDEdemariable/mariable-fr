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
      <main className="min-h-screen bg-white pb-12" style={{ paddingTop: 'var(--header-h-standard)' }}>
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
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>La Plateforme référence gratuitement le Prestataire sur son site internet <strong>www.mariable.fr</strong>, et met en relation ce dernier avec des couples organisant leur mariage (<strong>les « Couples Mariable »</strong>).</li>
                <li>En contrepartie, le Prestataire s'engage à verser à la Plateforme une <strong>commission fixe de 200€ HT</strong> par couple signé issu de cette mise en relation.</li>
              </ul>
              
              <div className="bg-wedding-cream rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-wedding-black mb-3">Commission fixe applicable :</h3>
                <div className="text-2xl font-bold text-wedding-olive mb-2">200€ HT par couple signé</div>
                <p className="text-sm text-muted-foreground">
                  Cette commission unique s'applique à toutes les catégories de prestataires (lieu de réception, traiteur, photographe, vidéaste, DJ, fleuriste, mise en beauté, etc.), quel que soit le montant de la prestation.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 2bis – L'Avantage Exclusif Mariable</h2>
              <p className="text-muted-foreground mb-4">
                Le Prestataire s'engage à proposer aux Couples Mariable un <strong>« Avantage Exclusif Mariable »</strong>, défini comme suit :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Un bonus à forte valeur perçue et faible coût réel pour le Prestataire</li>
                <li>Cet avantage n'est pas nécessairement une remise financière, mais peut prendre la forme d'un service additionnel, d'un upgrade, d'une prestation bonus, etc.</li>
                <li>L'avantage peut être conditionné à un panier minimum (ex : prestations supérieures à 3 000€ ou 5 000€)</li>
              </ul>
              
              <p className="text-muted-foreground mb-4">
                <strong>Exemples d'avantages acceptés :</strong>
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Photographe : album imprimé offert, séance engagement incluse</li>
                <li>Lieu de réception : brunch du lendemain offert, nuit des mariés incluse</li>
                <li>Traiteur : heure de service supplémentaire, cocktail premium inclus</li>
                <li>DJ/Musicien : heure de soirée offerte, sonorisation cérémonie incluse</li>
                <li>Fleuriste : arche ou élément signature offert, upgrade floral</li>
              </ul>

              <p className="text-muted-foreground mb-4">
                <strong>Matérialisation de l'Avantage :</strong>
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Mariable fournit au Prestataire un <strong>code promo unique</strong> permettant d'identifier les Couples Mariable</li>
                <li>Ce code doit être utilisé par le couple sur le site internet du Prestataire (si existant) ou mentionné sur le devis</li>
                <li>L'utilisation du code déclenche l'application de l'Avantage Exclusif Mariable pour le couple et l'obligation de commission pour le Prestataire</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 3 – Définition d'un Couple Mariable</h2>
              <p className="text-muted-foreground mb-4">
                Est considéré comme <strong>Couple Mariable</strong> tout couple ayant :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>été mis en relation via la plateforme Mariable.fr (formulaire, email redirigé, espace membre)</li>
                <li>ou mentionné Mariable lors de son premier contact avec le Prestataire</li>
                <li>ou utilisé le code promo unique Mariable attribué au Prestataire</li>
                <li>ou identifié par un identifiant lead unique généré par Mariable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 4 – Modalités de la commission</h2>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
                <li><strong>Montant</strong> : la commission est fixée à <strong>200€ HT</strong> par contrat signé avec un Couple Mariable, quel que soit le montant de la prestation.</li>
                <li><strong>Exigibilité</strong> : la commission est due <strong>15 jours après réception</strong> par le Prestataire de l'acompte du couple.</li>
                <li><strong>Déclaration</strong> : le Prestataire déclare à Mariable tout contrat signé avec un Couple Mariable dans un délai de <strong>7 jours</strong> via le formulaire dédié (voir annexe mode opératoire Mariable).</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 5 – Clause de non-contournement</h2>
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
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 6 – Obligations du Prestataire</h2>
              <p className="text-muted-foreground mb-4">
                Le Prestataire s'engage à :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>fournir des informations exactes et à jour (tarifs, disponibilités, descriptifs, photos, etc.),</li>
                <li>assurer les prestations selon les règles de l'art et la réglementation applicable,</li>
                <li>déclarer avec exactitude toute réservation issue de la Plateforme,</li>
                <li>proposer un Avantage Exclusif Mariable aux couples issus de la Plateforme,</li>
                <li>autoriser la Plateforme à utiliser ses photos, logos et contenus à des fins de référencement et de communication,</li>
                <li>mettre en place, sur son site internet un lien actif vers la page officielle www.mariable.fr, en tant que gage de partenariat et de référencement.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 7 – Obligations de la Plateforme</h2>
              <p className="text-muted-foreground mb-4">
                La Plateforme s'engage à :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>référencer le Prestataire sur Mariable.fr,</li>
                <li>transmettre des leads qualifiés et identifier clairement les Couples Mariable,</li>
                <li>fournir un code promo unique au Prestataire pour la traçabilité des couples,</li>
                <li>assurer la transparence des conditions de commission.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 8 – Durée et résiliation</h2>
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
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 9 – Confidentialité et données</h2>
              <p className="text-muted-foreground">
                Les Parties s'engagent à garder confidentielles les données échangées. Les données personnelles des couples seront traitées conformément à la réglementation applicable (RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 10 – Droit applicable et juridiction compétente</h2>
              <p className="text-muted-foreground mb-4">
                Le présent contrat est soumis au <strong>droit français</strong>.
              </p>
              <p className="text-muted-foreground">
                Tout litige relatif à son interprétation ou à son exécution sera porté devant les juridictions compétentes du ressort de la Cour d'appel de Paris.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-4 text-wedding-black">Article 11 – Modalités de collaboration</h2>
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