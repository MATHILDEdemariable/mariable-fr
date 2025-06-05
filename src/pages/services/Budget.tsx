
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, PieChart, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Budget = () => {
  const navigate = useNavigate();

  const budgetCategories = [
    { name: "Lieu de réception", percentage: 35, amount: "7 000€" },
    { name: "Traiteur", percentage: 25, amount: "5 000€" },
    { name: "Photographe", percentage: 10, amount: "2 000€" },
    { name: "Robe et costume", percentage: 8, amount: "1 600€" },
    { name: "Fleurs et décoration", percentage: 8, amount: "1 600€" },
    { name: "Musique", percentage: 6, amount: "1 200€" },
    { name: "Transport", percentage: 4, amount: "800€" },
    { name: "Divers", percentage: 4, amount: "800€" }
  ];

  const budgetTips = [
    {
      title: "Définissez vos priorités",
      description: "Identifiez les éléments les plus importants pour vous et allouez-y plus de budget."
    },
    {
      title: "Prévoyez une marge",
      description: "Gardez 10-15% de votre budget total pour les imprévus et derniers ajouts."
    },
    {
      title: "Négociez avec les prestataires",
      description: "N'hésitez pas à demander des devis détaillés et à négocier certains services."
    },
    {
      title: "Suivez vos dépenses",
      description: "Utilisez notre outil de suivi pour ne pas dépasser votre budget initial."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Budget de mariage | Mariable</title>
        <meta name="description" content="Calculez et gérez votre budget de mariage avec nos outils et conseils d'experts." />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-4">Budget de mariage</h1>
          <p className="text-muted-foreground">
            Planifiez et suivez votre budget de mariage en toute sérénité
          </p>
        </div>

        {/* Calculatrice de budget */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculatrice de budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Utilisez notre calculatrice pour estimer le budget de votre mariage selon vos critères.
            </p>
            <Button 
              className="bg-wedding-olive hover:bg-wedding-olive/90"
              onClick={() => navigate('/dashboard/budget/calculator')}
            >
              Calculer mon budget
            </Button>
          </CardContent>
        </Card>

        {/* Répartition moyenne du budget */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Répartition moyenne d'un budget de mariage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Voici comment se répartit généralement un budget de 20 000€ :
            </p>
            <div className="space-y-3">
              {budgetCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-wedding-olive h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-sm min-w-0 flex-shrink-0">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground ml-2">
                      {category.percentage}% - {category.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conseils budget */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Conseils pour optimiser votre budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgetTips.map((tip, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to action */}
        <div className="text-center p-6 bg-wedding-cream/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Gérez votre budget en détail</h3>
          <p className="text-muted-foreground mb-4">
            Créez votre compte pour accéder à notre outil de gestion de budget complet.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/register')}>
              Créer un compte
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/budget')}>
              Voir le tableau de bord
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Budget;
