import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const REGIONS = [
  { 
    name: "Auvergne-Rhône-Alpes", 
    slug: "auvergne-rhone-alpes",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Bourgogne-Franche-Comté", 
    slug: "bourgogne-franche-comte",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Bretagne", 
    slug: "bretagne",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Centre-Val de Loire", 
    slug: "centre-val-de-loire",
    image: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Corse", 
    slug: "corse",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Grand Est", 
    slug: "grand-est",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Hauts-de-France", 
    slug: "hauts-de-france",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Île-de-France", 
    slug: "ile-de-france",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Normandie", 
    slug: "normandie",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Nouvelle-Aquitaine", 
    slug: "nouvelle-aquitaine",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Occitanie", 
    slug: "occitanie",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Pays de la Loire", 
    slug: "pays-de-la-loire",
    image: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400&h=300&fit=crop&crop=center"
  },
  { 
    name: "Provence-Alpes-Côte d'Azur", 
    slug: "provence-alpes-cote-azur",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=center"
  }
];

interface RegionGridProps {
  onRegionClick?: (regionSlug: string) => void;
}

const RegionGrid: React.FC<RegionGridProps> = ({ onRegionClick }) => {
  const navigate = useNavigate();

  const handleRegionClick = (regionSlug: string) => {
    if (onRegionClick) {
      onRegionClick(regionSlug);
    } else {
      navigate(`/test-region/${regionSlug}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {REGIONS.map((region) => (
        <Card 
          key={region.slug}
          className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => handleRegionClick(region.slug)}
        >
          <div className="relative h-48">
            <img 
              src={region.image} 
              alt={region.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <h3 className="font-semibold text-lg">{region.name}</h3>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RegionGrid;