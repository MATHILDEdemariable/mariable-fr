
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Camera, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StartButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/test-formulaire')}
      className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-6 py-6 text-lg font-medium rounded-lg mt-8 w-full sm:w-auto"
    >
      Découvrez votre style de mariage
    </Button>
  );
};

const ToolsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            Vos outils de planification
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour organiser votre mariage de rêve
          </p>
        </div>
        
        <div className="flex justify-center">
          <StartButton />
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
