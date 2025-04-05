
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sophie & Thomas",
    date: "Août 2024",
    content: "Mariable a transformé notre expérience d'organisation de mariage. Au lieu de passer des semaines à rechercher les bons prestataires, nous avons trouvé exactement ce que nous cherchions en quelques jours. L'équipe a été attentive à nos besoins et notre budget.",
    rating: 5
  },
  {
    name: "Marie & Jean",
    date: "Juillet 2024",
    content: "Grâce à Mariable, nous avons découvert des prestataires qui correspondaient parfaitement à notre vision. Le processus était fluide et sans stress. Je recommande vivement ce service à tous les futurs mariés!",
    rating: 5
  },
  {
    name: "Claire & Fabien",
    date: "Juin 2024",
    content: "Ce qui nous a le plus impressionné avec Mariable, c'est la qualité des prestataires recommandés. Chacun d'entre eux partageait les mêmes valeurs d'excellence et de professionnalisme. Notre journée était parfaite grâce à eux.",
    rating: 5
  },
  {
    name: "Lucie & David",
    date: "Mai 2024",
    content: "Je ne savais pas par où commencer pour organiser notre mariage. Mariable nous a non seulement aidés à trouver les meilleurs prestataires, mais nous a également guidés tout au long du processus. Un service inestimable!",
    rating: 4
  },
  {
    name: "Émilie & Pierre",
    date: "Avril 2024",
    content: "La personnalisation du service est ce qui distingue vraiment Mariable. Ils ont pris le temps de comprendre notre style et nos préférences, et ont trouvé des prestataires qui correspondaient parfaitement à notre vision.",
    rating: 5
  },
  {
    name: "Anne & Nicolas",
    date: "Mars 2024",
    content: "Organiser un mariage à distance semblait impossible, mais Mariable a rendu cela facile. Leur plateforme intuitive et leur service client exceptionnel ont fait toute la différence. Notre mariage s'est déroulé sans accroc!",
    rating: 5
  }
];

const TemoignagesContent = () => (
  <>
    <p className="mb-8 text-lg">
      Découvrez ce que nos clients disent de leur expérience avec Mariable et comment nous les avons aidés à créer le mariage de leurs rêves.
    </p>
    
    <div className="grid md:grid-cols-2 gap-6">
      {testimonials.map((testimonial, index) => (
        <Card key={index} className="p-6 shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <p className="italic mb-4">"{testimonial.content}"</p>
          <div className="text-right">
            <p className="font-medium">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.date}</p>
          </div>
        </Card>
      ))}
    </div>
  </>
);

const Temoignages = () => {
  return (
    <ServiceTemplate 
      title="Témoignages"
      description="Ce que nos clients disent de nous"
      content={<TemoignagesContent />}
    />
  );
};

export default Temoignages;
