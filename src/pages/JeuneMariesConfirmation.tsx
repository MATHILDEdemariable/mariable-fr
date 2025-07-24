import React from 'react';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const JeuneMariesConfirmationPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Merci pour votre témoignage - Mariable"
        description="Votre témoignage de mariage a été soumis avec succès et sera examiné par notre équipe."
        keywords="témoignage mariage, confirmation, validation"
      />
      
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-wedding-olive/30">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-wedding-olive">
                  Merci pour votre témoignage !
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6 text-center">
                <p className="text-lg text-gray-700">
                  Votre expérience de mariage a été soumise avec succès.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-medium text-yellow-800">En cours d'examen</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Notre équipe va examiner votre témoignage sous 48h pour s'assurer qu'il respecte nos conditions de publication.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-medium text-blue-800">Notification par email</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Vous recevrez un email de confirmation dès que votre témoignage sera approuvé et publié.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <Button 
                    asChild
                    className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
                  >
                    <Link to="/jeunes-maries">
                      Voir les autres témoignages
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <Link to="/">
                      Retour à l'accueil
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default JeuneMariesConfirmationPage;