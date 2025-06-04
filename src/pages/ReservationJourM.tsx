
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
import { Calendar, MapPin, Users, Heart, Upload, FileText, Phone, CheckSquare } from 'lucide-react';
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
    // Nouveaux champs
    deroulementMariage: '',
    documentsLinks: '',
    uploadedFiles: [],
    prestataireReserves: {
      photographe: '',
      dj_musique: '',
      traiteur: '',
      fleuriste: '',
      maquilleuse_coiffeuse: '',
      autre: ''
    },
    contactJourJ: {
      nom: '',
      telephone: '',
      role: '',
      commentaire: ''
    },
    servicesSouhaites: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('prestataires.')) {
      const prestataireType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        prestataireReserves: {
          ...prev.prestataireReserves,
          [prestataireType]: value
        }
      }));
    } else if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactJourJ: {
          ...prev.contactJourJ,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      servicesSouhaites: checked 
        ? [...prev.servicesSouhaites, service]
        : prev.servicesSouhaites.filter(s => s !== service)
    }));
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
            hear_about_us: formData.hearAboutUs || null,
            deroulement_mariage: formData.deroulementMariage || null,
            documents_links: formData.documentsLinks || null,
            uploaded_files: formData.uploadedFiles,
            prestataires_reserves: formData.prestataireReserves,
            contact_jour_j: formData.contactJourJ,
            services_souhaites: formData.servicesSouhaites
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
        deroulementMariage: '',
        documentsLinks: '',
        uploadedFiles: [],
        prestataireReserves: {
          photographe: '',
          dj_musique: '',
          traiteur: '',
          fleuriste: '',
          maquilleuse_coiffeuse: '',
          autre: ''
        },
        contactJourJ: {
          nom: '',
          telephone: '',
          role: '',
          commentaire: ''
        },
        servicesSouhaites: []
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

  const servicesOptions = [
    'Présence physique le jour J',
    'Présence physique 2 jours'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Demande de réservation – Coordination Jour M | Mariable</title>
        <meta name="description" content="Demande de réservation pour notre service de coordination Le Jour M" />
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
              <span className="text-2xl font-bold text-wedding-olive">750 € TTC</span>
              <span className="text-sm text-gray-600">(au lieu de 1 000 € - offre de lancement)</span>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-center">
                Formulaire de demande de réservation
              </CardTitle>
              <p className="text-center text-gray-600">
                Remplissez ce formulaire pour faire votre demande de réservation
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informations personnelles */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-wedding-olive" />
                    Informations personnelles
                  </h3>
                  
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

                  <div className="mt-4">
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
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-wedding-olive" />
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

                {/* Documents à envoyer */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-wedding-olive" />
                    📎 Documents à envoyer
                  </h3>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-800 mb-2">
                      Merci de nous transmettre les documents déjà en votre possession pour faciliter la coordination soit via le formulaire soit par mail à l'adresse 
                      <strong> mathilde@mariable.fr</strong>
                    </p>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="documentsLinks">📤 Liens Google Drive / Pinterest ou autres</Label>
                    <Textarea
                      id="documentsLinks"
                      name="documentsLinks"
                      value={formData.documentsLinks}
                      onChange={handleInputChange}
                      className="mt-1"
                      rows={3}
                      placeholder="Insérez ici vos liens Google Drive, Pinterest ou autres partages..."
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Documents utiles :</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Planning prévisionnel (même brouillon)</li>
                      <li>• Liste des prestataires</li>
                      <li>• Devis & contrats si disponibles</li>
                      <li>• Plan de table ou plan de salle si disponible</li>
                      <li>• Liste des rôles attribués aux témoins / proches</li>
                      <li>• Moodboard / inspirations / éléments de déco</li>
                      <li>• Autres documents utiles (discours, playlists, checklists…)</li>
                    </ul>
                  </div>
                </div>

                {/* Prestataires déjà réservés */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-wedding-olive" />
                    📌 Prestataires déjà réservés
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Merci de nous indiquer les prestataires déjà confirmés (et ceux manquants) :
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="prestataires.photographe">Photographe</Label>
                      <Input
                        id="prestataires.photographe"
                        name="prestataires.photographe"
                        value={formData.prestataireReserves.photographe}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Nom du photographe ou 'À trouver'"
                      />
                    </div>

                    <div>
                      <Label htmlFor="prestataires.dj_musique">DJ / Musique</Label>
                      <Input
                        id="prestataires.dj_musique"
                        name="prestataires.dj_musique"
                        value={formData.prestataireReserves.dj_musique}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Nom du DJ/musicien ou 'À trouver'"
                      />
                    </div>

                    <div>
                      <Label htmlFor="prestataires.traiteur">Traiteur</Label>
                      <Input
                        id="prestataires.traiteur"
                        name="prestataires.traiteur"
                        value={formData.prestataireReserves.traiteur}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Nom du traiteur ou 'À trouver'"
                      />
                    </div>

                    <div>
                      <Label htmlFor="prestataires.fleuriste">Fleuriste</Label>
                      <Input
                        id="prestataires.fleuriste"
                        name="prestataires.fleuriste"
                        value={formData.prestataireReserves.fleuriste}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Nom du fleuriste ou 'À trouver'"
                      />
                    </div>

                    <div>
                      <Label htmlFor="prestataires.maquilleuse_coiffeuse">Maquilleuse / Coiffeuse</Label>
                      <Input
                        id="prestataires.maquilleuse_coiffeuse"
                        name="prestataires.maquilleuse_coiffeuse"
                        value={formData.prestataireReserves.maquilleuse_coiffeuse}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Nom de la maquilleuse/coiffeuse ou 'À trouver'"
                      />
                    </div>

                    <div>
                      <Label htmlFor="prestataires.autre">Autres prestataires</Label>
                      <Textarea
                        id="prestataires.autre"
                        name="prestataires.autre"
                        value={formData.prestataireReserves.autre}
                        onChange={handleInputChange}
                        className="mt-1"
                        rows={3}
                        placeholder="Autres prestataires (décorateur, videographe, etc.)"
                      />
                    </div>
                  </div>
                </div>

                {/* Déroulé global du mariage */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-wedding-olive" />
                    🗺️ Déroulé global du mariage (si vous en avez un)
                  </h3>
                  
                  <div>
                    <Label htmlFor="deroulementMariage">Planning prévisionnel</Label>
                    <Textarea
                      id="deroulementMariage"
                      name="deroulementMariage"
                      value={formData.deroulementMariage}
                      onChange={handleInputChange}
                      className="mt-1"
                      rows={5}
                      placeholder="Indiquez ici les grandes étapes prévues du jour J : heure de cérémonies, animations, lieu... (facultatif mais très utile)"
                    />
                  </div>
                </div>

                {/* Personne de contact */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-wedding-olive" />
                    📞 Personne de contact (autre que les mariés)
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Pour le jour J = relai logistique
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact.nom">Nom</Label>
                      <Input
                        id="contact.nom"
                        name="contact.nom"
                        value={formData.contactJourJ.nom}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Nom de la personne"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contact.telephone">Téléphone</Label>
                      <Input
                        id="contact.telephone"
                        name="contact.telephone"
                        type="tel"
                        value={formData.contactJourJ.telephone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="06 XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="contact.role">Rôle</Label>
                      <Input
                        id="contact.role"
                        name="contact.role"
                        value={formData.contactJourJ.role}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Ex: témoin principal, frère, amie coordinatrice..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contact.commentaire">Commentaire (si besoin)</Label>
                      <Input
                        id="contact.commentaire"
                        name="contact.commentaire"
                        value={formData.contactJourJ.commentaire}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Informations complémentaires"
                      />
                    </div>
                  </div>
                </div>

                {/* Services souhaités */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-wedding-olive" />
                    ✅ Services souhaités (à cocher)
                  </h3>
                  
                  <div className="space-y-3">
                    {servicesOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={formData.servicesSouhaites.includes(service)}
                          onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                        />
                        <Label htmlFor={service} className="text-sm font-normal">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organisation actuelle */}
                <div className="border-b pb-6">
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
                <div className="border-b pb-6">
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

                <div>
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
