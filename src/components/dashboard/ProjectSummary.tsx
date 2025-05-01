
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Euro, Clock, Save } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface ProjectSummaryProps {
  projectName?: string;
  weddingDate?: string;
  guestCount?: number;
  budget?: number;
  daysRemaining?: number;
  progress?: number;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  projectName = "Notre mariage",
  weddingDate = "",
  guestCount = 0,
  budget = 0,
  daysRemaining = 0,
  progress = 0
}) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    weddingDate: weddingDate || "",
    guestCount: guestCount || 0,
    budget: budget || 0
  });

  useEffect(() => {
    // Charger les données du localStorage au démarrage
    const savedProject = localStorage.getItem('weddingProject');
    if (savedProject) {
      const parsedProject = JSON.parse(savedProject);
      setFormData({
        weddingDate: parsedProject.weddingDate || "",
        guestCount: parsedProject.guestCount || 0,
        budget: parsedProject.budget || 0
      });
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guestCount' || name === 'budget' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    // Sauvegarder dans localStorage
    localStorage.setItem('weddingProject', JSON.stringify(formData));
    
    // Afficher un toast de confirmation
    toast({
      title: "Modifications enregistrées",
      description: "Les informations de votre projet ont été mises à jour"
    });
    
    // Quitter le mode édition
    setEditMode(false);
  };

  // Calculer les jours restants
  const calculateDaysRemaining = () => {
    if (!formData.weddingDate) return null;
    
    const today = new Date();
    const wedding = new Date(formData.weddingDate);
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const daysToWedding = calculateDaysRemaining();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">{projectName}</CardTitle>
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setEditMode(!editMode)}
            className="text-wedding-olive hover:bg-wedding-olive/10"
          >
            {editMode ? "Annuler" : "Modifier"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {editMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weddingDate">Date du mariage</Label>
                <Input
                  id="weddingDate"
                  name="weddingDate"
                  type="date"
                  value={formData.weddingDate}
                  onChange={handleChange}
                  className="bg-wedding-cream/5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guestCount">Nombre d'invités</Label>
                <Input
                  id="guestCount"
                  name="guestCount"
                  type="number"
                  min="1"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="bg-wedding-cream/5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Budget approximatif (€)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.budget}
                  onChange={handleChange}
                  className="bg-wedding-cream/5"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                className="bg-wedding-olive hover:bg-wedding-olive/90"
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-wedding-cream/20 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-wedding-olive/10 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-wedding-olive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : "Non définie"}
                </p>
              </div>
            </div>
            
            <div className="bg-wedding-cream/20 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-wedding-olive/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-wedding-olive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invités</p>
                <p className="font-medium">{formData.guestCount > 0 ? formData.guestCount : "Non défini"}</p>
              </div>
            </div>
            
            <div className="bg-wedding-cream/20 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-wedding-olive/10 p-2 rounded-full">
                <Euro className="h-5 w-5 text-wedding-olive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium">{formData.budget > 0 ? formatCurrency(formData.budget) : "Non défini"}</p>
              </div>
            </div>
            
            <div className="bg-wedding-cream/20 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-wedding-olive/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-wedding-olive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temps restant</p>
                <p className="font-medium">
                  {daysToWedding ? `${daysToWedding} jours` : "Date non définie"}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="pt-4">
          <ProgressBar 
            percentage={progress} 
            className="mb-4" 
          />
          
          <p className="text-sm text-muted-foreground">
            {progress < 25 && "C'est le début de votre aventure ! Commencez par définir votre vision et votre budget."}
            {progress >= 25 && progress < 50 && "Vous êtes bien lancés ! Concentrez-vous maintenant sur les réservations clés."}
            {progress >= 50 && progress < 75 && "Plus de la moitié du chemin est fait ! Passez aux détails et à la décoration."}
            {progress >= 75 && "Vous y êtes presque ! Finalisez les derniers détails pour votre grand jour."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSummary;
