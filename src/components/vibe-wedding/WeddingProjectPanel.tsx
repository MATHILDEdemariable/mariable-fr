import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import VendorCardInProject from './VendorCardInProject';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { 
  Calendar, 
  MapPin, 
  Users, 
  AlertCircle, 
  CheckCircle2,
  Euro,
  Save,
  ChevronDown,
  ChevronUp,
  Lock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWeddingProject } from '@/contexts/WeddingProjectContext';
import { useToast } from '@/hooks/use-toast';

const WeddingProjectPanel: React.FC = () => {
  const { project } = useWeddingProject();
  const { toast } = useToast();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour sauvegarder votre projet",
        variant: "destructive",
      });
      return;
    }

    if (!project?.weddingData) {
      toast({
        title: "Projet incomplet",
        description: "Continuez la conversation pour enrichir votre projet avant de le sauvegarder",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('generated_planning')
        .upsert({
          user_id: user.id,
          form_responses: project.weddingData,
          planning_blocks: {
            timeline: project.timeline || [],
            budgetBreakdown: project.budgetBreakdown || [],
            vendors: project.vendors || []
          }
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "✅ Projet sauvegardé",
        description: "Votre projet de mariage a été enregistré dans votre dashboard",
      });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le projet. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace(/\s/g, ' ');
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString || dateString.trim() === "") return "À définir";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "À définir";
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Calendar className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!project) {
    return (
      <motion.aside 
        className="w-full md:w-[450px] border-l border-border bg-card overflow-hidden flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Commencez une conversation pour créer votre projet</p>
        </div>
      </motion.aside>
    );
  }

  const totalBudget = project.weddingData?.budget || 
    project.budgetBreakdown?.reduce((sum, item) => sum + (item.estimatedCost || 0), 0) || 
    0;

  const COLORS = ['hsl(var(--wedding-olive))', '#A8B89F', '#C4D3BB', '#E0E8D7', '#F4F7F2', '#D4C5B9'];

  const chartData = project.budgetBreakdown?.map((item, index) => ({
    name: item.category,
    value: item.estimatedCost || 0,
    color: COLORS[index % COLORS.length]
  })) || [];

  const timelineByCategory = project.timeline?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, any[]>) || {};

  return (
    <motion.aside 
      className="w-full md:w-[450px] border-l border-border bg-card overflow-hidden flex flex-col"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header fixe avec CTA */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-wedding-olive/10 to-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-wedding-olive">Projet Mariage</h2>
          <Button 
            size="sm" 
            className="bg-wedding-olive hover:bg-wedding-olive/90"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>

        {/* KPI Header */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
            <div className="p-1.5 bg-wedding-olive/10 rounded-full">
              <Users className="w-4 h-4 text-wedding-olive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Invités</p>
              <p className="text-sm font-bold">{project.weddingData?.guests || "À définir"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
            <div className="p-1.5 bg-wedding-olive/10 rounded-full">
              <Euro className="w-4 h-4 text-wedding-olive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-sm font-bold">{formatPrice(totalBudget)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
            <div className="p-1.5 bg-wedding-olive/10 rounded-full">
              <MapPin className="w-4 h-4 text-wedding-olive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Lieu</p>
              <p className="text-sm font-bold truncate">{project.weddingData?.location || "À définir"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
            <div className="p-1.5 bg-wedding-olive/10 rounded-full">
              <Calendar className="w-4 h-4 text-wedding-olive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-bold">{formatDate(project.weddingData?.date)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs avec contenu scrollable */}
      <Tabs defaultValue="budget" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="retroplanning">Planning</TabsTrigger>
          <TabsTrigger value="prestataires">Prestataires</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* TAB 1: Budget */}
          <TabsContent value="budget" className="space-y-4 mt-4">
            {chartData.length > 0 ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Répartition du budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: number) => formatPrice(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Détail par poste</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {project.budgetBreakdown?.map((item, idx) => {
                      const percentage = totalBudget > 0 ? Math.round((item.estimatedCost / totalBudget) * 100) : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.category}</span>
                            <span className="text-muted-foreground">{formatPrice(item.estimatedCost)}</span>
                          </div>
                          <Progress 
                            value={percentage} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{percentage}% du budget</span>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">
                  Parlez de votre budget pour voir la répartition détaillée
                </p>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: Planning */}
          <TabsContent value="retroplanning" className="space-y-3 mt-4">
            <div className="relative">
              {!isAuthenticated && project.timeline && project.timeline.length > 0 && (
                <div className="absolute inset-0 backdrop-blur-md bg-white/60 dark:bg-gray-900/60 flex items-center justify-center z-10 rounded-lg">
                  <Card className="max-w-md mx-4 shadow-2xl">
                    <CardContent className="p-8 text-center space-y-4">
                      <Lock className="w-12 h-12 mx-auto text-wedding-olive" />
                      <h3 className="text-2xl font-bold">Accédez au rétroplanning détaillé</h3>
                      <p className="text-muted-foreground">
                        Créez votre compte gratuit pour débloquer le rétroplanning complet et toutes les fonctionnalités
                      </p>
                      <Button 
                        onClick={() => window.location.href = '/auth'}
                        className="bg-wedding-olive hover:bg-wedding-olive/90 text-white w-full"
                        size="lg"
                      >
                        Créer mon compte gratuit
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
              {Object.keys(timelineByCategory).length > 0 ? (
                Object.entries(timelineByCategory).map(([category, tasks]) => (
                  <Card key={category}>
                    <CardHeader 
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold">{category}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{tasks.length}</Badge>
                          {expandedCategories[category] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {expandedCategories[category] && (
                      <CardContent className="space-y-2 pt-0">
                        {tasks.map((item: any, idx) => (
                          <div 
                            key={idx}
                            className="flex items-start gap-2 p-2 rounded-md hover:bg-accent/30 transition-colors"
                          >
                            {getPriorityIcon(item.priority)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-tight">{item.task}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{item.dueDate}</p>
                            </div>
                            <Badge className={`text-xs ${getPriorityBadge(item.priority)}`}>
                              {item.priority === 'high' ? 'Urgent' : item.priority === 'medium' ? 'Moyen' : 'Faible'}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">
                    Continuez la conversation pour générer votre planning
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB PRESTATAIRES */}
          <TabsContent value="prestataires" className="space-y-3 mt-4">
            {project.vendors && project.vendors.length > 0 ? (
              <>
                <div className="space-y-2">
                  {project.vendors.map((vendor: any) => (
                    <VendorCardInProject key={vendor.id || vendor.nom} vendor={vendor} />
                  ))}
                </div>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full mt-4"
                >
                  <Link to="/selection">
                    🔍 Voir la sélection entière
                  </Link>
                </Button>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground mb-2">
                  Aucun prestataire recommandé pour le moment.
                </p>
                <p className="text-xs text-muted-foreground">
                  Utilisez "Recherche Prestataires" pour en ajouter.
                </p>
              </div>
            )}
          </TabsContent>

          {/* TAB 3: Actions prioritaires */}
          <TabsContent value="actions" className="space-y-3 mt-4">
            {project.timeline && project.timeline.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Prochaines étapes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {project.timeline?.filter((item: any) => item.priority === 'high').slice(0, 5).map((item: any, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-wedding-olive/50 transition-colors"
                    >
                      <div className="p-1.5 bg-red-100 rounded-full flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.task}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.dueDate}</p>
                        <Badge variant="outline" className="mt-2 text-xs">{item.category}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">
                  Les actions prioritaires apparaîtront ici
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </motion.aside>
  );
};

export default WeddingProjectPanel;
