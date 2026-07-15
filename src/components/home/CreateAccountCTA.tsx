import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CreateAccountCTA: React.FC = () => {
  return (
    <section className="py-16 md:py-20 px-4 bg-editorial-beige/50">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-editorial-noir mb-4">
          Créez votre espace en 30 secondes
        </h2>
        <p className="text-editorial-noir/70 mb-8 text-lg">
          Accédez gratuitement à tous les outils : budget, checklist, planning jour-J,
          seating plan et carnet d'adresses de prestataires.
        </p>
        <Button
          asChild
          className="bg-wedding-olive hover:bg-wedding-olive/90 text-white rounded-none px-8 py-6 text-base"
        >
          <Link to="/login">
            Créer un compte gratuit
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CreateAccountCTA;
