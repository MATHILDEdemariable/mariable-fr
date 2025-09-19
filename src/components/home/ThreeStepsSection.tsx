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
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
              3 étapes pour un mariage réussi
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Notre approche moderne et technologique pour organiser votre mariage parfait
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* CARD 1 - Préparation */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-wedding-olive/10 text-wedding-olive text-sm font-medium mb-4">
                    1 - Préparation
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-black">
                    Recevez notre carnet d'adresses exclusif
                  </h3>
                  
                  {/* Mockup carnet d'adresses */}
                  <div className="bg-gradient-to-br from-wedding-olive/5 to-wedding-olive/10 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-wedding-olive/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-wedding-olive" />
                      </div>
                      <div>
                        <div className="h-2 bg-wedding-olive/20 rounded w-20 mb-1"></div>
                        <div className="h-2 bg-wedding-olive/10 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-wedding-olive/30 rounded-full"></div>
                        <div className="h-1.5 bg-wedding-olive/20 rounded w-24"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-wedding-olive/30 rounded-full"></div>
                        <div className="h-1.5 bg-wedding-olive/20 rounded w-20"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-wedding-olive/30 rounded-full"></div>
                        <div className="h-1.5 bg-wedding-olive/20 rounded w-28"></div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6">
                    Recommandations personnalisées par région et budget, sélectionnées par nos experts
                  </p>
                </div>
                
                <Button 
                  onClick={() => setIsCarnetModalOpen(true)}
                  className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white group-hover:scale-105 transition-all"
                >
                  Recevoir le carnet
                </Button>
              </CardContent>
            </Card>

            {/* CARD 2 - Organisation */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-wedding-olive/10 text-wedding-olive text-sm font-medium mb-4">
                    2 - Organisation
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-black">
                    Accédez à nos outils gratuits
                  </h3>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-wedding-olive" />
                      <span className="text-gray-700">Checklist personnalisée</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-wedding-olive" />
                      <span className="text-gray-700">Calculatrices budget & invités</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-wedding-olive" />
                      <span className="text-gray-700">Suivi budgétaire avancé</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-wedding-olive" />
                      <span className="text-gray-700">Gestion des prestataires</span>
                    </li>
                  </ul>
                  
                  {/* Mockup avec 4 widgets */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gradient-to-br from-wedding-olive/5 to-wedding-olive/10 rounded-lg p-3 flex items-center gap-2">
                      <Check className="w-4 h-4 text-wedding-olive" />
                      <div className="flex-1">
                        <div className="h-1.5 bg-wedding-olive/20 rounded w-full mb-1"></div>
                        <div className="h-1 bg-wedding-olive/10 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-wedding-olive/5 to-wedding-olive/10 rounded-lg p-3 flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-wedding-olive" />
                      <div className="flex-1">
                        <div className="h-1.5 bg-wedding-olive/20 rounded w-full mb-1"></div>
                        <div className="h-1 bg-wedding-olive/10 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-wedding-olive/5 to-wedding-olive/10 rounded-lg p-3 flex items-center gap-2">
                      <div className="w-4 h-4 bg-wedding-olive/30 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-1.5 bg-wedding-olive/20 rounded w-full mb-1"></div>
                        <div className="h-1 bg-wedding-olive/10 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-wedding-olive/5 to-wedding-olive/10 rounded-lg p-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-wedding-olive" />
                      <div className="flex-1">
                        <div className="h-1.5 bg-wedding-olive/20 rounded w-full mb-1"></div>
                        <div className="h-1 bg-wedding-olive/10 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white group-hover:scale-105 transition-all">
                  <Link to="/register">
                    Créer mon compte gratuit
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* CARD 3 - Jour J */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-wedding-olive/10 text-wedding-olive text-sm font-medium mb-4">
                    3 - Jour J
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-black">
                    Coordonnez votre jour J grâce à notre app révolutionnaire
                  </h3>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-wedding-olive" />
                      <span className="text-gray-700">Planning détaillé minute par minute</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-wedding-olive" />
                      <span className="text-gray-700">Gestion équipe complète</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-wedding-olive" />
                      <span className="text-gray-700">Partage et délégation facile</span>
                    </li>
                  </ul>
                  
                  {/* Mockup interface mobile */}
                  <div className="bg-gradient-to-br from-wedding-olive/5 to-wedding-olive/10 rounded-lg p-4 mb-6">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-wedding-olive" />
                        <div className="h-2 bg-wedding-olive/20 rounded w-16"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-wedding-olive/20 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-1.5 bg-gray-200 rounded w-full mb-1"></div>
                            <div className="h-1 bg-gray-100 rounded w-2/3"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-wedding-olive/30 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-1.5 bg-gray-200 rounded w-full mb-1"></div>
                            <div className="h-1 bg-gray-100 rounded w-3/4"></div>
                          </div>
                        </div>
                        <div className="flex -space-x-1 justify-end mt-2">
                          <div className="w-4 h-4 bg-wedding-olive/40 rounded-full border border-white"></div>
                          <div className="w-4 h-4 bg-wedding-olive/60 rounded-full border border-white"></div>
                          <div className="w-4 h-4 bg-wedding-olive/80 rounded-full border border-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white group-hover:scale-105 transition-all">
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