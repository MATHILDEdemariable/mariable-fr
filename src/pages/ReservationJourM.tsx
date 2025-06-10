
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

const ReservationJourM = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    date_mariage: '',
    lieu_mariage: '',
    nombre_invites: '',
    services_souhaites: [] as string[],
    budget: '',
    message: ''
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
        .from('reservations_jour_m')
        .insert([{
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          date_mariage: formData.date_mariage,
          lieu_mariage: formData.lieu_mariage,
          nombre_invites: parseInt(formData.nombre_invites) || null,
          services_souhaites: formData.services_souhaites,
          budget: formData.budget,
          message: formData.message
        }]);

      if (error) throw error;

      toast({
        title: "Demande envoyée !",
        description: "Nous vous recontacterons dans les plus brefs délais.",
      });

      // Reset form
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        date_mariage: '',
        lieu_mariage: '',
        nombre_invites: '',
        services_souhaites: [],
        budget: '',
        message: ''
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
    'Sereine (149€)',
    'Sereine + Hotline (199€)', 
    'Privilège (799€)',
    'Options supplémentaires (€ selon besoin)'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Demande de réservation Jour-M | Mariable</title>
        <meta name="description" content="Réservez votre service de coordination Jour-M avec Mariable" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-black mb-4">
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
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
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_mariage">Date du mariage *</Label>
                    <Input
                      id="date_mariage"
                      name="date_mariage"
                      type="date"
                      value={formData.date_mariage}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nombre_invites">Nombre d'invités</Label>
                    <Input
                      id="nombre_invites"
                      name="nombre_invites"
                      type="number"
                      value={formData.nombre_invites}
                      onChange={handleInputChange}
                      placeholder="Ex: 80"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lieu_mariage">Lieu du mariage</Label>
                  <Input
                    id="lieu_mariage"
                    name="lieu_mariage"
                    value={formData.lieu_mariage}
                    onChange={handleInputChange}
                    placeholder="Ville ou région"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Services souhaités *</Label>
                  <div className="mt-3 space-y-3">
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
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Parlez-nous de votre projet, vos attentes particulières..."
                    rows={4}
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
