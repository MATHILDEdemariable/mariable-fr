
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const StyleQuizButton = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 mx-auto text-center">
        <Button
          onClick={() => navigate('/test-formulaire')}
          className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-6 py-6 text-lg font-medium rounded-lg"
        >
          <FileText className="mr-2 h-5 w-5" />
          Découvrez votre style de mariage
        </Button>
      </div>
    </section>
  );
};

export default StyleQuizButton;
