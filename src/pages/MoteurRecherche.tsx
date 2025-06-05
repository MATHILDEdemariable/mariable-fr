
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, Euro } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MoteurRecherche = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [budget, setBudget] = useState('');
  const navigate = useNavigate();

  const categories = [
    'Lieu de réception',
    'Photographe',
    'Traiteur',
    'DJ / Musique',
    'Fleuriste',
    'Coiffure / Maquillage',
    'Robe de mariée',
    'Décoration'
  ];

  const regions = [
    'Île-de-France',
    'Provence-Alpes-Côte d\'Azur',
    'Auvergne-Rhône-Alpes',
    'Nouvelle-Aquitaine',
    'Occitanie',
    'Hauts-de-France',
    'Grand Est',
    'Pays de la Loire'
  ];

  // Données de démonstration
  const mockResults = [
    {
      id: 1,
      name: "Château de Malmaison",
      category: "Lieu de réception",
      location: "Île-de-France",
      rating: 4.8,
      price: "À partir de 2500€",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Studio Photo Lumière",
      category: "Photographe",
      location: "Provence-Alpes-Côte d'Azur",
      rating: 4.9,
      price: "À partir de 1200€",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Traiteur Gourmand",
      category: "Traiteur",
      location: "Auvergne-Rhône-Alpes",
      rating: 4.7,
      price: "45€/personne",
      image: "/placeholder.svg"
    }
  ];

  const handleSearch = () => {
    // Logique de recherche à implémenter
    console.log({ searchTerm, category, region, budget });
  };

  return (
    <>
      <Helmet>
        <title>Recherche de prestataires | Mariable</title>
        <meta name="description" content="Trouvez les meilleurs prestataires de mariage près de chez vous selon vos critères et votre budget." />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-4">Trouvez vos prestataires de mariage</h1>
          <p className="text-muted-foreground">
            Découvrez les meilleurs professionnels pour votre grand jour
          </p>
        </div>

        {/* Formulaire de recherche */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Rechercher un prestataire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((reg) => (
                    <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleSearch} className="bg-wedding-olive hover:bg-wedding-olive/90">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Résultats de recherche ({mockResults.length})</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockResults.map((result) => (
              <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-wedding-olive">
                    {result.category}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-2">{result.name}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{result.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{result.rating}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm">
                      <Euro className="h-4 w-4" />
                      <span>{result.price}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => navigate(`/prestataire/${result.id}`)}
                  >
                    Voir le profil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Message d'information */}
        <div className="text-center mt-12 p-6 bg-wedding-cream/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Vous ne trouvez pas ce que vous cherchez ?</h3>
          <p className="text-muted-foreground mb-4">
            Contactez-nous et nous vous aiderons à trouver le prestataire parfait pour votre mariage.
          </p>
          <Button onClick={() => navigate('/contact')}>
            Nous contacter
          </Button>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MoteurRecherche;
