import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  CloudRain
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import jsPDF from 'jspdf';
import { toast } from 'sonner';

const CeremoniePage: React.FC = () => {
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

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    
    // Header avec design Mariable
    pdf.setFillColor(139, 137, 114); // wedding-olive
    pdf.rect(0, 0, 210, 35, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("MARIABLE", 20, 18);
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Checklist Cérémonie Laïque", 20, 28);
    
    let yPosition = 50;
    
    // Contenu
    pdf.setTextColor(0, 0, 0);
    
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
        pdf.text(`☐  ${item}`, 25, yPosition);
        yPosition += 7;
      });
      
      yPosition += 5;
    });
    
    // Rétroplanning
    yPosition += 5;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(139, 137, 114);
    pdf.text("Rétroplanning", 20, yPosition);
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
    pdf.setFillColor(245, 244, 240); // beige clair
    pdf.rect(0, 270, 210, 27, 'F');
    
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text("www.mariable.fr", 20, 282);
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 150, 282);
    
    pdf.save("checklist-ceremonie-laique.pdf");
    toast.success("Checklist cérémonie téléchargée !");
  };

  return (
    <>
      <Helmet>
        <title>Cérémonie Laïque - Guide Complet | Mariable</title>
        <meta name="description" content="Guide complet pour concevoir votre cérémonie laïque : déroulé, rituels symboliques, officiant, vœux, musique et logistique." />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-foreground">Cérémonie Laïque</h1>
              <p className="text-muted-foreground text-sm">Guide complet pour une célébration unique et personnalisée</p>
            </div>
          </div>
          <Button 
            onClick={handleExportPDF}
            className="bg-black hover:bg-black/90 text-white gap-2"
          >
            <Download className="h-4 w-4" />
            Télécharger la checklist
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
              La cérémonie laïque est le pivot émotionnel du mariage - un espace de liberté absolue où votre histoire devient le centre de la narration.
            </p>
          </CardContent>
        </Card>

        {/* Déroulé en 10 étapes */}
        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Le déroulé en 10 étapes
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
                    <p className="text-xs font-medium text-green-700 mb-1">✓ Avantages</p>
                    <ul className="space-y-1">
                      {officiant.avantages.map((a, i) => (
                        <li key={i} className="text-xs text-muted-foreground">• {a}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-amber-700 mb-1">⚠ Points de vigilance</p>
                    <ul className="space-y-1">
                      {officiant.vigilances.map((v, i) => (
                        <li key={i} className="text-xs text-muted-foreground">• {v}</li>
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
                    <p className="text-xs text-primary italic">💡 {rituel.conseils}</p>
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
                <h4 className="font-medium mb-3 text-sm">Rôles possibles</h4>
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
                      <span className="text-primary">→</span>
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
              Guide de rédaction des vœux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="preparation">
                <AccordionTrigger className="text-sm font-medium">Préparation</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Commencer à noter des idées 2-3 mois avant dans un petit carnet</li>
                    <li>• Recueillir des souvenirs, preuves d'amour quotidiennes, citations inspirantes</li>
                    <li>• Finaliser la version définitive 15 jours avant pour rester connecté à l'émotion</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="structure">
                <AccordionTrigger className="text-sm font-medium">Structure recommandée</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="font-medium text-primary">1. Le passé</p>
                      <p className="text-muted-foreground">Évoquer un souvenir marquant ou la première rencontre</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="font-medium text-primary">2. Le présent</p>
                      <p className="text-muted-foreground">Ce que l'autre représente aujourd'hui (refuge, force, évidence)</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="font-medium text-primary">3. Le futur</p>
                      <p className="text-muted-foreground">Promesses concrètes, grands projets et petits détails du quotidien</p>
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
                    <li>• <strong>Durée :</strong> 2 à 3 minutes pour captiver sans lasser</li>
                    <li>• <strong>Authenticité :</strong> Si vous êtes drôle, incluez de l'humour. Si vous êtes pudique, la simplicité suffit</li>
                    <li>• <strong>Support :</strong> Éviter le téléphone ! Utiliser un beau papier pour les photos</li>
                    <li>• <strong>Émotion :</strong> N'ayez pas peur de pleurer ou de marquer des silences - ce sont ces moments de vulnérabilité qui créent la magie</li>
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
                  <h4 className="font-medium text-sm">Plan B météo</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Prévoir un lieu de repli (salle, grange, barnum)</li>
                  <li>• Réfléchir à la logistique de transfert</li>
                  <li>• En cas de canicule : ombre et rafraîchissements</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="h-5 w-5 text-primary" />
                  <h4 className="font-medium text-sm">Sonorisation</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Minimum 2 micros sans fil pour +50 personnes</li>
                  <li>• Enceintes près des invités (pas derrière les mariés)</li>
                  <li>• Vérifier les prises ou louer un générateur silencieux</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-5 w-5 text-primary" />
                  <h4 className="font-medium text-sm">Aménagement</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Disposition en arc de cercle pour une meilleure visibilité</li>
                  <li>• Recouvrir les chaises plastique (brûlent au soleil)</li>
                  <li>• Mariés 3/4 face à l'assemblée</li>
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
              💡 Un groupe live peut s'adapter en temps réel (faire durer un morceau, s'arrêter au bon moment). Si DJ : lui transmettre le conducteur précis.
            </p>
          </CardContent>
        </Card>

        {/* Rétroplanning */}
        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Rétroplanning
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
              "La cérémonie laïque, bien plus qu'une simple alternative au cadre religieux, est une véritable ingénierie de l'émotion. 
              En plaçant l'histoire du couple au centre, elle transforme les invités de simples spectateurs en témoins actifs de l'engagement."
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CeremoniePage;
