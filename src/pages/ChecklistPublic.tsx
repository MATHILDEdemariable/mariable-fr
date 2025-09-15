import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Calendar, CheckCircle2, Circle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  completed: boolean;
  due_date?: string;
  position: number;
}

const CATEGORIES = [
  { key: 'invites', label: 'Invités', color: 'from-blue-100 to-blue-50', borderColor: 'border-blue-200', badgeColor: 'bg-blue-100 text-blue-800' },
  { key: 'budget', label: 'Budget', color: 'from-green-100 to-green-50', borderColor: 'border-green-200', badgeColor: 'bg-green-100 text-green-800' },
  { key: 'lieu', label: 'Lieu', color: 'from-purple-100 to-purple-50', borderColor: 'border-purple-200', badgeColor: 'bg-purple-100 text-purple-800' },
  { key: 'traiteur', label: 'Traiteur', color: 'from-orange-100 to-orange-50', borderColor: 'border-orange-200', badgeColor: 'bg-orange-100 text-orange-800' },
  { key: 'image', label: 'Image', color: 'from-pink-100 to-pink-50', borderColor: 'border-pink-200', badgeColor: 'bg-pink-100 text-pink-800' },
  { key: 'decorations', label: 'Décorations', color: 'from-indigo-100 to-indigo-50', borderColor: 'border-indigo-200', badgeColor: 'bg-indigo-100 text-indigo-800' },
  { key: 'jour-j', label: 'Jour-J', color: 'from-red-100 to-red-50', borderColor: 'border-red-200', badgeColor: 'bg-red-100 text-red-800' },
  { key: 'tenues', label: 'Tenues', color: 'from-yellow-100 to-yellow-50', borderColor: 'border-yellow-200', badgeColor: 'bg-yellow-100 text-yellow-800' },
  { key: 'beaute', label: 'Mise en beauté', color: 'from-cyan-100 to-cyan-50', borderColor: 'border-cyan-200', badgeColor: 'bg-cyan-100 text-cyan-800' },
  { key: 'autres', label: 'Autres', color: 'from-gray-100 to-gray-50', borderColor: 'border-gray-200', badgeColor: 'bg-gray-100 text-gray-800' },
];

const ChecklistPublic: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('ID utilisateur manquant dans l\'URL');
      setIsLoading(false);
      return;
    }
    loadItems();
  }, [userId]);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('checklist_mariage_manuel')
        .select('*')
        .eq('user_id', userId)
        .order('position');

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error('Impossible de charger la checklist');
      }

      if (!data || data.length === 0) {
        setError('Aucune checklist trouvée pour cet utilisateur');
        return;
      }

      setItems(data);
    } catch (error) {
      console.error('Error loading checklist:', error);
      setError('Erreur lors du chargement de la checklist');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressByCategory = (category: string) => {
    const categoryItems = items.filter(item => item.category === category);
    if (categoryItems.length === 0) return 0;
    const completed = categoryItems.filter(item => item.completed).length;
    return Math.round((completed / categoryItems.length) * 100);
  };

  const getOverallProgress = () => {
    if (items.length === 0) return 0;
    const completed = items.filter(item => item.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  const getCategoryData = (categoryKey: string) => {
    return CATEGORIES.find(cat => cat.key === categoryKey) || CATEGORIES[9];
  };

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Chargement de la checklist | Mariable</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Checklist non trouvée | Mariable</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Checklist non accessible</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checklist de mariage partagée | Mariable</title>
        <meta name="description" content="Consultez cette checklist de mariage partagée" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* En-tête */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
            <div className="text-center">
              <h1 className="text-xl md:text-3xl font-serif text-gray-800 mb-2">
                Checklist de mariage
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Consultation publique par Mariable
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-6 max-w-6xl">
          {/* Progression globale */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Progression globale</h3>
                <span className="text-sm text-muted-foreground">
                  {items.filter(item => item.completed).length} / {items.length} tâches
                </span>
              </div>
              <Progress value={getOverallProgress()} className="h-3" />
              <div className="text-center mt-2 text-sm text-muted-foreground">
                {getOverallProgress()}% complété
              </div>
            </CardContent>
          </Card>

          {/* Interface Post-it - Grille des catégories */}
          <h2 className="text-xl font-semibold mb-6">Checklist personnalisée</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => {
              const categoryItems = items.filter(item => item.category === category.key);
              const categoryData = getCategoryData(category.key);
              const completedCount = categoryItems.filter(item => item.completed).length;
              const progress = categoryItems.length > 0 ? Math.round((completedCount / categoryItems.length) * 100) : 0;

              return (
                <Card 
                  key={category.key} 
                  className={`relative overflow-hidden bg-gradient-to-br ${categoryData.color} ${categoryData.borderColor} border-2`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-gray-800">
                        {category.label}
                      </CardTitle>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs px-2 py-0.5 ${categoryData.badgeColor} border-0`}>
                        {completedCount} / {categoryItems.length}
                      </Badge>
                      {categoryItems.length > 0 && (
                        <div className="flex-1">
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-2 max-h-40 overflow-y-auto">
                    {categoryItems.length === 0 ? (
                      <p className="text-xs text-gray-500 italic text-center py-4">
                        Aucune tâche
                      </p>
                    ) : (
                      categoryItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-2 p-2 bg-white/40 rounded-md">
                          <div className="mt-0.5 text-gray-600">
                            {item.completed ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <Circle className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                              {item.title}
                            </p>
                            {item.due_date && (
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar className="w-2 h-2 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {new Date(item.due_date).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer avec lien vers Mariable */}
          <div className="text-center mt-8 p-4 bg-white rounded-lg border">
            <p className="text-sm text-gray-600 mb-2">
              Cette checklist a été créée avec
            </p>
            <Button 
              onClick={() => window.open('https://mariable.fr', '_blank')}
              variant="outline"
              size="sm"
            >
              ✨ Mariable - Organisez votre mariage
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChecklistPublic;