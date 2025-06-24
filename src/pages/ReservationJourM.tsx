
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ReservationJourM = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    wedding_date: '',
    wedding_location: '',
    guest_count: '',
    services_souhaites: [] as string[],
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

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services_souhaites: checked 
        ? [...prev.services_souhaites, service]
        : prev.services_souhaites.filter(s => s !== service)
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
          services_souhaites: formData.services_souhaites,
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
        services_souhaites: [],
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

  const servicesOptions = [
    'Libre',
    'Sereine',
    'Sereine + Hotline', 
    'Privilège',
    'Options supplémentaires'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Demande de réservation Jour-M | Mariable</title>
        <meta name="description" content="Réservez votre service de coordination Jour-M avec Mariable" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/demo-jour-m">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
          </div>
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-serif text-black mb-2">
              Demande de réservation Jour-M
            </h1>
            <p className="text-lg text-gray-700">
              Confiez-nous la coordination de votre mariage
            </p>
          </div>

          <Card>
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
                  <Label className="text-base font-medium">Services souhaités *</Label>
                  <div className="mt-2 space-y-2">
                    {servicesOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={formData.services_souhaites.includes(service)}
                          onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                        />
                        <Label htmlFor={service} className="font-normal">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
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
      </main>
      
      <Footer />
    </div>
  );
};

export default ReservationJourM;
