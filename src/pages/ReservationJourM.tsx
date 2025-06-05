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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Heart, Upload, FileText, Phone, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ReservationJourM = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    partnerFirstName: '',
    weddingDate: '',
    weddingLocation: '',
    guestCount: '',
    budget: '',
    currentOrganization: '',
    deroulementMariage: '',
    delegationTasks: '',
    specificNeeds: '',
    hearAboutUs: '',
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
    contactsJourJ: [{
      nom: '',
      telephone: '',
      role: '',
      commentaire: ''
    }],
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
      const [, index, field] = name.split('.');
      const contactIndex = parseInt(index);
      setFormData(prev => ({
        ...prev,
        contactsJourJ: prev.contactsJourJ.map((contact, i) => 
          i === contactIndex ? { ...contact, [field]: value } : contact
        )
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleContactRoleChange = (index: number, role: string) => {
    setFormData(prev => ({
      ...prev,
      contactsJourJ: prev.contactsJourJ.map((contact, i) => 
        i === index ? { ...contact, role } : contact
      )
    }));
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contactsJourJ: [...prev.contactsJourJ, { nom: '', telephone: '', role: '', commentaire: '' }]
    }));
  };

  const removeContact = (index: number) => {
    if (formData.contactsJourJ.length > 1) {
      setFormData(prev => ({
        ...prev,
        contactsJourJ: prev.contactsJourJ.filter((_, i) => i !== index)
      }));
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
    console.log('Début de l\'envoi du formulaire');
    console.log('FormData:', formData);
    
    setIsSubmitting(true);

    try {
      console.log('Tentative d\'insertion dans Supabase...');
      
      // Prepare data with correct field names matching the database schema
      const insertData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        partner_name: formData.partnerFirstName, // Note: keeping as partner_name to match existing schema
        wedding_date: formData.weddingDate,
        wedding_location: formData.weddingLocation,
        guest_count: formData.guestCount ? parseInt(formData.guestCount) : null,
        budget: formData.budget || null,
        current_organization: formData.currentOrganization,
        deroulement_mariage: formData.deroulementMariage || null,
        delegation_tasks: formData.delegationTasks || null,
        specific_needs: formData.specificNeeds || null,
        hear_about_us: formData.hearAboutUs || null,
        documents_links: formData.documentsLinks || null,
        uploaded_files: formData.uploadedFiles,
        prestataires_reserves: formData.prestataireReserves,
        contact_jour_j: formData.contactsJourJ,
        services_souhaites: formData.servicesSouhaites
      };

      console.log('Données préparées pour insertion:', insertData);
      
      const { data, error } = await supabase
        .from('jour_m_reservations')
        .insert([insertData]);

      console.log('Réponse Supabase:', { data, error });

      if (error) {
        console.error('Erreur Supabase détaillée:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
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
        partnerFirstName: '',
        weddingDate: '',
        weddingLocation: '',
        guestCount: '',
        budget: '',
        currentOrganization: '',
        deroulementMariage: '',
        delegationTasks: '',
        specificNeeds: '',
        hearAboutUs: '',
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
        contactsJourJ: [{
          nom: '',
          telephone: '',
          role: '',
          commentaire: ''
        }],
        servicesSouhaites: []
      });

      console.log('Formulaire réinitialisé avec succès');

    } catch (error) {
      console.error('Erreur complète lors de l\'envoi:', error);
      
      let errorMessage = "Une erreur est survenue. Veuillez réessayer.";
      
      if (error instanceof Error) {
        if (error.message.includes('guest_count')) {
          errorMessage = "Erreur avec le nombre d'invités. Veuillez vérifier que c'est un nombre valide.";
        } else if (error.message.includes('email')) {
          errorMessage = "Erreur avec l'adresse email. Veuillez vérifier le format.";
        } else if (error.message.includes('wedding_date')) {
          errorMessage = "Erreur avec la date du mariage. Veuillez vérifier le format de date.";
        } else if (error.message.includes('required')) {
          errorMessage = "Certains champs obligatoires sont manquants.";
        } else {
          errorMessage = `Erreur technique: ${error.message}`;
        }
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const servicesOptions = [
    'Présence physique le jour J',
    'Présence physique 2 jours',
    'Heure supplémentaire (+30€)',
    'Installation décoration (+200€)',
    'RDV visite technique (+200€)',
    'Présence J-1 ou J+1 (+200€)',
    'Documentation imprimée (+20€)',
    'Mariage +180 personnes (+200€)'
  ];

  const roleOptions = ['Témoin', 'Mère', 'Père', 'Frère', 'Sœur', 'Ami(e)', 'Autre'];

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
                    <Label htmlFor="partnerFirstName">Prénom de votre partenaire</Label>
                    <Input
                      id="partnerFirstName"
                      name="partnerFirstName"
                      value={formData.partnerFirstName}
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
                    <Label htmlFor="weddingLocation">Lieu du mariage (lieu exact + ville/région) *</Label>
                    <Input
                      id="weddingLocation"
                      name="weddingLocation"
                      value={formData.weddingLocation}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="Ex: Château de Malmaison, Rueil-Malmaison (92) / Domaine de la Bergerie, Provence"
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

                {/* Organisation actuelle fusionnée avec déroulé */}
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

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-wedding-olive" />
                      🗺️ Déroulé global du mariage
                    </h4>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Memo :</strong> N'hésitez pas à partager avec nous la vibe et le style de votre mariage ! Cela nous aide à mieux comprendre vos attentes : mariage bohème, champêtre, moderne, traditionnel, décontracté, élégant... Toute information sur l'ambiance souhaitée est précieuse pour nous.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="deroulementMariage">Planning prévisionnel</Label>
                      <Textarea
                        id="deroulementMariage"
                        name="deroulementMariage"
                        value={formData.deroulementMariage}
                        onChange={handleInputChange}
                        className="mt-1"
                        rows={5}
                        placeholder="Indiquez ici les grandes étapes prévues du jour J : heure de cérémonies, animations, lieu... et le style/ambiance souhaité (facultatif mais très utile)"
                      />
                    </div>
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

                {/* Personnes de contact */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-wedding-olive" />
                    📞 Personnes de contact (autres que les mariés)
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Pour le jour J = relai logistique
                  </p>

                  {formData.contactsJourJ.map((contact, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Contact {index + 1}</h4>
                        {formData.contactsJourJ.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeContact(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`contact.${index}.nom`}>Nom</Label>
                          <Input
                            id={`contact.${index}.nom`}
                            name={`contact.${index}.nom`}
                            value={contact.nom}
                            onChange={handleInputChange}
                            className="mt-1"
                            placeholder="Nom de la personne"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`contact.${index}.telephone`}>Téléphone</Label>
                          <Input
                            id={`contact.${index}.telephone`}
                            name={`contact.${index}.telephone`}
                            type="tel"
                            value={contact.telephone}
                            onChange={handleInputChange}
                            className="mt-1"
                            placeholder="06 XX XX XX XX"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor={`contact.${index}.role`}>Rôle</Label>
                          <Select onValueChange={(value) => handleContactRoleChange(index, value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                              {roleOptions.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`contact.${index}.commentaire`}>Commentaire (si besoin)</Label>
                          <Input
                            id={`contact.${index}.commentaire`}
                            name={`contact.${index}.commentaire`}
                            value={contact.commentaire}
                            onChange={handleInputChange}
                            className="mt-1"
                            placeholder="Informations complémentaires"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addContact}
                    className="mb-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un contact
                  </Button>

                  <div>
                    <Label htmlFor="delegationTasks">
                      Comment avez-vous pensé déléguer les tâches & à qui ?
                    </Label>
                    <Textarea
                      id="delegationTasks"
                      name="delegationTasks"
                      value={formData.delegationTasks}
                      onChange={handleInputChange}
                      className="mt-1"
                      rows={3}
                      placeholder="Décrivez comment vous envisagez de répartir les responsabilités entre vos proches..."
                    />
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

                {/* Documents à envoyer - déplacé à la fin */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-wedding-olive" />
                    📎 Documents à envoyer
                  </h3>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-800 mb-2">
                      Merci de nous transmettre les documents déjà en votre possession pour faciliter la coordination. Si c'est plus simple pour vous, vous pouvez aussi nous transférer vos mails avec pièces jointes des prestataires directement à l'adresse 
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

                  <div className="mb-4">
                    <Label htmlFor="uploadFiles">📎 Ou joindre des fichiers (PDF acceptés)</Label>
                    <Input
                      id="uploadFiles"
                      type="file"
                      accept=".pdf"
                      multiple
                      className="mt-1"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">**Document indispensable = devis de chaque prestataire**</h4>
                    <p className="text-sm text-gray-700 mb-3">J'ai besoin des devis pour comprendre la prestation et le déroulé potentiel</p>
                    
                    <h4 className="font-medium mb-2">Documents utiles :</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Planning prévisionnel (même brouillon)</li>
                      <li>• Liste des prestataires</li>
                      <li>• Contrats si disponibles</li>
                      <li>• Plan de table ou plan de salle si disponible</li>
                      <li>• Liste des rôles attribués aux témoins / proches</li>
                      <li>• Moodboard / inspirations / liste des éléments de déco DIY</li>
                      <li>• Autres documents utiles (playlists, checklists…)</li>
                    </ul>
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
