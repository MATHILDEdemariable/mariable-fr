import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CGVProContent from '@/components/legal/CGVProContent';

const CGV = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Contrat de mise en relation et commission | Mariable"
        description="Consultez les conditions contractuelles de partenariat entre Mariable et les professionnels de l'événementiel."
        canonical="/cgv"
      />
      <Header />
      <main className="min-h-screen bg-white pb-12" style={{ paddingTop: 'var(--header-h-standard)' }}>
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-serif mb-4 text-wedding-black">
            CONTRAT DE MISE EN RELATION ET COMMISSION
          </h1>

          <CGVProContent />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CGV;
