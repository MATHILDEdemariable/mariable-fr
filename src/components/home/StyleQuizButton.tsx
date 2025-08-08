
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const StyleQuizButton = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 mx-auto text-center">
        <Button
          onClick={() => navigate('/test-formulaire')}
          className={`bg-wedding-beige hover:bg-wedding-beige-dark text-black text-lg font-medium rounded-lg ${
            isMobile ? 'px-4 py-4 w-full' : 'px-6 py-6'
          }`}
        >
          <FileText className="mr-2 h-5 w-5" />
          Découvrez votre style de mariage
        </Button>
      </div>
    </section>
  );
};

export default StyleQuizButton;
