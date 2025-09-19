import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Calculator, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import CarnetAdressesModal from './CarnetAdressesModal';

const ThreeStepsSection = () => {
  const [isCarnetModalOpen, setIsCarnetModalOpen] = useState(false);

  return (
    <>
      <section id="three-steps-section" className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
              Faites de votre mariage une expérience exceptionnelle
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              grâce à Mariable et 3 étapes clés
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* CARD 1 - Réserver */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg">
              <CardContent className="p-8 flex flex-col h-full min-h-[400px]">
                <div className="flex-grow">
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                    Réserver
                  </h2>
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    les meilleurs lieux & prestataires
                  </h3>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-wedding-olive" />
                      <span className="text-gray-700">Prestataires sélectionnés par nos experts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-wedding-olive" />
                      <span className="text-gray-700">Recommandations par région et budget</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-wedding-olive" />
                      <span className="text-gray-700">Contacts directs vérifiés</span>
                    </li>
                  </ul>
                </div>
                
                <Button 
                  onClick={() => setIsCarnetModalOpen(true)}
                  className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white group-hover:scale-105 transition-all mt-auto"
                >
                  Recevoir le carnet
                </Button>
              </CardContent>
            </Card>

            {/* CARD 2 - Organiser */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg">
              <CardContent className="p-8 flex flex-col h-full min-h-[400px]">
                <div className="flex-grow">
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                    Organiser
                  </h2>
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    avec nos outils gratuits
                  </h3>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-wedding-olive" />
                      <span className="text-gray-700">Checklist personnalisée</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-wedding-olive" />
                      <span className="text-gray-700">Calculatrices budget & invités</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-wedding-olive" />
                      <span className="text-gray-700">Suivi budgétaire avancé</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-wedding-olive" />
                      <span className="text-gray-700">Gestion des prestataires</span>
                    </li>
                  </ul>
                </div>
                
                <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white group-hover:scale-105 transition-all mt-auto">
                  <Link to="/register">
                    Créer mon compte gratuit
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* CARD 3 - Coordonner le jour J */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg">
              <CardContent className="p-8 flex flex-col h-full min-h-[400px]">
                <div className="flex-grow">
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                    Coordonner le jour J
                  </h2>
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    avec une appli.
                  </h3>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-wedding-olive" />
                      <span className="text-gray-700">Planning détaillé minute par minute</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-wedding-olive" />
                      <span className="text-gray-700">Gestion équipe complète</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-wedding-olive" />
                      <span className="text-gray-700">Partage et délégation facile</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-wedding-olive" />
                      <span className="text-gray-700">Application web sans téléchargement</span>
                    </li>
                  </ul>
                </div>
                
                <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white group-hover:scale-105 transition-all mt-auto">
                  <Link to="/coordination-jour-j">
                    Découvrir l'app Jour J
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <CarnetAdressesModal 
        isOpen={isCarnetModalOpen} 
        onClose={() => setIsCarnetModalOpen(false)} 
      />
    </>
  );
};

export default ThreeStepsSection;