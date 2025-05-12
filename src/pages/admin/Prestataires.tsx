import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import PrestatairesAdmin from "@/components/admin/FormPrestataires";
import { Database } from "@/integrations/supabase/types";

type SupabaseAdminUser = Database["public"]["Tables"]["admin_users"]["Row"];

const AdminPrestataires = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); 

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user?.id) {
        checkIfAdmin(newSession.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        checkIfAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkIfAdmin = async (userId: string) => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", userId)
      .single<SupabaseAdminUser>(); 
    setIsAdmin(!error && !!data);
  };

  if (isAdmin === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {isAdmin ? (
        <div className="w-full max-w-6xl">
          <h1 className="text-2xl font-bold mb-4 text-center mt-12">Admin Prestataires</h1>
          <p className="text-lg text-center mb-4">
            Bienvenue dans l'interface d'administration des prestataires.
          </p>
          <PrestatairesAdmin />
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-semibold">Accès restreint</h2>
          {session?.user?.id}
          <p className="text-muted-foreground">
            Vous devez être connecté avec un compte administrateur pour accéder à cette page.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPrestataires;
