import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  FileCheck, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle2,
  FileText,
  AlertCircle,
  Info
} from 'lucide-react';

const MairieCivilPage: React.FC = () => {
  const documentsIndispensables = [
    {
      title: "Pièces d'identité",
      description: "Carte d'identité ou passeport en cours de validité pour les deux futurs époux",
      icon: FileCheck,
    },
    {
      title: "Justificatif de domicile",
      description: "Facture de moins de 3 mois (électricité, gaz, téléphone fixe, internet)",
      icon: FileText,
    },
    {
      title: "Acte de naissance",
      description: "Copie intégrale ou extrait avec filiation de moins de 3 mois (6 mois si délivré à l'étranger)",
      icon: FileText,
    },
    {
      title: "Certificat du notaire",
      description: "Obligatoire si vous avez signé un contrat de mariage",
      icon: FileCheck,
    },
    {
      title: "Liste des témoins",
      description: "Noms, prénoms, dates et lieux de naissance, professions et domiciles (2 à 4 témoins)",
      icon: Users,
    },
    {
      title: "Pièces d'identité des témoins",
      description: "Copie des pièces d'identité de chaque témoin",
      icon: FileCheck,
    },
  ];

  const etapes = [
    {
      numero: 1,
      title: "Prendre rendez-vous à la mairie",
      description: "Contactez la mairie de votre domicile ou du lieu de mariage 2 à 3 mois avant la date souhaitée",
      delai: "2-3 mois avant",
    },
    {
      numero: 2,
      title: "Constituer et déposer le dossier",
      description: "Rassemblez tous les documents requis et déposez-les complets à la mairie",
      delai: "1-2 mois avant",
    },
    {
      numero: 3,
      title: "Publication des bans",
      description: "Affichage obligatoire à la mairie pendant 10 jours. Aucune opposition = validation",
      delai: "10 jours minimum",
    },
    {
      numero: 4,
      title: "Cérémonie civile",
      description: "Célébration par un officier d'état civil. Durée : environ 20-30 minutes",
      delai: "Jour J",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Mariage Civil - Mairie | Mariable</title>
        <meta name="description" content="Tout savoir sur le mariage civil : documents indispensables et démarches à la mairie" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-wedding-olive" />
          <div>
            <h1 className="text-2xl font-serif text-wedding-olive">Mariage Civil - Mairie</h1>
            <p className="text-muted-foreground text-sm">Documents et démarches administratives</p>
          </div>
        </div>

        {/* Alerte importante */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-800">Important</p>
              <p className="text-sm text-amber-700">
                Le mariage civil doit obligatoirement précéder le mariage religieux. 
                Anticipez vos démarches car certains documents ont une validité limitée (3 mois pour l'acte de naissance).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Documents indispensables */}
        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-wedding-olive flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Documents indispensables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {documentsIndispensables.map((doc, index) => {
                const Icon = doc.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="p-2 rounded-full bg-wedding-olive/10">
                      <Icon className="h-4 w-4 text-wedding-olive" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Comment ça marche */}
        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-wedding-olive flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Comment ça marche ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Ligne de connexion verticale */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-wedding-olive/20" />
              
              <div className="space-y-6">
                {etapes.map((etape, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    {/* Numéro */}
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-wedding-olive text-white font-bold shrink-0">
                      {etape.numero}
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground">{etape.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {etape.delai}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{etape.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bon à savoir */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-start gap-3 py-4">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Bon à savoir</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Le mariage peut être célébré dans la commune de résidence de l'un des époux</li>
                <li>• La cérémonie a lieu dans la salle des mariages de la mairie</li>
                <li>• Le livret de famille vous sera remis à l'issue de la cérémonie</li>
                <li>• Les horaires et jours de célébration varient selon les mairies</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MairieCivilPage;
