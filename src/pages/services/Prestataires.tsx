
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, MapPin, Camera, Utensils, Music } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const PrestataireContent = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-wedding-cream/30 p-6 rounded-lg mb-8 border border-wedding-olive/20">
        <h2 className="text-2xl font-serif mb-3">Nos sélections de prestataires de mariage</h2>
        <p className="mb-4">
          Découvrez nos sélections des meilleurs prestataires de mariage pour votre grand jour, soigneusement vérifiés par notre équipe d'experts.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-wedding-olive hover:bg-wedding-olive/90"
            onClick={() => navigate('/selection')}
          >
            <Search className="mr-2 h-4 w-4" />
            Trouver des prestataires
          </Button>
          <Button 
            variant="outline"
            className="border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10"
            onClick={() => navigate('/planning-personnalise')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Planning personnalisé
          </Button>
        </div>
      </div>
    
      <h2 className="text-2xl font-serif mt-8 mb-4">Comment trouver les meilleurs prestataires de mariage ?</h2>
      
      <p className="mb-4">
        Trouver les meilleurs prestataires pour votre mariage peut être une tâche ardue. 
        Chez Mariable, nous simplifions ce processus en vous mettant en relation avec des prestataires 
        de qualité qui correspondent parfaitement à vos goûts, votre style et votre budget de mariage.
      </p>
      
      <h3 className="text-xl font-serif mt-6 mb-3">Un algorithme intelligent pour vous aider à organiser votre mariage sans wedding planner</h3>
      
      <div className="flex flex-col md:flex-row gap-4 items-start mb-8">
        <div className="flex-grow">
          <p className="mb-4">
            Notre algorithme intelligent analyse vos préférences et vous propose uniquement 
            des prestataires qui correspondent à vos critères. Plus besoin de passer des heures 
            à faire des recherches, nous le faisons pour vous !
          </p>
          <p>
            Que vous cherchiez un lieu de mariage exceptionnel, un photographe de mariage talentueux ou 
            le meilleur traiteur mariage de votre région, notre plateforme vous accompagne dans chaque étape 
            de la sélection de vos prestataires.
          </p>
        </div>
      </div>
      
      <h3 className="text-xl font-serif mt-8 mb-4">Nos catégories de prestataires de mariage</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-wedding-olive" />
            <h4 className="font-medium">Lieux de réception</h4>
          </div>
          <p className="text-sm text-muted-foreground pl-7">
            Découvrez les plus beaux lieux de mariage : châteaux, domaines, salles atypiques, fermes rénovées...
          </p>
          <div className="pl-7">
            <Link to="/selection?category=lieu" className="text-sm text-wedding-olive hover:underline">
              Voir les lieux de réception →
            </Link>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-wedding-olive" />
            <h4 className="font-medium">Photographes et vidéastes</h4>
          </div>
          <p className="text-sm text-muted-foreground pl-7">
            Immortalisez vos moments précieux avec nos photographes de mariage professionnels.
          </p>
          <div className="pl-7">
            <Link to="/selection?category=photo" className="text-sm text-wedding-olive hover:underline">
              Voir les photographes →
            </Link>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-wedding-olive" />
            <h4 className="font-medium">Traiteurs et services de restauration</h4>
          </div>
          <p className="text-sm text-muted-foreground pl-7">
            Offrez un festin mémorable avec les meilleurs traiteurs mariage sélectionnés pour leur savoir-faire.
          </p>
          <div className="pl-7">
            <Link to="/selection?category=traiteur" className="text-sm text-wedding-olive hover:underline">
              Voir les traiteurs →
            </Link>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-wedding-olive" />
            <h4 className="font-medium">DJ et musiciens</h4>
          </div>
          <p className="text-sm text-muted-foreground pl-7">
            Faites vibrer votre soirée avec les meilleurs DJ et groupes musicaux pour votre mariage.
          </p>
          <div className="pl-7">
            <Link to="/selection?category=musique" className="text-sm text-wedding-olive hover:underline">
              Voir les DJ et musiciens →
            </Link>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-serif mt-8 mb-4">Pourquoi choisir Mariable pour trouver vos prestataires ?</h3>
      
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <span className="font-medium">Une sélection rigoureuse</span> : Tous nos prestataires sont vérifiés et recommandés par notre équipe.
        </li>
        <li>
          <span className="font-medium">Des options pour tous les budgets</span> : Notre plateforme propose des prestataires adaptés à votre budget mariage.
        </li>
        <li>
          <span className="font-medium">Des avis authentiques</span> : Consultez les retours d'expérience de vrais couples.
        </li>
        <li>
          <span className="font-medium">Un accompagnement personnalisé</span> : Nos outils vous aident à faire les meilleurs choix pour votre grand jour.
        </li>
      </ul>
      
      <div className="mt-8 py-6 px-6 bg-wedding-cream/20 rounded-lg border border-wedding-olive/10">
        <h3 className="text-xl font-serif mb-3">Commencez votre recherche de prestataires</h3>
        <p className="mb-4">
          Prêt à trouver les prestataires parfaits pour votre mariage ? Utilisez notre moteur de recherche intelligent ou consultez notre checklist mariage pour vous aider à planifier chaque étape.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-wedding-olive hover:bg-wedding-olive/90"
            onClick={() => navigate('/selection')}
          >
            <Search className="mr-2 h-4 w-4" />
            Rechercher des prestataires
          </Button>
          <Button 
            variant="outline"
            className="border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10"
            onClick={() => navigate('/planning-personnalise')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Planning personnalisé
          </Button>
        </div>
      </div>
    </>
  );
};

const Prestataires = () => {
  return (
    <ServiceTemplate 
      title="Recherche de prestataires de mariage"
      description="Trouvez les meilleurs prestataires pour votre grand jour"
      content={<PrestataireContent />}
    >
      <SEO 
        title="Trouvez les meilleurs prestataires de mariage | Sélection vérifiée"
        description="Lieux, traiteurs, photographes, DJs… Découvrez une sélection des meilleurs prestataires de mariage vérifiés selon votre région et votre style. Comparez et contactez gratuitement."
        canonical="/services/prestataires"
      />
    </ServiceTemplate>
  );
};

export default Prestataires;
