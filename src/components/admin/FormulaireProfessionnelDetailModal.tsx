
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Image, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type FormulaireProfessionnel = Database['public']['Tables']['prestataires']['Row'];

interface FormulaireProfessionnelDetailModalProps {
  formulaire: FormulaireProfessionnel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AttachedFile {
  id: string;
  url: string;
  filename: string;
  type: string;
  size: number;
}

const FormulaireProfessionnelDetailModal: React.FC<FormulaireProfessionnelDetailModalProps> = ({
  formulaire,
  open,
  onOpenChange,
}) => {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (formulaire && open) {
      fetchAttachedFiles();
    }
  }, [formulaire, open]);

  const fetchAttachedFiles = async () => {
    if (!formulaire) return;
    
    setLoadingFiles(true);
    try {
      // Fetch brochures
      const { data: brochures, error: brochuresError } = await supabase
        .from('prestataires_brochures')
        .select('*')
        .eq('prestataire_id', formulaire.id);

      // Fetch photos
      const { data: photos, error: photosError } = await supabase
        .from('prestataires_photos')
        .select('*')
        .eq('prestataire_id', formulaire.id);

      if (brochuresError) console.error('Erreur lors du chargement des brochures:', brochuresError);
      if (photosError) console.error('Erreur lors du chargement des photos:', photosError);

      const allFiles: AttachedFile[] = [
        ...(brochures || []).map(file => ({
          id: file.id,
          url: file.url,
          filename: file.filename || 'Document',
          type: file.type || 'application/pdf',
          size: file.size || 0
        })),
        ...(photos || []).map(file => ({
          id: file.id,
          url: file.url,
          filename: file.filename || 'Image',
          type: file.type || 'image/jpeg',
          size: file.size || 0
        }))
      ];

      setAttachedFiles(allFiles);
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers:', error);
      toast.error('Erreur lors du chargement des fichiers');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleDownload = async (file: AttachedFile) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Fichier téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!formulaire) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Détails du formulaire professionnel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informations de base</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nom/Entreprise</label>
                <p className="text-base">{formulaire.nom}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Catégorie</label>
                <p className="text-base">
                  <Badge variant="outline">{formulaire.categorie}</Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Région</label>
                <p className="text-base">{formulaire.region}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ville</label>
                <p className="text-base">{formulaire.ville || 'Non spécifiée'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-base">{formulaire.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Téléphone</label>
                <p className="text-base">{formulaire.telephone || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Site web</label>
                <p className="text-base">
                  {formulaire.site_web ? (
                    <a href={formulaire.site_web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                      {formulaire.site_web}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  ) : 'Non renseigné'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date de soumission</label>
                <p className="text-base">{formatDate(formulaire.created_at)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Business Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informations légales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">SIRET</label>
                <p className="text-base">{formulaire.siret || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Assurance</label>
                <p className="text-base">{formulaire.assurance_nom || 'Non renseignée'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Prix minimum</label>
                <p className="text-base">
                  {formulaire.prix_minimum ? `${formulaire.prix_minimum}€` : 'Non renseigné'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Service Details */}
          {formulaire.description && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Description des services</h3>
                <p className="text-base whitespace-pre-wrap">{formulaire.description}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Responsable Information */}
          {(formulaire.responsable_nom || formulaire.responsable_bio) && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Responsable</h3>
                <div className="space-y-2">
                  {formulaire.responsable_nom && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nom du responsable</label>
                      <p className="text-base">{formulaire.responsable_nom}</p>
                    </div>
                  )}
                  {formulaire.responsable_bio && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bio du responsable</label>
                      <p className="text-base whitespace-pre-wrap">{formulaire.responsable_bio}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Attached Files */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Documents et images</h3>
            {loadingFiles ? (
              <p>Chargement des fichiers...</p>
            ) : attachedFiles.length === 0 ? (
              <p className="text-gray-500">Aucun fichier attaché</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {attachedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {file.type.startsWith('image/') ? (
                        <Image className="h-5 w-5 text-blue-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{file.filename}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CGV Agreement Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Accords</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm">CGV acceptées:</span>
                <Badge variant={formulaire.accord_cgv ? "default" : "destructive"}>
                  {formulaire.accord_cgv ? "Oui" : "Non"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Référencement accepté:</span>
                <Badge variant={formulaire.accord_referencement ? "default" : "destructive"}>
                  {formulaire.accord_referencement ? "Oui" : "Non"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormulaireProfessionnelDetailModal;
