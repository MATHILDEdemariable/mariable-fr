import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink, Phone, Mail, MapPin, Euro, RefreshCw, MessageCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VendorMatchingPanelProps {
  vendors: any[];
  error?: string;
  onRetry?: () => void;
}

const VendorMatchingPanel: React.FC<VendorMatchingPanelProps> = ({ vendors, error, onRetry }) => {
  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-foreground">
            Une erreur est survenue
          </h3>
          <p className="text-muted-foreground mb-6">
            Nous n'avons pas pu charger les recommandations de prestataires. Veuillez réessayer ou nous contacter si le problème persiste.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                if (onRetry) {
                  onRetry();
                } else {
                  window.location.reload();
                }
              }}
              variant="default"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recharger la page
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2"
            >
              <Link to="/contact">
                <MessageCircle className="w-4 h-4" />
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-wedding-olive/10 flex items-center justify-center">
            <Heart className="w-12 h-12 text-wedding-olive" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-foreground">
            Matching Intelligent
          </h3>
          <p className="text-muted-foreground mb-4">
            Décrivez vos besoins dans le chat et je vous proposerai les meilleurs prestataires pour votre mariage.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✨ Matching basé sur l'IA</p>
            <p>🎯 Personnalisé selon vos critères</p>
            <p>⭐ Prestataires validés et notés</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Prestataires Recommandés
        </h2>
        <p className="text-muted-foreground">
          {vendors.length} prestataire{vendors.length > 1 ? 's' : ''} correspondent à vos critères
        </p>
      </div>

      <div className="grid gap-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{vendor.nom}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {vendor.categorie}
                    </Badge>
                    {vendor.matchScore && (
                      <Badge 
                        variant="default" 
                        className="text-xs bg-wedding-olive text-white"
                      >
                        {vendor.matchScore}% Match
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {vendor.photo_principale_url && (
                <img 
                  src={vendor.photo_principale_url} 
                  alt={vendor.nom}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              {vendor.description_courte && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {vendor.description_courte}
                </p>
              )}

              <div className="space-y-2 text-sm">
                {vendor.ville && vendor.region && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{vendor.ville}, {vendor.region}</span>
                  </div>
                )}

                {vendor.prix_a_partir_de && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="w-4 h-4" />
                    <span>À partir de {vendor.prix_a_partir_de.toLocaleString()}€</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {vendor.slug && (
                  <Button 
                    asChild 
                    variant="default" 
                    size="sm"
                    className="flex-1"
                  >
                    <Link to={`/prestataire/${vendor.slug}`} target="_blank">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir le profil
                    </Link>
                  </Button>
                )}

                {vendor.telephone && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                  >
                    <a href={`tel:${vendor.telephone}`}>
                      <Phone className="w-4 h-4" />
                    </a>
                  </Button>
                )}

                {vendor.email && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                  >
                    <a href={`mailto:${vendor.email}`}>
                      <Mail className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorMatchingPanel;
