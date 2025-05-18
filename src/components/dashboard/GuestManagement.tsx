
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GuestCounts {
  adults: number;
  children: number;
  vendors: number;
  ceremony: number;
  cocktail: number;
  dinner: number;
  brunch: number;
}

const GuestManagement: React.FC = () => {
  const [counts, setCounts] = useState<GuestCounts>({
    adults: 0,
    children: 0,
    vendors: 0,
    ceremony: 0,
    cocktail: 0,
    dinner: 0,
    brunch: 0
  });
  const { toast } = useToast();
  
  const handleCountChange = (field: keyof GuestCounts, value: number) => {
    setCounts(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const getTotalGuests = () => {
    return counts.adults + counts.children + counts.vendors;
  };
  
  const saveCounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // You would use your actual supabase table here
        toast({
          title: "Invités sauvegardés",
          description: "Les informations sur vos invités ont été enregistrées"
        });
        
        // In a real implementation, you would store the data to Supabase
        // await supabase.from('guest_management').upsert({ user_id: user.id, counts });
      } else {
        toast({
          title: "Non connecté",
          description: "Connectez-vous pour sauvegarder vos informations",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="bg-wedding-cream/5">
      <CardHeader>
        <CardTitle className="font-serif text-wedding-olive">Gestion des Invités</CardTitle>
        <CardDescription>
          Gérez le nombre d'invités pour chaque moment de votre mariage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Nombre d'invités par type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Adultes</label>
                <Input
                  type="number"
                  value={counts.adults}
                  onChange={(e) => handleCountChange('adults', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Enfants</label>
                <Input
                  type="number"
                  value={counts.children}
                  onChange={(e) => handleCountChange('children', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prestataires</label>
                <Input
                  type="number"
                  value={counts.vendors}
                  onChange={(e) => handleCountChange('vendors', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Invités par moment du mariage</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-wedding-cream/20">
                  <TableRow>
                    <TableHead>Étape</TableHead>
                    <TableHead>Nombre d'invités</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Cérémonie</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={counts.ceremony}
                        onChange={(e) => handleCountChange('ceremony', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cocktail</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={counts.cocktail}
                        onChange={(e) => handleCountChange('cocktail', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dîner</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={counts.dinner}
                        onChange={(e) => handleCountChange('dinner', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Brunch</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={counts.brunch}
                        onChange={(e) => handleCountChange('brunch', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="bg-wedding-cream/20 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Total des invités</h3>
                <p className="text-sm text-muted-foreground">Adultes + Enfants + Prestataires</p>
              </div>
              <div className="text-2xl font-bold">{getTotalGuests()}</div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="wedding" onClick={saveCounts}>
              Enregistrer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestManagement;
