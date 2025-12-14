import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Camera, Users, Save, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface PhotoItem {
  id: string;
  text: string;
  checked: boolean;
}

interface PhotoSection {
  title: string;
  icon: React.ReactNode;
  items: PhotoItem[];
}

const DEFAULT_PHOTO_LIST: PhotoSection[] = [
  {
    title: "Photos de Couple",
    icon: <Camera className="h-5 w-5" />,
    items: [
      { id: 'couple-1', text: "Premier regard (First Look)", checked: false },
      { id: 'couple-2', text: "Sortie de cérémonie", checked: false },
      { id: 'couple-3', text: "Séance couple dans les jardins", checked: false },
      { id: 'couple-4', text: "Coucher de soleil", checked: false },
      { id: 'couple-5', text: "Premier baiser", checked: false },
      { id: 'couple-6', text: "Échange des alliances", checked: false },
      { id: 'couple-7', text: "Photo devant le lieu de réception", checked: false },
      { id: 'couple-8', text: "Photo avec les alliances", checked: false },
    ]
  },
  {
    title: "Photos de Groupe",
    icon: <Users className="h-5 w-5" />,
    items: [
      { id: 'group-1', text: "Famille du marié (parents, frères/sœurs)", checked: false },
      { id: 'group-2', text: "Famille de la mariée (parents, frères/sœurs)", checked: false },
      { id: 'group-3', text: "Les deux familles réunies", checked: false },
      { id: 'group-4', text: "Témoins et demoiselles d'honneur", checked: false },
      { id: 'group-5', text: "Garçons d'honneur", checked: false },
      { id: 'group-6', text: "Photo générale de tous les invités", checked: false },
      { id: 'group-7', text: "Photo fun avec les amis proches", checked: false },
      { id: 'group-8', text: "Photo avec les grands-parents", checked: false },
      { id: 'group-9', text: "Photo avec les enfants d'honneur", checked: false },
      { id: 'group-10', text: "Photo générationnelle (3 générations)", checked: false },
    ]
  }
];

interface PhotoListTemplateProps {
  coordinationId: string;
}

const PhotoListTemplate: React.FC<PhotoListTemplateProps> = ({ coordinationId }) => {
  const { toast } = useToast();
  const [sections, setSections] = useState<PhotoSection[]>(DEFAULT_PHOTO_LIST);
  const [newItemText, setNewItemText] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Charger les données sauvegardées
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
          const savedSections = JSON.parse(data.description);
          setSections(savedSections);
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
      // Vérifier si un document existe déjà
      const { data: existing } = await supabase
        .from('coordination_documents')
        .select('id')
        .eq('coordination_id', coordinationId)
        .eq('category', 'photo_list')
        .maybeSingle();

      const documentData = {
        coordination_id: coordinationId,
        title: 'Liste Photos Jour-J',
        description: JSON.stringify(sections),
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
        title: "Liste sauvegardée",
        description: "Votre liste de photos a été enregistrée"
      });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la liste",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Réinitialiser la liste aux valeurs par défaut ?')) {
      setSections(DEFAULT_PHOTO_LIST);
      setHasChanges(true);
    }
  };

  const toggleItem = (sectionIndex: number, itemId: string) => {
    setSections(prev => prev.map((section, idx) => {
      if (idx !== sectionIndex) return section;
      return {
        ...section,
        items: section.items.map(item => 
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      };
    }));
    setHasChanges(true);
  };

  const addItem = (sectionIndex: number) => {
    const text = newItemText[sectionIndex]?.trim();
    if (!text) return;

    setSections(prev => prev.map((section, idx) => {
      if (idx !== sectionIndex) return section;
      return {
        ...section,
        items: [...section.items, { 
          id: `custom-${Date.now()}`, 
          text, 
          checked: false 
        }]
      };
    }));
    setNewItemText(prev => ({ ...prev, [sectionIndex]: '' }));
    setHasChanges(true);
  };

  const removeItem = (sectionIndex: number, itemId: string) => {
    setSections(prev => prev.map((section, idx) => {
      if (idx !== sectionIndex) return section;
      return {
        ...section,
        items: section.items.filter(item => item.id !== itemId)
      };
    }));
    setHasChanges(true);
  };

  const checkedCount = sections.reduce((acc, section) => 
    acc + section.items.filter(item => item.checked).length, 0
  );
  const totalCount = sections.reduce((acc, section) => acc + section.items.length, 0);

  return (
    <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Camera className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <CardTitle className="text-lg">📸 Liste Photos Jour-J</CardTitle>
              <p className="text-sm text-muted-foreground">
                {checkedCount}/{totalCount} photos cochées
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-gray-600"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Réinitialiser
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="bg-pink-600 hover:bg-pink-700"
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div key={section.title} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              {section.icon}
              <span>{section.title}</span>
              <span className="text-xs text-gray-400">
                ({section.items.filter(i => i.checked).length}/{section.items.length})
              </span>
            </div>
            
            <div className="space-y-2 pl-7">
              {section.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 group">
                  <Checkbox
                    id={item.id}
                    checked={item.checked}
                    onCheckedChange={() => toggleItem(sectionIndex, item.id)}
                  />
                  <label
                    htmlFor={item.id}
                    className={`flex-1 text-sm cursor-pointer ${
                      item.checked ? 'line-through text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {item.text}
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(sectionIndex, item.id)}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {/* Ajouter un nouvel item */}
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Ajouter une photo..."
                  value={newItemText[sectionIndex] || ''}
                  onChange={(e) => setNewItemText(prev => ({ 
                    ...prev, 
                    [sectionIndex]: e.target.value 
                  }))}
                  onKeyPress={(e) => e.key === 'Enter' && addItem(sectionIndex)}
                  className="text-sm h-8"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItem(sectionIndex)}
                  className="h-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PhotoListTemplate;
