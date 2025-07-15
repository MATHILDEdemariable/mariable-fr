import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Utensils, 
  Camera, 
  Video, 
  Calendar,
  Music,
  Flower,
  Shirt,
  Palette
} from 'lucide-react';

const SERVICES = [
  { 
    name: "Lieu de réception", 
    slug: "lieu",
    icon: MapPin,
    description: "Châteaux, domaines, salles...",
    color: "text-emerald-600"
  },
  { 
    name: "Traiteur", 
    slug: "traiteur",
    icon: Utensils,
    description: "Cocktails, repas, buffets...",
    color: "text-orange-600"
  },
  { 
    name: "Photographe", 
    slug: "photographe",
    icon: Camera,
    description: "Reportage, portraits, lifestyle...",
    color: "text-blue-600"
  },
  { 
    name: "Vidéaste", 
    slug: "vidéaste",
    icon: Video,
    description: "Films, clips, drone...",
    color: "text-purple-600"
  },
  { 
    name: "Coordination", 
    slug: "coordination",
    icon: Calendar,
    description: "Organisation complète",
    color: "text-pink-600"
  },
  { 
    name: "DJ", 
    slug: "dj",
    icon: Music,
    description: "Animation musicale",
    color: "text-red-600"
  },
  { 
    name: "Fleuriste", 
    slug: "fleuriste",
    icon: Flower,
    description: "Bouquets, décorations florales...",
    color: "text-green-600"
  },
  { 
    name: "Robe de mariée", 
    slug: "robe-de-mariée",
    icon: Shirt,
    description: "Créateurs, boutiques...",
    color: "text-indigo-600"
  },
  { 
    name: "Décoration", 
    slug: "décoration",
    icon: Palette,
    description: "Mobilier, éclairage, thème...",
    color: "text-teal-600"
  }
];

interface ServiceGridProps {
  region: string;
  onServiceClick?: (serviceSlug: string, region: string) => void;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ region, onServiceClick }) => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceSlug: string) => {
    if (onServiceClick) {
      onServiceClick(serviceSlug, region);
    } else {
      navigate(`/test-mariage-${serviceSlug}-${region}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SERVICES.map((service) => {
        const IconComponent = service.icon;
        
        return (
          <Card 
            key={service.slug}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-muted/20"
            onClick={() => handleServiceClick(service.slug)}
          >
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-muted/10">
                  <IconComponent className={`h-8 w-8 ${service.color}`} />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ServiceGrid;