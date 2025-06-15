
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BasicInfoForm from "./BasicInfoForm";
import PricingPackagesForm from "./PricingPackagesForm";
import ResponsiblePersonForm from "./ResponsiblePersonForm";
import StylesManager from "./StylesManager";
import DisplayOptionsForm from "./DisplayOptionsForm";
import PhotoManager from "./PhotoManager";
import BrochureManager from "./BrochureManager";
import { Prestataire } from "./types";

interface TabbedEditFormProps {
  prestataire: Prestataire | null;
  onClose: () => void;
  onSuccess: () => void;
}

const TabbedEditForm: React.FC<TabbedEditFormProps> = ({ prestataire, onClose, onSuccess }) => {
  const [currentTab, setCurrentTab] = useState("infos");

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <TabsList>
        <TabsTrigger value="infos">Informations</TabsTrigger>
        <TabsTrigger value="prices">Prix & Formules</TabsTrigger>
        <TabsTrigger value="person">Responsable</TabsTrigger>
        <TabsTrigger value="styles">Styles</TabsTrigger>
        <TabsTrigger value="display">Options affichage</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="brochures">Brochures</TabsTrigger>
      </TabsList>
      <TabsContent value="infos">
        <BasicInfoForm prestataire={prestataire} />
      </TabsContent>
      <TabsContent value="prices">
        <PricingPackagesForm prestataire={prestataire} />
      </TabsContent>
      <TabsContent value="person">
        <ResponsiblePersonForm prestataire={prestataire} />
      </TabsContent>
      <TabsContent value="styles">
        <StylesManager prestataire={prestataire} />
      </TabsContent>
      <TabsContent value="display">
        <DisplayOptionsForm prestataire={prestataire} />
      </TabsContent>
      <TabsContent value="photos">
        <PhotoManager prestataire={prestataire} onUpdate={onSuccess} />
      </TabsContent>
      <TabsContent value="brochures">
        <BrochureManager prestataire={prestataire} onUpdate={onSuccess} />
      </TabsContent>
    </Tabs>
  );
};
export default TabbedEditForm;
