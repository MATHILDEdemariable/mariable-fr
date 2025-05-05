
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { CalendarDays, CheckSquare, DollarSign, Camera } from 'lucide-react';
import SEO from '@/components/SEO';

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
  
  return (
    <>
      <h2 className="text-2xl font-serif mb-5">Comment organiser un mariage sans wedding planner ?</h2>
      
      <p className="mb-4">
        Organiser un mariage sans wedding planner est tout à fait possible avec les bons outils et conseils. 
        Chez Mariable, nous vous proposons un accompagnement digital complet pour réussir chaque étape 
        de votre préparation de mariage.
      </p>
      
      <div className="mb-8 p-6 bg-wedding-cream/40 rounded-lg border border-wedding-olive/20">
        <h3 className="text-xl font-serif mb-3">Rejoignez notre communauté WhatsApp</h3>
        
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
      
      <h3 className="text-xl font-serif mt-8 mb-3">Nos outils pour organiser votre mariage</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="h-5 w-5 text-wedding-olive" />
            <h4 className="font-medium">Checklist mariage complète</h4>
          </div>
          <p className="text-sm mb-3">
            Suivez toutes les étapes importantes dans notre checklist mariage personnalisée pour ne rien oublier.
          </p>
          <Link to="/services/planification" className="text-sm text-wedding-olive hover:underline">
            Accéder à la checklist →
          </Link>
        </div>
        
        <div className="border rounded-lg p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-wedding-olive" />
            <h4 className="font-medium">Gestion du budget mariage</h4>
          </div>
          <p className="text-sm mb-3">
            Maîtrisez votre budget mariage grâce à notre outil de suivi financier intelligent.
          </p>
          <Link to="/services/budget" className="text-sm text-wedding-olive hover:underline">
            Gérer mon budget →
          </Link>
        </div>
        
        <div className="border rounded-lg p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="h-5 w-5 text-wedding-olive" />
            <h4 className="font-medium">Planning jour J</h4>
          </div>
          <p className="text-sm mb-3">
            Créez un déroulé de mariage détaillé pour que votre grand jour se déroule parfaitement.
          </p>
          <Link to="/services/jour-j" className="text-sm text-wedding-olive hover:underline">
            Planifier mon jour J →
          </Link>
        </div>
        
        <div className="border rounded-lg p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="h-5 w-5 text-wedding-olive" />
            <h4 className="font-medium">Sélection de prestataires</h4>
          </div>
          <p className="text-sm mb-3">
            Trouvez les meilleurs prestataires de mariage adaptés à votre style et à votre budget.
          </p>
          <Link to="/recherche" className="text-sm text-wedding-olive hover:underline">
            Découvrir les prestataires →
          </Link>
        </div>
      </div>
      
      <h3 className="text-xl font-serif mt-8 mb-3">Un référentiel de prestataires d'exception</h3>
      
      <p className="mb-4">
        Nous avons rigoureusement sélectionné chaque photographe mariage, lieu de réception et traiteur mariage de notre plateforme 
        selon des critères stricts de qualité, de fiabilité et de professionnalisme. Notre processus de 
        vérification approfondi vous garantit de collaborer uniquement avec les meilleurs talents 
        du secteur pour votre grand jour.
      </p>
      
      <h3 className="text-xl font-serif mt-6 mb-3">La connexion humaine avant tout</h3>
      
      <p className="mb-4">
        Au-delà des compétences techniques, nous valorisons particulièrement le feeling et la 
        connexion humaine entre vous et vos prestataires. Cette dimension relationnelle est selon 
        nous essentielle pour créer un mariage authentique qui vous ressemble.
      </p>
      
      <p className="mb-6">
        Notre approche personnalisée vous aide à identifier les prestataires avec lesquels vous 
        partagerez une véritable alchimie, créant ainsi les conditions idéales pour un mariage 
        parfait qui restera gravé dans vos mémoires.
      </p>
      
      <div className="mt-8 py-6 px-6 bg-wedding-cream/20 rounded-lg border border-wedding-olive/10">
        <h3 className="text-xl font-serif mb-3">Commencez à planifier votre mariage</h3>
        <p className="mb-4">
          Prêts à organiser votre mariage sans stress ? Utilisez nos outils et découvrez nos conseils personnalisés.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-wedding-olive hover:bg-wedding-olive/90"
            onClick={() => window.location.href = "/services/planification"}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            Consulter la checklist mariage
          </Button>
        </div>
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
