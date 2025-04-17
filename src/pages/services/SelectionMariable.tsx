
import React, { useState, useEffect } from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { useToast } from '@/hooks/use-toast';
import { fetchVendors } from '@/services/airtableService';
import { AirtableVendor, VendorFilter } from '@/types/airtable';
import VendorCard from '@/components/vendors/VendorCard';
import VendorDetailModal from '@/components/vendors/VendorDetailModal';
import VendorFilters from '@/components/vendors/VendorFilters';
import { Skeleton } from '@/components/ui/skeleton';

const SelectionMariableContent = () => {
  const [vendors, setVendors] = useState<AirtableVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<AirtableVendor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<VendorFilter>({
    category: null,
    search: '',
    region: 'Centre-Val-de-Loire', // Filtre par défaut
    priceRange: null
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    const loadVendors = async () => {
      setIsLoading(true);
      try {
        const data = await fetchVendors(filters);
        setVendors(data.records);
      } catch (error) {
        console.error('Erreur lors du chargement des prestataires:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les prestataires. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVendors();
  }, [filters, toast]);
  
  const handleVendorClick = (vendor: AirtableVendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };
  
  const handleFilterChange = (newFilters: Partial<VendorFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-wedding-cream/30 p-6 rounded-lg mb-8 border border-wedding-olive/20">
        <h2 className="text-2xl font-serif mb-3">La sélection Mariable</h2>
        <p className="mb-6">
          Découvrez notre sélection de prestataires de mariage dans la région Centre Val-de-Loire. 
          Tous les prestataires ont été soigneusement sélectionnés pour leur professionnalisme, 
          leur qualité de service et leur rapport qualité-prix.
        </p>
        
        <VendorFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : vendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onClick={handleVendorClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Aucun prestataire ne correspond à vos critères de recherche.
          </p>
        </div>
      )}
      
      <VendorDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vendor={selectedVendor}
      />
    </div>
  );
};

const SelectionMariable = () => {
  return (
    <ServiceTemplate 
      title="La sélection Mariable"
      description="Les meilleurs prestataires de mariage sélectionnés pour vous"
      content={<SelectionMariableContent />}
    />
  );
};

export default SelectionMariable;
