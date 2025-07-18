import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateUniqueSlug } from '@/utils/generateUniqueSlug';

type PrestataireCategorie =
  Database["public"]["Enums"]["prestataire_categorie"];
type RegionFrance = Database["public"]["Enums"]["region_france"];

// Définition du schéma de validation
const formSchema = z.object({
  nom: z
    .string()
    .min(3, { message: "Le nom doit contenir au moins 3 caractères" }),
  categorie: z.enum([
    "Lieu de réception",
    "Traiteur",
    "Photographe",
    "Vidéaste",
    "Coordination",
    "DJ",
    "Fleuriste",
    "Robe de mariée",
    "Décoration",
    "Mise en beauté",
    "Voiture",
    "Invités",
  ] as const),
  region: z.enum([
    "France entière",
    "Île-de-France",
    "Auvergne-Rhône-Alpes",
    "Bourgogne-Franche-Comté",
    "Bretagne",
    "Centre-Val de Loire",
    "Corse",
    "Grand Est",
    "Hauts-de-France",
    "Normandie",
    "Nouvelle-Aquitaine",
    "Occitanie",
    "Pays de la Loire",
    "Provence-Alpes-Côte d'Azur",
  ] as const),
  email: z.string().email({ message: "Adresse email invalide" }),
  telephone: z.string().optional(),
  site_web: z
    .string()
    .url({ message: "URL invalide" })
    .optional()
    .or(z.literal("")),
  siret: z.string().min(9, { message: "Le numéro SIRET est requis" }),
  assurance_nom: z
    .string()
    .min(2, { message: "Le nom de l'assurance est requis" }),
  description: z.string().optional(),
  prix_minimum: z.coerce.number().nonnegative(),
  accord_referencement: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter le référencement",
  }),
  accord_cgv: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les CGV",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORIES: PrestataireCategorie[] = [
  "Lieu de réception",
  "Traiteur",
  "Photographe",
  "Vidéaste",
  "Coordination",
  "DJ",
  "Fleuriste",
  "Robe de mariée",
  "Décoration",
  "Mise en beauté",
  "Voiture",
  "Invités",
];

const REGIONS: RegionFrance[] = [
  "France entière",
  "Île-de-France",
  "Auvergne-Rhône-Alpes",
  "Bourgogne-Franche-Comté",
  "Bretagne",
  "Centre-Val de Loire",
  "Corse",
  "Grand Est",
  "Hauts-de-France",
  "Normandie",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Pays de la Loire",
  "Provence-Alpes-Côte d'Azur",
];

const ProfessionalRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      categorie: undefined,
      region: undefined,
      email: "",
      telephone: "",
      site_web: "",
      siret: "",
      assurance_nom: "",
      description: "",
      prix_minimum: 0,
      accord_referencement: false,
      accord_cgv: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const uploadBrochure = async (
    prestataireId: string
  ): Promise<string | null> => {
    if (!selectedFile) return null;

    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${prestataireId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("brochures")
        .upload(filePath, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Obtenir l'URL publique du fichier
      const {
        data: { publicUrl },
      } = supabase.storage.from("brochures").getPublicUrl(filePath);

      // Enregistrer le lien dans la table prestataires_brochures
      await supabase.from("prestataires_brochures_preprod").insert({
        prestataire_id: prestataireId,
        url: publicUrl,
        filename: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });

      return publicUrl;
    } catch (error) {
      console.error("Erreur lors du téléchargement de la brochure:", error);
      toast({
        title: "Erreur",
        description:
          "Impossible de télécharger la brochure. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const slug = await generateUniqueSlug(values.nom);
      // Insérer le prestataire dans la base de données
      const { data: prestataire, error: insertError } = await supabase
        .from("prestataires_rows")
        .insert({
          nom: values.nom,
          categorie: values.categorie,
          region: values.region,
          email: values.email,
          telephone: values.telephone || null,
          site_web: values.site_web || null,
          siret: values.siret,
          assurance_nom: values.assurance_nom,
          prix_minimum: values.prix_minimum,
          description: values.description || null,
          accord_referencement: values.accord_referencement,
          accord_cgv: values.accord_cgv,
          visible: false, // Le prestataire n'est pas visible par défaut
          featured: false,
          description_more: null,
          partner: false,
          first_price_package: null,
          second_price_package: null,
          third_price_package: null,
          slug: slug,
          source_inscription: 'formulaire' // Marquer comme venant du formulaire
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      // Si un fichier a été sélectionné, le télécharger
      if (selectedFile && prestataire) {
        await uploadBrochure(prestataire.id);
      }

      toast({
        title: "Inscription réussie",
        description:
          "Votre demande d'inscription a été enregistrée avec succès. Nous vous contacterons prochainement.",
      });

      setFormSubmitted(true);
      form.reset();
      setSelectedFile(null);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center">
        <h3 className="text-xl font-medium mb-2">
          Merci pour votre inscription !
        </h3>
        <p className="mb-4">
          Votre demande a été enregistrée avec succès. Notre équipe examinera
          vos informations et vous contactera prochainement.
        </p>
        <Button
          variant="outline"
          onClick={() => setFormSubmitted(false)}
          className="mt-2"
        >
          Soumettre une nouvelle inscription
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'entreprise *</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de votre entreprise" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categorie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Région *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre région" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="06 xx xx xx xx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="site_web"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site web</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.votresite.fr" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="siret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro SIRET *</FormLabel>
                <FormControl>
                  <Input placeholder="12345678901234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assurance_nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de votre assurance *</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'assurance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prix_minimum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix minimum (€) *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <FormItem>
              <FormLabel>Brochure commerciale</FormLabel>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="file"
                  id="brochure"
                  className="max-w-md"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />
                {isUploading && <Loader2 className="animate-spin h-4 w-4" />}
              </div>
              <FormDescription>
                Formats acceptés : PDF, DOC, DOCX (max 5 Mo)
              </FormDescription>
            </FormItem>
          </div>

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description de vos services</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez vos services, votre expérience..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="accord_referencement"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    J'accepte d'être référencé sur la plateforme Mariable *
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accord_cgv"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    J'accepte les{" "}
                    <Link
                      to="/cgv"
                      className="text-wedding-olive hover:underline"
                    >
                      conditions générales
                    </Link>{" "}
                    de Mariable *
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="bg-wedding-olive hover:bg-wedding-olive/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Envoyer ma demande d'inscription"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfessionalRegistrationForm;
