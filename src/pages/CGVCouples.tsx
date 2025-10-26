import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const CGVCouples = () => {
  return (
    <>
      <SEO
        title="Conditions Générales d'Utilisation Couples | Mariable"
        description="Conditions d'utilisation de la plateforme Mariable pour les couples organisateurs de mariage."
        canonical="/cgv-couples"
      />
      <Header />
      <main className="min-h-screen bg-background pb-12" style={{ paddingTop: 'var(--header-h-standard)' }}>
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-serif mb-4 text-foreground">
            CONDITIONS GÉNÉRALES D'UTILISATION
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Pour les utilisateurs couples de la plateforme Mariable.fr
          </p>
          
          <div className="prose max-w-none space-y-8">
            
            {/* Article 1 - Présentation de la plateforme */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 1 – Présentation de la plateforme
              </h2>
              <p className="text-muted-foreground mb-4">
                La plateforme <strong>Mariable.fr</strong> est éditée par la société <strong>MARIABLE</strong>, SASU au capital de 8000 €, immatriculée au RCS de Nanterre sous le numéro 984 525 603, dont le siège social est situé au 99 avenue Achille Peretti, 92200 Neuilly-sur-Seine, représentée par sa Présidente, Madame Mathilde Lambert.
              </p>
              <p className="text-muted-foreground">
                Mariable est une plateforme numérique dédiée à l'organisation et à la planification de mariages, offrant aux couples des outils de gestion, de coordination et de mise en relation avec des prestataires professionnels de l'événementiel.
              </p>
            </section>

            {/* Article 2 - Objet */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 2 – Objet
              </h2>
              <p className="text-muted-foreground">
                Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions d'utilisation de la plateforme Mariable.fr par les utilisateurs couples (ci-après « les Utilisateurs »), ainsi que les droits et obligations de chacune des parties dans ce cadre.
              </p>
              <p className="text-muted-foreground mt-4">
                En créant un compte sur Mariable.fr, l'Utilisateur reconnaît avoir pris connaissance des présentes CGU et les accepte sans réserve.
              </p>
            </section>

            {/* Article 3 - Accès à la plateforme */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 3 – Accès à la plateforme et création de compte
              </h2>
              <p className="text-muted-foreground mb-4">
                L'accès à certaines fonctionnalités de la plateforme nécessite la création d'un compte utilisateur. Pour ce faire, l'Utilisateur doit :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Fournir des informations exactes, complètes et à jour (nom, prénom, adresse e-mail, téléphone)</li>
                <li>Choisir un mot de passe sécurisé</li>
                <li>Accepter les présentes CGU</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                L'Utilisateur s'engage à maintenir la confidentialité de ses identifiants de connexion et à ne pas les communiquer à des tiers. Il est seul responsable de l'utilisation de son compte.
              </p>
              <p className="text-muted-foreground mt-4">
                Mariable se réserve le droit de suspendre ou supprimer tout compte en cas d'utilisation frauduleuse, de violation des présentes CGU ou de comportement contraire aux bonnes mœurs.
              </p>
            </section>

            {/* Article 4 - Services proposés */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 4 – Services proposés
              </h2>
              <p className="text-muted-foreground mb-4">
                Mariable met à disposition des Utilisateurs les services suivants :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Outils de planification</strong> : budget, checklist, rétroplanning, plan de table</li>
                <li><strong>Gestion des invités</strong> : liste d'invités, suivi des RSVP, gestion des logements</li>
                <li><strong>Coordination jour J</strong> : programme détaillé, timelines, contacts d'urgence</li>
                <li><strong>Mise en relation avec des prestataires</strong> : référencement de professionnels de l'événementiel</li>
                <li><strong>Espace documentaire</strong> : stockage et organisation de documents liés au mariage</li>
                <li><strong>Fonctionnalités premium</strong> : accès à des outils avancés selon l'abonnement souscrit</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Mariable s'efforce d'assurer la disponibilité et la fiabilité de ses services, mais ne peut garantir un accès ininterrompu en raison de maintenances techniques ou de circonstances exceptionnelles.
              </p>
            </section>

            {/* Article 5 - Traitement des données personnelles */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 5 – Traitement des données personnelles (RGPD)
              </h2>
              <p className="text-muted-foreground mb-4">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, Mariable collecte et traite les données personnelles des Utilisateurs dans le respect de leur vie privée.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">5.1 – Données collectées</h3>
              <p className="text-muted-foreground mb-2">Les données collectées incluent :</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Données d'identification</strong> : nom, prénom, adresse e-mail, numéro de téléphone</li>
                <li><strong>Données de navigation</strong> : adresse IP, cookies, logs de connexion</li>
                <li><strong>Données relatives au mariage</strong> : date de mariage, nombre d'invités, budget, prestataires sélectionnés</li>
                <li><strong>Source d'acquisition</strong> : comment vous avez connu Mariable (réseaux sociaux, bouche à oreille, etc.)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">5.2 – Finalités du traitement</h3>
              <p className="text-muted-foreground mb-2">Les données sont traitées pour :</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>La création et la gestion de votre compte utilisateur</li>
                <li>La fourniture des services de planification et d'organisation de mariage</li>
                <li>La mise en relation avec des prestataires partenaires</li>
                <li>L'envoi de communications relatives à l'utilisation de la plateforme (notifications, mises à jour)</li>
                <li><strong>L'envoi d'informations commerciales et newsletters</strong> concernant les évolutions de la plateforme, nouveautés, offres et conseils mariage (avec possibilité de désinscription à tout moment)</li>
                <li>L'amélioration de nos services et l'analyse statistique</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">5.3 – Consentement</h3>
              <p className="text-muted-foreground mb-4">
                En créant un compte sur Mariable.fr et en acceptant les présentes CGU, l'Utilisateur consent expressément :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Au traitement de ses données personnelles conformément aux finalités énoncées ci-dessus</li>
                <li>À recevoir des communications par e-mail relatives aux évolutions de la plateforme, aux nouveautés, et aux conseils pour l'organisation de son mariage</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                L'Utilisateur peut à tout moment retirer son consentement ou se désabonner des communications commerciales via le lien de désinscription présent dans chaque e-mail, ou en contactant directement Mariable.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">5.4 – Durée de conservation</h3>
              <p className="text-muted-foreground">
                Les données sont conservées pendant la durée nécessaire à l'accomplissement des finalités pour lesquelles elles ont été collectées, et au maximum 3 ans après la dernière activité du compte, sauf obligation légale contraire.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">5.5 – Droits des Utilisateurs</h3>
              <p className="text-muted-foreground mb-4">
                Conformément au RGPD, chaque Utilisateur dispose des droits suivants :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Droit d'accès</strong> : obtenir une copie de ses données personnelles</li>
                <li><strong>Droit de rectification</strong> : corriger des données inexactes ou incomplètes</li>
                <li><strong>Droit à l'effacement</strong> : demander la suppression de ses données (« droit à l'oubli »)</li>
                <li><strong>Droit à la limitation</strong> : limiter le traitement de ses données dans certaines circonstances</li>
                <li><strong>Droit à la portabilité</strong> : récupérer ses données dans un format structuré</li>
                <li><strong>Droit d'opposition</strong> : s'opposer au traitement de ses données à des fins de prospection commerciale</li>
                <li><strong>Droit de retirer son consentement</strong> à tout moment</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Pour exercer ces droits, l'Utilisateur peut contacter Mariable par e-mail à l'adresse suivante : <strong>mathilde@mariable.fr</strong> ou par courrier postal au siège social.
              </p>
              <p className="text-muted-foreground mt-4">
                En cas de litige, l'Utilisateur a également le droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL).
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">5.6 – Sécurité des données</h3>
              <p className="text-muted-foreground">
                Mariable met en œuvre toutes les mesures techniques et organisationnelles appropriées pour garantir la sécurité et la confidentialité des données personnelles contre toute perte, altération, divulgation ou accès non autorisé.
              </p>
            </section>

            {/* Article 6 - Partage des données avec les prestataires */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 6 – Partage des données avec les prestataires
              </h2>
              <p className="text-muted-foreground mb-4">
                Lorsque l'Utilisateur exprime son intérêt pour un prestataire référencé sur Mariable.fr, ses coordonnées (nom, prénom, e-mail, téléphone) peuvent être transmises à ce prestataire afin de faciliter la mise en relation.
              </p>
              <p className="text-muted-foreground">
                Les prestataires partenaires s'engagent à respecter la réglementation en vigueur concernant la protection des données personnelles et à utiliser ces informations uniquement dans le cadre de la relation commerciale établie avec l'Utilisateur.
              </p>
            </section>

            {/* Article 7 - Propriété intellectuelle */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 7 – Propriété intellectuelle
              </h2>
              <p className="text-muted-foreground mb-4">
                L'ensemble des éléments composant la plateforme Mariable.fr (textes, images, logos, graphismes, vidéos, logiciels, architecture, base de données) est la propriété exclusive de Mariable ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
              </p>
              <p className="text-muted-foreground">
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments de la plateforme, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Mariable.
              </p>
            </section>

            {/* Article 8 - Responsabilité */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 8 – Responsabilité
              </h2>
              <p className="text-muted-foreground mb-4">
                <strong>8.1 – Responsabilité de Mariable</strong>
              </p>
              <p className="text-muted-foreground mb-4">
                Mariable s'engage à fournir ses services avec diligence et selon les règles de l'art. Toutefois, sa responsabilité ne saurait être engagée :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>En cas d'interruption temporaire du service pour des raisons de maintenance ou de mise à jour</li>
                <li>En cas de force majeure ou d'événements indépendants de sa volonté</li>
                <li>Pour les préjudices indirects ou immatériels subis par l'Utilisateur</li>
                <li>Pour le contenu fourni par les prestataires tiers référencés sur la plateforme</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong>8.2 – Responsabilité de l'Utilisateur</strong>
              </p>
              <p className="text-muted-foreground">
                L'Utilisateur est seul responsable de l'utilisation qu'il fait de la plateforme et des informations qu'il y publie. Il s'engage à utiliser les services de manière loyale et conforme aux présentes CGU.
              </p>
            </section>

            {/* Article 9 - Abonnements et paiements */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 9 – Abonnements et paiements
              </h2>
              <p className="text-muted-foreground mb-4">
                Mariable propose un accès gratuit à certaines fonctionnalités de base, ainsi que des <strong>offres premium</strong> permettant d'accéder à des outils avancés.
              </p>
              <p className="text-muted-foreground mb-4">
                Les tarifs des abonnements premium sont indiqués sur la plateforme et peuvent être modifiés à tout moment, sans effet rétroactif pour les abonnements en cours.
              </p>
              <p className="text-muted-foreground">
                Le paiement s'effectue en ligne via les moyens de paiement sécurisés proposés (carte bancaire, Stripe). Aucune donnée bancaire n'est conservée par Mariable.
              </p>
            </section>

            {/* Article 10 - Modification des CGU */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 10 – Modification des CGU
              </h2>
              <p className="text-muted-foreground">
                Mariable se réserve le droit de modifier à tout moment les présentes CGU. Les Utilisateurs seront informés de toute modification par e-mail ou via une notification sur la plateforme. La poursuite de l'utilisation de la plateforme après modification vaudra acceptation des nouvelles CGU.
              </p>
            </section>

            {/* Article 11 - Droit de rétractation */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 11 – Droit de rétractation
              </h2>
              <p className="text-muted-foreground">
                Conformément à l'article L221-18 du Code de la consommation, l'Utilisateur dispose d'un délai de 14 jours à compter de la souscription d'un abonnement premium pour exercer son droit de rétractation, sauf s'il a expressément demandé l'accès immédiat aux services et renoncé à ce droit.
              </p>
            </section>

            {/* Article 12 - Résiliation */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 12 – Résiliation
              </h2>
              <p className="text-muted-foreground mb-4">
                L'Utilisateur peut à tout moment supprimer son compte en contactant le service client à l'adresse <strong>mathilde@mariable.fr</strong>. La suppression du compte entraînera la suppression définitive de l'ensemble des données associées, sauf obligation légale de conservation.
              </p>
              <p className="text-muted-foreground">
                Mariable se réserve le droit de résilier un compte en cas de manquement grave aux présentes CGU, sans préavis ni indemnité.
              </p>
            </section>

            {/* Article 13 - Droit applicable et juridiction */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 13 – Droit applicable et juridiction compétente
              </h2>
              <p className="text-muted-foreground mb-4">
                Les présentes CGU sont soumises au <strong>droit français</strong>.
              </p>
              <p className="text-muted-foreground">
                En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGU, et à défaut de règlement amiable, le litige sera porté devant les juridictions compétentes du ressort de la Cour d'appel de Paris.
              </p>
            </section>

            {/* Article 14 - Contact */}
            <section>
              <h2 className="text-2xl font-serif mb-4 text-foreground">
                Article 14 – Contact
              </h2>
              <p className="text-muted-foreground mb-4">
                Pour toute question ou réclamation concernant l'utilisation de la plateforme ou le traitement de vos données personnelles, vous pouvez contacter Mariable :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Par e-mail</strong> : mathilde@mariable.fr</li>
                <li><strong>Par courrier</strong> : MARIABLE - 99 avenue Achille Peretti, 92200 Neuilly-sur-Seine</li>
              </ul>
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

export default CGVCouples;
