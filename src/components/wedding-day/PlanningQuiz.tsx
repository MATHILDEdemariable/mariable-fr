
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import {
  PlanningFormValues,
  PlanningQuestion,
  PlanningEvent,
  fetchPlanningQuestions,
  isQuestionVisible,
  generatePlanning
} from './types/planningTypes';

interface PlanningQuizProps {
  onSubmit: (data: PlanningFormValues, generatedEvents: PlanningEvent[]) => void;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onStepComplete?: (stepIndex: number) => void;
  stepLabels?: string[];
}

// Centralized categories configuration as single source of truth
const CATEGORIES_CONFIG = [
  { key: 'cérémonie', label: 'Cérémonie(s)', description: 'Informations sur votre/vos cérémonie(s) de mariage' },
  { key: 'logistique', label: 'Logistique', description: 'Temps de trajets et logistique' },
  { key: 'photos', label: 'Photos', description: 'Planification des séances photos' },
  { key: 'cocktail', label: 'Cocktail', description: 'Organisation du cocktail' },
  { key: 'repas', label: 'Repas', description: 'Déroulement du repas' },
  { key: 'soiree', label: 'Soirée', description: 'Organisation de votre soirée' },
  { key: 'préparatifs_final', label: 'Préparatifs', description: 'Préparatifs du matin de votre mariage' }
];

