
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { fetchAllUsers } from '@/lib/supabaseAdmin';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, User, Mail, Calendar, RefreshCw, AlertTriangle, Crown, Users, Phone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useUserStatus, getStatusBadgeProps, UserStatus } from '@/hooks/useUserStatus';
import { exportUsersToCSV } from '@/lib/csvExport';

interface UserRegistration {
  id: string;
  email: string;
  created_at: string;
  raw_user_meta_data: any;
  profile?: {
    first_name?: string;
    last_name?: string;
    subscription_type?: string;
    subscription_expires_at?: string;
    wedding_date?: string;
    guest_count?: number;
  };
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [users, setUsers] = useState<UserRegistration[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserRegistration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.raw_user_meta_data?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.raw_user_meta_data?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => {
        const status = getUserStatus(user.profile);
        return status === statusFilter;
      });
    }

    setFilteredUsers(filtered);
  }, [searchTerm, statusFilter, users]);

  const fetchUsers = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      
      console.log('🚀 Début de la récupération des utilisateurs...');
      
      const userData = await fetchAllUsers();
      
      console.log(`✅ ${userData.length} utilisateurs récupérés avec succès`);
      
      setUsers(userData);
      setFilteredUsers(userData);
      
      if (userData.length === 0) {
        toast.error('Aucun utilisateur trouvé dans la base de données');
      } else {
        toast.success(`${userData.length} utilisateurs chargés avec succès`);
      }
      
    } catch (err) {
      console.error('❌ Erreur complète:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors du chargement des utilisateurs: ${errorMessage}`);
      
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleExportCSV = async () => {
    console.log('🚀 handleExportCSV started:', { userCount: filteredUsers.length });
    
    try {
      setIsExporting(true);
      exportUsersToCSV(filteredUsers.length > 0 ? filteredUsers : users);
      toast.success(`Export CSV réalisé avec succès (${filteredUsers.length > 0 ? filteredUsers.length : users.length} utilisateurs)`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'export CSV:', error);
      toast.error('Erreur lors de l\'export CSV');
    } finally {
      setIsExporting(false);
    }
  };
    }

  const getUserStatus = (profile: UserRegistration['profile']): UserStatus => {
    if (!profile) return 'free';
    
    const subscriptionType = profile.subscription_type;
    const expiresAt = profile.subscription_expires_at;
    
    if (subscriptionType === 'premium') {
      if (!expiresAt) return 'premium';
      
      const expirationDate = new Date(expiresAt);
      const now = new Date();
      
      if (expirationDate > now) {
        return 'premium';
      } else {
        return 'expired';
      }
    }
    
    return 'free';
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

  const getFullName = (user: UserRegistration) => {
    const firstName = user.profile?.first_name || user.raw_user_meta_data?.first_name || '';
    const lastName = user.profile?.last_name || user.raw_user_meta_data?.last_name || '';
    return firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Non renseigné';
  };

  const getPhoneNumber = (user: UserRegistration) => {
    return user.raw_user_meta_data?.phone || 'Non renseigné';
  };

  const getRecentUsers = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return users.filter(user => new Date(user.created_at) >= weekAgo).length;
  };

  const getPremiumUsers = () => {
    return users.filter(user => getUserStatus(user.profile) === 'premium').length;
  };

  const getExpiredUsers = () => {
    return users.filter(user => getUserStatus(user.profile) === 'expired').length;
  };

  const StatusBadge = ({ user }: { user: UserRegistration }) => {
    const status = getUserStatus(user.profile);
    const badgeProps = getStatusBadgeProps(status);
    
    return (
      <Badge variant={badgeProps.variant} className={badgeProps.className}>
        {status === 'premium' && <Crown className="h-3 w-3 mr-1" />}
        {badgeProps.text}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p>Chargement...</p>
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
        <div>
          <h1 className="text-2xl font-bold text-wedding-black">Inscriptions Utilisateurs</h1>
          <p className="text-gray-600 mt-2">
            Gérez les comptes utilisateurs et suivez les nouvelles inscriptions.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button 
            onClick={handleExportCSV}
            disabled={isExporting || users.length === 0}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className={`h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} />
            {isExporting ? 'Export en cours...' : `Exporter CSV (${filteredUsers.length > 0 ? filteredUsers.length : users.length})`}
          </Button>
        </div>

        {/* Alerte d'erreur */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchUsers}
                disabled={isLoadingData}
                className="ml-4"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingData ? 'animate-spin' : ''}`} />
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-wedding-olive">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Premium</CardTitle>
              <Crown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getPremiumUsers()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abonnements Expirés</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{getExpiredUsers()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux (7j)</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{getRecentUsers()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="expired">Expirés</SelectItem>
                  <SelectItem value="free">Gratuit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>
              Utilisateurs Inscrits ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex justify-center items-center p-10">
                <p>Chargement des utilisateurs...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {users.length === 0 
                    ? 'Aucun utilisateur trouvé.' 
                    : 'Aucun utilisateur ne correspond à vos critères de recherche.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom Complet</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Date de mariage</TableHead>
                      <TableHead>Nb. invités</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {getFullName(user)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className={user.email === 'Email non disponible' ? 'text-gray-400 italic' : ''}>
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className={getPhoneNumber(user) === 'Non renseigné' ? 'text-gray-400 italic' : ''}>
                              {getPhoneNumber(user)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.profile?.wedding_date ? 
                            formatDate(user.profile.wedding_date) : 
                            <span className="text-gray-400 italic">Non renseigné</span>
                          }
                        </TableCell>
                        <TableCell>
                          {user.profile?.guest_count || 
                            <span className="text-gray-400 italic">Non renseigné</span>
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(user.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge user={user} />
                          {user.profile?.subscription_expires_at && getUserStatus(user.profile) === 'premium' && (
                            <div className="text-xs text-gray-500 mt-1">
                              Expire le {formatDate(user.profile.subscription_expires_at)}
                            </div>
                          )}
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

export default AdminUsers;
