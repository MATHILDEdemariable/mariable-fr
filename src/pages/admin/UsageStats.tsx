import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, TrendingUp, CheckSquare, Calendar, FileText, Heart, ClipboardList, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type ModuleStats = {
  usersCount: number;
  entriesCount?: number;
};

type UsageStats = {
  totalUsers: number;
  activeUsers: number;
  modules: {
    budget: ModuleStats;
    rsvp: ModuleStats;
    checklist: ModuleStats;
    coordination: ModuleStats;
    wishlist: ModuleStats;
    vendorTracking: ModuleStats;
    profileComplete: ModuleStats;
  };
};

const UsageStats = () => {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('get-usage-stats');
      
      if (error) throw error;
      
      if (data?.success && data?.stats) {
        setStats(data.stats);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques d'utilisation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune donnée disponible
      </div>
    );
  }

  const modules = [
    {
      name: 'Profils Complétés',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      users: stats.modules.profileComplete.usersCount,
      description: 'Date de mariage + nombre d\'invités renseignés'
    },
    {
      name: 'Budget',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      users: stats.modules.budget.usersCount,
      entries: stats.modules.budget.entriesCount,
      description: 'Utilisateurs ayant créé un budget'
    },
    {
      name: 'RSVP',
      icon: ClipboardList,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      users: stats.modules.rsvp.usersCount,
      entries: stats.modules.rsvp.entriesCount,
      description: 'Événements RSVP créés'
    },
    {
      name: 'Checklist',
      icon: CheckSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      users: stats.modules.checklist.usersCount,
      entries: stats.modules.checklist.entriesCount,
      description: 'Tâches personnalisées ajoutées'
    },
    {
      name: 'Coordination Jour-M',
      icon: Calendar,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      users: stats.modules.coordination.usersCount,
      entries: stats.modules.coordination.entriesCount,
      description: 'Plannings de coordination créés'
    },
    {
      name: 'Wishlist Prestataires',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      users: stats.modules.wishlist.usersCount,
      entries: stats.modules.wishlist.entriesCount,
      description: 'Prestataires favoris'
    },
    {
      name: 'Suivi Prestataires',
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      users: stats.modules.vendorTracking.usersCount,
      entries: stats.modules.vendorTracking.entriesCount,
      description: 'Prestataires suivis'
    }
  ];

  const activeRate = stats.totalUsers > 0 
    ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-wedding-black">Statistiques d'Utilisation</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de l'utilisation des modules par les utilisateurs
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs Inscrits</p>
                <p className="text-3xl font-bold text-wedding-olive">{stats.totalUsers}</p>
              </div>
              <Users className="h-10 w-10 text-wedding-olive opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actifs (30 jours)</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
                <p className="text-xs text-muted-foreground mt-1">{activeRate}% du total</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux d'Engagement</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalUsers > 0 
                    ? ((Object.values(stats.modules).reduce((acc, m) => acc + m.usersCount, 0) / (stats.totalUsers * 7)) * 100).toFixed(0) 
                    : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Moyenne sur tous les modules</p>
              </div>
              <CheckSquare className="h-10 w-10 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Stats */}
      <div>
        <h2 className="text-xl font-serif text-wedding-black mb-4">Utilisation par Module</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            const usageRate = stats.totalUsers > 0 
              ? ((module.users / stats.totalUsers) * 100).toFixed(1)
              : 0;

            return (
              <Card key={module.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{module.name}</CardTitle>
                    <div className={`p-2 rounded-lg ${module.bgColor}`}>
                      <Icon className={`h-5 w-5 ${module.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{module.users}</span>
                      <span className="text-sm text-muted-foreground">utilisateurs</span>
                    </div>
                    
                    {module.entries !== undefined && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-muted-foreground">{module.entries}</span>
                        <span className="text-xs text-muted-foreground">entrées</span>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{module.description}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Taux d'adoption</span>
                          <span className={`font-semibold ${module.color}`}>{usageRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${module.bgColor} ${module.color}`}
                            style={{ width: `${usageRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UsageStats;
