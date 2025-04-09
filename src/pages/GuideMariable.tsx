
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuideMariable = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container py-8 md:py-12">
        <div className="mb-8">
          <Link 
            to="/services/prestataires" 
            className="inline-flex items-center text-wedding-black hover:text-wedding-olive transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux prestataires
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-serif mt-4 mb-2">Guide Mariable</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Notre sélection des meilleurs prestataires pour votre mariage, soigneusement choisis et validés par notre équipe.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <iframe 
            className="airtable-embed w-full" 
            src="https://airtable.com/embed/app6YR8d1UIVu4KQG/shrfJkl5B1GpVk53q?viewControls=on" 
            frameBorder="0" 
            width="100%" 
            height="700" 
            style={{ background: "transparent", border: "1px solid #ccc" }}
            title="Guide Mariable"
          ></iframe>
        </div>
      </main>
      
      <footer className="py-8 border-t border-gray-200">
        <div className="container text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Mariable - Guide des prestataires recommandés
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GuideMariable;
