
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { jsPDF } from "jspdf";
import Header from '@/components/Header';
import SEO from '@/components/SEO';

interface FormData {
  style: string;
  relation: string;
  budget: string;
  ambiance: string;
  priority: string;
}

const TestFormulaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    style: '',
    relation: '',
    budget: '',
    ambiance: '',
    priority: '',
  });

  const questions = [
    {
      id: 1,
      title: "Quel style de mariage vous fait rêver ?",
      name: "style",
      options: [
        { value: "boheme", label: "Bohème & Nature" },
        { value: "classique", label: "Élégant & Classique" },
        { value: "moderne", label: "Contemporain & Moderne" },
        { value: "champetre", label: "Champêtre & Rustique" }
      ]
    },
    {
      id: 2,
      title: "Quelle est votre vision du mariage ?",
      name: "relation",
      options: [
        { value: "reve", label: "Un rêve d'enfant qui se réalise" },
        { value: "simple", label: "Une célébration simple et authentique" },
        { value: "unique", label: "Un événement unique et mémorable" },
        { value: "intime", label: "Un moment intime avec nos proches" }
      ]
    },
    {
      id: 3,
      title: "Quel est votre budget global estimé ?",
      name: "budget",
      options: [
        { value: "15-25", label: "15 000€ - 25 000€" },
        { value: "25-35", label: "25 000€ - 35 000€" },
        { value: "35-50", label: "35 000€ - 50 000€" },
        { value: "50+", label: "Plus de 50 000€" }
      ]
    },
    {
      id: 4,
      title: "Quelle ambiance souhaitez-vous créer ?",
      name: "ambiance",
      options: [
        { value: "festive", label: "Festive & Conviviale" },
        { value: "romantique", label: "Romantique & Poétique" },
        { value: "elegante", label: "Élégante & Raffinée" },
        { value: "decontractee", label: "Décontractée & Joyeuse" }
      ]
    },
    {
      id: 5,
      title: "Quelle est votre priorité absolue ?",
      name: "priority",
      options: [
        { value: "lieu", label: "Le lieu de réception" },
        { value: "ambiance", label: "L'ambiance générale" },
        { value: "repas", label: "Le repas et les boissons" },
        { value: "deco", label: "La décoration et les fleurs" }
      ]
    }
  ];

  const handleChange = (value: string, name: keyof FormData) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Votre profil mariage", 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    const responses = [
      { q: "Style de mariage", r: formData.style },
      { q: "Vision du mariage", r: formData.relation },
      { q: "Budget estimé", r: formData.budget },
      { q: "Ambiance souhaitée", r: formData.ambiance },
      { q: "Priorité", r: formData.priority }
    ];

    let yPosition = 40;
    responses.forEach(({ q, r }) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${q}:`, 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(r, 80, yPosition);
      yPosition += 10;
    });

    doc.save("profil-mariage.pdf");
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentStep - 1];

  return (
    <div className="min-h-screen bg-wedding-cream/20">
      <SEO 
        title="Test - Votre Style de Mariage"
        description="Découvrez votre style de mariage idéal grâce à notre questionnaire personnalisé"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-md">
            <CardHeader className="text-center">
              <h1 className="text-2xl md:text-3xl font-serif text-wedding-black">
                Découvrez votre style de mariage
              </h1>
              <p className="text-muted-foreground mt-2">
                Question {currentStep} sur 5
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="mb-8">
                <h2 className="text-xl font-serif mb-6 text-center">
                  {currentQuestion.title}
                </h2>
                
                <RadioGroup
                  value={formData[currentQuestion.name as keyof FormData]}
                  onValueChange={(value) => handleChange(value, currentQuestion.name as keyof FormData)}
                  className="space-y-4"
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-wedding-cream/10 transition-colors">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-grow cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  variant="outline"
                >
                  Précédent
                </Button>
                
                {currentStep < 5 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!formData[currentQuestion.name as keyof FormData]}
                    className="bg-wedding-olive hover:bg-wedding-olive/90"
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    onClick={generatePDF}
                    disabled={!formData.priority}
                    className="bg-wedding-olive hover:bg-wedding-olive/90"
                  >
                    Générer mon profil
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TestFormulaire;
