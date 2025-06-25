
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import PrestatairesAdmin from "@/components/admin/FormPrestataires";
import PrestataireCRMFilters from "@/components/admin/PrestataireCRMFilters";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SupabaseAdminUser = Database["public"]["Tables"]["admin_users"]["Row"];

const AdminPrestataires = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [crmFilters, setCrmFilters] = useState({
    statusCrm: '',
    search: '',
    category: '',
    region: ''
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user?.id) {
        checkIfAdmin(newSession.user.id);
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        checkIfAdmin(session.user.id);
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkIfAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", userId)
        .single<SupabaseAdminUser>();
      
      setIsAdmin(!error && !!data);
      setIsLoading(false);
      
      if (error || !data) {
        toast.error("Vous n'avez pas les droits administrateur");
      }
    } catch (err) {
      console.error("Erreur lors de la vérification des droits admin:", err);
      setIsAdmin(false);
      setIsLoading(false);
      toast.error("Une erreur est survenue lors de la vérification de vos droits");
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setCrmFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setCrmFilters({
      statusCrm: '',
      search: '',
      category: '',
      region: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {isAdmin ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-serif text-wedding-black mb-2">
              Gestion des Prestataires
            </h1>
            <p className="text-gray-600">
              Gérez votre base de prestataires et suivez vos contacts CRM
            </p>
          </div>

          <Tabs defaultValue="management" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="management">Gestion Prestataires</TabsTrigger>
              <TabsTrigger value="crm">Suivi CRM</TabsTrigger>
            </TabsList>
            
            <TabsContent value="management" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Base de données des prestataires</CardTitle>
                </CardHeader>
                <CardContent>
                  <PrestatairesAdmin />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="crm" className="space-y-4">
              <PrestataireCRMFilters
                filters={crmFilters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Suivi CRM des prestataires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Interface CRM en cours de développement</p>
                    <p className="text-sm mt-2">
                      Filtres appliqués : {Object.values(crmFilters).filter(Boolean).length > 0 
                        ? Object.entries(crmFilters).filter(([_, value]) => value).map(([key, value]) => `${key}: ${value}`).join(', ')
                        : 'Aucun filtre actif'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Toaster />
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Accès restreint</h2>
          <p className="text-muted-foreground">
            Vous devez être connecté avec un compte administrateur pour accéder à cette page.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPrestataires;
