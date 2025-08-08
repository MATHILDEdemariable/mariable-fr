
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Phone, Users, FileText, Bell, Headphones, UserCheck, MapPin, Eye } from 'lucide-react';

const ReservationJourM = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    wedding_date: '',
    wedding_location: '',
    guest_count: '',
    selected_formula: '',
    budget: '',
    current_organization: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormulaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      selected_formula: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('jour_m_reservations')
        .insert([{
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          wedding_date: formData.wedding_date,
          wedding_location: formData.wedding_location,
          guest_count: parseInt(formData.guest_count) || 0,
          services_souhaites: [formData.selected_formula],
          budget: formData.budget,
          current_organization: formData.current_organization
        }]);

      if (error) throw error;

      toast({
        title: "Demande envoyée !",
        description: "Nous vous recontacterons dans les plus brefs délais.",
      });

      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        wedding_date: '',
        wedding_location: '',
        guest_count: '',
        selected_formula: '',
        budget: '',
        current_organization: ''
      });

    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricingData = [
    {
      title: "Libre",
      price: "Gratuite",
      subtitle: "Inscrivez-vous :-)",
      features: [
        { icon: Phone, text: "Application de gestion Jour-J personnalisable (planning, checklist, guide)", included: true, note: "(sans partage)" },
        { icon: Users, text: "Partage de l'application avec vos proches (mode collaboratif)", included: true },
        { icon: UserCheck, text: "Vues personnalisées par rôle / mission assignée", included: true },
        { icon: FileText, text: "Accès aux documents partagés & assignés", included: true },
        { icon: Bell, text: "Notifications et rappels en temps réel (de J-3 à J+1)", included: false },
        { icon: Headphones, text: "Hotline Mariable disponible le jour-J", included: false },
        { icon: MapPin, text: "Coordination des prestataires en amont (J-15)", included: false },
        { icon: Users, text: "Présence physique le jour-J (8h incluses, horaires adaptables)", included: false }
      ]
    },
    {
      title: "Sereine",
      price: "149€",
      subtitle: "",
      features: [
        { icon: Phone, text: "Application de gestion Jour-J personnalisable (planning, checklist, guide)", included: true, note: "(remplie avec notre aide lors d'un RDV visio)" },
        { icon: Users, text: "Partage de l'application avec vos proches (mode collaboratif)", included: true },
        { icon: UserCheck, text: "Vues personnalisées par rôle / mission assignée", included: true },
        { icon: FileText, text: "Accès aux documents partagés & assignés", included: true },
        { icon: Bell, text: "Notifications et rappels en temps réel (de J-3 à J+1)", included: true },
        { icon: Headphones, text: "Hotline Mariable disponible le jour-J", included: true, note: "(option +50€ ou incluse si abonnement ligne directe)" },
        { icon: MapPin, text: "Coordination des prestataires en amont (J-15)", included: false },
        { icon: Users, text: "Présence physique le jour-J (8h incluses, horaires adaptables)", included: false }
      ]
    },
    {
      title: "Privilège",
      price: "799€",
      subtitle: "",
      features: [
        { icon: Phone, text: "Application de gestion Jour-J personnalisable (planning, checklist, guide)", included: true, note: "(remplie avec notre aide lors d'un RDV visio)" },
        { icon: Users, text: "Partage de l'application avec vos proches (mode collaboratif)", included: true },
        { icon: UserCheck, text: "Vues personnalisées par rôle / mission assignée", included: true },
        { icon: FileText, text: "Accès aux documents partagés & assignés", included: true },
        { icon: Bell, text: "Notifications et rappels en temps réel (de J-3 à J+1)", included: true },
        { icon: Headphones, text: "Hotline Mariable disponible le jour-J", included: true, note: "(incluse – accès prioritaire)" },
        { icon: MapPin, text: "Coordination des prestataires en amont (J-15)", included: true },
        { icon: Users, text: "Présence physique le jour-J (8h incluses, horaires adaptables)", included: true, note: "(heures supplémentaires possibles)" }
      ]
    }
  ];

  // Component pour le tableau des formules
  const FormulasTable = () => (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Nos formules Jour-J</CardTitle>
        <p className="text-center text-gray-600">Choisissez votre niveau de sérénité</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-medium">Fonctionnalité</th>
                {pricingData.map((plan) => (
                  <th key={plan.title} className="text-center p-3 font-medium min-w-[120px]">
                    <div className="font-semibold">{plan.title}</div>
                    <div className="text-lg font-bold text-wedding-olive">{plan.price}</div>
                    {plan.subtitle && <div className="text-xs text-gray-500">{plan.subtitle}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricingData[0].features.map((feature, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-left">
                    <div className="flex items-start gap-2">
                      <feature.icon className="h-4 w-4 mt-0.5 text-wedding-olive flex-shrink-0" />
                      <span className="text-xs">{feature.text}</span>
                    </div>
                  </td>
                  {pricingData.map((plan) => (
                    <td key={plan.title} className="p-3 text-center">
                      <div className="flex flex-col items-center">
                        {plan.features[index].included ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                        {plan.features[index].note && (
                          <span className="text-xs text-gray-500 mt-1 text-center">
                            {plan.features[index].note}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
          💡 Des options supplémentaires sont disponibles (visite technique, impression papier, hotline dédiée, etc.)
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Demande de réservation | Mariable</title>
        <meta name="description" content="Réservez votre service de coordination Jour-J avec Mariable" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-black mb-2">
              Demande de réservation
            </h1>
            <p className="text-lg text-gray-700">
              Confiez-nous la coordination de votre mariage
            </p>
          </div>

          {/* Formulaire centré */}
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="first_name">Prénom *</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Nom *</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="wedding_date">Date du mariage *</Label>
                      <Input
                        id="wedding_date"
                        name="wedding_date"
                        type="date"
                        value={formData.wedding_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="guest_count">Nombre d'invités</Label>
                      <Input
                        id="guest_count"
                        name="guest_count"
                        type="number"
                        value={formData.guest_count}
                        onChange={handleInputChange}
                        placeholder="Ex: 80"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="wedding_location">Lieu du mariage</Label>
                    <Input
                      id="wedding_location"
                      name="wedding_location"
                      value={formData.wedding_location}
                      onChange={handleInputChange}
                      placeholder="Ville ou région"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3">Services souhaités *</Label>
                    
                    <RadioGroup value={formData.selected_formula} onValueChange={handleFormulaChange}>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ligne_directe" id="ligne_directe" />
                          <Label htmlFor="ligne_directe" className="flex flex-col">
                            <span>Ligne directe (9,9€/mois jusqu'au jour du mariage)</span>
                            <span className="text-sm text-gray-500 font-normal">Hotline dédiée avec priorité</span>
                          </Label>
                        </div>
                        <div className="ml-6 p-3 bg-orange-50 border-l-4 border-orange-400 text-sm text-orange-700">
                          <span className="font-medium">⚠️ Attention :</span> ceci n'est pas une offre d'organisation de mariage complète ! uniquement une ligne directe pour des questions ponctuelles et des conseils
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-50">
                        <RadioGroupItem value="application_seule" id="application_seule" disabled />
                        <Label htmlFor="application_seule" className="flex flex-col cursor-not-allowed">
                          <span>Application seule (14,9€)</span>
                          <span className="text-sm text-gray-500 font-normal">Paiement direct - pas de demande nécessaire</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="application_support" id="application_support" />
                        <Label htmlFor="application_support" className="flex flex-col">
                          <span>Application + Support téléphonique (24,9€)</span>
                          <span className="text-sm text-gray-500 font-normal">Application + assistance téléphonique</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="privilege" id="privilege" />
                        <Label htmlFor="privilege" className="flex flex-col">
                          <span>Privilège (799€)</span>
                          <span className="text-sm text-gray-500 font-normal">Service complet avec présence physique</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget approximatif</Label>
                    <Input
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="Ex: 15 000€"
                    />
                  </div>

                  <div>
                    <Label htmlFor="current_organization">Message</Label>
                    <Textarea
                      id="current_organization"
                      name="current_organization"
                      value={formData.current_organization}
                      onChange={handleInputChange}
                      placeholder="Parlez-nous de votre projet, vos attentes particulières..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReservationJourM;
