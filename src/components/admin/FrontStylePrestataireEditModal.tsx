
import React from "react";
import FrontStylePrestataireForm from "./FrontStylePrestataireForm";
import { Prestataire } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhotoManager from "./PhotoManager";
import BrochureManager from "./BrochureManager";
import PricingPackagesForm from "./PricingPackagesForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FrontStylePrestataireEditModalProps {
  open: boolean;
  onClose: () => void;
  prestataire: Prestataire | null;
  onSuccess: () => void;
  isCreating?: boolean;
}

const FrontStylePrestataireEditModal: React.FC<FrontStylePrestataireEditModalProps> = ({
  open,
  onClose,
  prestataire,
  onSuccess,
  isCreating = false,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">{isCreating ? "Ajouter un prestataire" : `Modifier: ${prestataire?.nom}`}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
                <TabsTrigger value="info">Infos générales</TabsTrigger>
                <TabsTrigger value="pricing" disabled={isCreating}>Prix & Formules</TabsTrigger>
                <TabsTrigger value="photos" disabled={isCreating}>Photos</TabsTrigger>
                <TabsTrigger value="brochures" disabled={isCreating}>Brochures</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                <FrontStylePrestataireForm
                  prestataire={prestataire}
                  onSuccess={onSuccess}
                  onClose={onClose}
                  isCreating={isCreating}
                />
              </TabsContent>
              <TabsContent value="pricing">
                {prestataire && <PricingPackagesForm prestataire={prestataire} />}
              </TabsContent>
              <TabsContent value="photos">
                {prestataire && <PhotoManager prestataire={prestataire} onUpdate={onSuccess} />}
              </TabsContent>
              <TabsContent value="brochures">
                {prestataire && <BrochureManager prestataire={prestataire} onUpdate={onSuccess} />}
              </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FrontStylePrestataireEditModal;
