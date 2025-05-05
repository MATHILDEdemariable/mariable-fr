
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

