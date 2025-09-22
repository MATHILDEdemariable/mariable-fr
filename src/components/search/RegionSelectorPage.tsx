import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
// Types des régions françaises
type RegionFrance = 
  | "Auvergne-Rhône-Alpes"
  | "Bourgogne-Franche-Comté"
  | "Bretagne"
  | "Centre-Val de Loire"
  | "Corse"
  | "Grand Est"
  | "Hauts-de-France"
  | "Île-de-France"
  | "Normandie"
  | "Nouvelle-Aquitaine"
  | "Occitanie"
  | "Pays de la Loire"
  | "Provence-Alpes-Côte d'Azur"
  | "France entière";

// Organiser les régions par ordre alphabétique (sans France entière)
const regions: RegionFrance[] = [
  "Auvergne-Rhône-Alpes",
  "Bourgogne-Franche-Comté", 
  "Bretagne",
  "Centre-Val de Loire",
  "Corse",
  "Grand Est",
  "Hauts-de-France",
  "Île-de-France",
  "Normandie",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Pays de la Loire",
  "Provence-Alpes-Côte d'Azur"
];

// Fonction pour convertir le nom de région en slug
export const regionToSlug = (region: string): string => {
  if (region === 'france-entiere') return 'france-entiere';
  
  return region
    .toLowerCase()
    .replace(/[àáâäã]/g, 'a')
    .replace(/[èéêë]/g, 'e') 
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôöõ]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/'/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

// Fonction pour convertir le slug en nom de région
export const slugToRegion = (slug: string): RegionFrance | null => {
  if (slug === 'france-entiere') return 'France entière';
  
  const slugMap: { [key: string]: RegionFrance } = {
    'auvergne-rhone-alpes': 'Auvergne-Rhône-Alpes',
    'bourgogne-franche-comte': 'Bourgogne-Franche-Comté',
    'bretagne': 'Bretagne',
    'centre-val-de-loire': 'Centre-Val de Loire',
    'corse': 'Corse',
    'grand-est': 'Grand Est',
    'hauts-de-france': 'Hauts-de-France',
    'ile-de-france': 'Île-de-France',
    'normandie': 'Normandie',
    'nouvelle-aquitaine': 'Nouvelle-Aquitaine',
    'occitanie': 'Occitanie',
    'pays-de-la-loire': 'Pays de la Loire',
    'provence-alpes-cote-dazur': 'Provence-Alpes-Côte d\'Azur'
  };
  
  return slugMap[slug] || null;
};

type RegionSelectorPageProps = {
  onRegionSelect?: (region: string | null) => void;
};

const RegionSelectorPage: React.FC<RegionSelectorPageProps> = ({ onRegionSelect }) => {
  const navigate = useNavigate();

  const handleRegionClick = (region: string) => {
    const slug = regionToSlug(region);
    navigate(`/mariage/${slug}`);
    onRegionSelect?.(region);
  };

  const handleFranceEntiere = () => {
    navigate('/mariage/france-entiere');
    onRegionSelect?.('France entière');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif mb-4">
          Choisissez votre région
        </h1>
        <p className="text-lg text-muted-foreground">
          Trouvez les meilleurs prestataires de mariage dans votre région
        </p>
      </div>

      {/* Grille des régions avec France entière en dernier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* Première colonne */}
        <div className="space-y-4">
          {regions.slice(0, 7).map((region) => (
            <Card 
              key={region}
              className="border hover:border-wedding-olive/40 transition-all duration-200 cursor-pointer group hover:shadow-md"
              onClick={() => handleRegionClick(region)}
            >
              <CardContent className="p-4 text-center">
                <h3 className="font-medium text-foreground group-hover:text-wedding-olive transition-colors">
                  {region}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Deuxième colonne */}
        <div className="space-y-4">
          {regions.slice(7).map((region) => (
            <Card 
              key={region}
              className="border hover:border-wedding-olive/40 transition-all duration-200 cursor-pointer group hover:shadow-md"
              onClick={() => handleRegionClick(region)}
            >
              <CardContent className="p-4 text-center">
                <h3 className="font-medium text-foreground group-hover:text-wedding-olive transition-colors">
                  {region}
                </h3>
              </CardContent>
            </Card>
          ))}
          
          {/* France entière en dernier */}
          <Card 
            className="border-2 border-wedding-olive/20 hover:border-wedding-olive/40 transition-all duration-200 cursor-pointer group"
            onClick={handleFranceEntiere}
          >
            <CardContent className="p-4 text-center">
              <h3 className="font-medium text-wedding-olive group-hover:text-wedding-olive/80 transition-colors">
                France entière
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegionSelectorPage;