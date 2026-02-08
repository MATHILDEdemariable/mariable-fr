import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Clock, 
  Users, 
  Music, 
  CheckCircle2,
  FileText,
  AlertCircle,
  Info,
  Download,
  Mic,
  TreePine,
  Sparkles,
  MessageSquare,
  Calendar,
  MapPin,
  Volume2,
  Sun,
  CloudRain,
  Church,
  BookOpen,
  Cross,
  Crown,
  Flower2,
  Camera,
  PartyPopper,
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

const CeremoniePage: React.FC = () => {
  const { executeAction: executeActionLaique, showPremiumModal: showModalLaique, closePremiumModal: closeModalLaique, isPremium, feature: featureLaique, description: descriptionLaique } = usePremiumAction({
    feature: 'Checklist Cérémonie Laïque PDF',
    description: 'Téléchargez la checklist complète pour votre cérémonie laïque.'
  });

  const { executeAction: executeActionCatholique, showPremiumModal: showModalCatholique, closePremiumModal: closeModalCatholique, feature: featureCatholique, description: descriptionCatholique } = usePremiumAction({
    feature: 'Checklist Mariage Catholique PDF',
    description: 'Téléchargez la checklist complète pour votre mariage catholique.'
  });

  // ========== DONNÉES CÉRÉMONIE LAÏQUE ==========
  // ========== DONNÉES CÉRÉMONIE LAÏQUE ==========
  const fondamentaux = [
    { icon: Clock, label: "Durée optimale", value: "45 à 60 minutes" },
    { icon: AlertCircle, label: "Valeur juridique", value: "Aucune - Mariage civil obligatoire avant" },
    { icon: MapPin, label: "Lieux possibles", value: "Jardins, domaines, plages, musées, lieux atypiques" },
  ];

  const deroulementEtapes = [
    { numero: 1, titre: "Prélude et installation", description: "Musique d'ambiance, annonces logistiques (téléphones éteints)" },
    { numero: 2, titre: "Entrée du cortège", description: "Mariés au bras des parents, témoins, enfants d'honneur" },
    { numero: 3, titre: "Mot de bienvenue", description: "L'officiant pose le cadre, hommage aux absents possible" },
    { numero: 4, titre: "Histoire du couple", description: "Récit de la rencontre, épreuves traversées, projets d'avenir" },
    { numero: 5, titre: "Interventions des proches", description: "3 à 5 interventions maximum (témoins, famille)" },
    { numero: 6, titre: "Rituel symbolique", description: "Sable, rubans, arbre... un geste concret pour sacraliser l'union" },
    { numero: 7, titre: "Échange des vœux", description: "Les mariés se parlent directement - moment le plus émouvant" },
    { numero: 8, titre: "Échange des alliances", description: "Consentement explicite guidé par l'officiant" },
    { numero: 9, titre: "Conclusion et baiser", description: "Déclaration finale, musique de sortie" },
    { numero: 10, titre: "Sortie des mariés", description: "Acclamations, pétales de fleurs ou bulles de savon" },
  ];

  const typesOfficiants = [
    {
      type: "Professionnel",
      avantages: ["Maîtrise technique", "Neutralité", "Accompagnement structuré sur plusieurs mois"],
      vigilances: ["Coût financier", "Relation initialement moins intime"],
    },
    {
      type: "Proche (Ami/Famille)",
      avantages: ["Émotion forte", "Connaissance parfaite du couple", "Gratuit"],
      vigilances: ["Stress de la prise de parole", "Manque d'expérience technique"],
    },
    {
      type: "Mariés eux-mêmes",
      avantages: ["Contrôle total", "Format très intime"],
      vigilances: ["Charge mentale accrue le jour J", "Complexité de gestion du rythme"],
    },
  ];

  const rituels = [
    {
      nom: "Rituel du sable",
      description: "Mélanger deux sables de couleurs différentes dans un vase commun. Les grains se mélangent de façon irréversible, symbolisant l'union des deux personnalités.",
      conseils: "Choisir des couleurs contrastées. Conserver le vase en souvenir.",
    },
    {
      nom: "Handfasting (Rubans)",
      description: "D'origine celte, ce rituel consiste à lier les mains des mariés avec des rubans de différentes couleurs. Chaque ruban peut être apporté par un proche.",
      conseils: "Rubans de 1,2m de long et 4cm de large minimum pour un bel effet visuel.",
    },
    {
      nom: "Arbre à planter",
      description: "Les mariés plantent ensemble un arbuste symbolisant la croissance de leur amour et la nécessité d'en prendre soin quotidiennement.",
      conseils: "Choisir un arbre adapté à votre jardin. Les racines = fondations, les branches = avenir commun.",
    },
    {
      nom: "Pierres / Galets",
      description: "Chaque invité tient une pierre et y dépose symboliquement un vœu pour le couple. Les pierres sont collectées dans un bocal.",
      conseils: "Excellent pour impliquer une grande assemblée de manière silencieuse et solennelle.",
    },
    {
      nom: "Pelote de laine",
      description: "Une pelote est lancée entre les invités, créant un maillage physique qui relie tout le monde aux mariés.",
      conseils: "Déconseillé en cas de coiffures complexes ou de chapeaux volumineux !",
    },
  ];

  const rolesProches = [
    { role: "Discours et lectures", description: "Partager une anecdote, un poème ou un texte littéraire" },
    { role: "Transport des alliances", description: "Rôle de confiance, souvent confié aux enfants ou témoins" },
    { role: "Participation aux rituels", description: "Allumer une bougie, nouer un ruban, verser du sable" },
    { role: "Signature du certificat", description: "Moment solennel en fin de cérémonie" },
  ];

  const alternativesTimides = [
    "Intervention en duo (parler à deux pour se soutenir)",
    "Rôles muets (apporter les alliances, distribuer les livrets)",
    "Montage photo ou vidéo à projeter",
    "Lecture de textes d'auteurs célèbres (moins intimidant que d'écrire)",
  ];

  const programmationMusicale = [
    { moment: "Installation", type: "Instrumentale / Ambiance", conseil: "Volume modéré pour permettre la discussion" },
    { moment: "Entrée", type: "Chanson à texte / Émouvante", conseil: "Volume soutenu, début marqué" },
    { moment: "Rituels", type: "Instrumentale / Boucle", conseil: "S'effacer derrière la voix de l'officiant" },
    { moment: "Vœux", type: "Silence ou nappe discrète", conseil: "Ne pas masquer les émotions vocales" },
    { moment: "Sortie", type: "Rythmée / Festive", conseil: "Augmentation progressive après le baiser" },
  ];

  const retroplanning = [
    { delai: "M-1", action: "Finaliser la trame avec l'officiant, envoyer les musiques au DJ, confirmer les intervenants" },
    { delai: "J-7", action: "Relire ses vœux à voix haute, préparer le kit de secours (mouchoirs, eau, maquillage)" },
    { delai: "J-1", action: "Répétition sur place, installer la décoration, vérifier les micros" },
    { delai: "Jour J", action: "Prendre 5 minutes à deux avant le début pour se recentrer" },
  ];

  const checklistJourJ = [
    { categorie: "Cérémonie", items: ["Livrets de cérémonie", "Pétales/confettis", "Alliances", "Mouchoirs", "Bouteilles d'eau"] },
    { categorie: "Technique", items: ["Enceintes chargées", "Micros testés", "Playlist prête", "Câbles et rallonges"] },
    { categorie: "Confort", items: ["Signalétique vers le lieu", "Ombre (parasols)", "Boissons fraîches à l'arrivée"] },
    { categorie: "Après-cérémonie", items: ["Quelqu'un pour collecter les objets du rituel", "Ranger les livrets restants", "Guider vers le cocktail"] },
  ];

  // ========== DONNÉES CÉRÉMONIE CATHOLIQUE ==========
  const documentsCatholicite = [
    { document: "Acte de naissance", nature: "Extrait intégral avec filiation", validite: "Moins de 3 mois" },
    { document: "Acte de baptême", nature: "Copie pour mariage uniquement", validite: "Demandée par le prêtre" },
    { document: "Certificat de mariage civil", nature: "Document officiel de la mairie", validite: "Indispensable avant la cérémonie" },
    { document: "Déclaration d'intention", nature: "Manuscrite et personnelle", validite: "Expression des 4 piliers" },
    { document: "Autorisation de l'évêché", nature: "Dispense ou autorisation spéciale", validite: "Pour mariages mixtes ou dispars" },
  ];

  const piliersMariage = [
    { pilier: "Liberté", definition: "Choix conscient sans contrainte externe", pratique: "Engagement mûri, exempt de pressions familiales ou sociales" },
    { pilier: "Fidélité", definition: "Exclusivité et permanence de l'amour", pratique: "Promesse de soutien mutuel dans la santé comme dans la maladie" },
    { pilier: "Indissolubilité", definition: "Engagement pour la vie entière", pratique: "Volonté de bâtir un foyer durable, jusqu'à ce que la mort nous sépare" },
    { pilier: "Fécondité", definition: "Ouverture à la vie et don de soi", pratique: "Désir d'accueillir des enfants ou ouverture généreuse aux autres" },
  ];

  const derouleCatholique = [
    { numero: 1, titre: "Procession d'entrée", description: "Le marié entre au bras de sa mère, suivi du cortège, puis la mariée au bras de son père" },
    { numero: 2, titre: "Liturgie de la Parole", description: "Lectures bibliques (Ancien Testament, Épîtres, Évangile) et homélie du prêtre" },
    { numero: 3, titre: "Dialogue initial", description: "Le prêtre interroge les mariés sur leur liberté et engagement" },
    { numero: 4, titre: "Échange des consentements", description: "Les mariés se donnent mutuellement le sacrement" },
    { numero: 5, titre: "Bénédiction des alliances", description: "Les anneaux sont bénis et échangés en signe d'alliance" },
    { numero: 6, titre: "Bénédiction nuptiale", description: "Prière solennelle invoquant la force de l'Esprit Saint sur le couple" },
    { numero: 7, titre: "Signature des registres", description: "Accompagnée d'un morceau de musique, puis la quête" },
    { numero: 8, titre: "Sortie triomphale", description: "Les mariés quittent l'église sous les acclamations" },
  ];

  const musiqueSacree = [
    { moment: "Entrée du cortège", exemples: "Marche de Mendelssohn, Canon de Pachelbel" },
    { moment: "Psaume et Alléluia", exemples: "Psaume 127, Alléluia de Taizé ou de Haendel" },
    { moment: "Échange des alliances", exemples: "Ave Maria (Schubert ou Gounod), Panis Angelicus" },
    { moment: "Communion (si messe)", exemples: "Cantique de Jean Racine, Anima Christi" },
    { moment: "Signature des registres", exemples: "Aria (Bach), Oh Happy Day (Gospel)" },
  ];

  const traditionsSortie = [
    { tradition: "Lancer de riz", signification: "Symbole de prospérité et fertilité", contrainte: "Souvent interdit pour des raisons de nettoyage" },
    { tradition: "Bulles de savon", signification: "Effet féerique, idéal pour les photos", contrainte: "Nécessite des flacons individuels" },
    { tradition: "Lavande / Pétales", signification: "Parfum et romantisme naturel", contrainte: "Nécessite un balayage après" },
    { tradition: "Baguettes à grelots", signification: "Animation sonore et visuelle", contrainte: "Écologique et sans résidus" },
  ];

  const checklistCatholique = [
    { categorie: "Documents", items: ["Acte de naissance (moins de 3 mois)", "Acte de baptême", "Certificat mariage civil", "Déclaration d'intention"] },
    { categorie: "Préparation", items: ["Rencontres avec le prêtre (3-4)", "Sessions CPM (week-end)", "Rédaction déclaration d'intention", "Choix des lectures"] },
    { categorie: "Logistique église", items: ["Valider la date avec la paroisse", "Rencontrer l'organiste", "Prévoir la décoration florale", "Confirmer les témoins"] },
    { categorie: "Jour J", items: ["Alliances", "Livrets de messe", "Arrhes/quête", "Fleuriste église"] },
  ];

  // ========== FONCTION EXPORT PDF LAÏQUE ==========
  const handleExportPDFLaique = () => {
    executeActionLaique(() => {
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
    pdf.text("Checklist Ceremonie Laique", 20, 28);
    
    let yPosition = 50;
    
    // Fonction pour dessiner une checkbox
    const drawCheckbox = (x: number, y: number) => {
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.5);
      pdf.rect(x, y - 3, 4, 4);
    };
    
    // Contenu
    checklistJourJ.forEach(cat => {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(139, 137, 114);
      pdf.text(cat.categorie, 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      
      cat.items.forEach(item => {
        drawCheckbox(20, yPosition);
        pdf.text(item, 28, yPosition);
        yPosition += 7;
      });
      
      yPosition += 5;
    });
    
    // Rétroplanning
    yPosition += 5;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(139, 137, 114);
    pdf.text("Retroplanning", 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(60, 60, 60);
    
    retroplanning.forEach(item => {
      pdf.setFont("helvetica", "bold");
      pdf.text(item.delai, 25, yPosition);
      pdf.setFont("helvetica", "normal");
      const lines = pdf.splitTextToSize(item.action, 150);
      pdf.text(lines, 50, yPosition);
      yPosition += (lines.length * 5) + 5;
    });
    
    // Footer
    pdf.setFillColor(245, 244, 240);
    pdf.rect(0, 270, 210, 27, 'F');
    
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text("www.mariable.fr", 20, 282);
    pdf.text("Genere le " + new Date().toLocaleDateString('fr-FR'), 150, 282);
    
    pdf.save("checklist-ceremonie-laique.pdf");
    toast.success("Checklist ceremonie laique telechargee !");
    });
  };

  // ========== FONCTION EXPORT PDF CATHOLIQUE ==========
  const handleExportPDFCatholique = () => {
    executeActionCatholique(() => {
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
    pdf.text("Checklist Mariage Catholique", 20, 28);
    
    let yPosition = 50;
    
    // Fonction pour dessiner une checkbox
    const drawCheckbox = (x: number, y: number) => {
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.5);
      pdf.rect(x, y - 3, 4, 4);
    };
    
    // Contenu
    checklistCatholique.forEach(cat => {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(139, 137, 114);
      pdf.text(cat.categorie, 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      
      cat.items.forEach(item => {
        drawCheckbox(20, yPosition);
        pdf.text(item, 28, yPosition);
        yPosition += 7;
      });
      
      yPosition += 5;
    });
    
    // Notes importantes
    yPosition += 10;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(139, 137, 114);
    pdf.text("Notes importantes", 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(60, 60, 60);
    
    const notes = [
      "Preparation a commencer 6 a 12 mois avant le mariage",
      "Le mariage civil doit obligatoirement preceder le mariage religieux",
      "Prevoir 3 a 4 rencontres avec le pretre et des sessions CPM",
      "La ceremonie dure environ 1h a 1h30 (messe nuptiale)"
    ];
    
    notes.forEach(note => {
      pdf.text("- " + note, 25, yPosition);
      yPosition += 7;
    });
    
    // Footer
    pdf.setFillColor(245, 244, 240);
    pdf.rect(0, 270, 210, 27, 'F');
    
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text("www.mariable.fr", 20, 282);
    pdf.text("Genere le " + new Date().toLocaleDateString('fr-FR'), 150, 282);
    
    pdf.save("checklist-mariage-catholique.pdf");
    toast.success("Checklist mariage catholique telechargee !");
    });
  };

  return (
    <>
      <Helmet>
        <title>Ceremonie de Mariage - Guide Complet | Mariable</title>
        <meta name="description" content="Guide complet pour votre ceremonie de mariage : ceremonie laique, mariage catholique, rituels, voeux, musique et logistique." />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-serif text-foreground">Ceremonie de Mariage</h1>
            <p className="text-muted-foreground text-sm">Guides complets pour votre celebration</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="laique" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="laique" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Ceremonie Laique
            </TabsTrigger>
            <TabsTrigger value="catholique" className="flex items-center gap-2">
              <Church className="h-4 w-4" />
              Ceremonie Catholique
            </TabsTrigger>
          </TabsList>

          {/* ==================== ONGLET LAÏQUE ==================== */}
          <TabsContent value="laique" className="space-y-6">
            {/* Boutons télécharger et partager */}
            <div className="flex justify-end gap-2">
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText('https://www.mariable.fr/ceremonie-laique');
                  toast.success("Lien copié dans le presse-papier !");
                }}
                variant="outline"
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              <Button 
                onClick={handleExportPDFLaique}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                {!isPremium && <Lock className="h-4 w-4" />}
                <Download className="h-4 w-4" />
                Telecharger la checklist
              </Button>
            </div>

            {/* Fondamentaux */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Les fondamentaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {fondamentaux.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="p-4 border rounded-lg bg-muted/50 text-center">
                        <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-muted-foreground mt-4 italic text-center">
                  La ceremonie laique est le pivot emotionnel du mariage - un espace de liberte absolue ou votre histoire devient le centre de la narration.
                </p>
              </CardContent>
            </Card>

            {/* Déroulé en 10 étapes */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Le deroule en 10 etapes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-primary/20" />
                  
                  <div className="space-y-4">
                    {deroulementEtapes.map((etape, index) => (
                      <div key={index} className="relative flex items-start gap-4">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold shrink-0 text-sm">
                          {etape.numero}
                        </div>
                        <div className="flex-1 pb-2">
                          <h3 className="font-medium text-foreground">{etape.titre}</h3>
                          <p className="text-sm text-muted-foreground">{etape.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Choisir son officiant */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" />
                  Choisir son officiant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {typesOfficiants.map((officiant, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white">
                      <h4 className="font-medium text-center mb-3 text-primary">{officiant.type}</h4>
                      
                      <div className="mb-3">
                        <p className="text-xs font-medium text-green-700 mb-1">Avantages</p>
                        <ul className="space-y-1">
                          {officiant.avantages.map((a, i) => (
                            <li key={i} className="text-xs text-muted-foreground">- {a}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-amber-700 mb-1">Points de vigilance</p>
                        <ul className="space-y-1">
                          {officiant.vigilances.map((v, i) => (
                            <li key={i} className="text-xs text-muted-foreground">- {v}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Catalogue des rituels */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-primary" />
                  Catalogue des rituels symboliques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {rituels.map((rituel, index) => (
                    <AccordionItem key={index} value={`rituel-${index}`}>
                      <AccordionTrigger className="text-sm font-medium">
                        {rituel.nom}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-2">{rituel.description}</p>
                        <p className="text-xs text-primary italic">Conseil : {rituel.conseils}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Impliquer les proches */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Impliquer les proches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-sm">Roles possibles</h4>
                    <div className="space-y-2">
                      {rolesProches.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{item.role}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 text-sm">Alternatives pour les timides</h4>
                    <ul className="space-y-2">
                      {alternativesTimides.map((alt, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary">-</span>
                          {alt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guide de rédaction des vœux */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Guide de redaction des voeux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="preparation">
                    <AccordionTrigger className="text-sm font-medium">Preparation</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Commencer a noter des idees 2-3 mois avant dans un petit carnet</li>
                        <li>- Recueillir des souvenirs, preuves d'amour quotidiennes, citations inspirantes</li>
                        <li>- Finaliser la version definitive 15 jours avant pour rester connecte a l'emotion</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="structure">
                    <AccordionTrigger className="text-sm font-medium">Structure recommandee</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="font-medium text-primary">1. Le passe</p>
                          <p className="text-muted-foreground">Evoquer un souvenir marquant ou la premiere rencontre</p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="font-medium text-primary">2. Le present</p>
                          <p className="text-muted-foreground">Ce que l'autre represente aujourd'hui (refuge, force, evidence)</p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="font-medium text-primary">3. Le futur</p>
                          <p className="text-muted-foreground">Promesses concretes, grands projets et petits details du quotidien</p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="font-medium text-primary">4. La conclusion</p>
                          <p className="text-muted-foreground">Une phrase simple scellant l'engagement</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="conseils">
                    <AccordionTrigger className="text-sm font-medium">Conseils de proclamation</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Duree : 2 a 3 minutes pour captiver sans lasser</li>
                        <li>- Authenticite : Si vous etes drole, incluez de l'humour. Si vous etes pudique, la simplicite suffit</li>
                        <li>- Support : Eviter le telephone ! Utiliser un beau papier pour les photos</li>
                        <li>- Emotion : N'ayez pas peur de pleurer ou de marquer des silences</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Logistique */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Logistique et technique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CloudRain className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-sm">Plan B meteo</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>- Prevoir un lieu de repli (salle, grange, barnum)</li>
                      <li>- Reflechir a la logistique de transfert</li>
                      <li>- En cas de canicule : ombre et rafraichissements</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-sm">Sonorisation</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>- Minimum 2 micros sans fil pour +50 personnes</li>
                      <li>- Enceintes pres des invites (pas derriere les maries)</li>
                      <li>- Verifier les prises ou louer un generateur silencieux</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-sm">Amenagement</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>- Disposition en arc de cercle pour une meilleure visibilite</li>
                      <li>- Recouvrir les chaises plastique (brulent au soleil)</li>
                      <li>- Maries 3/4 face a l'assemblee</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Programmation musicale */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  Programmation musicale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Moment</th>
                        <th className="text-left py-2 px-3 font-medium">Type de musique</th>
                        <th className="text-left py-2 px-3 font-medium">Recommandation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programmationMusicale.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2 px-3 font-medium text-primary">{item.moment}</td>
                          <td className="py-2 px-3 text-muted-foreground">{item.type}</td>
                          <td className="py-2 px-3 text-muted-foreground text-xs">{item.conseil}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Un groupe live peut s'adapter en temps reel. Si DJ : lui transmettre le conducteur precis.
                </p>
              </CardContent>
            </Card>

            {/* Rétroplanning */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Retroplanning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {retroplanning.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                      <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded shrink-0">
                        {item.delai}
                      </span>
                      <p className="text-sm text-muted-foreground">{item.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Checklist Jour-J */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Checklist Jour-J
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {checklistJourJ.map((cat, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-primary mb-2">{cat.categorie}</h4>
                      <ul className="space-y-1">
                        {cat.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-4 h-4 border rounded flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Citation finale */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-muted-foreground italic">
                  "La ceremonie laique, bien plus qu'une simple alternative au cadre religieux, est une veritable ingenierie de l'emotion. 
                  En placant l'histoire du couple au centre, elle transforme les invites de simples spectateurs en temoins actifs de l'engagement."
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== ONGLET CATHOLIQUE ==================== */}
          <TabsContent value="catholique" className="space-y-6">
            {/* Boutons télécharger et partager */}
            <div className="flex justify-end gap-2">
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText('https://www.mariable.fr/ceremonie-catholique');
                  toast.success("Lien copié dans le presse-papier !");
                }}
                variant="outline"
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              <Button 
                onClick={handleExportPDFCatholique}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                {!isPremium && <Lock className="h-4 w-4" />}
                <Download className="h-4 w-4" />
                Telecharger la checklist
              </Button>
            </div>

            {/* Introduction */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <Church className="h-5 w-5 text-primary" />
                  Le Mariage Catholique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Duree</p>
                    <p className="text-xs text-muted-foreground mt-1">1h a 1h30 (messe nuptiale)</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Preparation</p>
                    <p className="text-xs text-muted-foreground mt-1">6 a 12 mois avant le mariage</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <Cross className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Nature</p>
                    <p className="text-xs text-muted-foreground mt-1">Acte sacramentel, alliance indissoluble</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic text-center">
                  Le mariage catholique represente un acte sacramentel ou le divin rencontre l'humain pour sceller une alliance indissoluble.
                </p>
              </CardContent>
            </Card>

            {/* Alerte importante */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="flex items-start gap-3 py-4">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Important</p>
                  <p className="text-sm text-amber-700">
                    Le mariage civil doit obligatoirement preceder le mariage religieux. 
                    La preparation doit etre initiee idealement 1 an a l'avance, ou au minimum 6 mois avant.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dossier de catholicité */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Dossier de catholicite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-2 px-3 font-medium">Document</th>
                        <th className="text-left py-2 px-3 font-medium">Nature</th>
                        <th className="text-left py-2 px-3 font-medium">Validite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentsCatholicite.map((doc, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2 px-3 font-medium">{doc.document}</td>
                          <td className="py-2 px-3 text-muted-foreground">{doc.nature}</td>
                          <td className="py-2 px-3 text-muted-foreground text-xs">{doc.validite}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Mariages mixtes */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Mariages mixtes et disparite de culte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-primary mb-2">Mariage mixte</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Union entre deux baptises (ex: catholique et protestant).
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Necessite une autorisation de l'eveque, sollicitee par le pretre.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-primary mb-2">Disparite de culte</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Union entre un catholique et une personne non baptisee.
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Necessite une dispense. Le conjoint catholique s'engage pour le bapteme des enfants.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Les 4 piliers */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Les 4 piliers du mariage catholique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {piliersMariage.map((pilier, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-primary mb-1">{pilier.pilier}</h4>
                      <p className="text-sm font-medium text-foreground mb-1">{pilier.definition}</p>
                      <p className="text-xs text-muted-foreground">{pilier.pratique}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic text-center">
                  Chaque epoux redige une declaration d'intention manuscrite exprimant son adhesion a ces 4 piliers.
                </p>
              </CardContent>
            </Card>

            {/* Préparation spirituelle */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Preparation spirituelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Rencontres avec le pretre</h4>
                    <p className="text-sm text-muted-foreground">
                      3 a 4 rencontres pour explorer la dimension spirituelle du couple, 
                      leur comprehension du sacrement et la redaction des declarations d'intention.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Sessions CPM (Centre de Preparation au Mariage)</h4>
                    <p className="text-sm text-muted-foreground">
                      Journees ou week-ends avec d'autres fiances pour aborder la communication, 
                      la gestion des conflits, la sexualite et le projet de vie.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Déroulé de la cérémonie */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Deroule de la ceremonie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-primary/20" />
                  
                  <div className="space-y-4">
                    {derouleCatholique.map((etape, index) => (
                      <div key={index} className="relative flex items-start gap-4">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold shrink-0 text-sm">
                          {etape.numero}
                        </div>
                        <div className="flex-1 pb-2">
                          <h3 className="font-medium text-foreground">{etape.titre}</h3>
                          <p className="text-sm text-muted-foreground">{etape.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Décoration et fleurs */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <Flower2 className="h-5 w-5 text-primary" />
                  Decoration et fleurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">L'autel</h4>
                    <p className="text-xs text-muted-foreground">
                      Point focal de la liturgie. Compositions florales au pied ou sur les cotes, 
                      jamais directement sur l'autel.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">L'allee centrale</h4>
                    <p className="text-xs text-muted-foreground">
                      Bouquets en bout de banc, rubans de soie ou satin, 
                      petales de fleurs si la paroisse l'autorise.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Les bougies</h4>
                    <p className="text-xs text-muted-foreground">
                      Symbolisent la lumiere du Christ. Rituel possible : 
                      allumer ensemble un cierge central depuis deux bougies.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic text-center">
                  Prevoyez une equipe pour retirer les decorations apres la ceremonie.
                </p>
              </CardContent>
            </Card>

            {/* Musique sacrée */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  Musique sacree
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-2 px-3 font-medium">Moment</th>
                        <th className="text-left py-2 px-3 font-medium">Exemples de repertoire</th>
                      </tr>
                    </thead>
                    <tbody>
                      {musiqueSacree.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2 px-3 font-medium text-primary">{item.moment}</td>
                          <td className="py-2 px-3 text-muted-foreground">{item.exemples}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  L'orgue reste l'instrument par excellence. Chorale gospel ou quatuor a cordes possibles pour personnaliser.
                </p>
              </CardContent>
            </Card>

            {/* Rôles des participants */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Roles des participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="temoins">
                    <AccordionTrigger className="text-sm font-medium">Les temoins</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Minimum 2 temoins (1 par marie), pas obligatoirement baptises</li>
                        <li>- Signent le registre pour certifier l'echange des consentements</li>
                        <li>- Piliers logistiques pour la gestion des invites</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="enfants">
                    <AccordionTrigger className="text-sm font-medium">Enfants d'honneur</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Portent les alliances sur un coussin</li>
                        <li>- Lancent des petales de fleurs devant la mariee</li>
                        <li>- Tiennent la traine de la robe si necessaire</li>
                        <li>- Age ideal : 5 a 10 ans pour minimiser les imprevus</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="photographes">
                    <AccordionTrigger className="text-sm font-medium">Photographes</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Se presenter au pretre avant la ceremonie</li>
                        <li>- Rester hors du choeur, deplacements lents et discrets</li>
                        <li>- Privilegier les teleobjectifs pour rester a distance</li>
                        <li>- Moments cles : entree, alliances, benediction, signature</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* La sortie */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <PartyPopper className="h-5 w-5 text-primary" />
                  La sortie de l'eglise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-2 px-3 font-medium">Tradition</th>
                        <th className="text-left py-2 px-3 font-medium">Signification</th>
                        <th className="text-left py-2 px-3 font-medium">Contrainte</th>
                      </tr>
                    </thead>
                    <tbody>
                      {traditionsSortie.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2 px-3 font-medium">{item.tradition}</td>
                          <td className="py-2 px-3 text-muted-foreground">{item.signification}</td>
                          <td className="py-2 px-3 text-muted-foreground text-xs">{item.contrainte}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic text-center">
                  Verifiez aupres de la paroisse ce qui est autorise. Prevoyez le nettoyage du parvis.
                </p>
              </CardContent>
            </Card>

            {/* Checklist Catholique */}
            <Card className="border-editorial-border">
              <CardHeader>
                <CardTitle className="font-serif text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Checklist mariage catholique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {checklistCatholique.map((cat, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-primary mb-2">{cat.categorie}</h4>
                      <ul className="space-y-1">
                        {cat.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-4 h-4 border rounded flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Citation finale catholique */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-muted-foreground italic">
                  "Le mariage catholique est un equilibre subtil entre la rigueur liturgique et l'expression d'un amour personnel. 
                  La celebration n'est pas une fin en soi, mais le debut d'une alliance soutenue par la foi et la communaute."
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <PremiumModal
        isOpen={showModalLaique}
        onClose={closeModalLaique}
        feature={featureLaique}
        description={descriptionLaique}
      />

      <PremiumModal
        isOpen={showModalCatholique}
        onClose={closeModalCatholique}
        feature={featureCatholique}
        description={descriptionCatholique}
      />
    </>
  );
};

export default CeremoniePage;
