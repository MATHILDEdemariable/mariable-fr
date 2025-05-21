
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { QuizData, QuizField, QuizFormValues, QuizSection, WeddingSchedule } from './types/scheduleTypes';
import { generateScheduleFromQuiz } from './utils/scheduleGenerator';

interface WeddingDayQuizProps {
  quizData: QuizData;
  onSubmit: (formData: QuizFormValues, schedule: WeddingSchedule) => void;
}

export const WeddingDayQuiz: React.FC<WeddingDayQuizProps> = ({ quizData, onSubmit }) => {
  const form = useForm<QuizFormValues>({
    defaultValues: {},
  });
  
  const [currentStep, setCurrentStep] = useState<string>('info_base');
  const [formSections] = useState<string[]>([
    'info_base',
    'preparatifs',
    'ceremonies',
    'photos',
    'reception',
    'soiree'
  ]);
  
  const watchedValues = form.watch();
  
  // Function to check if a field should be visible based on conditions
  const isFieldVisible = (field: QuizField): boolean => {
    if (!field.visible_si) return true;
    
    const conditions = Object.entries(field.visible_si);
    return conditions.every(([key, value]) => 
      watchedValues[key] === value
    );
  };
  
  // Advance to next section
  const goToNextStep = () => {
    const currentIndex = formSections.indexOf(currentStep);
    if (currentIndex < formSections.length - 1) {
      setCurrentStep(formSections[currentIndex + 1]);
    }
  };
  
  // Go back to previous section
  const goToPreviousStep = () => {
    const currentIndex = formSections.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(formSections[currentIndex - 1]);
    }
  };
  
  // Handle form submission
  const handleFormSubmit = (data: QuizFormValues) => {
    // Generate schedule from form data
    const schedule = generateScheduleFromQuiz(data);
    onSubmit(data, schedule);
  };
  
  // Render input based on field type
  const renderField = (fieldName: string, field: QuizField) => {
    if (!isFieldVisible(field)) return null;
    
    switch (field.type) {
      case 'choix':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    value={formField.value as string}
                    className="flex flex-col space-y-1"
                  >
                    {field.options?.map((option) => {
                      const optionValue = typeof option === 'string' ? option : option.valeur;
                      const optionLabel = typeof option === 'string' ? option : `${option.valeur}${option.duree ? ` (${option.duree} min)` : ''}`;
                      
                      return (
                        <div key={optionValue} className="flex items-center space-x-2">
                          <RadioGroupItem value={optionValue || ''} id={`${fieldName}-${optionValue}`} />
                          <label htmlFor={`${fieldName}-${optionValue}`} className="text-sm font-normal">
                            {optionLabel}
                          </label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'multi-choix':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <div className="flex flex-col space-y-2">
                  {field.options?.map((option) => {
                    const optionValue = typeof option === 'string' ? option : option.valeur;
                    const optionLabel = typeof option === 'string' ? option : `${option.valeur}${option.duree ? ` (${option.duree} min)` : ''}`;
                    
                    return (
                      <div key={optionValue} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${fieldName}-${optionValue}`}
                          checked={(formField.value as string[] || []).includes(optionValue || '')}
                          onCheckedChange={(checked) => {
                            const values = formField.value as string[] || [];
                            if (checked) {
                              formField.onChange([...values, optionValue]);
                            } else {
                              formField.onChange(values.filter(v => v !== optionValue));
                            }
                          }}
                        />
                        <label htmlFor={`${fieldName}-${optionValue}`} className="text-sm font-normal">
                          {optionLabel}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'time':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...formField} 
                    // Convert any non-string values to string for the input
                    value={String(formField.value || '')}
                    className="w-full max-w-[200px]"
                  />
                </FormControl>
                {field.duree && (
                  <FormDescription>
                    Durée estimée: {field.duree} minutes
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'number':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...formField} 
                    // Convert any non-numeric values to string for the input
                    value={String(formField.value || '')}
                    className="w-full max-w-[200px]"
                  />
                </FormControl>
                {field.unit && (
                  <FormDescription>
                    {field.unit}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      default:
        return null;
    }
  };
  
  // Recursively render fields in a section
  const renderSection = (section: QuizSection, parentKey: string = '') => {
    return Object.entries(section).map(([key, value]) => {
      // Skip the 'label' key when rendering subsections
      if (key === 'label') return null;
      
      const fieldName = parentKey ? `${parentKey}.${key}` : key;
      
      if ((value as QuizField).type) {
        // This is a field
        return renderField(fieldName, value as QuizField);
      } else {
        // This is a nested section
        return (
          <div key={fieldName} className="space-y-4 my-6">
            <h3 className="text-lg font-medium">{(value as QuizSection).label?.toString() || key}</h3>
            {renderSection(value as QuizSection, fieldName)}
          </div>
        );
      }
    });
  };
  
  // Group fields into logical sections for better UX
  const getFieldsForCurrentStep = () => {
    const { inputs_mariage } = quizData;
    
    switch (currentStep) {
      case 'info_base':
        return (
          <>
            <h2 className="text-xl font-serif mb-4">Informations de base</h2>
            {renderField('ceremonie_civile_le_meme_jour', inputs_mariage.ceremonie_civile_le_meme_jour as QuizField)}
            {renderField('type_ceremonie_principale', inputs_mariage.type_ceremonie_principale as QuizField)}
            {renderField('lieux_differents', inputs_mariage.lieux_differents as QuizField)}
            {renderField('temps_de_trajet', inputs_mariage.temps_de_trajet as QuizField)}
          </>
        );
        
      case 'preparatifs':
        return (
          <>
            <h2 className="text-xl font-serif mb-4">Préparatifs</h2>
            {renderSection(inputs_mariage.preparatifs_mariee as QuizSection, 'preparatifs_mariee')}
          </>
        );
        
      case 'ceremonies':
        return (
          <>
            <h2 className="text-xl font-serif mb-4">Cérémonies</h2>
            {renderField('horaire_ceremonie_principale', inputs_mariage.horaire_ceremonie_principale as QuizField)}
            {renderField('horaire_ceremonie_civile', inputs_mariage.horaire_ceremonie_civile as QuizField)}
          </>
        );
        
      case 'photos':
        return (
          <>
            <h2 className="text-xl font-serif mb-4">Photos et moments clés</h2>
            {renderField('first_look', inputs_mariage.first_look as QuizField)}
            {renderField('moment_photos', inputs_mariage.moment_photos as QuizField)}
          </>
        );
        
      case 'reception':
        return (
          <>
            <h2 className="text-xl font-serif mb-4">Cocktail et Réception</h2>
            {renderField('format_cocktail', inputs_mariage.format_cocktail as QuizField)}
            {renderField('type_repas', inputs_mariage.type_repas as QuizField)}
            {renderField('duree_repas', inputs_mariage.duree_repas as QuizField)}
          </>
        );
        
      case 'soiree':
        return (
          <>
            <h2 className="text-xl font-serif mb-4">Soirée et moments clés</h2>
            {renderField('soiree', inputs_mariage.soiree as QuizField)}
            {renderField('temps_forts', inputs_mariage.temps_forts as QuizField)}
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className="border-wedding-olive/20">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="space-y-6">
              {getFieldsForCurrentStep()}
              
              <div className="flex justify-between mt-6 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goToPreviousStep}
                  disabled={formSections.indexOf(currentStep) === 0}
                >
                  Précédent
                </Button>
                
                {formSections.indexOf(currentStep) === formSections.length - 1 ? (
                  <Button type="submit" className="bg-wedding-olive hover:bg-wedding-olive/80">
                    Générer le planning
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={goToNextStep}
                    className="bg-wedding-olive hover:bg-wedding-olive/80"
                  >
                    Suivant
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
