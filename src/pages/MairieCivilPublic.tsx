import React from 'react';
import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  FileCheck, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle2,
  FileText,
  AlertCircle,
  MapPin,
  Scale,
  Heart,
  Globe,
  UserCheck,
  ExternalLink
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MairieCivilPublic: React.FC = () => {
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

  return (
    <>
      <Helmet>
        <title>Guide Mariage Civil - Documents et Démarches | Mariable</title>
        <meta name="description" content="Guide complet pour votre mariage civil : documents indispensables, conditions, délais et étapes à suivre pour vous marier à la mairie." />
        <link rel="canonical" href="https://www.mariable.fr/mariage-civil" />
      </Helmet>

      <PremiumHeader />

      <main className="min-h-screen bg-editorial-beige" style={{ paddingTop: 'var(--header-h-standard)' }}>
        <div className="container max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-none bg-wedding-olive">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-editorial-noir mb-4">Guide du Mariage Civil</h1>
            <p className="text-editorial-noir/70 max-w-2xl mx-auto">
              Tout ce que vous devez savoir pour préparer votre mariage à la mairie
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register-gratuit" className="inline-flex items-center justify-center px-6 py-3 bg-wedding-olive text-white uppercase tracking-wide text-sm font-medium hover:bg-wedding-olive/90 transition-colors">
                Créer un compte Mariable
              </a>
              <a href="/" className="inline-flex items-center justify-center px-6 py-3 border border-editorial-noir text-editorial-noir uppercase tracking-wide text-sm font-medium hover:bg-editorial-noir hover:text-white transition-colors">
                Explorer la sélection de lieux & professionnels
              </a>
            </div>
          </div>

          <div className="space-y-8">
            {/* Alerte importante */}
            <div className="bg-white border border-editorial-noir/10 rounded-none flex items-start gap-3 p-5">
              <AlertCircle className="h-5 w-5 text-wedding-olive mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-editorial-noir">Important</p>
                <p className="text-sm text-editorial-noir/70">
                  Le mariage civil doit obligatoirement précéder le mariage religieux.
                  Les documents et délais peuvent varier selon les mairies — vérifiez toujours sur le site officiel de votre mairie.
                </p>
              </div>
            </div>

            {/* Conditions pour se marier */}
            <div className="bg-white border border-editorial-noir/10 rounded-none">
              <div className="px-6 pt-6 pb-3">
                <h2 className="flex items-center gap-2 font-serif text-xl text-editorial-noir">
                  <Scale className="h-5 w-5 text-wedding-olive" />
                  Conditions pour se marier
                </h2>
              </div>
              <div className="px-6 pb-6">
                <div className="grid gap-3">
                  {conditions.map((condition, index) => {
                    const Icon = condition.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 bg-editorial-beige rounded-none">
                        <Icon className="h-5 w-5 text-wedding-olive mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{condition.text}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Note : Dans certains cas exceptionnels, une dispense pour lien de parenté peut être accordée par le Président de la République.
                </p>
              </div>
            </div>

            {/* Où peut-on se marier */}
            <div className="bg-white border border-editorial-noir/10 rounded-none">
              <div className="px-6 pt-6 pb-3">
                <h2 className="flex items-center gap-2 font-serif text-xl text-editorial-noir">
                  <MapPin className="h-5 w-5 text-wedding-olive" />
                  Où peut-on se marier ?
                </h2>
              </div>
              <div className="px-6 pb-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {lieuxMariage.map((lieu, index) => {
                    const Icon = lieu.icon;
                    return (
                      <div key={index} className="p-4 border rounded-none bg-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-5 w-5 text-wedding-olive" />
                          <h4 className="font-medium text-sm">{lieu.titre}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">{lieu.description}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2 text-xs text-muted-foreground bg-editorial-beige p-4 rounded-none">
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
              </div>
            </div>

            {/* Documents indispensables */}
            <div className="bg-white border border-editorial-noir/10 rounded-none">
              <div className="px-6 pt-6 pb-3">
                <h2 className="flex items-center gap-2 font-serif text-xl text-editorial-noir">
                  <FileCheck className="h-5 w-5 text-wedding-olive" />
                  Documents indispensables
                </h2>
              </div>
              <div className="px-6 pb-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {documentsIndispensables.map((doc, index) => {
                    const Icon = doc.icon;
                    return (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 p-4 rounded-none bg-editorial-beige border border-editorial-noir/10"
                      >
                        <div className="p-2 rounded-none bg-wedding-olive/10">
                          <Icon className="h-4 w-4 text-wedding-olive" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                          <p className="text-xs text-wedding-olive mt-1">{doc.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Délais de publication des bans */}
            <div className="bg-white border border-editorial-noir/10 rounded-none">
              <div className="px-6 pt-6 pb-3">
                <h2 className="flex items-center gap-2 font-serif text-xl text-editorial-noir">
                  <Clock className="h-5 w-5 text-wedding-olive" />
                  Délais de publication des bans
                </h2>
              </div>
              <div className="px-6 pb-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {delaisBans.map((delai, index) => (
                    <div key={index} className="text-center p-4 border rounded-none bg-white">
                      <div className="text-3xl font-bold text-wedding-olive mb-1">{delai.semaines}</div>
                      <div className="text-sm font-medium mb-2">semaines minimum</div>
                      <p className="text-xs text-muted-foreground">{delai.condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Situations particulières */}
            <div className="bg-white border border-editorial-noir/10 rounded-none">
              <div className="px-6 pt-6 pb-3">
                <h2 className="flex items-center gap-2 font-serif text-xl text-editorial-noir">
                  <Globe className="h-5 w-5 text-wedding-olive" />
                  Situations particulières
                </h2>
              </div>
              <div className="px-6 pb-6">
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
                              <CheckCircle2 className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* Comment ça marche */}
            <div className="bg-white border border-editorial-noir/10 rounded-none">
              <div className="px-6 pt-6 pb-3">
                <h2 className="flex items-center gap-2 font-serif text-xl text-editorial-noir">
                  <CheckCircle2 className="h-5 w-5 text-wedding-olive" />
                  Comment ça marche ?
                </h2>
              </div>
              <div className="px-6 pb-6">
                <div className="relative">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-wedding-olive/20" />
                  
                  <div className="space-y-4">
                    {etapes.map((etape, index) => (
                      <div key={index} className="relative flex items-start gap-4">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-none bg-wedding-olive text-white font-bold shrink-0 text-sm">
                          {etape.numero}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">{etape.title}</h3>
                            <span className="text-xs text-wedding-olive bg-wedding-olive/10 px-2 py-0.5 rounded">
                              {etape.delai}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{etape.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Liens utiles */}
            <div className="bg-white border border-editorial-noir/10 rounded-none">
              <div className="px-6 pt-6 pb-3">
                <h2 className="flex items-center gap-2 font-serif text-xl text-editorial-noir">
                  <ExternalLink className="h-5 w-5 text-wedding-olive" />
                  Liens utiles
                </h2>
              </div>
              <div className="px-6 pb-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {liensUtiles.map((lien, index) => (
                    <a 
                      key={index}
                      href={lien.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-4 border rounded-none hover:border-wedding-olive hover:bg-wedding-olive/5 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-wedding-olive" />
                      <span className="text-sm font-medium">{lien.titre}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bon à savoir */}
            <div className="border border-wedding-olive/20 bg-wedding-olive/5 rounded-none">
              <div className="p-6">
                <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-wedding-olive" />
                  Bon à savoir
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Les témoins doivent être majeurs (18 ans) ou mineurs émancipés</li>
                  <li>• La cérémonie est publique - tout le monde peut y assister</li>
                  <li>• Vous pouvez personnaliser votre cérémonie avec des lectures, de la musique...</li>
                  <li>• Le livret de famille vous est remis à l'issue de la cérémonie</li>
                </ul>
              </div>
            </div>

            {/* CTA bottom */}
            <div className="text-center bg-wedding-olive p-8 mt-8">
              <h2 className="font-serif text-2xl text-white mb-4">Organisez votre mariage avec Mariable</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Créez un compte gratuit pour accéder à nos outils d'organisation ou explorez notre sélection de lieux & professionnels.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/register-gratuit" className="inline-flex items-center justify-center px-6 py-3 bg-white text-editorial-noir uppercase tracking-wide text-sm font-medium hover:bg-white/90 transition-colors">
                  Créer un compte gratuit
                </a>
                <a href="/professionnelsmariable" className="inline-flex items-center justify-center px-6 py-3 border border-white text-white uppercase tracking-wide text-sm font-medium hover:bg-white hover:text-editorial-noir transition-colors">
                  Voir lieux & professionnels
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>

  );
};

export default MairieCivilPublic;