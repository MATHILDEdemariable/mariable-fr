import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [additionalPhoto, setAdditionalPhoto] = useState<File | null>(null);
  const [additionalPhotoPreview, setAdditionalPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [cgvModalOpen, setCgvModalOpen] = useState(false);

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

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale est de 5 Mo.",
          variant: "destructive",
        });
        return;
      }
      setCoverPhoto(file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale est de 5 Mo.",
          variant: "destructive",
        });
        return;
      }
      setAdditionalPhoto(file);
      setAdditionalPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removeCoverPhoto = () => {
    setCoverPhoto(null);
    setCoverPhotoPreview(null);
  };

  const removeAdditionalPhoto = () => {
    setAdditionalPhoto(null);
    setAdditionalPhotoPreview(null);
  };

  const uploadPhoto = async (
    file: File,
    prestataireId: string,
    isPrincipal: boolean
  ): Promise<string | null> => {
    setIsUploadingPhoto(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${prestataireId}/${fileName}`;

      console.log('📤 Upload de la photo vers prestataires-photos...');
      
      // 1. Upload vers le bucket prestataires-photos
      const { error: uploadError } = await supabase.storage
        .from("prestataires-photos")
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ Erreur upload:', uploadError);
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("prestataires-photos").getPublicUrl(filePath);

      console.log('✅ Photo uploadée:', publicUrl);

      // 2. Compresser l'image via l'edge function compress-photo
      let finalUrl = publicUrl;
      let thumbnailUrl: string | null = null;
      let compressedSize = file.size;
      let finalFilename = file.name;

      try {
        console.log('🗜️ Compression de la photo...');
        const { data: compressedData, error: compressError } = await supabase.functions.invoke(
          'compress-photo',
          { body: { photoUrl: publicUrl, prestataireId: prestataireId } }
        );

        if (!compressError && compressedData?.success) {
          // Supprimer le fichier original non compressé
          await supabase.storage.from("prestataires-photos").remove([filePath]);
          
          finalUrl = compressedData.fullUrl;
          thumbnailUrl = compressedData.thumbnailUrl;
          compressedSize = compressedData.compressedSize;
          finalFilename = compressedData.filename;
          
          console.log(`✅ Photo compressée: ${compressedData.savings}% économisés`);
        } else {
          console.warn("⚠️ Compression échouée, utilisation de l'image originale:", compressError);
        }
      } catch (compressErr) {
        console.warn("⚠️ Erreur compression, utilisation de l'image originale:", compressErr);
      }

      // 3. Enregistrer dans la base de données
      const { error: dbError } = await supabase.from("prestataires_photos_preprod").insert({
        prestataire_id: prestataireId,
        url: finalUrl,
        thumbnail_url: thumbnailUrl,
        filename: finalFilename,
        type: file.type,
        size: compressedSize,
        principale: isPrincipal,
        is_cover: isPrincipal,
      });

      if (dbError) {
        console.error('❌ Erreur enregistrement DB:', dbError);
      }

      return finalUrl;
    } catch (error) {
      console.error("❌ Erreur lors du téléchargement de la photo:", error);
      toast({
        title: "Erreur",
        description:
          "Impossible de télécharger la photo. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      console.log('🚀 Envoi des données au serveur...');
      
      const { data, error } = await supabase.functions.invoke('register-professional', {
        body: {
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
        }
      });

      if (error) {
        console.error('❌ Erreur Edge Function:', error);
        throw error;
      }

      console.log('✅ Prestataire créé:', data);

      // Upload photos
      if (coverPhoto && data?.data?.id) {
        await uploadPhoto(coverPhoto, data.data.id, true);
      }

      if (additionalPhoto && data?.data?.id) {
        await uploadPhoto(additionalPhoto, data.data.id, false);
      }

      toast({
        title: "Inscription réussie",
        description:
          "Votre demande d'inscription a été enregistrée avec succès. Nous vous contacterons prochainement.",
      });

      setFormSubmitted(true);
      form.reset();
      setCoverPhoto(null);
      setCoverPhotoPreview(null);
      setAdditionalPhoto(null);
      setAdditionalPhotoPreview(null);
    } catch (error) {
      console.error("❌ Erreur lors de l'inscription:", error);
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description de votre activité</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez brièvement votre activité, vos spécialités..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Photo de couverture */}
        <div>
          <FormLabel>Photo de couverture</FormLabel>
          <FormDescription className="mb-2">
            {form.watch('categorie') === 'Lieu de réception' 
              ? 'Photo de votre lieu (façade, salle principale...)' 
              : 'Photo représentative de vos services'}
          </FormDescription>
          <div className="flex items-center gap-4 mt-2">
            {coverPhotoPreview ? (
              <div className="relative">
                <img 
                  src={coverPhotoPreview} 
                  alt="Aperçu" 
                  className="w-24 h-24 object-cover rounded border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeCoverPhoto}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Input
                type="file"
                className="max-w-md"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverPhotoChange}
              />
            )}
            {isUploadingPhoto && <Loader2 className="animate-spin h-4 w-4" />}
          </div>
          <FormDescription className="mt-1">
            Formats acceptés : JPG, PNG, WebP (max 5 Mo)
          </FormDescription>
        </div>

        {/* Photo complémentaire */}
        <div>
          <FormLabel>Photo complémentaire (optionnel)</FormLabel>
          <FormDescription className="mb-2">
            Une deuxième photo pour enrichir votre fiche
          </FormDescription>
          <div className="flex items-center gap-4 mt-2">
            {additionalPhotoPreview ? (
              <div className="relative">
                <img 
                  src={additionalPhotoPreview} 
                  alt="Aperçu" 
                  className="w-24 h-24 object-cover rounded border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeAdditionalPhoto}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Input
                type="file"
                className="max-w-md"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAdditionalPhotoChange}
              />
            )}
          </div>
          <FormDescription className="mt-1">
            Formats acceptés : JPG, PNG, WebP (max 5 Mo)
          </FormDescription>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="accord_referencement"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    J'accepte d'être référencé sur Mariable *
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accord_cgv"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    J'accepte les{" "}
                    <Dialog open={cgvModalOpen} onOpenChange={setCgvModalOpen}>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-wedding-olive underline hover:no-underline"
                        >
                          conditions générales de vente
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-serif">
                            Conditions Générales de Vente - Prestataires Mariable
                          </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh] pr-4">
                          <CGVContent />
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                    {" "}*
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Envoyer ma candidature"
          )}
        </Button>
      </form>
    </Form>
  );
};

const CGVContent = () => (
  <div className="space-y-6 text-sm">
    <p className="text-muted-foreground">
      Dernière mise à jour : Janvier 2026
    </p>

    <section>
      <h3 className="font-semibold text-wedding-black mb-2">Article 1 - Identification des Parties</h3>
      <p className="text-muted-foreground">
        Les présentes CGV s'appliquent entre la société Mariable (ci-après "la Plateforme") 
        et tout prestataire de services liés au mariage (ci-après "le Prestataire") 
        souhaitant être référencé sur la plateforme Mariable.
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-wedding-black mb-2">Article 2 - Objet du Contrat</h3>
      <p className="text-muted-foreground">
        Le présent contrat définit les conditions de référencement du Prestataire sur la Plateforme.
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-wedding-black mb-2">Article 3 - Référencement et Visibilité</h3>
      <p className="text-muted-foreground">
        Le Prestataire bénéficie d'une fiche éditorialisée sur la Plateforme, d'un guide d'accueil 
        digitalisé personnalisé et d'une visibilité sur les réseaux sociaux et newsletters de Mariable 
        selon les modalités définies dans l'offre souscrite.
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-wedding-black mb-2">Article 4 - Obligations du Prestataire</h3>
      <p className="text-muted-foreground mb-2">Le Prestataire s'engage à :</p>
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
        <li>Fournir des informations exactes et à jour sur son activité</li>
        <li>Disposer d'une assurance RC professionnelle valide</li>
        <li>Autoriser la Plateforme à prélever et utiliser des photos publiques de ses réseaux sociaux 
            (notamment Instagram) pour sublimer la fiche du Prestataire si les photos fournies 
            ne respectent pas la ligne éditoriale de Mariable</li>
      </ul>
    </section>

    <section>
      <h3 className="font-semibold text-wedding-black mb-2">Article 5 - Obligations de la Plateforme</h3>
      <p className="text-muted-foreground mb-2">La Plateforme s'engage à :</p>
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
        <li>Assurer la visibilité du Prestataire auprès de sa communauté de futurs mariés</li>
        <li>Mettre à disposition les outils inclus dans l'offre souscrite</li>
        <li>Transmettre les demandes des couples intéressés selon les modalités convenues</li>
      </ul>
    </section>

    <section>
      <h3 className="font-semibold text-wedding-black mb-2">Article 6 - Durée et Résiliation</h3>
      <p className="text-muted-foreground">
        Le contrat est conclu pour une durée indéterminée. Chaque partie peut y mettre fin 
        avec un préavis de 30 jours.
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-wedding-black mb-2">Article 7 - Confidentialité et Données</h3>
      <p className="text-muted-foreground">
        Les parties s'engagent à respecter la confidentialité des informations échangées 
        et à se conformer au RGPD concernant le traitement des données personnelles.
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-wedding-black mb-2">Article 8 - Droit Applicable</h3>
      <p className="text-muted-foreground">
        Les présentes CGV sont soumises au droit français. Tout litige sera soumis 
        aux tribunaux compétents de Paris.
      </p>
    </section>

    <section className="bg-premium-warm p-4 rounded-lg">
      <h3 className="font-semibold text-wedding-black mb-2">Article 9 - Évolution des Conditions Tarifaires</h3>
      <p className="text-muted-foreground mb-2">
        Les conditions tarifaires de Mariable sont susceptibles d'évoluer.
      </p>
      <p className="text-muted-foreground mb-2">
        Tout changement sera notifié au Prestataire avec un préavis de 30 jours. Le Prestataire 
        sera libre d'accepter les nouvelles conditions ou de résilier le contrat sans pénalité.
      </p>
      <p className="text-muted-foreground">
        Le renouvellement de l'adhésion aux nouvelles conditions vaudra acceptation du nouveau 
        tarif proposé.
      </p>
    </section>
  </div>
);

export default ProfessionalRegistrationForm;