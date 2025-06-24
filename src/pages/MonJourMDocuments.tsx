
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Download, Trash2, Upload } from 'lucide-react';
import { useCoordination } from '@/hooks/useCoordination';

const MonJourMDocuments = () => {
  const { documents } = useCoordination();
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = [
    { value: 'general', label: 'Général' },
    { value: 'contracts', label: 'Contrats' },
    { value: 'planning', label: 'Planning' },
    { value: 'photos', label: 'Photos' },
    { value: 'music', label: 'Musique' },
    { value: 'other', label: 'Autre' }
  ];

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const sizes = ['o', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string | null) => {
    // Retourne une icône basée sur le type de fichier
    return FileText;
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Documents du Jour-M</h2>
          <p className="text-sm text-gray-600">
            {documents.length} document{documents.length > 1 ? 's' : ''} partagé{documents.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un document
        </Button>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Titre du document" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Glissez-déposez vos fichiers ici ou <Button variant="link" className="p-0 h-auto">parcourez</Button>
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
              <Button>
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des documents */}
      <div className="space-y-3">
        {documents.map((doc) => {
          const IconComponent = getFileIcon(doc.file_type);
          return (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-wedding-olive" />
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{categories.find(c => c.value === doc.category)?.label}</span>
                        {doc.file_size && <span>{formatFileSize(doc.file_size)}</span>}
                        <span>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun document partagé</p>
          <p className="text-sm">Ajoutez des documents importants pour votre équipe</p>
        </div>
      )}
    </div>
  );
};

export default MonJourMDocuments;
