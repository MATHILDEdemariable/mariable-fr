
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, MapPin, Users, Heart, Upload, FileText, Phone, Mail } from 'lucide-react';
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
    hearAboutUs: '',
    documentsLinks: '',
    prestatairePhotographe: '',
    prestataireDJ: '',
    prestataireTraiteur: '',
    prestataireFleuriste: '',
    prestataireMaquillage: '',
    prestataireAutres: '',
    deroulementMariage: '',
    contactNom: '',
    contactTelephone: '',
    contactRole: '',
    contactCommentaire: '',
    servicePresencePhysique: false,
    servicePresence2Jours: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Envoi de la demande de réservation:', formData);
      
      // Préparer les données pour la base
      const prestataireData = {
        photographe: formData.prestatairePhotographe,
        dj_musique: formData.prestataireDJ,
        traiteur: formData.prestataireTraiteur,
        fleuriste: formData.prestataireFleuriste,
        maquillage_coiffure: formData.prestataireMaquillage,
        autres: formData.prestataireAutres
      };

      const contactJourJ = {
        nom: formData.contactNom,
        telephone: formData.contactTelephone,
        role: formData.contactRole,
        commentaire: formData.contactCommentaire
      };

      const servicesSouhaites = [];
      if (formData.servicePresencePhysique) servicesSouhaites.push('presence_physique');
      if (formData.servicePresence2Jours) servicesSouhaites.push('presence_2_jours');

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
            hear_about_us: formData.hearAboutUs || null,
            documents_links: formData.documentsLinks || null,
            prestataires_reserves: prestataireData,
            deroulement_mariage: formData.deroulementMariage || null,
            contact_jour_j: contactJourJ,
            services_souhaites: servicesSouhaites
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
        hearAboutUs: '',
        documentsLinks: '',
        prestatairePhotographe: '',
        prestataireDJ: '',
        prestataireTraiteur: '',
        prestataireFleuriste: '',
        prestataireMaquillage: '',
        prestataireAutres: '',
        deroulementMariage: '',
        contactNom: '',
        contactTelephone: '',
        contactRole: '',
        contactCommentaire: '',
        servicePresencePhysique: false,
        servicePresence2Jours: false
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
        <title>Demande de réservation – Coordination Jour M | Mariable</title>
        <meta name="description" content="Réservez votre service de coordination Le Jour M pour un mariage parfaitement orchestré" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">💎</span>
              <h1 className="text-4xl md:text-5xl font-serif text-black">
                Demande de réservation – Coordination Jour M
              </h1>
            </div>
            <p className="text-xl text-gray-700 mb-4">
              Un jour J orchestré
            </p>
            <div className="inline-flex items-center gap-4 bg-wedding-olive/10 px-6 py-3 rounded-lg">
              <span className="text-2xl font-bold text-wedding-olive">550 € TTC</span>
              <span className="text-sm text-gray-600">(au lieu de 1000 € - offre de lancement)</span>
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Informations personnelles</h3>
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
                </div>

                {/* Informations mariage */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
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

                  <div>
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

                  <div>
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

                {/* Documents à envoyer */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-wedding-olive" />
                    Documents à envoyer
                  </h3>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      Merci de nous transmettre les documents déjà en votre possession pour faciliter la coordination soit par mail 
                      (transfert à l'adresse <strong>mathilde@mariable.fr</strong>) soit via ce formulaire :
                    </p>
                    <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                      <li>Planning prévisionnel (même brouillon)</li>
                      <li>Liste des prestataires</li>
                      <li>Devis & contrats si disponibles</li>
                      <li>Plan de table ou plan de salle si disponible</li>
                      <li>Liste des rôles attribués aux témoins / proches</li>
                      <li>Moodboard / inspirations / éléments de déco</li>
                      <li>Autres documents utiles (discours, playlists, checklists…)</li>
                    </ul>
                  </div>

                  <div>
                    <Label htmlFor="documentsLinks">Lien Google Drive ou autre plateforme de partage</Label>
                    <Input
                      id="documentsLinks"
                      name="documentsLinks"
                      value={formData.documentsLinks}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                {/* Prestataires déjà réservés */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Prestataires déjà réservés</h3>
                  <p className="text-sm text-gray-600">
                    Merci de nous indiquer les prestataires déjà confirmés (et ceux manquants) :
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prestatairePhotographe">Photographe</Label>
                      <Input
                        id="prestatairePhotographe"
                        name="prestatairePhotographe"
                        value={formData.prestatairePhotographe}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Nom du photographe ou 'À trouver'"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prestataireDJ">DJ / Musique</Label>
                      <Input
                        id="prestataireDJ"
                        name="prestataireDJ"
                        value={formData.prestataireDJ}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Nom du DJ ou 'À trouver'"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prestataireTraiteur">Traiteur</Label>
                      <Input
                        id="prestataireTraiteur"
                        name="prestataireTraiteur"
                        value={formData.prestataireTraiteur}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Nom du traiteur ou 'À trouver'"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prestataireFleuriste">Fleuriste</Label>
                      <Input
                        id="prestataireFleuriste"
                        name="prestataireFleuriste"
                        value={formData.prestataireFleuriste}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Nom du fleuriste ou 'À trouver'"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prestataireMaquillage">Maquilleuse / Coiffeuse</Label>
                      <Input
                        id="prestataireMaquillage"
                        name="prestataireMaquillage"
                        value={formData.prestataireMaquillage}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Nom de la maquilleuse ou 'À trouver'"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prestataireAutres">Autres prestataires</Label>
                      <Input
                        id="prestataireAutres"
                        name="prestataireAutres"
                        value={formData.prestataireAutres}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Ex: Officiant, animateur..."
                      />
                    </div>
                  </div>
                </div>

                {/* Déroulé global du mariage */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-wedding-olive" />
                    Déroulé global du mariage
                  </h3>
                  
                  <div>
                    <Label htmlFor="deroulementMariage">
                      Indiquez ici les grandes étapes prévues du jour J (facultatif mais très utile)
                    </Label>
                    <Textarea
                      id="deroulementMariage"
                      name="deroulementMariage"
                      value={formData.deroulementMariage}
                      onChange={handleInputChange}
                      className="mt-1"
                      rows={5}
                      placeholder="Ex: 14h - Cérémonie civile à la mairie, 16h - Cérémonie religieuse à l'église, 17h - Cocktail au château, 20h - Dîner, 22h - Ouverture de bal..."
                    />
                  </div>
                </div>

                {/* Personne de contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-wedding-olive" />
                    Personne de contact (autre que les mariés)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pour le jour J = relai logistique
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactNom">Nom</Label>
                      <Input
                        id="contactNom"
                        name="contactNom"
                        value={formData.contactNom}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Prénom et nom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactTelephone">Téléphone</Label>
                      <Input
                        id="contactTelephone"
                        name="contactTelephone"
                        value={formData.contactTelephone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactRole">Rôle</Label>
                      <Input
                        id="contactRole"
                        name="contactRole"
                        value={formData.contactRole}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Ex: témoin principal, frère, amie coordinatrice..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactCommentaire">Commentaire (si besoin)</Label>
                      <Input
                        id="contactCommentaire"
                        name="contactCommentaire"
                        value={formData.contactCommentaire}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Informations supplémentaires"
                      />
                    </div>
                  </div>
                </div>

                {/* Services souhaités */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Services souhaités</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="servicePresencePhysique"
                        checked={formData.servicePresencePhysique}
                        onCheckedChange={(checked) => handleCheckboxChange('servicePresencePhysique', checked as boolean)}
                      />
                      <Label htmlFor="servicePresencePhysique" className="text-sm">
                        Présence physique le jour J de 11h à 21h (+200€)
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="servicePresence2Jours"
                        checked={formData.servicePresence2Jours}
                        onCheckedChange={(checked) => handleCheckboxChange('servicePresence2Jours', checked as boolean)}
                      />
                      <Label htmlFor="servicePresence2Jours" className="text-sm">
                        Présence physique 2 jours (nous contacter pour devis)
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Organisation actuelle */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
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

                  <div>
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
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Comment nous avez-vous connus</h3>
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
                      <li>• Nous vous recontactons sous 24h</li>
                      <li>• Appel découverte</li>
                      <li>• Lancement de la coordination après validation</li>
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
