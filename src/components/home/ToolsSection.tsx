
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
            Outils et services pour votre mariage
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Découvrez nos outils pratiques pour organiser votre mariage
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
