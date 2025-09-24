
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Prestataire } from "./types";
import FeaturedImage from "@/components/ui/featured-image";
import { Search, Plus, Filter, Upload, Download } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import FrontStylePrestataireEditModal from "./FrontStylePrestataireEditModal";
import CSVUploadTab from "./CSVUploadTab";
import { exportPrestatairesToCSV } from '@/lib/csvExport';

const PrestatairesAdmin = () => {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPrestataires, setFilteredPrestataires] = useState<Prestataire[]>([]);
  const [frontEditOpen, setFrontEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<"edit" | "add" | "">("");
  const [frontEditSelected, setFrontEditSelected] = useState<Prestataire | null>(null);

  // Nouveaux filtres
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchPrestataires = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("prestataires_rows")
        .select(`*, prestataires_photos_preprod (*)`)
        .order("nom", { ascending: true });
      
      if (error) {
        toast.error("Erreur lors du chargement des prestataires");
        console.error("Erreur chargement:", error);
        setIsLoading(false);
        return;
      }
      
      if (data) {
        const prestataireData = data as unknown as Prestataire[];
        for (const presta of prestataireData) {
          // Fetch additional related data
          const { data: brochures } = await supabase
            .from("prestataires_brochures_preprod")
            .select("*")
            .eq("prestataire_id", presta.id);

          const { data: meta } = await supabase
            .from("prestataires_meta")
            .select("*")
            .eq("prestataire_id", presta.id);

          presta.prestataires_brochures = brochures || [];
          presta.prestataires_meta = meta || [];
        }
        
        setPrestataires(prestataireData);
        setFilteredPrestataires(prestataireData);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des prestataires:", err);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestataires();
  }, []);

  useEffect(() => {
    let filtered = prestataires;

    // Filtre par recherche
    if (debouncedSearchTerm) {
      filtered = filtered.filter(presta => 
        presta.nom.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        presta.ville?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        presta.categorie?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(presta => presta.categorie === categoryFilter);
    }

    // Filtre par ville
    if (cityFilter !== 'all') {
      filtered = filtered.filter(presta => presta.ville === cityFilter);
    }

    // Filtre par région
    if (regionFilter !== 'all') {
      filtered = filtered.filter(presta => presta.region === regionFilter);
    }

    // Filtre par visibilité
    if (visibilityFilter !== 'all') {
      const isVisible = visibilityFilter === 'visible';
      filtered = filtered.filter(presta => presta.visible === isVisible);
    }

    setFilteredPrestataires(filtered);
  }, [debouncedSearchTerm, prestataires, categoryFilter, cityFilter, regionFilter, visibilityFilter]);

  // Obtenir les valeurs uniques pour les filtres
  const uniqueCategories = [...new Set(prestataires.map(p => p.categorie).filter(Boolean))];
  const uniqueCities = [...new Set(prestataires.map(p => p.ville).filter(Boolean))];
  const uniqueRegions = [...new Set(prestataires.map(p => p.region).filter(Boolean))];

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce prestataire ?")) {
      try {
        const { error } = await supabase
          .from("prestataires_rows")
          .delete()
          .eq("id", id);
          
        if (error) {
          toast.error("Erreur lors de la suppression");
          console.error("Erreur suppression:", error);
          return;
        }
        
        toast.success("Prestataire supprimé avec succès");
        fetchPrestataires();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error("Une erreur est survenue");
      }
    }
  };

  const handleEdit = (presta: Prestataire) => {
    setFrontEditSelected(presta);
    setEditMode("edit");
    setFrontEditOpen(true);
  };

  const handlePublish = async (presta: Prestataire) => {
    try {
      const { error } = await supabase
        .from("prestataires_rows")
        .update({ visible: !presta.visible })
        .eq("id", presta.id);
        
      if (error) {
        toast.error("Erreur lors de la modification");
        console.error("Erreur mise à jour:", error);
        return;
      }
      
      toast.success(presta.visible 
        ? "Prestataire masqué avec succès" 
        : "Prestataire publié avec succès"
      );
      fetchPrestataires();
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      toast.error("Une erreur est survenue");
    }
  };

  const handleFeature = async (presta: Prestataire) => {
    try {
      const { error } = await supabase
        .from("prestataires_rows")
        .update({ featured: !presta.featured })
        .eq("id", presta.id);

      if (error) {
        toast.error("Erreur lors de la modification de la mise en avant");
        console.error("Erreur mise à jour 'featured':", error);
        return;
      }

      toast.success(
        presta.featured
          ? "Prestataire retiré de la mise en avant"
          : "Prestataire mis en avant avec succès"
      );
      fetchPrestataires();
    } catch (err) {
      console.error(
        "Erreur lors de la modification de la mise en avant:",
        err
      );
      toast.error("Une erreur est survenue");
    }
  };

  const handleAddNew = () => {
    setFrontEditSelected(null);
    setEditMode("add");
    setFrontEditOpen(true);
  };

  const handleHref = (slug: string) => {
    window.open(`/prestataire/${slug}`, "_blank");
  };

  const handleExportCSV = async () => {
    console.log('🚀 handleExportCSV started:', { prestataireCount: prestataires.length });
    
    try {
      setIsExporting(true);
      exportPrestatairesToCSV(prestataires);
      toast.success(`Export CSV prestataires réalisé avec succès (${prestataires.length} prestataires)`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'export CSV prestataires:', error);
      toast.error('Erreur lors de l\'export CSV');
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Liste des prestataires
          </TabsTrigger>
          <TabsTrigger value="csv-upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import CSV Google Maps
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-6">
          <div className="flex flex-col space-y-4 mb-6">
            {/* Première ligne : Recherche et boutons actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher un prestataire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  onClick={handleExportCSV}
                  disabled={isExporting || prestataires.length === 0}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className={`h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} />
                  {isExporting ? 'Export...' : 'Exporter CSV'}
                </Button>
                <Button 
                  onClick={handleAddNew} 
                  className="flex items-center gap-2"
                >
                  <Plus size={18} />
                  Ajouter
                </Button>
              </div>
            </div>

        {/* Deuxième ligne : Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtres :</span>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {uniqueCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              {uniqueRegions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Visibilité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="visible">Visibles</SelectItem>
              <SelectItem value="hidden">Masqués</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-10">
          <p>Chargement des prestataires...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Région</TableHead>
                <TableHead className="text-center">Visible</TableHead>
                <TableHead className="text-center">Mis en avant</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrestataires.map((presta) => (
                <TableRow key={presta.id} className="hover:bg-gray-50">
                  <TableCell>
                    <FeaturedImage presta={presta} />
                  </TableCell>
                  <TableCell className="font-medium">{presta.nom}</TableCell>
                  <TableCell>
                    {presta.categorie || "Non spécifiée"}
                  </TableCell>
                  <TableCell>{presta.ville || "Non spécifiée"}</TableCell>
                  <TableCell>{presta.region || "Non spécifiée"}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        presta.visible ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        presta.featured ? "bg-purple-500" : "bg-gray-300"
                      }`}
                    ></span>
                  </TableCell>
                  <TableCell className="space-x-2 flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      variant={presta.featured ? "secondary" : "outline"}
                      onClick={() => handleFeature(presta)}
                    >
                      {presta.featured ? "En avant ✨" : "Mettre en avant"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleHref(presta.slug!)}
                      disabled={!presta.slug}
                    >
                      Aperçu
                    </Button>
                    <Button
                      size="sm"
                      variant={presta.visible ? "destructive" : "default"}
                      onClick={() => handlePublish(presta)}
                    >
                      {presta.visible ? "Masquer" : "Publier"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(presta)}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(presta.id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      </TabsContent>

      <TabsContent value="csv-upload" className="space-y-4 mt-6">
        <CSVUploadTab onSuccess={() => fetchPrestataires()} />
      </TabsContent>
      </Tabs>

      <FrontStylePrestataireEditModal
        open={frontEditOpen}
        onClose={() => setFrontEditOpen(false)}
        prestataire={editMode === "edit" ? frontEditSelected : null}
        onSuccess={() => {
          setFrontEditOpen(false);
          fetchPrestataires();
        }}
        isCreating={editMode === "add"}
      />
    </div>
  );
};

export default PrestatairesAdmin;
