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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Prestataire } from "./types";
import FeaturedImage from "@/components/ui/featured-image";
import { Search, Plus } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import FrontStylePrestataireEditModal from "./FrontStylePrestataireEditModal";

const PrestatairesAdmin = () => {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPrestataires, setFilteredPrestataires] = useState<Prestataire[]>([]);
  const [frontEditOpen, setFrontEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<"edit" | "add" | "">("");
  const [frontEditSelected, setFrontEditSelected] = useState<Prestataire | null>(
    null
  );

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
    if (debouncedSearchTerm) {
      const filtered = prestataires.filter(presta => 
        presta.nom.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        presta.ville?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        presta.categorie?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredPrestataires(filtered);
    } else {
      setFilteredPrestataires(prestataires);
    }
  }, [debouncedSearchTerm, prestataires]);

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

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Rechercher un prestataire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            onClick={handleAddNew} 
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus size={18} />
            Ajouter un prestataire
          </Button>
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
                    {presta.slug && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleHref(presta.slug || "")}
                      >
                        Aperçu
                      </Button>
                    )}
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
