import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import VibeWeddingHero from '@/components/vibe-wedding/VibeWeddingHero';
import VendorMatchCard from '@/components/vibe-wedding/VendorMatchCard';
import VendorMatchingChat from '@/components/vibe-wedding/VendorMatchingChat';
import VendorContactModal from '@/components/vendors/VendorContactModal';
import CarnetAdressesModal from '@/components/home/CarnetAdressesModal';
import { useVibeWeddingMatching } from '@/hooks/useVibeWeddingMatching';
import { Button } from '@/components/ui/button';

const VibeWedding: React.FC = () => {
  const [conversationStarted, setConversationStarted] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCarnetModalOpen, setIsCarnetModalOpen] = useState(false);
  
  const {
    messages,
    matchedVendors,
    isLoading,
    needsRegion,
    needsCategory,
    detectedCategory,
    isSaving,
    sendMessage,
    saveProject,
    loadConversation
  } = useVibeWeddingMatching();

  // Charger la conversation si conversationId dans l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const conversationId = params.get('conversationId');
    
    if (conversationId && loadConversation) {
      console.log('🔄 Chargement conversation depuis URL:', conversationId);
      setConversationStarted(true);
      loadConversation(conversationId);
    }
  }, [loadConversation]);

  const handleStartConversation = (message: string) => {
    setConversationStarted(true);
    sendMessage(message);
  };

  const handleContactVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
    setSelectedVendor(null);
  };

  const getCarnetMessage = () => {
    if (matchedVendors.length === 0) {
      return "Aucun prestataire trouvé ? Demandez votre carnet d'adresse personnalisé";
    }
    return "La sélection n'est pas suffisante ? Demandez votre carnet d'adresse personnalisé";
  };

  // Afficher le Hero si la conversation n'a pas encore commencé
  if (!conversationStarted) {
    return (
      <>
        <Helmet>
          <title>Vibe Wedding - Matching Intelligent de Prestataires | Mariable</title>
          <meta 
            name="description" 
            content="Trouvez les meilleurs prestataires pour votre mariage avec notre IA. Matching personnalisé selon vos critères et votre région." 
          />
        </Helmet>

        <VibeWeddingHero onStartConversation={handleStartConversation} />
      </>
    );
  }

  // Afficher l'interface de matching une fois la conversation démarrée
  return (
    <>
      <Helmet>
        <title>Vibe Wedding - Matching Intelligent de Prestataires | Mariable</title>
        <meta 
          name="description" 
          content="Trouvez les meilleurs prestataires pour votre mariage avec notre IA. Matching personnalisé selon vos critères et votre région." 
        />
      </Helmet>

      <PremiumHeader />

      <div className="flex flex-col min-h-screen">
        <div className="flex h-[calc(100vh-96px)] pt-16 bg-background">
          {/* Gauche : Panneau des prestataires matchés */}
          <div className="flex-1 overflow-y-auto p-6 border-r border-border">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Matching Intelligent
                </h2>
                <p className="text-gray-600 mt-1">
                  {matchedVendors.length > 0 
                    ? `${matchedVendors.length} prestataires correspondent à vos critères`
                    : "Les prestataires recommandés s'afficheront ici"}
                </p>
              </div>

              {matchedVendors.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">💬 Commencez la conversation</p>
                  <p className="text-sm">
                    Décrivez ce que vous recherchez pour votre mariage et je vous proposerai les meilleurs prestataires
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-1" />
                    <button
                      onClick={saveProject}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                    >
                      {isSaving ? '💾 Sauvegarde...' : '💾 Sauvegarder ce projet'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matchedVendors.map((vendor) => (
                      <VendorMatchCard
                        key={vendor.id}
                        vendor={vendor}
                        onContact={() => handleContactVendor(vendor)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* CTA Carnet d'Adresse - Toujours visible */}
              <div className="mt-8 text-center border-t pt-6">
                <p className="text-muted-foreground text-sm mb-3">
                  {getCarnetMessage()}
                </p>
                <Button
                  onClick={() => setIsCarnetModalOpen(true)}
                  variant="outline"
                  className="inline-flex items-center gap-2"
                >
                  <span>📬</span>
                  Recevoir mon carnet d'adresses personnalisé
                </Button>
              </div>
            </div>
          </div>

          {/* Droite : Chat conversationnel */}
          <div className="w-[420px] bg-card border-l border-border">
            <VendorMatchingChat
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              needsRegion={needsRegion}
              needsCategory={needsCategory}
              detectedCategory={detectedCategory}
            />
          </div>
        </div>
        
        <Footer />
      </div>

      {/* Modal de contact */}
      {selectedVendor && (
        <VendorContactModal
          isOpen={isContactModalOpen}
          onClose={handleCloseContactModal}
          vendorId={selectedVendor.id}
          vendorName={selectedVendor.nom}
        />
      )}

      {/* Modal Carnet d'Adresse */}
      <CarnetAdressesModal 
        isOpen={isCarnetModalOpen} 
        onClose={() => setIsCarnetModalOpen(false)} 
      />
    </>
  );
};

export default VibeWedding;
