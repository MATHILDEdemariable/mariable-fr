
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon } from "lucide-react";

const ReaderBanner = () => {
  return (
    <Alert variant="default" className="bg-wedding-olive/10 border-wedding-olive mb-4">
      <div className="flex items-center gap-2">
        <EyeIcon className="h-4 w-4 text-wedding-olive" />
        <AlertDescription className="text-wedding-olive font-medium">
          Mode lecture seule - Vous visualisez un tableau de bord partagé
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default ReaderBanner;
