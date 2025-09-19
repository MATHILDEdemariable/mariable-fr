import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  Calculator, 
  TrendingUp, 
  Users, 
  CheckSquare, 
  Calendar, 
  Smartphone,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CarnetAdressesModal from './CarnetAdressesModal';

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCarnetModalOpen, setIsCarnetModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    // Catégorie Prestataires
    {
      icon: Heart,
      title: "Carnet d'adresses premium",
      description: "Accès exclusif à notre sélection de prestataires",
      action: () => setIsCarnetModalOpen(true),
      category: "prestataires",
      gradient: "from-pink-500 to-rose-500",
      delay: "100ms"
    },
    {
      icon: Filter,
      title: "Recherche par critères",
      description: "Trouvez vos prestataires selon vos besoins",
      link: "/services/prestataires",
      category: "prestataires", 
      gradient: "from-purple-500 to-pink-500",
      delay: "200ms"
    },
    // Catégorie Budget
    {
      icon: Calculator,
      title: "Calculateur intelligent",
      description: "Estimez votre budget mariage avec précision",
      link: "/dashboard/budget",
      category: "budget",
      gradient: "from-green-500 to-emerald-500",
      delay: "300ms"
    },
    {
      icon: TrendingUp,
      title: "Suivi des dépenses",
      description: "Maîtrisez votre budget en temps réel",
      link: "/dashboard/budget",
      category: "budget",
      gradient: "from-emerald-500 to-teal-500",
      delay: "400ms"
    },
    // Catégorie Listes
    {
      icon: Users,
      title: "Liste d'invités",
      description: "Gérez vos invitations et confirmations",
      link: "/dashboard/vendors",
      category: "listes",
      gradient: "from-blue-500 to-cyan-500",
      delay: "500ms"
    },
    {
      icon: CheckSquare,
      title: "Checklist personnalisée",
      description: "Suivez vos préparatifs étape par étape",
      link: "/checklist-mariage",
      category: "listes",
      gradient: "from-cyan-500 to-blue-500",
      delay: "600ms"
    },
    // Catégorie Planning
    {
      icon: Calendar,
      title: "Timeline du mariage", 
      description: "Planifiez votre journée parfaite",
      link: "/coordination-jour-j",
      category: "planning",
      gradient: "from-orange-500 to-red-500",
      delay: "700ms"
    },
    {
      icon: Smartphone,
      title: "Coordination Jour-J",
      description: "App sans téléchargement pour le jour J",
      link: "/coordination-jour-j",
      category: "planning",
      gradient: "from-wedding-olive to-wedding-gold",
      delay: "800ms"
    }
  ];

  return (
    <>
      <section 
        ref={sectionRef}
        className="py-16 md:py-24 bg-white relative"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 
              className={`text-3xl md:text-5xl font-serif text-wedding-dark mb-6 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Tous les outils pour votre mariage
            </h2>
            <p 
              className={`text-lg md:text-xl text-gray-700 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Une suite complète d'outils pour organiser votre mariage de A à Z
            </p>
          </div>

          {/* Grid 2x4 des fonctionnalités */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const content = (
                <Card 
                  className={`group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer border-0 shadow-md bg-white h-full transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: feature.delay }}
                >
                  <CardContent className="p-6 text-center flex flex-col justify-between h-full">
                    <div>
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-semibold text-wedding-dark mb-2 group-hover:text-wedding-olive transition-colors text-sm md:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );

              if (feature.action) {
                return (
                  <div key={index} onClick={feature.action}>
                    {content}
                  </div>
                );
              }

              return (
                <Link key={index} to={feature.link!} className="block">
                  {content}
                </Link>
              );
            })}
          </div>

          {/* Categories legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
              Prestataires
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
              Budget
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              Listes
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-wedding-olive rounded-full"></div>
              Planning
            </div>
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

export default FeaturesSection;