
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';

const MentionsLegales = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container py-16">
        <h1 className="text-4xl font-serif mb-8">Mentions Légales</h1>
        <Separator className="mb-8" />
        
        <div className="prose max-w-3xl">
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Éditeur du site</h2>
            <p>Mariable SAS</p>
            <p>123 Rue du Mariage, 75001 Paris, France</p>
            <p>SIREN : 123456789</p>
            <p>Capital social : 10 000 €</p>
            <p>TVA Intracommunautaire : FR 12 345678901</p>
            <p>Téléphone : +33 1 23 45 67 89</p>
            <p>Email : contact@mariable.fr</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Directeur de la publication</h2>
            <p>Marie Dupont, Présidente</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Hébergement</h2>
            <p>Le site mariable.fr est hébergé par :</p>
            <p>OVH SAS</p>
            <p>2 rue Kellermann</p>
            <p>59100 Roubaix - France</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Propriété intellectuelle</h2>
            <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
            <p>La reproduction de tout ou partie de ce site sur un support électronique ou autre est formellement interdite sauf autorisation expresse de Mariable SAS.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Données personnelles</h2>
            <p>Mariable SAS s'engage à ce que la collecte et le traitement de vos données soient conformes au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.</p>
            <p>Pour toute information ou exercice de vos droits sur les traitements de données personnelles, vous pouvez contacter notre délégué à la protection des données (DPO) à l'adresse suivante : dpo@mariable.fr</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Cookies</h2>
            <p>Le site mariable.fr utilise des cookies pour améliorer l'expérience utilisateur. Pour en savoir plus sur la gestion des cookies, veuillez consulter notre politique relative aux cookies.</p>
          </section>
        </div>
      </main>
      
      <footer className="py-12 bg-white text-wedding-black">
        <div className="container">
          <div className="mt-6 pt-6 border-t border-wedding-black/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-wedding-black/70 mb-4 md:mb-0">
              © 2025 Mariable - Tous droits réservés
            </p>
            <div className="flex gap-6">
              <Link to="/mentions-legales" className="text-sm text-wedding-black/70 hover:text-wedding-black">Mentions Légales</Link>
              <Link to="/cgv" className="text-sm text-wedding-black/70 hover:text-wedding-black">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MentionsLegales;
