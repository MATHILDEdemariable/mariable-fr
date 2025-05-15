import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

import PrestataireModal from "./PrestataireModal";

import FeaturedImage from "@/components/ui/featured-image";
import { Prestataire, PrestataireInsert } from "./types";

const PrestatairesAdmin = () => {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [selected, setSelected] = useState<Prestataire | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode: "edit" | "add">("add");

  const fetchPrestataires = async () => {
    const { data, error } = await supabase
      .from("prestataires_rows")
      .select(`*, prestataires_photos_preprod (*)`)
      .order("nom", { ascending: true });
    if (error) {
      toast.error("Erreur lors du chargement");
      return;
    }
    if (data) {
      for (const presta of data) {
        const { data: brochures } = await supabase
          .from("prestataires_brochures_preprod")
          .select("*")
          .eq("prestataire_id", presta.id);

        presta.prestataires_brochures = brochures;
      }
    }
    // console.log("Prestataires:", data);
    setPrestataires(data || []);
  };

  useEffect(() => {
    fetchPrestataires();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("prestataires_rows")
      .delete()
      .eq("id", id);
    if (error) return toast.error("Erreur suppression");
    toast.success("Prestataire supprimé");
    fetchPrestataires();
  };

  const handleEdit = (presta: Prestataire) => {
    setSelected(presta);
    setMode("edit");
    setDialogOpen(true);
  };
  const handlePublish = async (presta: Prestataire) => {
    const { error } = await supabase
      .from("prestataires_rows")
      .update({ visible: !presta.visible })
      .eq("id", presta.id);
    if (error) return toast.error("Erreur lors de la publication");
    toast.success(presta.visible ? "Prestataire caché" : "Prestataire publié");
    fetchPrestataires();
  };
  const handleAdd = () => {
    setSelected(null);
    setMode("add");
    setDialogOpen(true);
  };

  const handleHref = (slug: string) => {
    window.open(`/prestataire/${slug}`, "_blank");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Gestion des prestataires</h1>
        <Button onClick={handleAdd}>Ajouter un prestataire</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Mise en avant</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prestataires.map((presta) => {
            return (
              <TableRow key={presta.id}>
                <TableCell>
                  <FeaturedImage presta={presta} />
                </TableCell>
                <TableCell>{presta.nom}</TableCell>
                <TableCell>{presta.ville}</TableCell>
                <TableCell>{presta.categorie}</TableCell>
                <TableCell>{presta.featured ? "Oui" : "Non"}</TableCell>
                <TableCell className="space-x-2 flex flex-row">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleHref(presta.slug)}
                  >
                    Prévisualiser
                  </Button>
                  <Button
                    size="sm"
                    variant={presta.visible ? "publish" : "unpublish"}
                    onClick={() => handlePublish(presta)}
                  >
                    {presta.visible ? "Cacher" : "Publier"}
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
            );
          })}
        </TableBody>
      </Table>

      {dialogOpen && (
        <PrestataireModal
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={fetchPrestataires}
          mode={mode}
          prestataire={selected}
        />
      )}
    </div>
  );
};

export default PrestatairesAdmin;
