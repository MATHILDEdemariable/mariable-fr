
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Charte = () => {
  return (
    <>
      <Helmet>
        <title>Notre Charte | Mariable</title>
        <meta name="description" content="Découvrez notre charte Mariable et nos engagements" />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif mb-8 text-center">Notre Charte Mariable</h1>

        <div className="prose prose-lg mx-auto">
          <p className="lead text-xl mb-8">
            Chez Mariable, nous nous engageons à vous offrir une expérience exceptionnelle pour la planification de votre mariage, avec des valeurs fortes et une méthodologie rigoureuse.
          </p>

          <h2 className="text-2xl font-serif mt-8 mb-4">Nos Principes Fondamentaux</h2>
          <ul className="space-y-4">
            <li>
              <strong>Excellence :</strong> Nous sélectionnons rigoureusement les prestataires que nous référençons pour garantir un service impeccable.
            </li>
            <li>
              <strong>Transparence :</strong> Toutes nos recommandations sont basées sur des critères objectifs et des avis vérifiés.
            </li>
            <li>
              <strong>Personnalisation :</strong> Chaque couple est unique, et nous adaptons nos conseils à votre vision, votre budget et vos priorités.
            </li>
            <li>
              <strong>Accessibilité :</strong> Nous proposons des outils et des conseils pour tous les budgets et tous les styles de mariage.
            </li>
          </ul>

          <h2 className="text-2xl font-serif mt-10 mb-4">Notre Promesse</h2>
          <p>
            Mariable s'engage à être votre allié de confiance tout au long de votre parcours de planification. Notre plateforme vous offre :
          </p>
          <ul className="space-y-4">
            <li>Des conseils personnalisés par des experts du mariage</li>
            <li>Des outils de planification pratiques et intuitifs</li>
            <li>Un accompagnement humain et bienveillant</li>
            <li>Une sélection des meilleurs prestataires pour votre projet</li>
          </ul>

          <h2 className="text-2xl font-serif mt-10 mb-4">Rejoignez l'Excellence</h2>
          <p>
            Nous sommes fiers de référencer uniquement des prestataires qui partagent nos valeurs d'excellence et de professionnalisme. Notre processus de sélection rigoureux garantit que chaque prestataire recommandé saura répondre à vos attentes les plus élevées.
          </p>
          
          <div className="mt-6 mb-10 flex justify-center">
            <Link to="/recherche">
              <Button className="bg-wedding-olive hover:bg-wedding-olive/90">
                Découvrir notre guide de prestataires
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <h2 className="text-2xl font-serif mt-10 mb-4">Votre confiance, notre priorité</h2>
          <p>
            En choisissant Mariable, vous optez pour un partenaire transparent et engagé dans la réussite de votre mariage. Nous mettons un point d'honneur à protéger vos données personnelles et à vous fournir uniquement des informations fiables et pertinentes.
          </p>
          <p className="mt-4">
            Notre équipe reste à votre écoute pour répondre à toutes vos questions et vous accompagner dans cette belle aventure.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Charte;
