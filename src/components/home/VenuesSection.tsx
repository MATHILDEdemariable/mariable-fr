import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import VendorCard from "@/components/vendors/VendorCard";
import CarnetAdressesModal from "@/components/home/CarnetAdressesModal";
import { Database } from "@/integrations/supabase/types";
type PrestataireCategorie = Database['public']['Enums']['prestataire_categorie'];
const ALL_REGIONS_VALUE = 'Toutes les régions';
const REGIONS = [ALL_REGIONS_VALUE, 'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandie', 'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', "Provence-Alpes-Côte d'Azur"];

// Catégories simplifiées pour la page d'accueil
const MAIN_CATEGORIES = ['Lieu de réception', 'Photographe', 'Traiteur'];
const VenuesSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('home');
  const CATEGORIES: { id: string; label: string }[] = [
    { id: 'all', label: t('venuesSection.categories.all') },
    { id: 'Lieu de réception', label: t('venuesSection.categories.venue') },
    { id: 'Photographe', label: t('venuesSection.categories.photographer') },
    { id: 'Traiteur', label: t('venuesSection.categories.caterer') },
    { id: 'Autres', label: t('venuesSection.categories.others') },
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>(ALL_REGIONS_VALUE);
  const [isCarnetModalOpen, setIsCarnetModalOpen] = useState(false);
  const {
    data: vendors,
    isLoading
  } = useQuery({
  const {
    data: vendors,
    isLoading
  } = useQuery({
    queryKey: ['homepage-vendors', selectedCategory, selectedRegion],
    queryFn: async () => {
      let query = supabase.from('prestataires_rows').select(`
          *,
          prestataires_photos_preprod (url, is_cover, ordre, thumbnail_url)
        `).eq('visible', true)
        .order('partner', { ascending: false })
        .order('featured', { ascending: false })
        .limit(6);

      // Gestion des catégories simplifiées
      if (selectedCategory === 'Autres') {
        // Filtrer les prestataires qui NE SONT PAS dans les catégories principales
        query = query.not('categorie', 'in', `("Lieu de réception","Photographe","Traiteur")`);
      } else if (selectedCategory !== 'all') {
        query = query.eq('categorie', selectedCategory as PrestataireCategorie);
      }

      // Filtre par région - utilise filter avec l'opérateur cs pour les champs JSONB
      if (selectedRegion !== 'Toutes les régions') {
        query = query.filter('regions', 'cs', JSON.stringify([selectedRegion]));
      }
      const {
        data
      } = await query;
      return data || [];
    }
  });
  const handleVendorClick = (vendor: any) => {
    navigate(`/prestataire/${vendor.slug}`);
  };
  return <section className="py-12 md:py-24 px-4 md:px-10 bg-white overflow-hidden">
      <div className="container max-w-7xl mx-auto">
        {/* Titre éditorial */}
        <motion.header initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="text-center mb-8 md:mb-16 px-2">
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir mb-4">
            Lieux de mariage & prestataires
          </h2>
          <p className="text-base text-editorial-gray font-sans max-w-2xl mx-auto">
            Explorez notre sélection de lieux d'exception et de professionnels vérifiés pour votre mariage
          </p>
        </motion.header>


        {/* Mobile Filters */}
        <div className="lg:hidden mb-6 space-y-3">
          <Select value={selectedCategory} onValueChange={value => setSelectedCategory(value)}>
            <SelectTrigger className="w-full bg-white border-editorial-border rounded-none">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full bg-white border-editorial-border rounded-none">
              <MapPin className="w-4 h-4 mr-2 text-editorial-gray" />
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Region Filter */}
        <div className="hidden lg:flex justify-center mb-12">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[220px] md:w-[280px] bg-white border-editorial-border rounded-none">
              <MapPin className="w-4 h-4 mr-2 text-editorial-gray" />
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Layout 2 colonnes */}
        <div className="flex gap-4 md:gap-8 overflow-hidden">
          {/* Sidebar gauche - Catégories (desktop only) */}
          <aside className="hidden lg:block w-[250px] flex-shrink-0">
            <div className="bg-white border border-editorial-border p-6 sticky top-24">
              <h3 className="text-sm uppercase tracking-widest font-medium text-editorial-noir mb-6">
                Catégories
              </h3>
              <ul className="space-y-1">
                {CATEGORIES.map(cat => <li key={cat.id}>
                    <button onClick={() => setSelectedCategory(cat.id)} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCategory === cat.id ? 'border-l-2 border-editorial-beige text-editorial-noir font-medium bg-editorial-beige/20' : 'text-editorial-gray hover:text-editorial-noir hover:bg-editorial-border/50'}`}>
                      {cat.label}
                    </button>
                  </li>)}
              </ul>
            </div>
          </aside>

          {/* Grid droite - Cartes prestataires */}
          <div className="flex-1 min-w-0 w-full">
            {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse">
                    <div className="aspect-[16/9] bg-gradient-to-br from-editorial-border to-editorial-border/70" />
                    <div className="p-4 bg-white border border-t-0 border-editorial-border">
                      <div className="h-5 bg-editorial-border rounded w-3/4 mb-2" />
                      <div className="h-4 bg-editorial-border rounded w-1/2" />
                    </div>
                  </div>)}
              </div> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
                {vendors?.map(vendor => <VendorCard key={vendor.id} vendor={vendor} onClick={handleVendorClick} />)}
              </div>}

            {/* CTA Explorer */}
            <div className="text-center mt-12 px-4">
              <Button 
                onClick={() => navigate('/professionnelsmariable')} 
                className="w-full sm:w-auto bg-editorial-olive hover:bg-editorial-olive/90 text-white px-6 py-4 sm:px-10 sm:py-6 text-xs sm:text-sm uppercase tracking-widest rounded-none max-w-full"
              >
                Voir tous les professionnels
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sélection personnalisée */}
      <CarnetAdressesModal isOpen={isCarnetModalOpen} onClose={() => setIsCarnetModalOpen(false)} />
    </section>;
};
export default VenuesSection;