import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Check, X, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PhotoItem {
  id: string;
  title: string;
  toCapture: boolean;
  guestIds: string[];
  customNames: string[];
}

interface Guest {
  id: string;
  guest_first_name: string;
  guest_last_name: string;
}

interface PhotoListReadOnlyProps {
  coordinationId: string;
}

const PhotoListReadOnly: React.FC<PhotoListReadOnlyProps> = ({ coordinationId }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [coordinationId]);

  const loadData = async () => {
    try {
      // Charger la liste de photos
      const { data: docData, error: docError } = await supabase
        .from('coordination_documents')
        .select('description')
        .eq('coordination_id', coordinationId)
        .eq('category', 'photo_list')
        .maybeSingle();

      if (docError && docError.code !== 'PGRST116') throw docError;

      if (docData?.description) {
        try {
          const parsed = JSON.parse(docData.description);
          // Gérer les deux formats (ancien avec sections, nouveau plat)
          if (Array.isArray(parsed) && parsed[0]?.items) {
            const flatPhotos: PhotoItem[] = [];
            parsed.forEach((section: any) => {
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
          } else if (Array.isArray(parsed)) {
            setPhotos(parsed);
          }
        } catch (e) {
          console.error('Erreur parsing photo list:', e);
        }
      }

      // Charger les infos des invités pour les noms
      const { data: coordination } = await supabase
        .from('wedding_coordination')
        .select('user_id')
        .eq('id', coordinationId)
        .single();

      if (coordination?.user_id) {
        const { data: guestsData } = await supabase
          .from('wedding_guest_list')
          .select('id, guest_first_name, guest_last_name')
          .eq('user_id', coordination.user_id);

        setGuests(guestsData || []);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGuestName = (guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    return guest ? `${guest.guest_first_name} ${guest.guest_last_name}` : '';
  };

  const getPersonsList = (photo: PhotoItem): string => {
    const names: string[] = [];
    
    // Ajouter les noms depuis la liste d'invités
    photo.guestIds.forEach(id => {
      const name = getGuestName(id);
      if (name) names.push(name);
    });
    
    // Ajouter les noms personnalisés
    names.push(...photo.customNames);
    
    return names.length > 0 ? names.join(', ') : 'Couple seul';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Chargement...
        </CardContent>
      </Card>
    );
  }

  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucune liste de photos configurée</p>
        </CardContent>
      </Card>
    );
  }

  const photosToCapture = photos.filter(p => p.toCapture);
  const photosSkipped = photos.filter(p => !p.toCapture);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-pink-500" />
          Liste des Photos ({photosToCapture.length} prévues)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Photos à réaliser le jour J avec les personnes concernées
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photos à faire */}
        <div className="space-y-2">
          {photosToCapture.map((photo) => (
            <div
              key={photo.id}
              className="p-3 border rounded-lg bg-white"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{photo.title}</h4>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                    <Users className="h-3 w-3" />
                    <span>{getPersonsList(photo)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Photos non prévues */}
        {photosSkipped.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-gray-500 mb-2">
              Photos optionnelles / non prévues ({photosSkipped.length})
            </p>
            <div className="space-y-1">
              {photosSkipped.map((photo) => (
                <div
                  key={photo.id}
                  className="flex items-center gap-2 p-2 text-gray-400 text-sm"
                >
                  <X className="h-4 w-4" />
                  <span className="line-through">{photo.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoListReadOnly;
