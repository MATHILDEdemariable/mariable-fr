import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import CGVCouplesContent from '@/components/legal/CGVCouplesContent';

const CGVCouples = () => {
  return (
    <>
      <SEO
        title="Conditions Générales d'Utilisation Couples | Mariable"
        description="Conditions d'utilisation de la plateforme Mariable pour les couples organisateurs de mariage."
        canonical="/cgv-couples"
      />
      <Header />
      <main className="min-h-screen bg-background pb-12" style={{ paddingTop: 'var(--header-h-standard)' }}>
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-serif mb-4 text-foreground">
            CONDITIONS GÉNÉRALES D'UTILISATION
          </h1>

          <CGVCouplesContent />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CGVCouples;
