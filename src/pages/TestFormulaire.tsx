import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { jsPDF } from "jspdf";
import { File, Home, Calendar, Loader2 } from "lucide-react";
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import { supabase, type Json } from "@/integrations/supabase/client";

interface FormData {
  style: string;
  relation: string;
  budget: string;
  ambiance: string;
  priority: string;
}

interface StyleScore {
  elegantClassic: number;
  bohemeNature: number;
  romanticFairy: number;
  urbanTrendy: number;
  funFestive: number;
}

interface FormOption {
  value: string;
  label: string;
  style: string;
}

interface FormQuestion {
  id: string;
  question_order: number;
  question_title: string;
  question_label: string;
  input_type: 'select' | 'input' | 'checkbox';
  options: FormOption[] | null;
  default_value: string | null;
  category: string;
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
  const [styleScores, setStyleScores] = useState<StyleScore>({
    elegantClassic: 0,
    bohemeNature: 0,
    romanticFairy: 0,
    urbanTrendy: 0,
    funFestive: 0,
  });
  const [dominantStyle, setDominantStyle] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const styleDescriptions = {
    elegantClassic: {
      title: "Élégance Classique",
      description: "Vous êtes attiré par un mariage raffiné et intemporel. Des lignes épurées, des couleurs neutres comme le blanc, le crème et des touches de dorure. Un lieu prestigieux comme un château ou une demeure de caractère serait parfait pour votre célébration.",
      keyElements: ["Décoration soignée et minimaliste", "Couleurs neutres et or/argent", "Lieu de prestige", "Tenue traditionnelle et élégante"]
    },
    bohemeNature: {
      title: "Bohème Nature",
      description: "Vous êtes attiré par un mariage authentique et proche de la nature. Des matériaux bruts, des fleurs sauvages et une ambiance décontractée caractérisent votre style. Un lieu en extérieur comme une prairie, une forêt ou un jardin serait idéal pour votre célébration.",
      keyElements: ["Décoration avec matériaux naturels", "Fleurs sauvages et verdure", "Lieu en plein air", "Ambiance décontractée et conviviale"]
    },
    romanticFairy: {
      title: "Romantique Féérique",
      description: "Vous êtes attiré par un mariage doux et féerique qui semble tout droit sorti d'un conte. Des couleurs pastels, beaucoup de fleurs et une ambiance enchantée caractérisent votre style. Un lieu poétique comme un jardin fleuri ou une orangerie serait parfait.",
      keyElements: ["Décoration florale abondante", "Couleurs douces et pastels", "Éclairage tamisé et guirlandes", "Détails délicats et romantiques"]
    },
    urbanTrendy: {
      title: "Urbain & Tendance",
      description: "Vous êtes attiré par un mariage moderne et créatif qui sort des sentiers battus. Des lignes graphiques, des couleurs contrastées et des concepts originaux caractérisent votre style. Un lieu atypique comme un loft industriel ou une galerie d'art serait idéal.",
      keyElements: ["Design contemporain et minimaliste", "Touches industrielles ou géométriques", "Lieu atypique et original", "Concepts créatifs et personnalisés"]
    },
    funFestive: {
      title: "Délire Festif",
      description: "Vous êtes attiré par un mariage joyeux et animé où la fête est au centre de tout. Des couleurs vives, une ambiance décontractée et beaucoup d'animations caractérisent votre style. Un lieu convivial et flexible serait parfait pour votre célébration.",
      keyElements: ["Décoration colorée et festive", "Animations et jeux pour les invités", "Ambiance décontractée", "Expériences immersives et surprenantes"]
    }
  };

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data, error } = await supabase
          .from('couple_formulaire')
          .select('*')
          .order('question_order', { ascending: true });

        if (error) throw error;

        // Conversion des données JSON vers le type attendu
        const questionsWithParsedOptions = data.map(q => ({
          ...q,
          options: q.options ? (q.options as any) as FormOption[] : null
        }));

        setQuestions(questionsWithParsedOptions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  const handleChange = (value: string, name: keyof FormData, styleKey: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setStyleScores(prev => ({
      ...prev,
      [styleKey]: prev[styleKey as keyof StyleScore] + 1
    }));
  };

  const calculateDominantStyle = () => {
    let maxScore = 0;
    let dominantStyleKey = "";
    
    Object.entries(styleScores).forEach(([style, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantStyleKey = style;
      }
    });
    
    return dominantStyleKey;
  };
  
  const generatePDF = () => {
    const dominantStyleKey = calculateDominantStyle();
    setDominantStyle(dominantStyleKey);
    
    const styleInfo = styleDescriptions[dominantStyleKey as keyof typeof styleDescriptions];
    
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(127, 148, 116);
    doc.text("Votre Style de Mariage", 105, 20, { align: "center" });
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(styleInfo.title, 105, 30, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(styleInfo.description, 170), 20, 45);
    
    doc.setFont("helvetica", "bold");
    doc.text("Éléments clés pour votre mariage:", 20, 80);
    
    doc.setFont("helvetica", "normal");
    let yPosition = 90;
    styleInfo.keyElements.forEach((element, index) => {
      doc.text(`· ${element}`, 25, yPosition);
      yPosition += 10;
    });
    
    doc.setFont("helvetica", "bold");
    doc.text("Vos réponses:", 20, yPosition + 10);
    doc.setFont("helvetica", "normal");
    
    const responses = [
      { q: "Style de mariage", r: formData.style },
      { q: "Vision du mariage", r: formData.relation },
      { q: "Budget estimé", r: formData.budget },
      { q: "Ambiance souhaitée", r: formData.ambiance },
      { q: "Priorité", r: formData.priority }
    ];
    
    yPosition += 20;
    responses.forEach(({ q, r }, index) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${q}:`, 25, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(r, 80, yPosition);
      yPosition += 10;
    });
    
    yPosition = 260;
    doc.setFontSize(10);
    doc.setTextColor(127, 148, 116);
    doc.text("Créé par Mariable - Votre allié pour un mariage sur-mesure", 105, yPosition, { align: "center" });
    doc.text("www.mariable.fr", 105, yPosition + 6, { align: "center" });
    
    doc.save("votre-style-mariage.pdf");
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setFormData({
      style: '',
      relation: '',
      budget: '',
      ambiance: '',
      priority: '',
    });
    setStyleScores({
      elegantClassic: 0,
      bohemeNature: 0,
      romanticFairy: 0,
      urbanTrendy: 0,
      funFestive: 0,
    });
    setCurrentStep(1);
    setShowResult(false);
    setDominantStyle("");
  };

  const getCurrentQuestion = () => {
    if (loading || questions.length === 0) return null;
    return questions[currentStep - 1];
  };

  const currentQuestion = getCurrentQuestion();

  const renderResultScreen = () => {
    const styleKey = dominantStyle as keyof typeof styleDescriptions;
    const styleInfo = styleDescriptions[styleKey];
    
    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif mb-4 text-wedding-olive">
          Votre style de mariage est :
        </h2>
        <h3 className="text-xl md:text-2xl font-serif mb-6">
          {styleInfo.title}
        </h3>
        
        <p className="mb-6 text-muted-foreground">
          {styleInfo.description}
        </p>
        
        <div className="bg-wedding-cream/20 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-2">Éléments clés pour votre mariage :</h4>
          <ul className="space-y-1">
            {styleInfo.keyElements.map((element, index) => (
              <li key={index} className="flex items-center">
                <span className="text-wedding-olive mr-2">•</span> {element}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button 
            variant="outline"
            onClick={handleReset}
            className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10"
          >
            Refaire le test
          </Button>
          
          <Button 
            onClick={generatePDF}
            className="bg-wedding-olive hover:bg-wedding-olive/90 gap-2"
          >
            <File size={18} />
            Télécharger en PDF
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button 
            onClick={() => navigate('/services/planification')}
            className="bg-wedding-olive hover:bg-wedding-olive/90 gap-2"
          >
            <Calendar size={18} />
            Commencer ma planification
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
            className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10 gap-2"
          >
            <Home size={18} />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  };

  const renderQuestionScreen = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
        </div>
      );
    }

    if (!currentQuestion) {
      return (
        <div className="text-center p-8">
          <p>Aucune question trouvée. Veuillez réessayer plus tard.</p>
        </div>
      );
    }

    return (
      <>
        <div className="mb-8">
          <h2 className="text-xl font-serif mb-6 text-center">
            {currentQuestion.question_title}
          </h2>
          
          {currentQuestion.input_type === 'select' && currentQuestion.options && (
            <RadioGroup
              value={formData[currentQuestion.category as keyof FormData] || ''}
              onValueChange={(value) => {
                const selectedOption = currentQuestion.options?.find(opt => opt.value === value);
                if (selectedOption) {
                  handleChange(value, currentQuestion.category as keyof FormData, selectedOption.style);
                }
              }}
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
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
          >
            Précédent
          </Button>
          
          {currentStep < questions.length ? (
            <Button
              onClick={handleNext}
              disabled={!formData[currentQuestion.category as keyof FormData]}
              className="bg-wedding-olive hover:bg-wedding-olive/90"
            >
              Suivant
            </Button>
          ) : (
            <Button
              onClick={generatePDF}
              disabled={!formData[currentQuestion.category as keyof FormData]}
              className="bg-wedding-olive hover:bg-wedding-olive/90 gap-2"
            >
              <File size={18} />
              Voir mon style
            </Button>
          )}
        </div>
      </>
    );
  };

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
              {!showResult && !loading && questions.length > 0 && (
                <p className="text-muted-foreground mt-2">
                  Question {currentStep} sur {questions.length}
                </p>
              )}
            </CardHeader>
            
            <CardContent>
              {showResult ? renderResultScreen() : renderQuestionScreen()}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TestFormulaire;
