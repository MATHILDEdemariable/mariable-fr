import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MessageCircle, TrendingUp, Users, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Helmet } from "react-helmet-async";

interface FeedbackData {
  id: string;
  user_id: string;
  score_nps: number;
  commentaire: string | null;
  page_courante: string | null;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email?: string;
  } | null;
}

const AdminSatisfactionUtilisateurs = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeedbacks();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, searchTerm, scoreFilter]);

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_satisfaction_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Récupérer les profils séparément
      const feedbacksWithProfiles = await Promise.all(
        (data || []).map(async (feedback) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', feedback.user_id)
            .single();
          
          return {
            ...feedback,
            profiles: profile || { first_name: null, last_name: null }
          } as FeedbackData;
        })
      );
      
      setFeedbacks(feedbacksWithProfiles);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des retours:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les retours de satisfaction."
      });
    } finally {
      setLoading(false);
    }
  };

  const filterFeedbacks = () => {
    let filtered = feedbacks;

    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(feedback => {
        const fullName = `${feedback.profiles?.first_name || ''} ${feedback.profiles?.last_name || ''}`.toLowerCase();
        return fullName.includes(term) ||
               (feedback.commentaire?.toLowerCase().includes(term)) ||
               (feedback.page_courante?.toLowerCase().includes(term));
      });
    }

    // Filtre par score
    if (scoreFilter !== 'all') {
      if (scoreFilter === 'detractors') {
        filtered = filtered.filter(feedback => feedback.score_nps <= 6);
      } else if (scoreFilter === 'passives') {
        filtered = filtered.filter(feedback => feedback.score_nps >= 7 && feedback.score_nps <= 8);
      } else if (scoreFilter === 'promoters') {
        filtered = filtered.filter(feedback => feedback.score_nps >= 9);
      }
    }

    setFilteredFeedbacks(filtered);
  };

  const getScoreBadge = (score: number) => {
    if (score <= 6) {
      return <Badge variant="destructive">Détracteur ({score})</Badge>;
    } else if (score <= 8) {
      return <Badge variant="secondary">Passif ({score})</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-500 text-white">Promoteur ({score})</Badge>;
    }
  };

  const getStats = () => {
    if (feedbacks.length === 0) {
      return {
        total: 0,
        scorePoyen: 0,
        detracteurs: 0,
        passifs: 0,
        promoteurs: 0,
        nps: 0
      };
    }

    const total = feedbacks.length;
    const scoreMoyen = feedbacks.reduce((sum, f) => sum + f.score_nps, 0) / total;
    const detracteurs = feedbacks.filter(f => f.score_nps <= 6).length;
    const passifs = feedbacks.filter(f => f.score_nps >= 7 && f.score_nps <= 8).length;
    const promoteurs = feedbacks.filter(f => f.score_nps >= 9).length;
    
    // Calcul du NPS : (% Promoteurs - % Détracteurs) 
    const nps = Math.round(((promoteurs / total) * 100) - ((detracteurs / total) * 100));

    return {
      total,
      scoreMoyen: Math.round(scoreMoyen * 10) / 10,
      detracteurs,
      passifs,
      promoteurs,
      nps
    };
  };

  const stats = getStats();

  if (isLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Helmet>
          <title>Satisfaction Utilisateurs - Admin - Mariable</title>
          <meta name="description" content="Analyse des retours de satisfaction des utilisateurs." />
        </Helmet>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-wedding-black">Satisfaction Utilisateurs</h1>
          <p className="text-muted-foreground">
            Analyse des retours de satisfaction et scores NPS
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total réponses</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Score moyen</p>
                <p className="text-2xl font-bold">{stats.scoreMoyen}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-5 h-5 ${stats.nps >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <div>
                <p className="text-sm text-muted-foreground">Score NPS</p>
                <p className="text-2xl font-bold">{stats.nps}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Promoteurs</p>
                <p className="text-2xl font-bold">{stats.promoteurs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Passifs</p>
                <p className="text-2xl font-bold">{stats.passifs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Détracteurs</p>
                <p className="text-2xl font-bold">{stats.detracteurs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou commentaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="promoters">Promoteurs (9-10)</SelectItem>
                  <SelectItem value="passives">Passifs (7-8)</SelectItem>
                  <SelectItem value="detractors">Détracteurs (0-6)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des retours */}
      <Card>
        <CardHeader>
          <CardTitle>
            Retours des utilisateurs ({filteredFeedbacks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFeedbacks.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun retour trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Commentaire</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {feedback.profiles?.first_name || feedback.profiles?.last_name 
                              ? `${feedback.profiles.first_name || ''} ${feedback.profiles.last_name || ''}`.trim()
                              : 'Utilisateur inconnu'
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {feedback.user_id.substring(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getScoreBadge(feedback.score_nps)}
                      </TableCell>
                      <TableCell className="max-w-md">
                        {feedback.commentaire ? (
                          <div className="text-sm">
                            <p className="line-clamp-3">{feedback.commentaire}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">Pas de commentaire</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {feedback.page_courante || 'Non spécifié'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(feedback.created_at), 'dd MMM yyyy', { locale: fr })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(feedback.created_at), 'HH:mm')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSatisfactionUtilisateurs;