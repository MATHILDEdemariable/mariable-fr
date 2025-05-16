
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useBriefContext, WeddingBrief } from './BriefContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface FormStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

// Define a more specific interface for our form state
interface FormState {
  couple: {
    name1: string;
    name2: string;
    email: string;
  };
  preferences: {
    style: string;
    theme: string[];
    colors: string[];
    season: string;
  };
  budget: {
    total: number;
  };
  timeline: {
    weddingDate: string | null;
    engagementLength: string;
  };
  additionalInfo: string;
}

const ConversationalForm: React.FC<Props> = ({ onComplete }) => {
  const { addBrief, setCurrentBrief } = useBriefContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    couple: {
      name1: '',
      name2: '',
      email: '',
    },
    preferences: {
      style: '',
      theme: [],
      colors: [],
      season: '',
    },
    budget: {
      total: 0,
    },
    timeline: {
      weddingDate: null,
      engagementLength: '',
    },
    additionalInfo: '',
  });

  const updateFormState = (field: string, value: any) => {
    setFormState((prev) => {
      const [mainField, subField] = field.split('.');
      if (subField) {
        // Create a properly typed copy of the main field object
        const mainFieldObject = { ...prev[mainField as keyof FormState] } as Record<string, any>;
        
        return {
          ...prev,
          [mainField]: {
            ...mainFieldObject,
            [subField]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormState((prev) => {
      const [mainField, subField] = field.split('.');
      
      if (mainField && subField) {
        const mainFieldKey = mainField as keyof FormState;
        // Create a properly typed copy of the main field object
        const mainFieldObject = { ...(prev[mainFieldKey] as object) } as Record<string, any>;
        
        // Safely access and copy the array
        const currentValues = [...(mainFieldObject[subField] || [])];
        
        if (checked) {
          currentValues.push(value);
        } else {
          const index = currentValues.indexOf(value);
          if (index > -1) {
            currentValues.splice(index, 1);
          }
        }
        
        return {
          ...prev,
          [mainField]: {
            ...mainFieldObject,
            [subField]: currentValues,
          },
        };
      }
      
      return prev;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Create a new brief object with proper typing
      const newBrief: WeddingBrief = {
        id: uuidv4(),
        couple: { ...formState.couple },
        preferences: { ...formState.preferences },
        budget: { ...formState.budget },
        timeline: { ...formState.timeline },
        additionalInfo: formState.additionalInfo,
        createdAt: new Date(),
      };
      
      // Add the brief to our context
      addBrief(newBrief);
      setCurrentBrief(newBrief);
      
      // Show success message
      toast({
        title: "Brief créé avec succès",
        description: "Votre plan de mariage est en cours de génération.",
      });
      
      // Move to the next view
      onComplete();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du brief.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define the steps in our conversational form
  const steps: FormStep[] = [
    {
      id: 'couple',
      title: 'Parlez-nous de vous',
      description: 'Pour commencer, partagez quelques informations sur votre couple.',
      component: (
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name1">Votre prénom</Label>
              <Input
                id="name1"
                placeholder="Prénom"
                value={formState.couple.name1}
                onChange={(e) => updateFormState('couple.name1', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name2">Prénom de votre partenaire</Label>
              <Input
                id="name2"
                placeholder="Prénom du partenaire"
                value={formState.couple.name2}
                onChange={(e) => updateFormState('couple.name2', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email de contact</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={formState.couple.email}
              onChange={(e) => updateFormState('couple.email', e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'preferences',
      title: 'Vos préférences',
      description: 'Partagez-nous vos goûts et préférences pour votre mariage idéal.',
      component: (
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Style de mariage souhaité</Label>
            <RadioGroup
              value={formState.preferences.style}
              onValueChange={(value) => updateFormState('preferences.style', value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="classique" id="classique" />
                <Label htmlFor="classique">Classique & Élégant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="champêtre" id="champetre" />
                <Label htmlFor="champetre">Champêtre & Naturel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bohème" id="boheme" />
                <Label htmlFor="boheme">Bohème & Romantique</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderne" id="moderne" />
                <Label htmlFor="moderne">Moderne & Minimaliste</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Thèmes qui vous inspirent (plusieurs choix possibles)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {['Nature', 'Voyage', 'Littérature', 'Musique', 'Cinéma', 'Vintage', 'Art déco'].map((theme) => (
                <div key={theme} className="flex items-center space-x-2">
                  <Checkbox
                    id={`theme-${theme}`}
                    checked={formState.preferences.theme.includes(theme)}
                    onCheckedChange={(checked) => handleCheckboxChange('preferences.theme', theme, checked === true)}
                  />
                  <Label htmlFor={`theme-${theme}`}>{theme}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Saison préférée pour votre mariage</Label>
            <RadioGroup
              value={formState.preferences.season}
              onValueChange={(value) => updateFormState('preferences.season', value)}
              className="grid grid-cols-2 md:grid-cols-4 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="printemps" id="printemps" />
                <Label htmlFor="printemps">Printemps</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="été" id="ete" />
                <Label htmlFor="ete">Été</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="automne" id="automne" />
                <Label htmlFor="automne">Automne</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hiver" id="hiver" />
                <Label htmlFor="hiver">Hiver</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Couleurs favorites (plusieurs choix possibles)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Blanc', 'Ivoire', 'Blush', 'Terracotta', 'Vert sauge', 'Bleu nuit', 'Doré', 'Bordeaux'].map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={formState.preferences.colors.includes(color)}
                    onCheckedChange={(checked) => handleCheckboxChange('preferences.colors', color, checked === true)}
                  />
                  <Label htmlFor={`color-${color}`}>{color}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'budget',
      title: 'Votre budget',
      description: 'Définissez votre enveloppe budgétaire pour votre mariage.',
      component: (
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="budget-total">Budget global estimé (en €)</Label>
            <Input
              id="budget-total"
              type="number"
              placeholder="20000"
              value={formState.budget.total || ''}
              onChange={(e) => updateFormState('budget.total', Number(e.target.value))}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Le budget moyen d'un mariage en France est d'environ 15 000€ à 20 000€.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'timeline',
      title: 'Votre planning',
      description: 'Partagez vos dates importantes et votre timeline idéale.',
      component: (
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="wedding-date">Date de mariage souhaitée (si connue)</Label>
            <Input
              id="wedding-date"
              type="date"
              value={formState.timeline.weddingDate || ''}
              onChange={(e) => updateFormState('timeline.weddingDate', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Durée de préparation souhaitée</Label>
            <RadioGroup
              value={formState.timeline.engagementLength}
              onValueChange={(value) => updateFormState('timeline.engagementLength', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6_mois" id="6_mois" />
                <Label htmlFor="6_mois">Moins de 6 mois</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12_mois" id="12_mois" />
                <Label htmlFor="12_mois">6 à 12 mois</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="18_mois" id="18_mois" />
                <Label htmlFor="18_mois">12 à 18 mois</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24_mois" id="24_mois" />
                <Label htmlFor="24_mois">Plus de 18 mois</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      ),
    },
    {
      id: 'additional',
      title: 'Informations supplémentaires',
      description: 'Y a-t-il d\'autres informations que vous souhaiteriez partager ?',
      component: (
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="additional-info">Détails supplémentaires</Label>
            <Textarea
              id="additional-info"
              placeholder="Partagez toute information complémentaire qui pourrait nous aider à mieux comprendre vos besoins..."
              rows={5}
              value={formState.additionalInfo}
              onChange={(e) => updateFormState('additionalInfo', e.target.value)}
            />
          </div>
        </div>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-serif">{currentStepData.title}</h3>
        <p className="text-muted-foreground">{currentStepData.description}</p>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className={`rounded-full p-1 ${idx === currentStep ? 'bg-wedding-olive text-white' : 'bg-gray-200'}`}>
              {idx < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="w-5 h-5 flex items-center justify-center">{idx + 1}</span>
              )}
            </div>
            {idx < steps.length - 1 && (
              <div className="h-0.5 w-4 bg-gray-200"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {currentStepData.component}

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Précédent
        </Button>
        
        {isLastStep ? (
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-wedding-olive hover:bg-wedding-olive/90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Générer mon plan de mariage
          </Button>
        ) : (
          <Button 
            onClick={nextStep}
            className="bg-wedding-olive hover:bg-wedding-olive/90"
          >
            Continuer <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConversationalForm;