const PlanningQuiz: React.FC<PlanningQuizProps> = ({ 
  onSubmit, 
  currentStep = 0, 
  onStepChange, 
  onStepComplete,
  stepLabels = []
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PlanningQuestion[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  const form = useForm<PlanningFormValues>({
    defaultValues: {},
  });
  
  const watchAllFields = form.watch();
  
  // Get current category based on step
  const currentCategory = availableCategories[currentCategoryIndex] || '';
  
  // Fetch planning questions from Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await fetchPlanningQuestions(supabase);
        setQuestions(data.allQuestions);
        
        // Initialize available categories based on base config
        const baseCategories = CATEGORIES_CONFIG.map(cat => cat.key);
        setAvailableCategories(baseCategories);
        
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors du chargement des questions');
        console.error('Error loading planning questions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, []);
  
  // Update available categories when form values change (for conditional logic)
  useEffect(() => {
    const baseCategories = CATEGORIES_CONFIG.map(cat => cat.key);
    let dynamicCategories = [...baseCategories];
    
    // Add préparatifs_2 if double ceremony is selected
    if (watchAllFields.double_ceremonie === 'oui') {
      // Insert préparatifs_2 before préparatifs_final
      const finalPrepIndex = dynamicCategories.indexOf('préparatifs_final');
      if (finalPrepIndex > -1) {
        dynamicCategories.splice(finalPrepIndex, 0, 'préparatifs_2');
      }
    }
    
    setAvailableCategories(dynamicCategories);
  }, [watchAllFields.double_ceremonie]);
  
  // Sync with parent step changes
  useEffect(() => {
    if (currentStep !== currentCategoryIndex) {
      setCurrentCategoryIndex(currentStep);
    }
  }, [currentStep]);
  
  // Handle navigation between categories
  const handleNextStep = () => {
    const nextIndex = currentCategoryIndex + 1;
    
    if (nextIndex < availableCategories.length) {
      setCurrentCategoryIndex(nextIndex);
      if (onStepChange) {
        onStepChange(nextIndex);
      }
      if (onStepComplete) {
        onStepComplete(currentCategoryIndex);
      }
    }
  };
  
  const handlePrevStep = () => {
    const prevIndex = currentCategoryIndex - 1;
    
    if (prevIndex >= 0) {
      setCurrentCategoryIndex(prevIndex);
      if (onStepChange) {
        onStepChange(prevIndex);
      }
    }
  };
  
  // Handle form submission
  const handleFormSubmit = (data: PlanningFormValues) => {
    try {
      // Generate the planning based on the form responses
      const generatedPlanning = generatePlanning(questions, data);
      onSubmit(data, generatedPlanning);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération du planning');
      console.error('Error generating planning:', err);
    }
  };
  
  // Helper to render appropriate input based on question type
  const renderQuestionInput = (question: PlanningQuestion) => {
    const { type, option_name } = question;
    
    switch (type) {
      case 'choix':
        return (
          <FormField
            key={option_name}
            control={form.control}
            name={option_name}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {question.options && Array.isArray(question.options) && question.options.map((option, index) => {
                      const optionValue = typeof option === 'object' ? option.valeur : option;
                      const optionLabel = typeof option === 'object' 
                        ? `${option.valeur} (${option.duree_minutes} minutes)`
                        : option;
                        
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={optionValue} id={`${option_name}-${index}`} />
                          <label htmlFor={`${option_name}-${index}`} className="text-sm">{optionLabel}</label>
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
            key={option_name}
            control={form.control}
            name={option_name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <div className="flex flex-col space-y-2">
                  {question.options && Array.isArray(question.options) && question.options.map((option, index) => {
                    const optionValue = typeof option === 'object' ? option.valeur : option;
                    const optionLabel = typeof option === 'object' 
                      ? `${option.valeur} (${option.duree_minutes} minutes)`
                      : option;
                      
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${option_name}-${index}`}
                          checked={(field.value || []).includes(optionValue)}
                          onCheckedChange={(checked) => {
                            const updatedValue = field.value || [];
                            if (checked) {
                              field.onChange([...updatedValue, optionValue]);
                            } else {
                              field.onChange(updatedValue.filter((v: string) => v !== optionValue));
                            }
                          }}
                        />
                        <label htmlFor={`${option_name}-${index}`} className="text-sm">{optionLabel}</label>
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
            key={option_name}
            control={form.control}
            name={option_name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field} 
                    className="w-full max-w-[200px]"
                  />
                </FormControl>
                <FormDescription>
                  Heure au format 24h (ex: 14:30)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'number':
        return (
          <FormField
            key={option_name}
            control={form.control}
            name={option_name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="w-full max-w-[200px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'texte':
        return (
          <FormField
            key={option_name}
            control={form.control}
            name={option_name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'fixe':
        return (
          <div key={option_name} className="space-y-2">
            <h3 className="font-medium">{question.label}</h3>
            <p className="text-sm text-gray-500">
              {question.duree_minutes > 0 ? `Durée prévue: ${question.duree_minutes} minutes` : ''}
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Special renderer for ceremony section with fixed conditional fieldsets
  const renderCeremonySection = () => {
    const isDualCeremony = watchAllFields.double_ceremonie === 'oui';
    
    // Find the double ceremony question
    const doubleCeremonyQuestion = questions.find(q => q.option_name === 'double_ceremonie');
    
    return (
      <div className="space-y-6">
        {/* Double ceremony question - always shown first */}
        {doubleCeremonyQuestion && renderQuestionInput(doubleCeremonyQuestion)}
        
        {/* Conditional rendering based on double ceremony choice */}
        {isDualCeremony ? (
          <>
            {/* First ceremony fieldset */}
            <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
              <legend className="text-lg font-medium px-2">Première cérémonie</legend>
              <FormField
                control={form.control}
                name="heure_ceremonie_1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de la 1ère cérémonie</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        className="w-full max-w-[200px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Heure au format 24h (ex: 14:30)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type_ceremonie_1"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Type de la 1ère cérémonie</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="civile" id="type_ceremonie_1-civile" />
                          <label htmlFor="type_ceremonie_1-civile" className="text-sm">civile (30 minutes)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="religieuse" id="type_ceremonie_1-religieuse" />
                          <label htmlFor="type_ceremonie_1-religieuse" className="text-sm">religieuse (90 minutes)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="laique" id="type_ceremonie_1-laique" />
                          <label htmlFor="type_ceremonie_1-laique" className="text-sm">laïque (60 minutes)</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            
            {/* Second ceremony fieldset */}
            <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
              <legend className="text-lg font-medium px-2">Deuxième cérémonie</legend>
              <FormField
                control={form.control}
                name="heure_ceremonie_2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de la 2ème cérémonie</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        className="w-full max-w-[200px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Heure au format 24h (ex: 14:30)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type_ceremonie_2"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Type de la 2ème cérémonie</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="civile" id="type_ceremonie_2-civile" />
                          <label htmlFor="type_ceremonie_2-civile" className="text-sm">civile (30 minutes)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="religieuse" id="type_ceremonie_2-religieuse" />
                          <label htmlFor="type_ceremonie_2-religieuse" className="text-sm">religieuse (90 minutes)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="laique" id="type_ceremonie_2-laique" />
                          <label htmlFor="type_ceremonie_2-laique" className="text-sm">laïque (60 minutes)</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </>
        ) : (
          /* Single ceremony fieldset */
          <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
            <legend className="text-lg font-medium px-2">Votre cérémonie</legend>
            <FormField
              control={form.control}
              name="heure_ceremonie_principale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure de la cérémonie principale</FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                      className="w-full max-w-[200px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Heure au format 24h (ex: 14:30)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type_ceremonie_principale"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Type de la cérémonie principale</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="civile" id="type_ceremonie_principale-civile" />
                        <label htmlFor="type_ceremonie_principale-civile" className="text-sm">civile (30 minutes)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="religieuse" id="type_ceremonie_principale-religieuse" />
                        <label htmlFor="type_ceremonie_principale-religieuse" className="text-sm">religieuse (90 minutes)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="laique" id="type_ceremonie_principale-laique" />
                        <label htmlFor="type_ceremonie_principale-laique" className="text-sm">laïque (60 minutes)</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        )}
      </div>
    );
  };

  // Special renderer for logistics section with conditional dual ceremony fields
  const renderLogisticsSection = () => {
    const isDualCeremony = watchAllFields.double_ceremonie === 'oui';
    
    return (
      <div className="space-y-6">
        {/* Regular logistics questions that are always shown */}
        {questions
          .filter(q => q.categorie === 'logistique' && q.option_name !== 'trajet_entre_lieux')
          .filter(q => isQuestionVisible(q, watchAllFields))
          .map(question => (
            <div key={question.id} className="py-2">
              {renderQuestionInput(question)}
            </div>
          ))}
        
        {/* Conditional dual ceremony logistics */}
        {isDualCeremony && (
          <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
            <legend className="text-lg font-medium px-2">Trajets pour double cérémonie</legend>
            
            <FormField
              control={form.control}
              name="trajet_1_depart_ceremonie_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trajet 1: point de départ ➝ cérémonie 1</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full max-w-[200px]"
                      placeholder="Durée en minutes"
                    />
                  </FormControl>
                  <FormDescription>
                    Temps de trajet en minutes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="trajet_2_ceremonie_1_arrivee_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trajet 2: cérémonie 1 ➝ point d'arrivée 1</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full max-w-[200px]"
                      placeholder="Durée en minutes"
                    />
                  </FormControl>
                  <FormDescription>
                    Temps de trajet en minutes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="trajet_3_depart_ceremonie_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trajet 3: point de départ ➝ cérémonie 2</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full max-w-[200px]"
                      placeholder="Durée en minutes"
                    />
                  </FormControl>
                  <FormDescription>
                    Temps de trajet en minutes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="trajet_4_ceremonie_2_arrivee_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trajet 4: cérémonie 2 ➝ point d'arrivée 2</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full max-w-[200px]"
                      placeholder="Durée en minutes"
                    />
                  </FormControl>
                  <FormDescription>
                    Temps de trajet en minutes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        )}
      </div>
    );
  };

  // Special renderer for preparatifs section with conditional preparatifs 2
  const renderPreparatifsSection = () => {
    const isDualCeremony = watchAllFields.double_ceremonie === 'oui';
    const isPreparatifs2 = currentCategory === 'préparatifs_2';
    
    if (isPreparatifs2) {
      return (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Préparatifs avant la 2ème cérémonie</h3>
            <p className="text-sm text-blue-700">
              Choisissez les étapes de préparation à répéter avant votre deuxième cérémonie.
            </p>
          </div>
          
          <FormField
            control={form.control}
            name="preparatifs_2_coiffure"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Retouche coiffure</FormLabel>
                  <FormDescription>
                    Retouche et remise en forme de la coiffure (30 minutes)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="preparatifs_2_maquillage"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Retouche maquillage</FormLabel>
                  <FormDescription>
                    Retouche du maquillage et finalisation (30 minutes)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="preparatifs_2_habillage"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Changement de tenue</FormLabel>
                  <FormDescription>
                    Changement ou ajustement de la tenue (45 minutes)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      );
    }
    
    // Regular preparatifs section
    const currentQuestions = questions
      .filter(q => q.categorie === 'préparatifs_final')
      .filter(q => isQuestionVisible(q, watchAllFields));

    return (
      <div className="space-y-6">
        {currentQuestions.map(question => (
          <div key={question.id} className="py-2">
            {renderQuestionInput(question)}
          </div>
        ))}
      </div>
    );
  };
  
  // Component to render current section questions
  const CurrentSectionQuestions = () => {
    // Special handling for ceremony section
    if (currentCategory === 'cérémonie') {
      return renderCeremonySection();
    }
    
    // Special handling for logistics section
    if (currentCategory === 'logistique') {
      return renderLogisticsSection();
    }
    
    // Special handling for preparatifs sections
    if (currentCategory === 'préparatifs_final' || currentCategory === 'préparatifs_2') {
      return renderPreparatifsSection();
    }
    
    // Filter questions by current section and visibility conditions
    const currentQuestions = questions
      .filter(q => q.categorie === currentCategory)
      .filter(q => isQuestionVisible(q, watchAllFields));

    if (currentQuestions.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Aucune question disponible pour cette section.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {currentQuestions.map(question => (
          <div key={question.id} className="py-2">
            {renderQuestionInput(question)}
          </div>
        ))}
      </div>
    );
  };
  
  // Get section config helper
  const getCurrentCategoryConfig = () => {
    if (currentCategory === 'préparatifs_2') {
      return { key: 'préparatifs_2', label: 'Préparatifs 2', description: 'Préparatifs avant la 2ème cérémonie' };
    }
    
    return CATEGORIES_CONFIG.find(cat => cat.key === currentCategory) || 
           { key: currentCategory, label: currentCategory, description: '' };
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-wedding-olive"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">
            <p>Erreur: {error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const currentCategoryConfig = getCurrentCategoryConfig();
  
  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Section title */}
            <div className="border-b pb-4 mb-6">
              <h2 className="text-xl font-serif">{currentCategoryConfig.label}</h2>
              <p className="text-sm text-gray-500">
                {currentCategoryConfig.description}
              </p>
            </div>
            
            {/* Current section questions */}
            <CurrentSectionQuestions />
            
            {/* Navigation buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentCategoryIndex === 0}
              >
                Précédent
              </Button>
              
              {currentCategoryIndex === availableCategories.length - 1 ? (
                <Button 
                  type="submit"
                  className="bg-wedding-olive hover:bg-wedding-olive/80"
                >
                  Générer le planning
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-wedding-olive hover:bg-wedding-olive/80"
                >
                  Suivant
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PlanningQuiz;
