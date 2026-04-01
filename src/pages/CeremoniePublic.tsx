import React from 'react';
import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
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

  const SectionTitle = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 rounded-none bg-[#63745a]">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h2 className="font-serif text-2xl md:text-3xl text-editorial-black">{children}</h2>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Guide Cérémonie Laïque de Mariage | Mariable</title>
        <meta name="description" content="Guide complet pour votre cérémonie laïque de mariage : rituels, vœux, musique, déroulement et conseils pour une célébration unique et personnalisée." />
        <link rel="canonical" href="https://www.mariable.fr/ceremonie-laique" />
      </Helmet>

      <PremiumHeader />

      <main className="min-h-screen" style={{ paddingTop: 'var(--header-h-standard)' }}>
        {/* Hero Section — Sage Green */}
        <section className="bg-[#63745a] py-20 md:py-28">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block border border-white/40 text-white/90 text-xs tracking-widest uppercase px-4 py-1.5 mb-6">
              Guide complet
            </span>
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-5">
              Guide de la Cérémonie Laïque
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Tout ce que vous devez savoir pour organiser une cérémonie laïque unique et personnalisée
            </p>
          </div>
        </section>

        {/* Fondamentaux */}
        <section className="py-16 bg-premium-warm">
          <div className="container max-w-4xl mx-auto px-4">
            <SectionTitle icon={Heart}>Les Fondamentaux</SectionTitle>
            <div className="grid md:grid-cols-3 gap-5">
              {fondamentaux.map((item, index) => (
                <div key={index} className="bg-white p-5 shadow-sm flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-[#63745a] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-editorial-black">{item.label}</p>
                    <p className="text-editorial-black/60 text-sm mt-1">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Déroulement */}
        <section className="py-16 bg-premium-beige">
          <div className="container max-w-4xl mx-auto px-4">
            <SectionTitle icon={Clock}>Déroulement Type (45-60 min)</SectionTitle>
            <div className="space-y-3">
              {deroulementEtapes.map((etape) => (
                <div key={etape.numero} className="flex gap-4 items-start p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 bg-[#63745a] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {etape.numero}
                  </div>
                  <div>
                    <p className="font-medium text-editorial-black">{etape.titre}</p>
                    <p className="text-editorial-black/60 text-sm">{etape.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Officiants */}
        <section className="py-16 bg-premium-warm">
          <div className="container max-w-4xl mx-auto px-4">
            <SectionTitle icon={Mic}>Choisir son Officiant</SectionTitle>
            <div className="grid md:grid-cols-3 gap-5">
              {typesOfficiants.map((officiant, index) => (
                <div key={index} className="bg-white p-5 shadow-sm">
                  <h4 className="font-serif text-lg text-editorial-black mb-4 pb-3 border-b border-[#63745a]/20">{officiant.type}</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#63745a] font-semibold uppercase tracking-wider mb-2">Avantages</p>
                      <ul className="text-sm text-editorial-black/70 space-y-1.5">
                        {officiant.avantages.map((av, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#63745a] mt-0.5 shrink-0" />
                            {av}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-editorial-black/50 font-semibold uppercase tracking-wider mb-2">Vigilances</p>
                      <ul className="text-sm text-editorial-black/70 space-y-1.5">
                        {officiant.vigilances.map((vig, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <AlertCircle className="h-3.5 w-3.5 text-editorial-black/40 mt-0.5 shrink-0" />
                            {vig}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rituels */}
        <section className="py-16 bg-premium-beige">
          <div className="container max-w-4xl mx-auto px-4">
            <SectionTitle icon={TreePine}>Idées de Rituels Symboliques</SectionTitle>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {rituels.map((rituel, index) => (
                <AccordionItem key={index} value={`rituel-${index}`} className="bg-white shadow-sm border-none px-5">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-serif text-editorial-black">{rituel.nom}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <p className="text-editorial-black/70">{rituel.description}</p>
                      <div className="bg-[#63745a]/10 p-4">
                        <p className="text-sm text-[#63745a]">
                          <span className="font-semibold">Conseil :</span> {rituel.conseils}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Rôles des proches */}
        <section className="py-16 bg-premium-warm">
          <div className="container max-w-4xl mx-auto px-4">
            <SectionTitle icon={Users}>Impliquer les Proches</SectionTitle>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {rolesProches.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-5 bg-white shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-[#63745a] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-editorial-black">{item.role}</p>
                    <p className="text-editorial-black/60 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 shadow-sm">
              <p className="font-serif text-lg text-editorial-black mb-4">Alternatives pour les timides</p>
              <ul className="grid md:grid-cols-2 gap-3">
                {alternativesTimides.map((alt, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-editorial-black/70">
                    <span className="w-1.5 h-1.5 bg-[#63745a] rounded-full shrink-0" />
                    {alt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Musique */}
        <section className="py-16 bg-premium-beige">
          <div className="container max-w-4xl mx-auto px-4">
            <SectionTitle icon={Music}>Programmation Musicale</SectionTitle>
            <div className="overflow-x-auto bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#63745a] text-white">
                    <th className="text-left py-3 px-5 font-medium">Moment</th>
                    <th className="text-left py-3 px-5 font-medium">Type de musique</th>
                    <th className="text-left py-3 px-5 font-medium">Conseil</th>
                  </tr>
                </thead>
                <tbody>
                  {programmationMusicale.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-premium-warm'}>
                      <td className="py-3 px-5 font-medium text-editorial-black">{item.moment}</td>
                      <td className="py-3 px-5 text-editorial-black/70">{item.type}</td>
                      <td className="py-3 px-5 text-editorial-black/70">{item.conseil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Rétroplanning */}
        <section className="py-16 bg-premium-warm">
          <div className="container max-w-4xl mx-auto px-4">
            <SectionTitle icon={Sun}>Rétroplanning de Préparation</SectionTitle>
            <div className="space-y-3">
              {retroplanning.map((item, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-white shadow-sm border-l-4 border-[#63745a]">
                  <div className="font-bold text-[#63745a] min-w-[50px]">{item.delai}</div>
                  <p className="text-editorial-black/70">{item.action}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="py-16 bg-premium-beige">
          <div className="container max-w-4xl mx-auto px-4">
            <SectionTitle icon={CheckCircle2}>Checklist Jour J</SectionTitle>
            <div className="grid md:grid-cols-2 gap-6">
              {checklistJourJ.map((cat, index) => (
                <div key={index} className="bg-white p-6 shadow-sm">
                  <h4 className="font-serif text-lg text-editorial-black mb-4 pb-2 border-b border-[#63745a]/20">{cat.categorie}</h4>
                  <ul className="space-y-2.5">
                    {cat.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-editorial-black/70">
                        <div className="w-4 h-4 border-2 border-[#63745a]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final — Sage Green */}
        <section className="py-20 bg-[#63745a]">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">
              Prêts à organiser votre cérémonie ?
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Accédez à tous nos outils pour planifier votre mariage en toute sérénité
            </p>
            <a 
              href="/register" 
              className="inline-flex items-center gap-2 bg-white text-editorial-black px-8 py-3 font-medium hover:bg-white/90 transition-colors"
            >
              Créer un compte gratuit
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CeremoniePublic;
