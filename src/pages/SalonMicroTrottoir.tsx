import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SalonMicroTrottoir = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Autorisation Micro-Trottoir | Salon du Mariage 2025 - Mariable</title>
        <meta name="description" content="Participez à notre micro-trottoir au Salon du Mariage 2025 et aidez-nous à faire connaître Mariable, la solution unique de coordination de mariage !" />
        <meta name="keywords" content="micro trottoir mariage, autorisation interview, salon du mariage, mariable, témoignage mariage" />
        <link rel="canonical" href="https://www.mariable.fr/salon-du-mariage-2025/autorisation-micro-trottoir" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/salon-du-mariage-2025" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Salon du Mariage 2025
          </Link>
        </div>

        {/* Formulaire Airtable en pleine page */}
        <div className="max-w-4xl mx-auto">
          <div className="w-full">
            <iframe 
              className="airtable-embed w-full rounded-lg shadow-lg" 
              src="https://airtable.com/embed/app8PM2oH1wOtI1R4/shrOGywUnGBRflZnl" 
              frameBorder="0" 
              width="100%" 
              height="800" 
              style={{ background: 'transparent', border: '1px solid #e5e7eb' }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SalonMicroTrottoir;