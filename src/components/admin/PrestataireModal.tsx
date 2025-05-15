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
import { extractMetas } from "@/lib/extractMetas";
import { FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { any } from "zod";

type Prestataire = Database["public"]["Tables"]["prestataires_rows"]["Row"];
type PrestataireInsert =
  Database["public"]["Tables"]["prestataires_rows"]["Insert"];
type MetaInsert = Database["public"]["Tables"]["prestataires_meta"]["Insert"];

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
  const [carouselFiles, setCarouselFiles] = useState<File[]>([]);
  const [selectedFileBrochure, setSelectedFileBrochure] = useState<File | null>(
    null
  );

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
        //check if the prestataire already has a photo
        const { data: existingPhotos } = await supabase
          .from("prestataires_photos_preprod")
          .select("*")
          .eq("prestataire_id", prestataireId);
        if (existingPhotos && existingPhotos.length > 0) {
          const { data, error: UpdateError } = await supabase
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
          toast.success("Image mise à jour avec succès");
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
          toast.success("Image ajoutée avec succès");
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

  const uploadCarouselImages = async (prestataireId: string) => {
    for (const file of carouselFiles) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${prestataireId}/carousel/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Erreur lors de l'upload carousel:", uploadError);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("photos").getPublicUrl(filePath);

        const { error: insertError } = await supabase
          .from("prestataires_photos_preprod")
          .insert({
            prestataire_id: prestataireId,
            url: publicUrl,
            filename: file.name,
            type: file.type,
            size: file.size,
            principale: false, // image du carousel
          });

        if (insertError) {
          console.error("Erreur DB carousel:", insertError);
        }
      } catch (error) {
        console.error(
          "Erreur inconnue lors de l'upload d'image carousel:",
          error
        );
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFileBrochure(files[0]);
    }
  };

  const uploadBrochure = async (
    prestataireId: string
  ): Promise<string | null> => {
    if (!selectedFileBrochure) return null;

    setIsUploading(true);

    try {
      const fileExt = selectedFileBrochure.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${prestataireId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("brochures")
        .upload(filePath, selectedFileBrochure);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("brochures").getPublicUrl(filePath);

      await supabase.from("prestataires_brochures_preprod").insert({
        prestataire_id: prestataireId,
        url: publicUrl,
        filename: selectedFileBrochure.name,
        type: selectedFileBrochure.type,
        size: selectedFileBrochure.size,
      });

      return publicUrl;
    } catch (error) {
      console.error("Erreur lors du téléchargement de la brochure:", error);
      toast.error("Impossible de télécharger la brochure. Veuillez réessayer.");
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!form.nom) {
      toast.error("Nom requis");
      return;
    }

    const metas = extractMetas(form, [
      "id",
      "slug",
      "categorie",
      "categorie_lieu",
      "created_at",
      "updated_at",
      "description",
      "email",
      "nom",
      "region",
      "ville",
      "featured",
      "visible",
      "prestataires_photos_preprod",
      "prestataires_brochures"
    ]);

    if (mode === "edit" && prestataire) {
      const { prestataires_photos_preprod,prestataires_brochures, ...formWithoutRelations } = form;

      const { error } = await supabase
        .from("prestataires_rows")
        .update(formWithoutRelations)
        .eq("id", prestataire.id);

      if (error) return toast.error("Erreur mise à jour");
      if (selectedFile) {
        await uploadImage(prestataire.id);
      }

      if (carouselFiles.length > 0) {
        await uploadCarouselImages(prestataire.id);
      }

      if (selectedFileBrochure) {
        await uploadBrochure(prestataire.id);
      }

      const { error: deleteError } = await supabase
        .from("prestataires_meta")
        .delete()
        .eq("prestataire_id", prestataire.id);

      const metasArray = Object.entries(metas).map(([key, value]) => ({
        meta_key: key,
        meta_value: value,
        prestataire_id: prestataire.id,
      }));

      if (metasArray.length > 0) {
        const { error: metaError } = await supabase
          .from("prestataires_meta")
          .insert(metasArray);

        if (metaError) {
          toast.error("Erreur lors de l'enregistrement des métas");
          console.error(metaError);
        }
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

      if (carouselFiles.length > 0) {
        await uploadCarouselImages(data.id);
      }

      if (selectedFileBrochure) {
        await uploadBrochure(data.id);
      }

      const metasArray = Object.entries(metas).map(([key, value]) => ({
        meta_key: key,
        meta_value: value,
        prestataire_id: data.id,
      }));

      if (metasArray.length > 0) {
        const { error: metaError } = await supabase
          .from("prestataires_meta")
          .insert(metasArray);

        if (metaError) {
          toast.error("Erreur lors de l'enregistrement des métas");
          console.error(metaError);
        }
      }
      toast.success("Prestataire ajouté");
    }

    onClose();
    onSave();
  };

  const deleteCarouselImage = (id: string) => async () => {
    const currentImageHml = document.getElementById(`carousel-image-${id}`);

    const { error } = await supabase
      .from("prestataires_photos_preprod")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Erreur lors de la suppression de l'image");
    } else {
      currentImageHml?.remove();
      toast.success("Image supprimée avec succès");
    }
  };

  const deleteBrochure = (id: string) => async () => {
    const currentBrochure = document.getElementById(`brochure-${id}`);

    const { error } = await supabase
      .from("prestataires_brochures_preprod")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Erreur lors de la suppression de la brochure");
    } else {
      currentBrochure?.remove();
      toast.success("Brochure supprimée avec succès");
    }
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
        <div>
          <img
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : prestataire?.prestataires_photos_preprod?.[0]?.url ||
                  "https://placehold.co/500x150?text=No+image"
            }
            alt="Prestataire"
            className="w-full max-h-[150px] object-cover rounded-lg "
          />
        </div>
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

        <p>Images du carousel</p>
        {prestataire?.prestataires_photos_preprod && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
              {Array.isArray(prestataire.prestataires_photos_preprod) &&
                prestataire.prestataires_photos_preprod
                  .filter((item) => !item.principale)
                  .map((item) => (
                    <div
                      key={item.id}
                      id={`carousel-image-${item.id}`}
                      className="relative w-full aspect-video overflow-hidden rounded-lg border"
                    >
                      <span
                        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1 rounded cursor-pointer"
                        onClick={deleteCarouselImage(item.id)}
                      >
                        X
                      </span>
                      <img
                        src={item.url}
                        alt={`carousel-${item.filename}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
            </div>
          </>
        )}
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setCarouselFiles(Array.from(e.target.files).slice(0, 5)); // max 5 images
            }
          }}
          className="mb-4"
        />

        <p>Brochure</p>
        {prestataire?.prestataires_brochures && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {Array.isArray(prestataire.prestataires_brochures) &&
                prestataire.prestataires_brochures.map((item) => (
                  <div
                    key={item.id}
                    id={`brochure-${item.id}`}
                    className="relative w-full aspect-video overflow-hidden rounded-lg border flex flex-col items-center justify-center"
                  >
                    <span
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1 rounded cursor-pointer"
                      onClick={deleteBrochure(item.id)}
                    >
                      X
                    </span>
                    <p className="text-center"><a href={item.url} target="_blank">{item.filename}</a></p>
                  </div>
                ))}
            </div>
          </>
        )}

        <Input
          type="file"
          id="brochure"
          className="max-w-full"
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
        />

        <h2 className="mt-4  bg-slate-50 p-2 rounded-md text-center text-slate-500">
          Informations
        </h2>
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
          <Textarea
            placeholder="Description en plus"
            value={form.description_more || ""}
            onChange={(e) => handleChange("description_more", e.target.value)}
            className="md:col-span-2"
          />
          <h2 className="mt-4  md:col-span-2 bg-slate-50 p-2 rounded-md text-center text-slate-500">
            Packages
          </h2>
          <div className="grid grid-cols-3 flex-wrap gap-4 md:col-span-2">
            <Input
              type="number"
              step="0.01"
              min="0"
              max="99999999.99"
              placeholder="Exemple : 3800,00"
              value={form.first_price_package ?? ""}
              onChange={(e) =>
                handleChange("first_price_package", parseFloat(e.target.value))
              }
            />
            <Input
              type="number"
              step="0.01"
              min="0"
              max="99999999.99"
              placeholder="Exemple : 4200,00"
              value={form.second_price_package ?? ""}
              onChange={(e) =>
                handleChange("second_price_package", parseFloat(e.target.value))
              }
            />
            <Input
              type="number"
              step="0.01"
              min="0"
              max="99999999.99"
              placeholder="Exemple : 5400,00"
              value={form.third_price_package ?? ""}
              onChange={(e) =>
                handleChange("third_price_package", parseFloat(e.target.value))
              }
            />
          </div>
          <h2 className="mt-4  md:col-span-2 bg-slate-50 p-2 rounded-md text-center text-slate-500">
            Autres informations
          </h2>
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
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.partner ?? false}
              onCheckedChange={(val) => handleChange("partner", !!val)}
            />
            <label>Partenaire</label>
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
