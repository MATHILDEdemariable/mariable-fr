import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const VenuesSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Tous les lieux' },
    { id: 'Lieu de réception', label: 'Lieux de réception' },
    { id: 'Photographe', label: 'Photographes' },
    { id: 'Traiteur', label: 'Traiteurs' },
    { id: 'Fleuriste', label: 'Fleuristes' },
    { id: 'DJ', label: 'DJ & Musique' },
  ];

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['homepage-vendors', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('prestataires_rows')
        .select(`
          id,
          nom,
          slug,
          ville,
          categorie,
          regions,
          prestataires_photos_preprod (url, is_cover, ordre)
        `)
        .eq('visible', true)
        .limit(6);
      
      if (selectedCategory !== 'all') {
        query = query.eq('categorie', selectedCategory as any);
      }
      
      const { data } = await query;
      return data || [];
    }
  });

  const getVendorImages = (vendor: any) => {
    const photos = vendor.prestataires_photos_preprod || [];
    const sortedPhotos = [...photos].sort((a, b) => {
      if (a.is_cover && !b.is_cover) return -1;
      if (!a.is_cover && b.is_cover) return 1;
      return (a.ordre || 0) - (b.ordre || 0);
    });
    return sortedPhotos.slice(0, 3).map((p: any) => p.url);
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-10 bg-white">
      <div className="container max-w-7xl mx-auto">
        {/* Titre éditorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0F0F0F] uppercase tracking-[2px] mb-4">
            Lieux & Prestataires
          </h2>
          <p className="text-base text-[#666666] font-sans max-w-2xl mx-auto">
            Explorez notre sélection de lieux d'exception et de professionnels vérifiés pour votre mariage
          </p>
        </motion.div>

        {/* Barre de recherche */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white border border-[#E8E8E8] p-3 md:p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-[#666666]" />
            <Input
              placeholder="Rechercher un lieu, un prestataire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Filtres en ligne */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Select>
            <SelectTrigger className="w-[140px] md:w-[160px] bg-white border-[#E8E8E8] rounded-none">
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="idf">Île-de-France</SelectItem>
              <SelectItem value="paca">PACA</SelectItem>
              <SelectItem value="occitanie">Occitanie</SelectItem>
              <SelectItem value="bretagne">Bretagne</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[140px] md:w-[160px] bg-white border-[#E8E8E8] rounded-none">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chateau">Château</SelectItem>
              <SelectItem value="domaine">Domaine</SelectItem>
              <SelectItem value="mas">Mas</SelectItem>
              <SelectItem value="hotel">Hôtel</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[140px] md:w-[160px] bg-white border-[#E8E8E8] rounded-none">
              <SelectValue placeholder="Capacité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">Jusqu'à 50</SelectItem>
              <SelectItem value="100">50 - 100</SelectItem>
              <SelectItem value="200">100 - 200</SelectItem>
              <SelectItem value="300">200+</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[140px] md:w-[160px] bg-white border-[#E8E8E8] rounded-none">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popularité</SelectItem>
              <SelectItem value="recent">Plus récent</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Layout 2 colonnes */}
        <div className="flex gap-8">
          {/* Sidebar gauche - Catégories (desktop only) */}
          <aside className="hidden lg:block w-[250px] flex-shrink-0">
            <div className="bg-white border border-[#E8E8E8] p-6 sticky top-24">
              <h3 className="text-sm uppercase tracking-widest font-medium text-[#0F0F0F] mb-6">
                Catégories
              </h3>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'border-l-2 border-[#3D5A3D] text-[#3D5A3D] font-medium bg-[#3D5A3D]/5'
                          : 'text-[#666666] hover:text-[#0F0F0F] hover:bg-[#E8E8E8]/50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Grid droite - Cartes venues */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="grid grid-cols-3 gap-0.5 h-[200px]">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="bg-gradient-to-br from-[#E8E8E8] to-[#D0D0D0]" />
                      ))}
                    </div>
                    <div className="p-5 bg-white border border-t-0 border-[#E8E8E8]">
                      <div className="h-5 bg-[#E8E8E8] rounded w-3/4 mb-2" />
                      <div className="h-4 bg-[#E8E8E8] rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {vendors?.map((vendor) => {
                  const images = getVendorImages(vendor);
                  return (
                    <motion.div
                      key={vendor.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      onClick={() => navigate(`/prestataire/${vendor.slug}`)}
                      className="cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(61,90,61,0.15)]"
                    >
                      {/* 3 images en grid */}
                      <div className="grid grid-cols-3 gap-0.5 h-[200px] overflow-hidden">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-br from-[#E8E8E8] to-[#D0D0D0] overflow-hidden"
                          >
                            {images[i] && (
                              <img
                                src={images[i]}
                                alt={`${vendor.nom} - ${i + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      {/* Info */}
                      <div className="p-5 bg-white border border-t-0 border-[#E8E8E8]">
                        <h4 className="font-sans text-lg font-medium text-[#0F0F0F] group-hover:text-[#3D5A3D] transition-colors">
                          {vendor.nom}
                        </h4>
                        <p className="text-sm text-[#666666] flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {vendor.ville || (vendor.regions as string[])?.[0] || 'France'}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* CTA Explorer */}
            <div className="text-center mt-12">
              <Button
                onClick={() => navigate('/professionnelsmariable')}
                className="bg-[#3D5A3D] hover:bg-[#0F0F0F] text-white px-10 py-6 text-sm uppercase tracking-widest rounded-none"
              >
                Voir tous les professionnels
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenuesSection;
