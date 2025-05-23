
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import WeddingChatbot from '@/components/wedding-assistant/v2/WeddingChatbot';
import { Card, CardContent } from '@/components/ui/card';

// Custom WhatsApp icon component
const CustomWhatsappIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M9.5 13.5c.5 1.5 2.5 2 3.5 0" />
  </svg>
);

const ConseilsContent = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleAccountCreation = () => {
    // Redirect to register page or dashboard if user is logged in
    const isLoggedIn = false; // This should be replaced with actual auth check
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };
  
  return (
    <>
      <h1 className="text-3xl font-serif mb-6 text-center">Conseils pour organiser un mariage sans wedding planner</h1>
      
      {/* Section 1: Rejoignez la communauté */}
      <div className="mb-8 p-6 bg-wedding-cream/40 rounded-lg border border-wedding-olive/20">
        <h2 className="text-xl font-serif mb-3">Rejoignez notre communauté WhatsApp</h2>
        
        <p className="mb-4">
          Vous souhaitez des conseils personnalisés gratuits pour l'organisation de votre mariage ? 
          Il vous suffit de rejoindre notre communauté WhatsApp pour échanger avec d'autres futurs 
          mariés et bénéficier des conseils de nos experts en organisation de mariage.
        </p>
        
        <div className="flex justify-center mt-6">
          <Button 
            size={isMobile ? "default" : "lg"} 
            className="bg-[#25D366] hover:bg-[#22c35e] text-white gap-2"
            asChild
          >
            <a 
              href="https://chat.whatsapp.com/In5xf3ZMJNvJkhy4F9g5C5" 
              target="_blank" 
              rel="noopener noreferrer" 
            >
              <CustomWhatsappIcon />
              <span>Rejoindre la communauté</span>
            </a>
          </Button>
        </div>
      </div>
      
      {/* Section 2: Assistant virtuel intégré */}
      <h2 className="text-2xl font-serif mt-10 mb-6 text-center">Assistant virtuel pour vos questions mariage</h2>
      
      <Card className="mb-10">
        <CardContent className="pt-6">
          <WeddingChatbot preventScroll={true} />
        </CardContent>
      </Card>
      
      {/* Section 3: Appel à l'action */}
      <div className="mt-10 py-8 px-6 bg-wedding-cream/20 rounded-lg border border-wedding-olive/10 text-center">
        <h2 className="text-2xl font-serif mb-4">Commencez à planifier votre mariage</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Prêts à organiser votre mariage de rêve sans wedding planner ? Créez votre compte gratuit 
          et accédez à tous nos outils d'organisation de mariage.
        </p>
        <Button 
          className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-8 py-6 text-lg"
          onClick={handleAccountCreation}
        >
          Créer un compte
        </Button>
      </div>
    </>
  );
};

const Conseils = () => {
  return (
    <ServiceTemplate 
      title="Conseils mariage"
      description="Des recommandations personnalisées pour votre grand jour"
      content={<ConseilsContent />}
    >
      <SEO 
        title="Conseils pour organiser un mariage sans wedding planner | Guide complet"
        description="Découvrez nos conseils d'experts pour organiser votre mariage sans stress. Checklist mariage, astuces budget et sélection des meilleurs prestataires."
        canonical="/services/conseils"
      />
    </ServiceTemplate>
  );
};

export default Conseils;
