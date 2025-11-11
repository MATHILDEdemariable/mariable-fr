import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import ChatbotButton from '@/components/ChatbotButton';

const GuideDebutant = () => {
  const pdfUrl = '/guide-debutant.pdf';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'guide-organisation-mariage-debutants-mariable.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>Guide Organisation Mariage Débutants | Mariable</title>
        <meta 
          name="description" 
          content="Téléchargez gratuitement le Guide Organisation Mariage pour Débutants de Mariable. Conseils et étapes essentielles pour commencer l'organisation de votre mariage." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-premium-warm">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* En-tête */}
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl md:text-5xl text-wedding-olive mb-4">
                Guide Organisation Mariage Débutants
              </h1>
              <p className="text-lg text-wedding-black/70 max-w-2xl mx-auto mb-6">
                Tous nos conseils pour bien commencer l'organisation de votre mariage.
                De la vision au budget, suivez notre guide complet.
              </p>
              <Button 
                onClick={handleDownload}
                size="lg"
                className="bg-wedding-olive hover:bg-wedding-olive/90"
              >
                <Download className="h-5 w-5 mr-2" />
                Télécharger le PDF
              </Button>
            </div>

            {/* Visualisation PDF */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-wedding-olive" />
                  <h2 className="font-serif text-xl text-wedding-olive">
                    Prévisualisation du guide
                  </h2>
                </div>
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
              
              <div className="relative" style={{ height: '80vh' }}>
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="Guide Organisation Mariage Débutants"
                  style={{ border: 'none' }}
                />
              </div>
            </div>

            {/* Points clés */}
            <div className="mt-12 grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="font-serif text-3xl text-wedding-olive mb-2">Vision</div>
                <p className="text-sm text-wedding-black/70">Définir votre style</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="font-serif text-3xl text-wedding-olive mb-2">Liste</div>
                <p className="text-sm text-wedding-black/70">Établir les invités</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="font-serif text-3xl text-wedding-olive mb-2">Budget</div>
                <p className="text-sm text-wedding-black/70">Gérer vos finances</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="font-serif text-3xl text-wedding-olive mb-2">Date</div>
                <p className="text-sm text-wedding-black/70">Choisir le moment</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <ChatbotButton />
      </div>
    </>
  );
};

export default GuideDebutant;
