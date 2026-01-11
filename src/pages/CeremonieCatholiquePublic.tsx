import React from 'react';
import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  Clock, 
  Users, 
  Music, 
  CheckCircle2,
  FileText,
  AlertCircle,
  Calendar,
  Church,
  BookOpen,
  Cross,
  Crown,
  Flower2,
  PartyPopper,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CeremonieCatholiquePublic: React.FC = () => {
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

  return (
    <>
      <Helmet>
        <title>Guide Cérémonie Catholique de Mariage | Mariable</title>
        <meta name="description" content="Guide complet pour votre mariage catholique : dossier de catholicité, 4 piliers, déroulement de la cérémonie, musique sacrée et conseils pratiques." />
      </Helmet>

      <PremiumHeader />

      <main className="min-h-screen bg-white" style={{ paddingTop: 'var(--header-h-standard)' }}>
        <div className="container max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary">
                <Church className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Guide du Mariage Catholique</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tout ce que vous devez savoir pour préparer votre mariage religieux catholique
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Church className="h-5 w-5 text-primary" />
                  Le Mariage Catholique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Durée</p>
                    <p className="text-xs text-muted-foreground mt-1">1h à 1h30 (messe nuptiale)</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Préparation</p>
                    <p className="text-xs text-muted-foreground mt-1">6 à 12 mois avant le mariage</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <Cross className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Nature</p>
                    <p className="text-xs text-muted-foreground mt-1">Acte sacramentel, alliance indissoluble</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic text-center">
                  Le mariage catholique représente un acte sacramentel où le divin rencontre l'humain pour sceller une alliance indissoluble.
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
                    Le mariage civil doit obligatoirement précéder le mariage religieux. 
                    La préparation doit être initiée idéalement 1 an à l'avance, ou au minimum 6 mois avant.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dossier de catholicité */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  Dossier de catholicité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-2 px-3 font-medium">Document</th>
                        <th className="text-left py-2 px-3 font-medium">Nature</th>
                        <th className="text-left py-2 px-3 font-medium">Validité</th>
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
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  Mariages mixtes et disparité de culte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-primary mb-2">Mariage mixte</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Union entre deux baptisés (ex: catholique et protestant).
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Nécessite une autorisation de l'évêque, sollicitée par le prêtre.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-primary mb-2">Disparité de culte</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Union entre un catholique et une personne non baptisée.
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Nécessite une dispense. Le conjoint catholique s'engage pour le baptême des enfants.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Les 4 piliers */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
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
                  Chaque époux rédige une déclaration d'intention manuscrite exprimant son adhésion à ces 4 piliers.
                </p>
              </CardContent>
            </Card>

            {/* Préparation spirituelle */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Préparation spirituelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Rencontres avec le prêtre</h4>
                    <p className="text-sm text-muted-foreground">
                      3 à 4 rencontres pour explorer la dimension spirituelle du couple, 
                      leur compréhension du sacrement et la rédaction des déclarations d'intention.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Sessions CPM (Centre de Préparation au Mariage)</h4>
                    <p className="text-sm text-muted-foreground">
                      Journées ou week-ends avec d'autres fiancés pour aborder la communication, 
                      la gestion des conflits, la sexualité et le projet de vie.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Déroulé de la cérémonie */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Déroulé de la cérémonie
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
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Flower2 className="h-5 w-5 text-primary" />
                  Décoration et fleurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">L'autel</h4>
                    <p className="text-xs text-muted-foreground">
                      Point focal de la liturgie. Compositions florales au pied ou sur les côtés, 
                      jamais directement sur l'autel.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">L'allée centrale</h4>
                    <p className="text-xs text-muted-foreground">
                      Bouquets en bout de banc, rubans de soie ou satin, 
                      pétales de fleurs si la paroisse l'autorise.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Les bougies</h4>
                    <p className="text-xs text-muted-foreground">
                      Symbolisent la lumière du Christ. Rituel possible : 
                      allumer ensemble un cierge central depuis deux bougies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Musique sacrée */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Music className="h-5 w-5 text-primary" />
                  Musique sacrée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-2 px-3 font-medium">Moment</th>
                        <th className="text-left py-2 px-3 font-medium">Exemples de répertoire</th>
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
                  L'orgue reste l'instrument par excellence. Chorale gospel ou quatuor à cordes possibles pour personnaliser.
                </p>
              </CardContent>
            </Card>

            {/* Rôles des participants */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  Rôles des participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="temoins">
                    <AccordionTrigger className="text-sm font-medium">Les témoins</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Minimum 2 témoins (1 par marié), pas obligatoirement baptisés</li>
                        <li>- Signent le registre pour certifier l'échange des consentements</li>
                        <li>- Piliers logistiques pour la gestion des invités</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="enfants">
                    <AccordionTrigger className="text-sm font-medium">Enfants d'honneur</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Portent les alliances sur un coussin</li>
                        <li>- Lancent des pétales de fleurs devant la mariée</li>
                        <li>- Tiennent la traîne de la robe si nécessaire</li>
                        <li>- Âge idéal : 5 à 10 ans pour minimiser les imprévus</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="photographes">
                    <AccordionTrigger className="text-sm font-medium">Photographes</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Se présenter au prêtre avant la cérémonie</li>
                        <li>- Rester hors du chœur, déplacements lents et discrets</li>
                        <li>- Privilégier les téléobjectifs pour rester à distance</li>
                        <li>- Moments clés : entrée, alliances, bénédiction, signature</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* La sortie */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <PartyPopper className="h-5 w-5 text-primary" />
                  La sortie de l'église
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
                  Vérifiez auprès de la paroisse ce qui est autorisé. Prévoyez le nettoyage du parvis.
                </p>
              </CardContent>
            </Card>

            {/* Checklist Catholique */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
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

            {/* Citation finale */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-muted-foreground italic">
                  "Le mariage catholique est un équilibre subtil entre la rigueur liturgique et l'expression d'un amour personnel. 
                  La célébration n'est pas une fin en soi, mais le début d'une alliance soutenue par la foi et la communauté."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CeremonieCatholiquePublic;