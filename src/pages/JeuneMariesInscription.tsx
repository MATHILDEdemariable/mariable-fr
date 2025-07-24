import React, { useState } from 'react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJeunesMaries } from '@/hooks/useJeunesMaries';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ImageUploader } from '@/components/admin/ImageUploader';

const budgetOptions = [
  'Moins de 10 000€',
  '10 000€ - 20 000€',
  '20 000€ - 30 000€',
  '30 000€ - 50 000€',
  'Plus de 50 000€'
];

const JeuneMariesInscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { submitJeuneMarie } = useJeunesMaries();
  const [loading, setLoading] = useState(false);
  const [prestataires, setPrestataires] = useState([{ nom: '', categorie: '', note: 5, commentaire: '' }]);
  
  const [formData, setFormData] = useState({
    nom_complet: '',
    email: '',
    telephone: '',
    lieu_mariage: '',
    date_mariage: '',
    nombre_invites: '',
    budget_approximatif: '',
    photo_principale_url: '',
    experience_partagee: '',
    conseils_couples: '',
    note_experience: 5
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addPrestataire = () => {
    setPrestataires(prev => [...prev, { nom: '', categorie: '', note: 5, commentaire: '' }]);
  };

  const removePrestataire = (index: number) => {
    if (prestataires.length > 1) {
      setPrestataires(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updatePrestataire = (index: number, field: string, value: string | number) => {
    setPrestataires(prev => prev.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom_complet || !formData.email || !formData.lieu_mariage || !formData.date_mariage) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const validPrestataires = prestataires.filter(p => p.nom && p.categorie);
    
    const dataToSubmit = {
      ...formData,
      nombre_invites: formData.nombre_invites ? parseInt(formData.nombre_invites) : null,
      prestataires_recommandes: validPrestataires,
      photos_mariage: [],
      visible: false
    };

    const success = await submitJeuneMarie(dataToSubmit);
    
    if (success) {
      navigate('/jeunes-maries/confirmation');
    }
    
    setLoading(false);
  };

  return (
    <>
      <SEO 
        title="Partager votre expérience de mariage - Mariable"
        description="Partagez votre expérience de mariage pour aider d'autres couples dans l'organisation de leur grand jour."
        keywords="témoignage mariage, partager expérience, conseil mariage"
      />
      
      <div className="min-h-screen bg-gradient-subtle">
        {/* Hero Section */}
        <section className="bg-wedding-olive text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Heart className="h-12 w-12 text-white mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-serif mb-4">
                Partagez votre expérience de mariage
              </h1>
              <p className="text-lg text-white/90">
                Aidez d'autres couples en partageant vos conseils et recommandations
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations de base */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-wedding-olive">Informations de base</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nom complet * <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="nom_complet"
                        value={formData.nom_complet}
                        onChange={handleInputChange}
                        placeholder="Ex: Marie & Pierre Dupont"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone</label>
                      <Input
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Date du mariage <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        name="date_mariage"
                        value={formData.date_mariage}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Lieu du mariage <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="lieu_mariage"
                        value={formData.lieu_mariage}
                        onChange={handleInputChange}
                        placeholder="Ville, Région"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre d'invités</label>
                      <Input
                        type="number"
                        name="nombre_invites"
                        value={formData.nombre_invites}
                        onChange={handleInputChange}
                        placeholder="120"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget approximatif</label>
                      <Select onValueChange={(value) => handleSelectChange('budget_approximatif', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetOptions.map((budget) => (
                            <SelectItem key={budget} value={budget}>
                              {budget}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expérience */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-wedding-olive">Votre expérience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Note globale de votre expérience
                    </label>
                    <Select onValueChange={(value) => handleSelectChange('note_experience', value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="5/5" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((note) => (
                          <SelectItem key={note} value={note.toString()}>
                            {note}/5 étoiles
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Partagez votre expérience
                    </label>
                    <Textarea
                      name="experience_partagee"
                      value={formData.experience_partagee}
                      onChange={handleInputChange}
                      placeholder="Racontez-nous les moments forts de votre mariage, ce qui vous a marqué..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Conseils pour les futurs mariés
                    </label>
                    <Textarea
                      name="conseils_couples"
                      value={formData.conseils_couples}
                      onChange={handleInputChange}
                      placeholder="Quels conseils donneriez-vous aux couples qui préparent leur mariage ?"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Prestataires recommandés */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-wedding-olive">Prestataires recommandés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prestataires.map((prestataire, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Prestataire {index + 1}</h4>
                        {prestataires.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePrestataire(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Nom du prestataire"
                          value={prestataire.nom}
                          onChange={(e) => updatePrestataire(index, 'nom', e.target.value)}
                        />
                        <Input
                          placeholder="Catégorie (ex: Photographe)"
                          value={prestataire.categorie}
                          onChange={(e) => updatePrestataire(index, 'categorie', e.target.value)}
                        />
                        <Select onValueChange={(value) => updatePrestataire(index, 'note', parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Note" />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 4, 3, 2, 1].map((note) => (
                              <SelectItem key={note} value={note.toString()}>
                                {note}/5
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Textarea
                        placeholder="Commentaire sur ce prestataire..."
                        value={prestataire.commentaire}
                        onChange={(e) => updatePrestataire(index, 'commentaire', e.target.value)}
                        rows={2}
                      />
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPrestataire}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un prestataire
                  </Button>
                </CardContent>
              </Card>

              {/* Photo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-wedding-olive">Photo principale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Photo de votre mariage
                    </label>
                    <ImageUploader
                      bucketName="jeunes-maries-photos"
                      currentImageUrl={formData.photo_principale_url}
                      onImageUpload={(url) => setFormData(prev => ({ ...prev, photo_principale_url: url }))}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Uploadez directement votre plus belle photo de mariage
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Soumission */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Information importante :</strong> Votre témoignage sera examiné par notre équipe avant publication. 
                  Vous recevrez un email de confirmation une fois votre profil approuvé.
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="bg-wedding-olive hover:bg-wedding-olive/90 min-w-48"
                >
                  {loading ? 'Envoi en cours...' : 'Partager mon expérience'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default JeuneMariesInscriptionPage;