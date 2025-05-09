import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Database, Constants } from "@/integrations/supabase/types";
import { v4 as uuidv4 } from "uuid";
import slugify from "@/utils/slugify";

type Prestataire = Database["public"]["Tables"]["prestataires_rows"]["Row"];
type PrestataireInsert =
  Database["public"]["Tables"]["prestataires_rows"]["Insert"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  prestataire: Prestataire | null;
  mode: "edit" | "add";
}

const PrestataireModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  prestataire,
  mode,
}) => {
  const [form, setForm] = useState<PrestataireInsert>({ nom: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (prestataire) {
      setForm({ ...prestataire });
    } else {
      setForm({ nom: "" });
    }
  }, [prestataire]);

  const handleChange = (field: keyof PrestataireInsert, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadImage = async (prestataireId: string): Promise<string | null> => {
    if (!selectedFile) return null;

    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${prestataireId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("photos")
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error("Erreur lors du téléchargement de l'image:", uploadError);
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(filePath);

      if (mode === "edit") {
        const { error: UpdateError } = await supabase
          .from("prestataires_photos_preprod")
          .update({
            url: publicUrl,
            filename: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            principale: true,
          })
          .eq("prestataire_id", prestataireId);
        if (UpdateError) {
          console.error(
            "Erreur lors de la mise à jour de l'image dans la base de données:",
            UpdateError
          );
          throw UpdateError;
        }
      } else {
        const { error: InsertError } = await supabase
          .from("prestataires_photos_preprod")
          .insert({
            prestataire_id: prestataireId,
            url: publicUrl,
            filename: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            principale: true,
          });
        if (InsertError) {
          console.error(
            "Erreur lors de l'insertion de l'image dans la base de données:",
            InsertError
          );
          throw InsertError;
        }
      }

      return publicUrl;
    } catch (error) {
      toast.error(error.message);
      console.error("Erreur lors du téléchargement de la brochure:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.nom) {
      toast.error("Nom requis");
      return;
    }

    if (mode === "edit" && prestataire) {
      const { prestataires_photos_preprod, ...formWithoutRelations } = form;

      const { error } = await supabase
        .from("prestataires_rows")
        .update(formWithoutRelations)
        .eq("id", prestataire.id);

      if (error) return toast.error("Erreur mise à jour");
      if (selectedFile) {
        await uploadImage(prestataire.id);
      }
      toast.success("Prestataire mis à jour");
    } else {
      form.slug = slugify(form.nom);
      const { data, error } = await supabase
        .from("prestataires_rows")
        .insert(form)
        .select("id")
        .single();

      if (error) return toast.error("Erreur création");
      await uploadImage(data.id);

      toast.success("Prestataire ajouté");
    }

    onClose();
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Modifier" : "Ajouter"} un prestataire
          </DialogTitle>
        </DialogHeader>
        <p>Image de couverture du prestataire</p>
        {mode === "edit" && (
          <div>
            <img
              src={
                prestataire.prestataires_photos_preprod?.[0]?.url ||
                "https://placehold.co/500x150"
              }
              alt="Prestataire"
              className="w-full max-h-[150px] object-cover rounded-lg "
            />
          </div>
        )}
        {mode === "add" && selectedFile && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-full max-h-[150px] object-cover rounded-lg "
            />
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setSelectedFile(e.target.files[0]);
            }
          }}
          className="mb-4"
        />
        <p>Autres informations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Nom"
            value={form.nom || ""}
            onChange={(e) => handleChange("nom", e.target.value)}
          />
          <Select
            value={form.categorie || ""}
            onValueChange={(v) => handleChange("categorie", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {Constants.public.Enums.prestataire_categorie.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Description"
            value={form.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="md:col-span-2"
          />
          <Select
            value={form.region || ""}
            onValueChange={(v) => handleChange("region", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              {Constants.public.Enums.region_france.map((reg) => (
                <SelectItem key={reg} value={reg}>
                  {reg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Ville"
            value={form.ville || ""}
            onChange={(e) => handleChange("ville", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Latitude"
            value={form.latitude ?? ""}
            onChange={(e) =>
              handleChange("latitude", parseFloat(e.target.value))
            }
          />
          <Input
            type="number"
            placeholder="Longitude"
            value={form.longitude ?? ""}
            onChange={(e) =>
              handleChange("longitude", parseFloat(e.target.value))
            }
          />
          <Input
            type="number"
            placeholder="Prix à partir de"
            value={form.prix_a_partir_de ?? ""}
            onChange={(e) =>
              handleChange("prix_a_partir_de", parseFloat(e.target.value))
            }
          />
          <Input
            type="number"
            placeholder="Prix par personne"
            value={form.prix_par_personne ?? ""}
            onChange={(e) =>
              handleChange("prix_par_personne", parseFloat(e.target.value))
            }
          />
          <Input
            placeholder="Responsable nom"
            value={form.responsable_nom || ""}
            onChange={(e) => handleChange("responsable_nom", e.target.value)}
          />
          <Textarea
            placeholder="Responsable bio"
            value={form.responsable_bio || ""}
            onChange={(e) => handleChange("responsable_bio", e.target.value)}
          />
          <Input
            placeholder="Email"
            value={form.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <Input
            placeholder="Téléphone"
            value={form.telephone || ""}
            onChange={(e) => handleChange("telephone", e.target.value)}
          />
          <Input
            placeholder="Site web"
            value={form.site_web || ""}
            onChange={(e) => handleChange("site_web", e.target.value)}
          />
          <Input
            placeholder="SIRET"
            value={form.siret || ""}
            onChange={(e) => handleChange("siret", e.target.value)}
          />
          <Input
            placeholder="Nom de l'assurance"
            value={form.assurance_nom || ""}
            onChange={(e) => handleChange("assurance_nom", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Prix minimum"
            value={form.prix_minimum ?? ""}
            onChange={(e) =>
              handleChange("prix_minimum", parseFloat(e.target.value))
            }
          />
          <Input
            placeholder="Catégorie lieu"
            value={form.categorie_lieu || ""}
            onChange={(e) => handleChange("categorie_lieu", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Capacité invités"
            value={form.capacite_invites ?? ""}
            onChange={(e) =>
              handleChange("capacite_invites", parseInt(e.target.value))
            }
          />
          <Input
            type="number"
            placeholder="Nombre couchages"
            value={form.nombre_couchages ?? ""}
            onChange={(e) =>
              handleChange("nombre_couchages", parseInt(e.target.value))
            }
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.hebergement_inclus ?? false}
              onCheckedChange={(val) =>
                handleChange("hebergement_inclus", !!val)
              }
            />
            <label>Hébergement inclus</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.accord_referencement ?? false}
              onCheckedChange={(val) =>
                handleChange("accord_referencement", !!val)
              }
            />
            <label>Accord référencement</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.accord_cgv ?? false}
              onCheckedChange={(val) => handleChange("accord_cgv", !!val)}
            />
            <label>Accord CGV</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.featured ?? false}
              onCheckedChange={(val) => handleChange("featured", !!val)}
            />
            <label>Mise en avant</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.visible ?? false}
              onCheckedChange={(val) => handleChange("visible", !!val)}
            />
            <label>Publier</label>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrestataireModal;
