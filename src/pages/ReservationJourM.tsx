
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ReservationJourM = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    partnerName: '',
    weddingDate: '',
    weddingLocation: '',
    guestCount: '',
    budget: '',
    currentOrganization: '',
    specificNeeds: '',
    hearAboutUs: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Envoi de la demande de réservation:', formData);
      
      const { data, error } = await supabase
        .from('jour_m_reservations')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            partner_name: formData.partnerName || null,
            wedding_date: formData.weddingDate,
            wedding_location: formData.weddingLocation,
            guest_count: parseInt(formData.guestCount),
            budget: formData.budget || null,
            current_organization: formData.currentOrganization,
            specific_needs: formData.specificNeeds || null,
            hear_about_us: formData.hearAboutUs || null
          }
        ]);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log('Demande enregistrée avec succès:', data);
      
      toast({
        title: "Demande envoyée avec succès !",
        description: "Nous vous recontacterons dans les 24h pour programmer votre consultation.",
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        partnerName: '',
        weddingDate: '',
        weddingLocation: '',
        guestCount: '',
        budget: '',
        currentOrganization: '',
        specificNeeds: '',
        hearAboutUs: ''
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Réservation Le Jour M | Mariable</title>
        <meta name="description" content="Réservez votre service de coordination Le Jour M pour un mariage parfaitement orchestré" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">💎</span>
              <h1 className="text-4xl md:text-5xl font-serif text-black">
                Le Jour M
              </h1>
            </div>
            <p className="text-xl text-gray-700 mb-4">
              Un jour J orchestré
            </p>
            <div className="inline-flex items-center gap-4 bg-wedding-olive/10 px-6 py-3 rounded-lg">
              <span className="text-2xl font-bold text-wedding-olive">750 € TTC</span>
              <span className="text-sm text-gray-600">(au lieu de 1 000 € - offre de lancement)</span>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-center">
                Formulaire de réservation
              </CardTitle>
              <p className="text-center text-gray-600">
                Remplissez ce formulaire pour réserver votre service de coordination
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
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
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="partnerName">Nom de votre partenaire</Label>
                  <Input
                    id="partnerName"
                    name="partnerName"
                    value={formData.partnerName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                {/* Informations mariage */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-wedding-olive" />
                    Informations sur votre mariage
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weddingDate">Date du mariage *</Label>
                      <Input
                        id="weddingDate"
                        name="weddingDate"
                        type="date"
                        value={formData.weddingDate}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guestCount">Nombre d'invités approximatif *</Label>
                      <Input
                        id="guestCount"
                        name="guestCount"
                        type="number"
                        value={formData.guestCount}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="Ex: 80"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="weddingLocation">Lieu du mariage (ville/région) *</Label>
                    <Input
                      id="weddingLocation"
                      name="weddingLocation"
                      value={formData.weddingLocation}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="Ex: Lyon, Provence, Château de..."
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="budget">Budget global approximatif</Label>
                    <Input
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Ex: 25 000 €"
                    />
                  </div>
                </div>

                {/* Organisation actuelle */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Votre organisation actuelle
                  </h3>
                  
                  <div>
                    <Label htmlFor="currentOrganization">
                      Où en êtes-vous dans votre organisation ? *
                    </Label>
                    <Textarea
                      id="currentOrganization"
                      name="currentOrganization"
                      value={formData.currentOrganization}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      rows={4}
                      placeholder="Décrivez brièvement l'état d'avancement de votre organisation (prestataires réservés, planning établi, etc.)"
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="specificNeeds">
                      Besoins spécifiques ou points d'attention particuliers
                    </Label>
                    <Textarea
                      id="specificNeeds"
                      name="specificNeeds"
                      value={formData.specificNeeds}
                      onChange={handleInputChange}
                      className="mt-1"
                      rows={3}
                      placeholder="Y a-t-il des aspects de votre mariage qui vous préoccupent particulièrement ?"
                    />
                  </div>
                </div>

                {/* Comment nous avez-vous connus */}
                <div className="border-t pt-6">
                  <div>
                    <Label htmlFor="hearAboutUs">Comment avez-vous entendu parler de Mariable ?</Label>
                    <Input
                      id="hearAboutUs"
                      name="hearAboutUs"
                      value={formData.hearAboutUs}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Ex: Instagram, bouche-à-oreille, Google..."
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="bg-wedding-olive/10 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold mb-2">Prochaines étapes :</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Nous vous recontacterons dans les 24h</li>
                      <li>• Planification d'un appel de découverte (15-20 min)</li>
                      <li>• Envoi d'un devis personnalisé</li>
                      <li>• Signature du contrat et début de la coordination</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white py-3"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande de réservation'}
                  </Button>
                </div>
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
