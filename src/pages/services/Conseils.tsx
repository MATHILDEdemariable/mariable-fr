
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { Button } from '@/components/ui/button';

// Custom WhatsApp icon component
const CustomWhatsappIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M9.5 13.5c.5 1.5 2.5 2 3.5 0" />
  </svg>
);

const ConseilsContent = () => (
  <>
    <p>
      Chaque mariage est unique, tout comme les futurs mariés. Nos conseils personnalisés 
      s'adaptent à votre style, vos préférences et votre vision du mariage idéal.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Un référentiel de prestataires d'exception</h2>
    
    <p>
      Nous avons rigoureusement sélectionné chaque prestataire de notre plateforme selon des 
      critères stricts de qualité, de fiabilité et de professionnalisme. Notre processus de 
      vérification approfondi vous garantit de collaborer uniquement avec les meilleurs talents 
      du secteur.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">La connexion humaine avant tout</h2>
    
    <p>
      Au-delà des compétences techniques, nous valorisons particulièrement le feeling et la 
      connexion humaine entre vous et vos prestataires. Cette dimension relationnelle est selon 
      nous essentielle pour créer un mariage authentique qui vous ressemble.
    </p>
    
    <p className="mt-6">
      Notre approche personnalisée vous aide à identifier les prestataires avec lesquels vous 
      partagerez une véritable alchimie, créant ainsi les conditions idéales pour un mariage 
      parfait qui restera gravé dans vos mémoires.
    </p>
    
    <div className="mt-10 p-6 bg-wedding-cream/40 rounded-lg border border-wedding-olive/20">
      <h2 className="text-2xl font-serif mb-4">Rejoignez notre communauté WhatsApp</h2>
      
      <p className="mb-4">
        Vous souhaitez des conseils personnalisés gratuits pour l'organisation de votre mariage ? 
        Il vous suffit de rejoindre notre communauté WhatsApp pour échanger avec d'autres futurs 
        mariés et bénéficier des conseils de nos experts.
      </p>
      
      <div className="flex justify-center mt-6">
        <Button 
          size="lg" 
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
  </>
);

const Conseils = () => {
  return (
    <ServiceTemplate 
      title="Conseils personnalisés"
      description="Des recommandations adaptées à votre style et vos envies"
      content={<ConseilsContent />}
    />
  );
};

export default Conseils;
