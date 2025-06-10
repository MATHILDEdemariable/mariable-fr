
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { X, Upload, FileText } from 'lucide-react';

interface BrochureUploadProps {
  prestataireId: string;
  brochures: Array<{
    id: string;
    url: string;
    filename?: string;
    type?: string;
  }>;
  onBrochuresUpdate: () => void;
}

const BrochureUpload: React.FC<BrochureUploadProps> = ({ 
  prestataireId, 
  brochures, 
  onBrochuresUpdate 
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `brochures/${prestataireId}/${Date.now()}.${fileExt}`;
        
        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('prestataires-documents')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('prestataires-documents')
          .getPublicUrl(fileName);

        // Save brochure info to database
        const { error: dbError } = await supabase
          .from('prestataires_brochures_preprod')
          .insert({
            prestataire_id: prestataireId,
            url: publicUrl,
            filename: file.name,
            size: file.size,
            type: file.type
          });

        if (dbError) {
          console.error('Database error:', dbError);
          toast({
            title: "Erreur",
            description: "Erreur lors de l'enregistrement du document",
            variant: "destructive"
          });
        }
      }
      
      toast({
        title: "Succès",
        description: "Documents uploadés avec succès"
      });
      
      onBrochuresUpdate();
    } catch (error) {
      console.error('Error uploading brochures:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload des documents",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBrochure = async (brochureId: string) => {
    try {
      const { error } = await supabase
        .from('prestataires_brochures_preprod')
        .delete()
        .eq('id', brochureId);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Document supprimé avec succès"
      });
      
      onBrochuresUpdate();
    } catch (error) {
      console.error('Error deleting brochure:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="brochure-upload">Ajouter des brochures/documents</Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            id="brochure-upload"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <Button disabled={uploading} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Upload...' : 'Upload'}
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Formats acceptés: PDF, DOC, DOCX, JPG, PNG
        </p>
      </div>

      <div className="space-y-2">
        {brochures.map((brochure) => (
          <div key={brochure.id} className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">{brochure.filename || 'Document'}</p>
                <p className="text-sm text-gray-500">{brochure.type}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(brochure.url, '_blank')}
              >
                Voir
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteBrochure(brochure.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrochureUpload;
