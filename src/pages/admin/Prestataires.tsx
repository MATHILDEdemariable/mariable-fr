
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrestatairesAdmin from "@/components/admin/FormPrestataires";
import VendorContactsAdmin from "@/components/admin/VendorContactsAdmin";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminPrestataires = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

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
    return null; // La redirection va se faire
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-wedding-black">CRM Prestataires</h1>
          <p className="text-gray-600 mt-2">
            Gérez votre base de prestataires et les demandes de contact.
          </p>
        </div>
        
        <Tabs defaultValue="prestataires" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prestataires">Gestion Prestataires</TabsTrigger>
            <TabsTrigger value="contacts">Demandes de Contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prestataires" className="mt-6">
            <PrestatairesAdmin />
          </TabsContent>
          
          <TabsContent value="contacts" className="mt-6">
            <VendorContactsAdmin />
          </TabsContent>
        </Tabs>
        
        <Toaster />
      </div>
    </AdminLayout>
  );
};

export default AdminPrestataires;
