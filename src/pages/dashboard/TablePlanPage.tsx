
import React from "react";
import { Helmet } from "react-helmet-async";
import TablePlanCanvas from "@/components/table-plan/TablePlanCanvas";

const TablePlanPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Plan de table | Mariable</title>
        <meta name="description" content="Outil de création de plan de table interactif pour votre mariage" />
      </Helmet>
      <div className="max-w-6xl mx-auto py-6 px-2 sm:px-4">
        <h1 className="text-3xl md:text-4xl font-serif mb-2">
          Plan de table
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Créez facilement un plan de table pour votre événement avec glisser-déposer, gestion des tables, chaises et invités.
        </p>
        <TablePlanCanvas />
      </div>
    </>
  );
};

export default TablePlanPage;
