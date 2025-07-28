import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import SEOTestimonial from '@/components/SEOTestimonial';
import { useJeunesMaries } from '@/hooks/useJeunesMaries';
import { JeuneMarie } from '@/types/jeunes-maries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ArrowLeft, 
  Heart,
  Mail,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const JeuneMariesDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getJeuneMariesBySlug } = useJeunesMaries();
  const [jeuneMarie, setJeuneMarie] = useState<JeuneMarie | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadJeuneMarie = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const data = await getJeuneMariesBySlug(slug);
      if (data) {
        setJeuneMarie(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };

    loadJeuneMarie();
  }, [slug, getJeuneMariesBySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-wedding-olive mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Chargement du témoignage...</p>
        </div>
      </div>
    );
  }

  if (notFound || !jeuneMarie) {
    return <Navigate to="/jeunes-maries" replace />;
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const renderStars = (note?: number) => {
    if (!note) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-medium">{note}/5</span>
      </div>
    );
  };

  return (
    <>
      <SEOTestimonial jeuneMarie={jeuneMarie} />
      
      <div className="min-h-screen bg-gradient-subtle">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Button asChild variant="outline" className="mb-0">
              <Link to="/jeunes-maries">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux témoignages
              </Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              {jeuneMarie.photo_principale_url && (
                <div className="aspect-video max-w-2xl mx-auto overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={jeuneMarie.photo_principale_url}
                    alt={`Mariage de ${jeuneMarie.nom_complet}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-serif text-wedding-olive">
                  {jeuneMarie.nom_complet}
                </h1>
                
                <div className="flex flex-wrap justify-center gap-4 text-lg text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDate(jeuneMarie.date_mariage)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{jeuneMarie.lieu_mariage}</span>
                  </div>
                  {jeuneMarie.nombre_invites && (
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span>{jeuneMarie.nombre_invites} invités</span>
                    </div>
                  )}
                </div>

                {jeuneMarie.note_experience && (
                  <div className="flex justify-center">
                    {renderStars(jeuneMarie.note_experience)}
                  </div>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2">
              {jeuneMarie.budget_approximatif && (
                <Badge variant="outline" className="text-sm">
                  Budget: {jeuneMarie.budget_approximatif}
                </Badge>
              )}
              {jeuneMarie.prestataires_recommandes.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {jeuneMarie.prestataires_recommandes.length} recommandation{jeuneMarie.prestataires_recommandes.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {/* Expérience partagée */}
            {jeuneMarie.experience_partagee && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-wedding-olive flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Notre expérience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {jeuneMarie.experience_partagee}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Conseils */}
            {jeuneMarie.conseils_couples && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-wedding-olive">
                    Nos conseils pour les futurs mariés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {jeuneMarie.conseils_couples}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Prestataires recommandés */}
            {jeuneMarie.prestataires_recommandes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-wedding-olive">
                    Prestataires recommandés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {jeuneMarie.prestataires_recommandes.map((prestataire, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{prestataire.nom}</h4>
                            <p className="text-gray-600">{prestataire.categorie}</p>
                          </div>
                          {prestataire.note && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < prestataire.note! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-1 text-sm">{prestataire.note}/5</span>
                            </div>
                          )}
                        </div>
                        {prestataire.commentaire && (
                          <p className="text-gray-700 text-sm">{prestataire.commentaire}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-wedding-olive">
                  Vous souhaitez échanger avec nous ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  N'hésitez pas à nous contacter si vous avez des questions sur notre expérience !
                </p>
                <div className="flex flex-wrap gap-4">
                  {jeuneMarie.email && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const subject = encodeURIComponent(`Contact via témoignage Mariable - ${jeuneMarie.nom_complet}`);
                        const body = encodeURIComponent(`Bonjour ${jeuneMarie.nom_complet},\n\nJe vous contacte suite à votre témoignage sur Mariable.\n\n`);
                        const mailtoUrl = `mailto:${jeuneMarie.email}?subject=${subject}&body=${body}&cc=mathilde@mariable.fr`;
                        
                        // Fallback si mailto ne fonctionne pas
                        try {
                          window.location.href = mailtoUrl;
                        } catch (error) {
                          // Copier l'email dans le presse-papier
                          navigator.clipboard.writeText(jeuneMarie.email);
                          alert(`Email copié : ${jeuneMarie.email}\n\nVeuillez contacter ce couple directement et mettre mathilde@mariable.fr en copie.`);
                        }
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Nous contacter
                    </Button>
                  )}
                  {jeuneMarie.telephone && (
                    <Button asChild variant="outline">
                      <a href={`tel:${jeuneMarie.telephone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Nous appeler
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center">
              <div className="bg-wedding-olive/5 rounded-lg p-8">
                <Heart className="h-12 w-12 text-wedding-olive mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-wedding-olive mb-2">
                  Vous aussi, partagez votre expérience !
                </h3>
                <p className="text-gray-600 mb-4">
                  Aidez d'autres couples en partageant vos conseils et recommandations
                </p>
                <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Link to="/jeunes-maries/inscription">
                    Partager mon expérience
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JeuneMariesDetailPage;