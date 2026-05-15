import React from 'react';
import { Lightbulb, Shirt, Plane, Camera, Music, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

const EditorialArticlesSection = () => {
  const categories = [
    {
      icon: Lightbulb,
      title: "Idées & Inspiration",
      description: "Tendances et styles de mariage",
      link: "/blog?category=inspiration"
    },
    {
      icon: Shirt,
      title: "Mode mariage",
      description: "Robes, costumes et accessoires",
      link: "/blog?category=mode"
    },
    {
      icon: Plane,
      title: "Voyages de noces",
      description: "Destinations de rêve",
      link: "/blog?category=voyage"
    },
    {
      icon: Camera,
      title: "Photo & Vidéo",
      description: "Capturer vos moments",
      link: "/blog?category=photo"
    },
    {
      icon: Music,
      title: "Musique & Ambiance",
      description: "Playlists et animations",
      link: "/blog?category=musique"
    },
    {
      icon: Utensils,
      title: "Réception & Traiteur",
      description: "Gastronomie et cocktails",
      link: "/blog?category=reception"
    },
  ];

  return (
    <section className="py-24 bg-editorial-noir">
      <div className="container mx-auto px-4">
        {/* Titre */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4 font-normal">
            Inspiration & <em>Conseils mariage</em>
          </h2>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            Explorez nos rubriques pour préparer votre mariage
          </p>
        </div>

        {/* Grille d'icônes style line-art */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Link 
              key={index}
              to={category.link}
              className="group text-center"
            >
              {/* Icône avec style line-art */}
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-white/30 rounded-full group-hover:border-white/60 transition-colors">
                <category.icon className="w-8 h-8 text-editorial-beige/80 group-hover:text-white transition-colors" strokeWidth={1} />
              </div>
              
              {/* Titre */}
              <h3 className="font-serif text-white text-base mb-1 group-hover:text-editorial-beige transition-colors">
                {category.title}
              </h3>
              
              {/* Description */}
              <p className="text-white/80 text-xs">
                {category.description}
              </p>
            </Link>
          ))}
        </div>

        {/* CTA voir tout */}
        <div className="text-center mt-12">
          <Link 
            to="/blog" 
            className="text-xs tracking-widest text-white/70 uppercase border-b border-white/30 pb-1 hover:text-white hover:border-white transition-colors"
          >
            Voir tous les articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EditorialArticlesSection;
