
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MessageSquare, Clock, Send, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Accompagnement = () => {
  // IMPORTANT: Remplacez "33..." par le vrai numéro WhatsApp de Mathilde
  const whatsappNumber = "33760108189"; 
  const prefilledMessage = "Bonjour Mathilde, je viens de souscrire à l'accompagnement Mariable et je suis prête à commencer !";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledMessage)}`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Bienvenue à l'Accompagnement Mariable | Mariable</title>
        <meta name="description" content="Bienvenue dans votre accompagnement personnalisé Mariable. Contactez votre experte mariage et commencez à planifier." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">
              Félicitations et bienvenue !
            </h1>
            <p className="text-lg text-gray-700 mb-10">
              Vous avez fait le premier pas vers une organisation de mariage sereine. Votre accompagnement personnalisé avec Mathilde commence maintenant.
            </p>

            <Card className="text-left shadow-lg mb-10">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-wedding-olive" />
                  Votre accompagnement One-to-One
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  C'est moi, Mathilde, qui serai votre interlocutrice unique. Pensez à moi comme votre alliée, disponible pour répondre à toutes vos questions et vous guider à chaque étape.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-wedding-olive mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Messages illimités</h4>
                      <p className="text-sm text-gray-600">Envoyez-moi vos questions, doutes ou idées à tout moment. Les messages vocaux sont aussi les bienvenus (2 minutes max par message pour rester concis !).</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-wedding-olive mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Disponibilité & Réactivité</h4>
                      <p className="text-sm text-gray-600">Je suis disponible 7j/7 et je m'engage à vous répondre en moins de 24 heures.</p>
                    </div>
                  </div>
                </div>
                 <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold mb-2">Comment commencer ?</h4>
                   <p className="text-sm text-gray-600">
                    C'est très simple : c'est à vous de prendre l'initiative. Dès que vous avez une question, une hésitation ou besoin d'un avis, contactez-moi directement sur WhatsApp.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
               <Button asChild size="lg" className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Contacter Mathilde sur WhatsApp
                  <Send className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Accompagnement;
