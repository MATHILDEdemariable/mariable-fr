
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  FileText, 
  Calendar, 
  BarChart3,
  Shield
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

const ADMIN_PASSWORD = 'Alain1987!';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalPrestataires: 0,
    totalBlogPosts: 0,
    recentReservations: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already authenticated in session
    const adminAuth = sessionStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      loadStats();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      loadStats();
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans le dashboard admin"
      });
    } else {
      toast({
        title: "Erreur d'authentification",
        description: "Mot de passe incorrect",
        variant: "destructive"
      });
    }
  };

  const loadStats = async () => {
    try {
      const [reservations, prestataires, blogPosts] = await Promise.all([
        supabase.from('jour_m_reservations').select('*', { count: 'exact' }),
        supabase.from('prestataires').select('*', { count: 'exact' }),
        supabase.from('blog_posts').select('*', { count: 'exact' })
      ]);

      // Recent reservations (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentRes = await supabase
        .from('jour_m_reservations')
        .select('*', { count: 'exact' })
        .gte('created_at', weekAgo.toISOString());

      setStats({
        totalReservations: reservations.count || 0,
        totalPrestataires: prestataires.count || 0,
        totalBlogPosts: blogPosts.count || 0,
        recentReservations: recentRes.count || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-wedding-olive mb-4" />
            <CardTitle className="text-2xl font-serif">Administration</CardTitle>
            <p className="text-gray-600">Authentification requise</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe admin"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-wedding-olive hover:bg-wedding-olive/80">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif text-wedding-black">Dashboard Admin</h1>
            <p className="text-gray-600 mt-2">Tableau de bord administrateur</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Réservations Jour-M</p>
                  <p className="text-2xl font-bold text-wedding-olive">{stats.totalReservations}</p>
                </div>
                <Calendar className="h-8 w-8 text-wedding-olive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prestataires</p>
                  <p className="text-2xl font-bold text-wedding-olive">{stats.totalPrestataires}</p>
                </div>
                <Users className="h-8 w-8 text-wedding-olive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Articles Blog</p>
                  <p className="text-2xl font-bold text-wedding-olive">{stats.totalBlogPosts}</p>
                </div>
                <FileText className="h-8 w-8 text-wedding-olive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nouvelles (7j)</p>
                  <p className="text-2xl font-bold text-wedding-olive">{stats.recentReservations}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-wedding-olive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => navigate('/admin/reservations-jour-m')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-wedding-olive" />
                Réservations Jour-M
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Gérer les demandes de coordination de mariage</p>
              <Button className="mt-4 w-full bg-wedding-olive hover:bg-wedding-olive/80">
                Accéder
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => navigate('/admin/prestataires')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-wedding-olive" />
                CRM Prestataires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Gérer la base de données des prestataires</p>
              <Button className="mt-4 w-full bg-wedding-olive hover:bg-wedding-olive/80">
                Accéder
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => navigate('/admin/blog')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-wedding-olive" />
                Blog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Gérer les articles du blog</p>
              <Button className="mt-4 w-full bg-wedding-olive hover:bg-wedding-olive/80">
                Accéder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
