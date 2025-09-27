import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from "react-helmet-async";

const EnvoiDevis = () => {
  const [formData, setFormData] = useState({
    nom_professionnel: '',
    email_professionnel: '',
    email_client: '',
    message: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Format de fichier invalide",
          description: "Seuls les fichiers PDF sont acceptés."
        });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
        toast({
          variant: "destructive", 
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 10MB."
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const validateForm = () => {
    const { nom_professionnel, email_professionnel, email_client } = formData;
    
    if (!nom_professionnel.trim()) {
      toast({
        variant: "destructive",
        title: "Nom requis",
        description: "Veuillez saisir votre nom."
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_professionnel)) {
      toast({
        variant: "destructive",
        title: "Email professionnel invalide",
        description: "Veuillez saisir un email valide."
      });
      return false;
    }

    if (!emailRegex.test(email_client)) {
      toast({
        variant: "destructive",
        title: "Email client invalide", 
        description: "Veuillez saisir un email client valide."
      });
      return false;
    }

    if (!file) {
      toast({
        variant: "destructive",
        title: "Fichier requis",
        description: "Veuillez sélectionner un fichier PDF."
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsUploading(true);

    try {
      // Upload du fichier vers Supabase Storage
      const fileExt = 'pdf';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `devis/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('devis-pdf')
        .upload(filePath, file!);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique du fichier
      const { data: { publicUrl } } = supabase.storage
        .from('devis-pdf')
        .getPublicUrl(filePath);

      // Insérer les données dans la base
      const { error: insertError } = await supabase
        .from('devis_professionnels')
        .insert({
          nom_professionnel: formData.nom_professionnel.trim(),
          email_professionnel: formData.email_professionnel.trim(),
          email_client: formData.email_client.trim(),
          message: formData.message.trim() || null,
          fichier_url: publicUrl,
          fichier_nom: file!.name,
          fichier_taille: file!.size,
          statut: 'nouveau'
        });

      if (insertError) throw insertError;

      setIsSuccess(true);
      toast({
        title: "Devis envoyé avec succès",
        description: "Votre devis a été transmis et sera traité prochainement."
      });

    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        variant: "destructive",
        title: "Erreur lors de l'envoi",
        description: "Une erreur s'est produite. Veuillez réessayer."
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Helmet>
          <title>Devis envoyé avec succès - Mariable</title>
          <meta name="description" content="Votre devis a été envoyé avec succès et sera traité prochainement." />
        </Helmet>
        
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Devis envoyé !</h2>
            <p className="text-muted-foreground mb-6">
              Votre devis a été transmis avec succès. Il sera traité prochainement.
            </p>
            <Button onClick={() => setIsSuccess(false)}>
              Envoyer un autre devis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Helmet>
        <title>Envoi de devis - Mariable</title>
        <meta name="description" content="Envoyez vos devis PDF facilement à vos clients via notre plateforme sécurisée." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Envoi de devis professionnel</h1>
            <p className="text-lg text-muted-foreground">
              Transmettez vos devis PDF de manière sécurisée
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informations du devis
              </CardTitle>
              <CardDescription>
                Remplissez les informations ci-dessous et joignez votre devis au format PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom_professionnel">Votre nom *</Label>
                    <Input
                      id="nom_professionnel"
                      name="nom_professionnel"
                      value={formData.nom_professionnel}
                      onChange={handleInputChange}
                      placeholder="Nom complet"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email_professionnel">Votre email *</Label>
                    <Input
                      id="email_professionnel"
                      name="email_professionnel"
                      type="email"
                      value={formData.email_professionnel}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email_client">Email du client *</Label>
                  <Input
                    id="email_client"
                    name="email_client"
                    type="email"
                    value={formData.email_client}
                    onChange={handleInputChange}
                    placeholder="client@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message (optionnel)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Message d'accompagnement pour votre client..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="file">Fichier PDF du devis *</Label>
                  <div className="mt-2">
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="flex text-sm text-muted-foreground">
                          <label
                            htmlFor="file"
                            className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                          >
                            <span>Choisir un fichier</span>
                            <input
                              id="file"
                              type="file"
                              className="sr-only"
                              accept=".pdf"
                              onChange={handleFileChange}
                              required
                            />
                          </label>
                          <p className="pl-1">ou glisser-déposer</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          PDF uniquement, max 10MB
                        </p>
                        {file && (
                          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            {file.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Envoyer le devis
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnvoiDevis;