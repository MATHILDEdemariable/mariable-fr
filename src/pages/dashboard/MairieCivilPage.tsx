import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  FileCheck, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle2,
  FileText,
  AlertCircle,
  Info,
  MapPin,
  Scale,
  Download,
  Printer,
  Heart,
  Globe,
  UserCheck,
  ExternalLink,
  Share2,
  Lock
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

const MairieCivilPage: React.FC = () => {
  const { executeAction, showPremiumModal, closePremiumModal, isPremium, feature, description } = usePremiumAction({
    feature: 'Checklist Mariage Civil PDF',
    description: 'Téléchargez la checklist complète des documents pour votre mariage civil.'
  });

  const conditions = [
    { icon: Calendar, text: "Être âgé(e) d'au moins 18 ans révolus" },
    { icon: Heart, text: "Mariage autorisé entre personnes de même sexe ou de sexe différent (loi du 17 mai 2013)" },
    { icon: Users, text: "N'avoir aucun lien de proche parenté ou d'alliance avec le futur conjoint" },
    { icon: Scale, text: "Ne pas être déjà marié(e) en France ou à l'étranger" },
  ];

  const lieuxMariage = [
    { 
      titre: "Commune du domicile", 
      description: "Aucune condition de durée d'habitation n'est exigée",
      icon: Building2
    },
    { 
      titre: "Commune des parents", 
      description: "Commune de domicile du père ou de la mère de l'un des futurs époux",
      icon: Users
    },
  ];

  const liensUtiles = [
    { titre: "Demander un acte de naissance", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/R1406" },
    { titre: "Demander un acte de mariage (après)", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/R42837" },
    { titre: "Contrat de mariage (notaire)", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F948" },
  ];

  const documentsIndispensables = [
    {
      title: "Pièce d'identité",
      description: "CNI, passeport OU permis de conduire",
      detail: "Pour chaque époux",
      icon: FileCheck,
    },
    {
      title: "Justificatif de domicile récent",
      description: "Quittance de loyer, facture EDF, eau, téléphone...",
      detail: "Pour chaque époux",
      icon: FileText,
    },
    {
      title: "Acte de naissance (copie intégrale)",
      description: "Moins de 3 mois si naissance en France / Moins de 6 mois si délivré par un consulat",
      detail: "Pour chaque époux",
      icon: FileText,
    },
    {
      title: "Liste des témoins",
      description: "1 ou 2 témoins par époux (max 2 par marié)",
      detail: "Noms, prénoms, date/lieu de naissance, profession, domicile",
      icon: Users,
    },
    {
      title: "Pièces d'identité des témoins",
      description: "Photocopie pour chaque témoin",
      detail: "Témoins majeurs (18 ans) ou mineurs émancipés",
      icon: UserCheck,
    },
    {
      title: "Certificat du notaire",
      description: "Uniquement si contrat de mariage signé",
      detail: "À demander à votre notaire",
      icon: Scale,
    },
  ];

  const delaisBans = [
    { semaines: "4", condition: "Les deux futurs époux habitent la même commune" },
    { semaines: "6", condition: "L'un des futurs époux habite une autre commune" },
    { semaines: "8", condition: "L'un des futurs époux est domicilié à l'étranger" },
  ];

  const situationsParticulieres = [
    {
      titre: "Veuvage",
      documents: ["Acte de décès du précédent conjoint"]
    },
    {
      titre: "Divorce",
      documents: ["Acte de naissance avec mention marginale du divorce"]
    },
    {
      titre: "Tutelle ou curatelle",
      documents: [
        "Consentement écrit du tuteur ou curateur",
        "Photocopie de la pièce d'identité du tuteur/curateur",
        "Pour les personnes sous tutelle : certificat du médecin traitant attestant un avis favorable"
      ]
    },
    {
      titre: "Époux de nationalité étrangère",
      documents: [
        "Si non francophone : traducteur assermenté obligatoire le jour du mariage",
        "Coordonnées du traducteur à remettre 6 jours avant le mariage minimum",
        "Tous les documents étrangers doivent être traduits en français par un traducteur assermenté",
        "Documents légalisés ou certifiés par une apostille selon les pays",
        "Des pièces spécifiques peuvent être demandées selon la nationalité (se renseigner à la mairie ou au consulat)"
      ]
    },
  ];

  const etapes = [
    {
      numero: 1,
      title: "Constituer le dossier",
      description: "Rassemblez toutes les pièces requises. Vérifiez sur le site officiel de votre mairie car les documents peuvent varier.",
      delai: "En amont",
    },
    {
      numero: 2,
      title: "Prendre rendez-vous",
      description: "Contactez la mairie 2-3 mois avant la date souhaitée pour fixer un rendez-vous de dépôt.",
      delai: "2-3 mois avant",
    },
    {
      numero: 3,
      title: "Rendez-vous dépôt de dossier",
      description: "Présentez-vous avec votre dossier complet. L'officier d'état civil peut demander une audition commune des futurs époux.",
      delai: "1-2 mois avant",
    },
    {
      numero: 4,
      title: "Publication des bans",
      description: "Affichage obligatoire pendant 10 jours à la mairie. Les délais varient selon votre situation (4 à 8 semaines).",
      delai: "10 jours minimum",
    },
    {
      numero: 5,
      title: "Cérémonie civile",
      description: "Célébration officielle par l'officier d'état civil en présence de vos témoins. Durée : environ 20-30 minutes.",
      delai: "Jour J",
    },
  ];

  const handleExportPDF = () => {
    executeAction(() => {
    const pdf = new jsPDF();
    
    // Header avec design Mariable
    pdf.setFillColor(139, 137, 114);
    pdf.rect(0, 0, 210, 35, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("MARIABLE", 20, 18);
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Checklist Mariage Civil - Documents a preparer", 20, 28);
    
    let yPosition = 50;
    
    // Fonction pour dessiner une checkbox
    const drawCheckbox = (x: number, y: number) => {
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.5);
      pdf.rect(x, y - 3, 4, 4);
    };
    
    // Documents obligatoires
    pdf.setTextColor(139, 137, 114);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Documents obligatoires", 20, yPosition);
    yPosition += 10;
    
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    
    const checklistItems = [
      "Piece d'identite epoux 1 (CNI, passeport ou permis)",
      "Piece d'identite epoux 2 (CNI, passeport ou permis)",
      "Justificatif de domicile recent epoux 1",
      "Justificatif de domicile recent epoux 2",
      "Acte de naissance epoux 1 (copie integrale, moins de 3 mois)",
      "Acte de naissance epoux 2 (copie integrale, moins de 3 mois)",
      "Liste des temoins (1-2 par epoux)",
      "Photocopie piece d'identite temoin 1",
      "Photocopie piece d'identite temoin 2",
      "Photocopie piece d'identite temoin 3 (si applicable)",
      "Photocopie piece d'identite temoin 4 (si applicable)",
    ];
    
    checklistItems.forEach(item => {
      drawCheckbox(20, yPosition);
      pdf.text(item, 28, yPosition);
      yPosition += 7;
    });
    
    yPosition += 8;
    
    // Documents optionnels
    pdf.setTextColor(139, 137, 114);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Si applicable", 20, yPosition);
    yPosition += 10;
    
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    
    const optionalItems = [
      "Certificat du notaire (si contrat de mariage)",
      "Acte de deces (si veuvage)",
      "Acte de naissance avec mention divorce (si divorce)",
      "Consentement du tuteur/curateur (si tutelle/curatelle)",
      "Documents traduits et legalises (si epoux etranger)",
    ];
    
    optionalItems.forEach(item => {
      drawCheckbox(20, yPosition);
      pdf.text(item, 28, yPosition);
      yPosition += 7;
    });
    
    yPosition += 8;
    
    // Délais
    pdf.setTextColor(139, 137, 114);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Delais minimum avant le mariage", 20, yPosition);
    yPosition += 10;
    
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text("- 4 semaines si les 2 epoux habitent la meme commune", 25, yPosition);
    yPosition += 7;
    pdf.text("- 6 semaines si l'un habite une autre commune", 25, yPosition);
    yPosition += 7;
    pdf.text("- 8 semaines si l'un est domicilie a l'etranger", 25, yPosition);
    
    yPosition += 12;
    
    // Notes importantes
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(100, 100, 100);
    pdf.text("Note : Les dates et horaires dependent de la disponibilite de la mairie.", 20, yPosition);
    yPosition += 5;
    pdf.text("La capacite des salles varie selon les mairies - renseignez-vous !", 20, yPosition);
    
    // Footer avec design Mariable
    pdf.setFillColor(245, 244, 240);
    pdf.rect(0, 270, 210, 27, 'F');
    
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont("helvetica", "normal");
    pdf.text("www.mariable.fr", 20, 282);
    pdf.text("Genere le " + new Date().toLocaleDateString('fr-FR'), 150, 282);
    
    pdf.save("checklist-mariage-civil.pdf");
    toast.success("Checklist PDF telechargee !");
    });
  };

  return (
    <>
      <Helmet>
        <title>Mariage Civil - Documents et Démarches | Mariable</title>
        <meta name="description" content="Guide complet pour votre mariage civil : documents indispensables, conditions, délais et étapes à suivre pour vous marier à la mairie." />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-black">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-foreground">Mariage Civil - Mairie</h1>
              <p className="text-muted-foreground text-sm">Guide complet des démarches administratives</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                navigator.clipboard.writeText('https://www.mariable.fr/mariage-civil');
                toast.success("Lien copié dans le presse-papier !");
              }}
              variant="outline"
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
            <Button 
              onClick={handleExportPDF}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {!isPremium && <Lock className="h-4 w-4" />}
              <Download className="h-4 w-4" />
              Télécharger la checklist PDF
            </Button>
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
                Les documents et délais peuvent varier selon les mairies - vérifiez toujours sur le site officiel de votre mairie.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Conditions pour se marier */}
        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Conditions pour se marier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {conditions.map((condition, index) => {
                const Icon = condition.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{condition.text}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Note : Dans certains cas exceptionnels, une dispense pour lien de parenté peut être accordée par le Président de la République.
            </p>
          </CardContent>
        </Card>

        {/* Où peut-on se marier */}
        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Où peut-on se marier ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {lieuxMariage.map((lieu, index) => {
                const Icon = lieu.icon;
                return (
                  <div key={index} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-sm">{lieu.titre}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{lieu.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2 text-xs text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <p>
                <strong>À Paris :</strong> Le mariage est célébré dans l'arrondissement correspondant au domicile ou à la résidence.
              </p>
              <p>
                <strong>Capacité des salles :</strong> Variable selon les mairies - pensez à demander !
              </p>
              <p>
                <strong>Dates et horaires :</strong> Décidés par le Maire selon la disponibilité du personnel, 
                des adjoints habilités à célébrer les mariages et des locaux.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Documents indispensables */}
        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
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
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      <p className="text-xs text-primary mt-1">{doc.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Délais de publication des bans */}
        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Délais de publication des bans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {delaisBans.map((delai, index) => (
                <div key={index} className="text-center p-4 border rounded-lg bg-white">
                  <div className="text-3xl font-bold text-primary mb-1">{delai.semaines}</div>
                  <div className="text-sm font-medium mb-2">semaines minimum</div>
                  <p className="text-xs text-muted-foreground">{delai.condition}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Situations particulières */}
        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Situations particulières
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {situationsParticulieres.map((situation, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-sm font-medium">
                    {situation.titre}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {situation.documents.map((doc, docIndex) => (
                        <li key={docIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Comment ça marche */}
        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Comment ça marche ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-primary/20" />
              
              <div className="space-y-6">
                {etapes.map((etape, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-black text-white font-bold shrink-0">
                      {etape.numero}
                    </div>
                    
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground">{etape.title}</h3>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                          {etape.delai}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{etape.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liens utiles */}
        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              Liens utiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {liensUtiles.map((lien, index) => (
                <a
                  key={index}
                  href={lien.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border rounded-lg bg-white hover:bg-muted/50 transition-colors group"
                >
                  <ExternalLink className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-foreground">{lien.titre}</span>
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic text-center">
              Ces liens renvoient vers le site officiel service-public.gouv.fr
            </p>
          </CardContent>
        </Card>

        {/* Bon à savoir */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-start gap-3 py-4">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Bon à savoir</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• L'officier d'état civil peut demander une audition commune des futurs époux</li>
                <li>• La cérémonie a lieu dans la salle des mariages de la mairie</li>
                <li>• Le livret de famille vous sera remis à l'issue de la cérémonie</li>
                <li>• Pour les époux étrangers non francophones, un traducteur assermenté est obligatoire le jour J</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Bouton imprimer en bas */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleExportPDF}
            variant="outline"
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Imprimer la checklist
          </Button>
        </div>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature={feature}
        description={description}
      />
    </>
  );
};

export default MairieCivilPage;
