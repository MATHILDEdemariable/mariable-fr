
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Calendar, User, Mail } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface UserRegistration {
  id: string;
  email: string;
  created_at: string;
  raw_user_meta_data: Json;
}

const InscriptionsUtilisateurs = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<UserRegistration[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterRegistrations();
  }, [registrations, dateFilter, emailFilter]);

  const fetchRegistrations = async () => {
    try {
      setIsLoadingData(true);
      const { data, error } = await supabase.rpc('get_user_registrations');
      
      if (error) {
        console.error('Erreur lors de la récupération des inscriptions:', error);
        toast.error("Erreur lors du chargement des inscriptions");
        return;
      }

      setRegistrations(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoadingData(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = [...registrations];

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(reg => {
        const regDate = new Date(reg.created_at);
        return regDate.toDateString() === filterDate.toDateString();
      });
    }

    if (emailFilter) {
      filtered = filtered.filter(reg => 
        reg.email.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }

    setFilteredRegistrations(filtered);
  };

  const exportToCsv = () => {
    const headers = ['Email', 'Prénom', 'Nom', 'Date d\'inscription'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => {
        const metaData = reg.raw_user_meta_data as any;
        return [
          reg.email,
          metaData?.first_name || '',
          metaData?.last_name || '',
          new Date(reg.created_at).toLocaleDateString('fr-FR')
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inscriptions-utilisateurs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
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

  const getMetaDataValue = (metaData: Json, key: string): string => {
    if (typeof metaData === 'object' && metaData !== null) {
      return (metaData as any)[key] || 'Non renseigné';
    }
    return 'Non renseigné';
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
            Tableau de bord des créations de comptes utilisateurs
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Input
                type="date"
                placeholder="Filtrer par date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-auto"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Filtrer par email"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="w-auto"
              />
            </div>

            <Button 
              onClick={exportToCsv}
              variant="outline"
              className="flex items-center gap-2"
              disabled={filteredRegistrations.length === 0}
            >
              <Download className="h-4 w-4" />
              Exporter CSV
            </Button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Total: {filteredRegistrations.length} inscription(s)
              {dateFilter && ` pour le ${new Date(dateFilter).toLocaleDateString('fr-FR')}`}
            </p>
          </div>

          {isLoadingData ? (
            <div className="flex justify-center items-center py-8">
              <p>Chargement des données...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">
                        {registration.email}
                      </TableCell>
                      <TableCell>
                        {getMetaDataValue(registration.raw_user_meta_data, 'first_name')}
                      </TableCell>
                      <TableCell>
                        {getMetaDataValue(registration.raw_user_meta_data, 'last_name')}
                      </TableCell>
                      <TableCell>
                        {formatDate(registration.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredRegistrations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune inscription trouvée
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default InscriptionsUtilisateurs;
