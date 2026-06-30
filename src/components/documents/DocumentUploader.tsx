import React, { useState } from 'react';
import { Upload, FileText, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTranslation } from 'react-i18next';
import PremiumModal from '@/components/premium/PremiumModal';

interface DocumentUploaderProps {
  onUploadComplete: () => void;
  documentCount?: number;
}

const MAX_FREE_DOCUMENTS = 2;

const DOCUMENT_TYPE_KEYS = ['devis', 'contrat', 'facture', 'autre'] as const;

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadComplete, documentCount = 0 }) => {
  const { t } = useTranslation('weddingDay');
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('devis');
  const [vendorName, setVendorName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const isAnalyzing = false;
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
          title: t('documentUploader.tooLargeTitle'),
          description: t('documentUploader.tooLargeDesc'),
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
        title: t('documentUploader.noFile'),
        variant: "destructive"
      });
      return;
    }

    if (isLimitReached) {
      setShowPremiumModal(true);
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
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
          category: category || null
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: t('documentUploader.uploadedTitle'),
        description: t('documentUploader.uploadedDesc')
      });


      setFile(null);
      setVendorName('');
      setCategory('');
      onUploadComplete();

    } catch (error) {
      console.error("Erreur upload:", error);
      toast({
        title: t('documentUploader.uploadErrorTitle'),
        description: t('documentUploader.uploadErrorDesc'),
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4">
      <div className="text-center">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="font-medium mb-2">{t('documentUploader.title')}</h3>
        <div className="text-sm text-muted-foreground mb-4 space-y-2">
          {isPremium ? (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
              {t('documentUploader.premiumBadge')}
            </span>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-gray-500">
                {t('documentUploader.documentsCount', { used: documentCount, max: MAX_FREE_DOCUMENTS })}
              </span>
              {isLimitReached && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                  <Lock className="w-3 h-3" />
                  {t('documentUploader.limitReached')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label>{t('documentUploader.typeLabel')}</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPE_KEYS.map(key => (
                <SelectItem key={key} value={key}>
                  {t(`documentUploader.types.${key}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('documentUploader.vendorLabel')}</Label>
          <Input 
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder={t('documentUploader.vendorPlaceholder')}
          />
        </div>

        <div>
          <Label>{t('documentUploader.categoryLabel')}</Label>
          <Input 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={t('documentUploader.categoryPlaceholder')}
          />
        </div>

        <div>
          <Label>{t('documentUploader.fileLabel')}</Label>
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
            {t('documentUploader.uploading')}
          </>
        ) : isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t('documentUploader.analyzing')}
          </>
        ) : isLimitReached ? (
          <>
            <Lock className="h-4 w-4 mr-2" />
            {t('documentUploader.upgrade')}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {t('documentUploader.upload')}
          </>
        )}
      </Button>
    </div>

    <PremiumModal
      isOpen={showPremiumModal}
      onClose={() => setShowPremiumModal(false)}
      feature={t('documentUploader.premiumFeature')}
      description={t('documentUploader.premiumDesc')}
    />
    </>
  );
};

export default DocumentUploader;
