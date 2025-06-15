
import React from "react";
import { Prestataire } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface PrestatairePackagesProps {
    fields: Partial<Prestataire>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFields: React.Dispatch<React.SetStateAction<Partial<Prestataire>>>;
}

const PrestatairePackages: React.FC<PrestatairePackagesProps> = ({ fields, handleChange, setFields }) => {
    return (
        <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Formules & Prix</h3>
            <div className="flex items-center space-x-2 mb-4">
                <Switch
                    id="show_prices"
                    checked={fields.show_prices ?? true}
                    onCheckedChange={(checked) =>
                        setFields((prev) => ({ ...prev, show_prices: checked }))
                    }
                />
                <label htmlFor="show_prices">Afficher les prix sur la page</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Package 1 */}
                <div className="space-y-3 p-4 border rounded-lg">
                    <h4 className="font-semibold">Formule 1</h4>
                    <label className="block font-medium">Nom</label>
                    <Input name="first_price_package_name" value={fields.first_price_package_name ?? ''} onChange={handleChange} />
                    <label className="block font-medium">Prix</label>
                    <Input type="number" name="first_price_package" value={fields.first_price_package ?? ''} onChange={handleChange} />
                    <label className="block font-medium">Description</label>
                    <Textarea name="first_price_package_description" value={fields.first_price_package_description ?? ''} onChange={handleChange} className="min-h-[80px]" />
                </div>
                {/* Package 2 */}
                <div className="space-y-3 p-4 border rounded-lg">
                    <h4 className="font-semibold">Formule 2</h4>
                    <label className="block font-medium">Nom</label>
                    <Input name="second_price_package_name" value={fields.second_price_package_name ?? ''} onChange={handleChange} />
                    <label className="block font-medium">Prix</label>
                    <Input type="number" name="second_price_package" value={fields.second_price_package ?? ''} onChange={handleChange} />
                    <label className="block font-medium">Description</label>
                    <Textarea name="second_price_package_description" value={fields.second_price_package_description ?? ''} onChange={handleChange} className="min-h-[80px]" />
                </div>
                {/* Package 3 */}
                <div className="space-y-3 p-4 border rounded-lg">
                    <h4 className="font-semibold">Formule 3</h4>
                    <label className="block font-medium">Nom</label>
                    <Input name="third_price_package_name" value={fields.third_price_package_name ?? ''} onChange={handleChange} />
                    <label className="block font-medium">Prix</label>
                    <Input type="number" name="third_price_package" value={fields.third_price_package ?? ''} onChange={handleChange} />
                    <label className="block font-medium">Description</label>
                    <Textarea name="third_price_package_description" value={fields.third_price_package_description ?? ''} onChange={handleChange} className="min-h-[80px]" />
                </div>
                {/* Package 4 */}
                <div className="space-y-3 p-4 border rounded-lg">
                    <h4 className="font-semibold">Formule 4</h4>
                    <label className="block font-medium">Nom</label>
                    <Input name="fourth_price_package_name" value={fields.fourth_price_package_name ?? ''} onChange={handleChange} />
                    <label className="block font-medium">Prix</label>
                    <Input type="number" name="fourth_price_package" value={fields.fourth_price_package ?? ''} onChange={handleChange} />
                    <label className="block font-medium">Description</label>
                    <Textarea name="fourth_price_package_description" value={fields.fourth_price_package_description ?? ''} onChange={handleChange} className="min-h-[80px]" />
                </div>
            </div>
        </div>
    );
};

export default PrestatairePackages;
