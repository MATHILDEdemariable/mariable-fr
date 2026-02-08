import React, { useState } from 'react';
import { Upload, FileText, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useQuery } from '@tanstack/react-query';
import PremiumModal from '@/components/premium/PremiumModal';

interface DocumentUploaderProps {
  onUploadComplete: () => void;
  documentCount?: number;
}

const MAX_FREE_DOCUMENTS = 2;

const DOCUMENT_TYPES = [
  { value: 'devis', label: '📋 Devis' },
  { value: 'contrat', label: '📄 Contrat' },
  { value: 'facture', label: '💰 Facture' },
  { value: 'autre', label: '📎 Autre' }
];

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadComplete, documentCount = 0 }) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('devis');
  const [vendorName, setVendorName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { toast } = useToast();
  const { profile } = useUserProfile();

  const isPremium = profile?.subscription_type === 'premium';
  const isLimitReached = !isPremium && documentCount >= MAX_FREE_DOCUMENTS;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale est de 20MB",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Aucun fichier sélectionné",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la limite pour les utilisateurs free
    if (isLimitReached) {
      setShowPremiumModal(true);
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('wedding-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('wedding-documents')
        .getPublicUrl(fileName);

      const { data: docData, error: insertError } = await supabase
        .from('wedding_documents')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: fileName,
          file_url: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          document_type: documentType,
          vendor_name: vendorName || null,
          category: category || null,
          is_analyzed: false
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Document uploadé",
        description: "Votre document a été ajouté avec succès"
      });

      if (isPremium && documentType === 'devis') {
        setIsAnalyzing(true);
        await analyzeDocument(docData.id, publicUrl);
      }

      setFile(null);
      setVendorName('');
      setCategory('');
      onUploadComplete();

    } catch (error) {
      console.error("Erreur upload:", error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader le document",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const analyzeDocument = async (documentId: string, fileUrl: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { documentId, fileUrl, documentType }
      });

      if (error) throw error;

      toast({
        title: "✨ Analyse IA terminée",
        description: "Le résumé de votre document est disponible"
      });

    } catch (error) {
      console.error("Erreur analyse IA:", error);
      toast({
        title: "Analyse IA non disponible",
        description: "Le document a été uploadé mais l'analyse a échoué",
        variant: "destructive"
      });
    }
  };

  return (
    <>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4">
      <div className="text-center">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="font-medium mb-2">Uploader un document</h3>
        <div className="text-sm text-muted-foreground mb-4 space-y-2">
          {isPremium ? (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
              ✨ Analyse IA Premium activée
            </span>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-gray-500">
                {documentCount}/{MAX_FREE_DOCUMENTS} documents
              </span>
              {isLimitReached && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                  <Lock className="w-3 h-3" />
                  Limite atteinte
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Type de document</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Nom du prestataire (optionnel)</Label>
          <Input 
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="Ex: Château de Versailles"
          />
        </div>

        <div>
          <Label>Catégorie (optionnel)</Label>
          <Input 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Lieu de réception"
          />
        </div>

        <div>
          <Label>Fichier (PDF, Word, Excel, Image - max 20MB)</Label>
          <Input 
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      <Button 
        onClick={handleUpload}
        disabled={!file || isUploading || isAnalyzing}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Upload en cours...
          </>
        ) : isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyse IA en cours...
          </>
        ) : isLimitReached ? (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Passer au Premium
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Uploader
          </>
        )}
      </Button>
    </div>

    <PremiumModal
      isOpen={showPremiumModal}
      onClose={() => setShowPremiumModal(false)}
      feature="Stockage illimité de documents"
      description="Passez au Premium pour stocker tous vos documents de mariage sans limite."
    />
    </>
  );
};

export default DocumentUploader;
