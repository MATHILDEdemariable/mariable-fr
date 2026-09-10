import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Camera, Save, RotateCcw, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import PhotoGuestSelector from './PhotoGuestSelector';
import { jsPDF } from 'jspdf';

interface PhotoItem {
  id: string;
  title: string;
  toCapture: boolean;
  guestIds: string[];
  customNames: string[];
}



interface PhotoListTemplateProps {
  coordinationId: string;
}

const PhotoListTemplate: React.FC<PhotoListTemplateProps> = ({ coordinationId }) => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation('monJourM');

  const buildDefaultPhotoList = (): PhotoItem[] => {
    const titles = t('photoList.defaults', { returnObjects: true }) as string[];
    const list = Array.isArray(titles) ? titles : [];
    return list.map((title, index) => ({
      id: `photo-${index + 1}`,
      title,
      toCapture: index < 12,
      guestIds: [],
      customNames: index === 8 ? [t('photoList.allGuests')] : []
    }));
  };

  const [photos, setPhotos] = useState<PhotoItem[]>(buildDefaultPhotoList);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    loadSavedPhotoList();
  }, [coordinationId]);

  const loadSavedPhotoList = async () => {
    try {
      const { data, error } = await supabase
        .from('coordination_documents')
        .select('*')
        .eq('coordination_id', coordinationId)
        .eq('category', 'photo_list')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.description) {
        try {
          const savedPhotos = JSON.parse(data.description);
          // Migration des anciennes données si nécessaire
          if (Array.isArray(savedPhotos) && savedPhotos[0]?.items) {
            // Ancien format avec sections
            const flatPhotos: PhotoItem[] = [];
            savedPhotos.forEach((section: any) => {
              section.items?.forEach((item: any) => {
                flatPhotos.push({
                  id: item.id,
                  title: item.text || item.title,
                  toCapture: item.checked ?? item.toCapture ?? true,
                  guestIds: item.guestIds || [],
                  customNames: item.customNames || []
                });
              });
            });
            setPhotos(flatPhotos);
          } else if (Array.isArray(savedPhotos)) {
            setPhotos(savedPhotos);
          }
        } catch (e) {
          console.error('Erreur parsing photo list:', e);
        }
      }
    } catch (error) {
      console.error('Erreur chargement photo list:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: existing } = await supabase
        .from('coordination_documents')
        .select('id')
        .eq('coordination_id', coordinationId)
        .eq('category', 'photo_list')
        .maybeSingle();

      const documentData = {
        coordination_id: coordinationId,
        title: t('photoList.docTitle'),
        description: JSON.stringify(photos),
        category: 'photo_list',
        file_url: ''
      };

      if (existing) {
        await supabase
          .from('coordination_documents')
          .update(documentData)
          .eq('id', existing.id);
      } else {
        await supabase
          .from('coordination_documents')
          .insert(documentData);
      }

      setHasChanges(false);
      toast({
        title: t('photoList.toast.saved'),
        description: t('photoList.toast.savedDesc')
      });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast({
        title: t('photoList.toast.error'),
        description: t('photoList.toast.errorDesc'),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm(t('photoList.resetConfirm'))) {
      setPhotos(buildDefaultPhotoList());
      setHasChanges(true);
    }
  };

  const toggleCapture = (photoId: string) => {
    setPhotos(prev => prev.map(photo =>
      photo.id === photoId ? { ...photo, toCapture: !photo.toCapture } : photo
    ));
    setHasChanges(true);
  };

  const updatePhotoGuests = (photoId: string, guestIds: string[], customNames: string[]) => {
    setPhotos(prev => prev.map(photo =>
      photo.id === photoId ? { ...photo, guestIds, customNames } : photo
    ));
    setHasChanges(true);
  };

  const addPhoto = () => {
    if (!newPhotoTitle.trim()) return;
    const newPhoto: PhotoItem = {
      id: `photo-custom-${Date.now()}`,
      title: newPhotoTitle.trim(),
      toCapture: true,
      guestIds: [],
      customNames: []
    };
    setPhotos(prev => [...prev, newPhoto]);
    setNewPhotoTitle('');
    setHasChanges(true);
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    setHasChanges(true);
  };

  const startEditing = (photo: PhotoItem) => {
    setEditingId(photo.id);
    setEditingTitle(photo.title);
  };

  const saveEditing = () => {
    if (editingId && editingTitle.trim()) {
      setPhotos(prev => prev.map(photo =>
        photo.id === editingId ? { ...photo, title: editingTitle.trim() } : photo
      ));
      setHasChanges(true);
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Titre
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(t('photoList.docTitle'), pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(t('photoList.pdf.generatedOn', { date: new Date().toLocaleDateString(i18n.language === 'en' ? 'en-GB' : 'fr-FR') }), pageWidth / 2, 28, { align: 'center' });
    
    let yPos = 45;
    const lineHeight = 8;
    const maxY = 280;
    
    // Photos à faire
    const toCapturePhotos = photos.filter(p => p.toCapture);
    if (toCapturePhotos.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(t('photoList.pdf.toDo', { count: toCapturePhotos.length }), 14, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      toCapturePhotos.forEach((photo, index) => {
        if (yPos > maxY) {
          doc.addPage();
          yPos = 20;
        }
        
        const persons = photo.customNames.length > 0 ? photo.customNames.join(', ') : t('photoList.pdf.coupleOnly');
        doc.text(`[ ] ${photo.title}`, 14, yPos);
        doc.setTextColor(100);
        doc.text(`    ${t('photoList.pdf.with')} ${persons}`, 14, yPos + 4);
        doc.setTextColor(0);
        yPos += lineHeight + 4;
      });
    }
    
    // Photos optionnelles
    const skippedPhotos = photos.filter(p => !p.toCapture);
    if (skippedPhotos.length > 0) {
      yPos += 10;
      if (yPos > maxY) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(t('photoList.pdf.optional', { count: skippedPhotos.length }), 14, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128);
      
      skippedPhotos.forEach((photo) => {
        if (yPos > maxY) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${t('photoList.pdf.optionalTag')} ${photo.title}`, 14, yPos);
        yPos += lineHeight;
      });
    }
    
    doc.save(t('photoList.pdf.fileName'));
    
    toast({
      title: t('photoList.toast.exported'),
      description: t('photoList.toast.exportedDesc')
    });
  };

  const toCaptureCount = photos.filter(p => p.toCapture).length;

  return (
    <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Camera className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('photoList.title')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('photoList.count', { done: toCaptureCount, total: photos.length })}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="text-gray-600"
            >
              <Download className="h-4 w-4 mr-1" />
              {t('photoList.exportPdf')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-gray-600"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {t('photoList.reset')}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="bg-pink-600 hover:bg-pink-700"
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? t('photoList.saving') : t('photoList.save')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Tableau des photos */}
        <div className="border rounded-lg overflow-hidden">
          {/* En-tête */}
          <div className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 p-3 bg-gray-50 border-b text-xs font-medium text-gray-600">
            <div className="text-center">{t('photoList.colToDo')}</div>
            <div>{t('photoList.colPhoto')}</div>
            <div>{t('photoList.colPeople')}</div>
            <div></div>
          </div>

          {/* Lignes */}
          <div className="divide-y">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`grid grid-cols-[40px_1fr_1fr_40px] gap-2 p-3 items-center hover:bg-gray-50 transition-colors ${
                  !photo.toCapture ? 'bg-gray-50/50 opacity-60' : ''
                }`}
              >
                {/* Checkbox */}
                <div className="flex justify-center">
                  <Checkbox
                    checked={photo.toCapture}
                    onCheckedChange={() => toggleCapture(photo.id)}
                  />
                </div>

                {/* Titre éditable */}
                <div>
                  {editingId === photo.id ? (
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={saveEditing}
                      onKeyPress={(e) => e.key === 'Enter' && saveEditing()}
                      autoFocus
                      className="h-8 text-sm"
                    />
                  ) : (
                    <span
                      className={`text-sm cursor-pointer hover:text-pink-600 ${
                        !photo.toCapture ? 'line-through text-gray-400' : ''
                      }`}
                      onClick={() => startEditing(photo)}
                    >
                      {photo.title}
                    </span>
                  )}
                </div>

                {/* Sélecteur de personnes */}
                <div>
                  <PhotoGuestSelector
                    selectedGuestIds={photo.guestIds}
                    customNames={photo.customNames}
                    onGuestsChange={(guestIds, customNames) =>
                      updatePhotoGuests(photo.id, guestIds, customNames)
                    }
                  />
                </div>

                {/* Supprimer */}
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePhoto(photo.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Ajouter une photo */}
          <div className="p-3 bg-gray-50 border-t">
            <div className="flex gap-2">
              <Input
                placeholder={t('photoList.addPlaceholder')}
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPhoto()}
                className="text-sm"
              />
              <Button onClick={addPhoto} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                {t('photoList.add')}
              </Button>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          {t('photoList.hint')}
        </p>
      </CardContent>
    </Card>
  );
};

export default PhotoListTemplate;
