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
  AlertCircle,
  Mic,
  TreePine,
  Sparkles,
  MapPin,
  Sun,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CeremoniePublic: React.FC = () => {
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

  return (
    <>
      <Helmet>
        <title>Guide Cérémonie Laïque de Mariage | Mariable</title>
        <meta name="description" content="Guide complet pour votre cérémonie laïque de mariage : rituels, vœux, musique, déroulement et conseils pour une célébration unique et personnalisée." />
      </Helmet>

      <PremiumHeader />

      <main className="min-h-screen bg-white" style={{ paddingTop: 'var(--header-h-standard)' }}>
        <div className="container max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Guide de la Cérémonie Laïque</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tout ce que vous devez savoir pour organiser une cérémonie laïque unique et personnalisée
            </p>
          </div>

          <div className="space-y-8">
            {/* Fondamentaux */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Heart className="h-5 w-5 text-primary" />
                  Les Fondamentaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {fondamentaux.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{item.label}</p>
                        <p className="text-muted-foreground text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Déroulement */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  Déroulement Type (45-60 min)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deroulementEtapes.map((etape) => (
                    <div key={etape.numero} className="flex gap-4 items-start p-3 hover:bg-muted/30 rounded-lg transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {etape.numero}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{etape.titre}</p>
                        <p className="text-muted-foreground text-sm">{etape.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Officiants */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Mic className="h-5 w-5 text-primary" />
                  Choisir son Officiant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {typesOfficiants.map((officiant, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-card">
                      <h4 className="font-semibold text-foreground mb-3">{officiant.type}</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-green-700 font-medium mb-1">Avantages :</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {officiant.avantages.map((av, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-600 mt-1 shrink-0" />
                                {av}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs text-amber-700 font-medium mb-1">Vigilances :</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {officiant.vigilances.map((vig, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <AlertCircle className="h-3 w-3 text-amber-600 mt-1 shrink-0" />
                                {vig}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rituels */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <TreePine className="h-5 w-5 text-primary" />
                  Idées de Rituels Symboliques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {rituels.map((rituel, index) => (
                    <AccordionItem key={index} value={`rituel-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <span className="font-medium text-foreground">{rituel.nom}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <p className="text-muted-foreground">{rituel.description}</p>
                          <div className="bg-amber-50 p-3 rounded-lg">
                            <p className="text-sm text-amber-800">
                              <span className="font-medium">Conseil :</span> {rituel.conseils}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Rôles des proches */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  Impliquer les Proches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {rolesProches.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">{item.role}</p>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="font-medium text-foreground mb-2">Alternatives pour les timides :</p>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {alternativesTimides.map((alt, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {alt}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Musique */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Music className="h-5 w-5 text-primary" />
                  Programmation Musicale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Moment</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Type de musique</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Conseil</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programmationMusicale.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3 px-4 font-medium text-foreground">{item.moment}</td>
                          <td className="py-3 px-4 text-muted-foreground">{item.type}</td>
                          <td className="py-3 px-4 text-muted-foreground">{item.conseil}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Rétroplanning */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Sun className="h-5 w-5 text-primary" />
                  Rétroplanning de Préparation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {retroplanning.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start p-3 border-l-4 border-primary bg-muted/20">
                      <div className="font-bold text-primary min-w-[50px]">{item.delai}</div>
                      <p className="text-muted-foreground">{item.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Checklist */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Checklist Jour J
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {checklistJourJ.map((cat, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-foreground mb-3">{cat.categorie}</h4>
                      <ul className="space-y-2">
                        {cat.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-4 h-4 border-2 border-primary rounded" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Vous souhaitez accéder à plus d'outils pour organiser votre mariage ?
              </p>
              <a 
                href="/register" 
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Créer un compte gratuit
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CeremoniePublic;
