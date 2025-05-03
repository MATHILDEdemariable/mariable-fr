
import React from 'react';
import FormQuestionsAdmin from '@/components/admin/FormQuestionsAdmin';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import { Card, CardHeader } from "@/components/ui/card";

const FormAdmin = () => {
  return (
    <div className="min-h-screen bg-wedding-cream/10">
      <SEO 
        title="Administration - Formulaire"
        description="Gérez les questions du questionnaire de style"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <h1 className="text-2xl md:text-3xl font-serif text-wedding-black text-center">
              Administration du formulaire de style
            </h1>
          </CardHeader>
        </Card>
        
        <FormQuestionsAdmin />
      </main>
    </div>
  );
};

export default FormAdmin;
