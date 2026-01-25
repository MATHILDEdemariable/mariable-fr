import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Camera, Utensils, Flower2, Music, Heart, Check, ArrowRight, Phone, Mail, FileText, ClipboardList, Instagram, Calendar, MapPin, Users, ChevronDown, Scissors, Car, Sparkles, Gamepad2, ChefHat, Coffee, Truck } from 'lucide-react';
import SEO from '@/components/SEO';
import PremiumHeader from '@/components/home/PremiumHeader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';

const heroImage = "https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/prestataires-photos/393cefaa-0946-457b-8f61-d3b471e7dde1/34cbf103-defd-41bd-94db-ef846182c915-image_-_2025-10-12T120419.624.jpg";

// Partenaires classés par catégorie - Données extraites des PDFs
const partnersByCategory = {
  "Traiteur classique": {
    icon: Utensils,
    partners: [
      { name: "Le Nectar traiteur", tel: "06 67 83 76 65", description: "Cuisine raffinée, produits frais et de saison", price: "À partir de 94€/pers" },
      { name: "Cook for you", tel: "07 88 78 38 14", description: "S'adapte à vos envies, qualité et saisonnalité", price: "À partir de 65€/pers" },
      { name: "Phylis traiteur", tel: "05 56 21 21 52", description: "20 ans d'expertise, remise 5% via le domaine", price: "À partir de 90€/pers" }
    ]
  },
  "Traiteur original": {
    icon: Utensils,
    partners: [
      { name: "Toc Toque Cuisine", tel: "06 03 95 91 07", description: "Cuissons au brasero, repas élégant ou original", price: "À partir de 62€/pers" },
      { name: "MOOD", tel: "06 80 87 45 50", description: "Cuisine créative et éclectique sur mesure", price: "À partir de 85€/pers" },
      { name: "Madame Le Coq", tel: "07 77 75 49 60", description: "Personnalisation poussée, touche féminine", price: "Sur devis" }
    ]
  },
  "Chef à domicile": {
    icon: ChefHat,
    partners: [
      { name: "Bernadet Damien", tel: "06 40 55 95 78", description: "Produits d'exception, moments mémorables", price: "À partir de 90€/pers" },
      { name: "Adam Brunet", tel: "06 38 65 29 10", description: "Chef artiste, repas sur mesure", price: "À partir de 100€/pers" }
    ]
  },
  "Foodtruck": {
    icon: Truck,
    partners: [
      { name: "Buteco Apero Truck", tel: "06 34 32 05 46", description: "Bar ambulant, cocktails sur mesure", price: "À partir de 20€/pers" },
      { name: "La Pastoune", tel: "07 83 56 55 32", description: "Pâtes fraîches éco-responsables", price: "À partir de 15€/pers" },
      { name: "Stand by me", tel: "07 83 56 55 32", description: "Mi-chemin traiteur/foodtruck, cuisine créative", price: "Sur devis" },
      { name: "Le Chariot", tel: "06 03 18 32 55", description: "Gastronomie de rue du monde entier", price: "À partir de 65€/pers" }
    ]
  },
  "Brunch": {
    icon: Coffee,
    partners: [
      { name: "Green garage foodtruck", tel: "06 52 22 81 76", description: "100% fait maison, street food américaine", price: "Sur devis" },
      { name: "La cheffe", tel: "06 32 26 81 49", description: "Brunch sucré/salé, produits locaux", price: "Sur devis" },
      { name: "Les plateaux fruités de Sabrina", tel: "06 52 22 81 76", description: "Plateaux de fruits frais", price: "Sur devis" }
    ]
  },
  "Photographes": {
    icon: Camera,
    partners: [
      { name: "Estelle Cantillac", tel: "06 35 31 65 98", description: "Retrouvez son book sur Google", price: "" },
      { name: "Marion Bacquey", tel: "06 64 26 01 50", description: "Retrouvez son book sur Google", price: "" },
      { name: "Romain Tholliez", tel: "06 17 41 37 43", description: "Retrouvez son book sur Google", price: "" },
      { name: "Lisa Baquerin", tel: "06 40 49 99 95", description: "Retrouvez son book sur Google", price: "" },
      { name: "Christophe Boury", tel: "06 89 57 77 17", description: "Retrouvez son book sur Google", price: "" }
    ]
  },
  "DJ & Animation": {
    icon: Music,
    partners: [
      { name: "DJ Mariage 33", tel: "07 83 44 34 69", description: "Animation musicale professionnelle", price: "À partir de 1000€" },
      { name: "Jean Noël Caron", tel: "06 80 11 30 16", description: "Via le domaine, tout compris", price: "1200€" },
      { name: "DJ Paul", tel: "06 62 37 73 22", description: "Animation sur mesure", price: "Sur devis" },
      { name: "MUST EVENT", tel: "06 18 25 85 09", description: "Agence événementielle", price: "Sur devis" },
      { name: "Rose Culotte", tel: "", description: "Groupe de musique (via Instagram)", price: "Sur devis" },
      { name: "Barry Musique Service", tel: "06 07 05 24 80", description: "DJ professionnel", price: "Sur devis" }
    ]
  },
  "Maquillage & Coiffure": {
    icon: Scissors,
    partners: [
      { name: "Cyrille D", tel: "06 13 09 05 43", description: "Maquilleuse coiffeuse, forfait complet", price: "À partir de 450€" },
      { name: "Petra", tel: "06 99 74 26 82", description: "Maquilleuse, hors frais de déplacement", price: "190€ jour J" },
      { name: "Laetitia B", tel: "06 26 48 13 78", description: "Maquilleuse avec essai inclus", price: "150€" },
      { name: "Cyrielle Delas", tel: "06 31 51 41 81", description: "Maquilleuse coiffeuse (crepage_de_chignon)", price: "Sur devis" },
      { name: "Allisson Milliez", tel: "", description: "Maquilleuse coiffeuse", price: "Sur devis" },
      { name: "Lauraly", tel: "06 66 07 63 68", description: "Événements et beauté", price: "Sur devis" }
    ]
  },
  "Fleuristes": {
    icon: Flower2,
    partners: [
      { name: "L'Atelier de Roméo", tel: "06 48 41 23 13", description: "Saint Sulpice et Cameyrac", price: "" },
      { name: "Sibelle Créations", tel: "06 58 21 32 20", description: "Tauriac", price: "" },
      { name: "Le Temps d'une Fleur", tel: "06 31 02 97 68", description: "Sillas", price: "" },
      { name: "L'Univers Gloriosa", tel: "07 63 69 01 59", description: "Camiac et St Denis", price: "" },
      { name: "A Green Success", tel: "06 83 18 08 35", description: "Mérignac", price: "" },
      { name: "May Flowers Bee", tel: "06 11 57 63 16", description: "Lormont", price: "" }
    ]
  },
  "Taxi & VTC": {
    icon: Car,
    partners: [
      { name: "VTC Jean Carmona", tel: "06 42 47 64 85", description: "Mise à disposition", price: "50€/h" },
      { name: "Taxi Val", tel: "", description: "Secteur rive droite, forfait via le Domaine", price: "Sur devis" },
      { name: "Taxi Blayais", tel: "07 63 32 42 67", description: "Van, navettes aéroport/gare", price: "Sur devis" }
    ]
  },
  "Décoration": {
    icon: Sparkles,
    partners: [
      { name: "Manoir des Rêves", tel: "07 66 84 91 18", description: "Mobilier chiné + mise en scène complète", price: "manoirdesreves.fr" },
      { name: "À La Française Wedding", tel: "06 01 07 43 62", description: "Location de décoration", price: "alafrancaise-weddings.com" }
    ]
  },
  "Activités": {
    icon: Gamepad2,
    partners: [
      { name: "Kit jeux extérieurs", tel: "", description: "Ping pong, molky, mikado géant, cornhole (via le domaine)", price: "40€ le week-end" },
      { name: "Barbecue gaz", tel: "", description: "Mise à disposition le week-end (via le domaine)", price: "40€" },
      { name: "Visite Château Leroy Beauval", tel: "", description: "Visite du chai et dégustation (via le domaine)", price: "À partir de 9€/pers" },
      { name: "Structures gonflables - Loutafete", tel: "05 56 97 24 09", description: "loutafete.com", price: "Sur devis" },
      { name: "Structures gonflables - Sonodary", tel: "06 78 71 03 31", description: "sonodary.com", price: "Sur devis" }
    ]
  }
};

// Étapes du parcours mariage
const journeySteps = [
  {
    number: "1",
    title: "Signature du contrat",
    description: "Félicitations ! Votre date est maintenant réservée au Domaine de Badine. Vous recevrez une confirmation par email.",
    icon: FileText
  },
  {
    number: "2",
    title: "Visite technique",
    description: "Planifiez votre visite technique pour valider l'installation, les accès et les détails logistiques de votre réception.",
    icon: MapPin
  },
  {
    number: "3",
    title: "Choix des prestataires",
    description: "Consultez nos partenaires recommandés ci-dessous. Vous pouvez les contacter de notre part pour bénéficier d'avantages.",
    icon: Users
  },
  {
    number: "4",
    title: "Réunion de coordination",
    description: "1 mois avant le jour J, nous organisons une réunion pour finaliser le déroulé et répondre à vos dernières questions.",
    icon: Calendar
  },
  {
    number: "5",
    title: "Le Jour J",
    description: "Notre équipe vous accueille et vous accompagne tout au long de cette journée exceptionnelle entre Bordeaux et Saint-Émilion.",
    icon: Heart
  }
];

// Documents et ressources
const documents = [
  {
    icon: Utensils,
    title: "Liste des traiteurs",
    description: "Tous les traiteurs référencés par le domaine",
    url: "/documents/badine/listing-traiteurs-domaine-badine.pdf",
    type: "pdf"
  },
  {
    icon: Users,
    title: "Liste des prestataires",
    description: "Photographes, DJ, fleuristes, décorateurs...",
    url: "/documents/badine/listing-prestataires-domaine-badine.pdf",
    type: "pdf"
  },
  {
    icon: ClipboardList,
    title: "Catalogue déco",
    description: "Demandez le catalogue déco sur mesure à Nina",
    url: "#",
    type: "contact"
  },
  {
    icon: Instagram,
    title: "Inspiration",
    description: "Découvrez les mariages célébrés au domaine",
    url: "https://www.domainedebadine.com",
    type: "link"
  }
];

// Outils Mariable
const bonusTools = ['Checklist IA', 'Budget', 'Invités', 'Planning Jour J', 'Plan de table', 'Calculatrice boisson'];

// FAQ / Infos pratiques
const faqItems = [
  {
    question: "Capacité d'accueil",
    answer: "Le domaine peut accueillir jusqu'à 130 personnes. Deux salles modulables permettent de s'adapter à votre configuration. L'espace extérieur avec piscine est idéal pour les cocktails."
  },
  {
    question: "Hébergement sur place",
    answer: "9 couchages sont inclus dans la formule de base. Des options d'hébergement supplémentaires peuvent être organisées aux alentours."
  },
  {
    question: "Formule de base",
    answer: "À partir de 5 200€, la formule inclut les salles de réception, les espaces extérieurs, la piscine, le parking et les 9 couchages."
  },
  {
    question: "Partenariats prestataires",
    answer: "Certains prestataires ont un partenariat avec le domaine, ce qui permet de gérer la partie administrative et facturation tout en vous laissant maître des échanges organisationnels."
  },
  {
    question: "Contact référent",
    answer: "Nina est votre interlocutrice privilégiée pour toutes vos questions. Vous pouvez la joindre au 06 47 11 96 69 ou par email à nina@domainedebadine.com."
  }
];

const DomaineDeBadine = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEO 
        title="Guide d'accueil - Domaine de Badine | Mariable" 
        description="Votre guide personnalisé pour préparer sereinement votre mariage au Domaine de Badine, entre Bordeaux et Saint-Émilion. Partenaires, documents et informations pratiques." 
      />

      <PremiumHeader />

      {/* HERO - Accueil chaleureux */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url("${heroImage}")` }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Bienvenue au<br />
            <span className="text-premium-sage-light">Domaine de Badine</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-8 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Votre guide d'accueil personnalisé pour préparer sereinement votre mariage
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              size="lg"
              onClick={() => scrollToSection('parcours')}
              className="bg-white text-editorial-noir hover:bg-white/90 rounded-none px-8 py-6 text-sm tracking-widest uppercase font-sans"
            >
              Découvrir le guide
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* SOMMAIRE NAVIGATION */}
      <section className="sticky top-20 z-40 bg-white border-b border-editorial-noir/10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {[
              { id: 'parcours', label: 'Le parcours' },
              { id: 'documents', label: 'Documents' },
              { id: 'partenaires', label: 'Partenaires' },
              { id: 'infos', label: 'Infos pratiques' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 text-xs tracking-widest uppercase text-editorial-noir/70 hover:text-editorial-noir border border-editorial-noir/20 hover:border-editorial-noir/40 transition-colors rounded-none"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION PARCOURS - Timeline */}
      <section id="parcours" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-editorial-noir mb-4">
              Votre mariage étape par étape
            </h2>
            <p className="text-editorial-noir/60 text-lg max-w-xl mx-auto">
              De la signature jusqu'au jour J, nous vous accompagnons à chaque étape
            </p>
          </motion.div>

          {/* Timeline verticale */}
          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-editorial-noir/10 md:-translate-x-px" />

            {journeySteps.map((step, index) => (
              <motion.div 
                key={step.number}
                className={`relative flex items-start gap-6 md:gap-12 mb-12 last:mb-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Numéro */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-none bg-editorial-beige flex items-center justify-center z-10 border border-editorial-noir/10">
                  <span className="font-serif text-xl text-editorial-noir">{step.number}</span>
                </div>

                {/* Contenu */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  <div className="bg-editorial-beige/30 p-6 rounded-none border border-editorial-noir/5">
                    <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <step.icon className="h-5 w-5 text-premium-sage" />
                      <h3 className="font-serif text-xl text-editorial-noir">{step.title}</h3>
                    </div>
                    <p className="text-editorial-noir/60 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION DOCUMENTS */}
      <section id="documents" className="py-16 md:py-24 bg-editorial-beige/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-editorial-noir mb-4">
              Documents et ressources
            </h2>
            <p className="text-editorial-noir/60 text-lg max-w-xl mx-auto">
              Tous les documents utiles pour préparer votre réception
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {documents.map((doc, index) => (
              <motion.a
                key={doc.title}
                href={doc.url}
                target={doc.type === 'link' ? '_blank' : undefined}
                rel={doc.type === 'link' ? 'noopener noreferrer' : undefined}
                className="bg-white p-6 border border-editorial-noir/10 hover:border-editorial-noir/30 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-editorial-beige flex items-center justify-center mb-4 group-hover:bg-premium-sage/20 transition-colors">
                  <doc.icon className="h-6 w-6 text-premium-sage" />
                </div>
                <h3 className="font-serif text-lg text-editorial-noir mb-2">{doc.title}</h3>
                <p className="text-editorial-noir/60 text-sm mb-4">{doc.description}</p>
                <span className="text-xs tracking-widest uppercase text-premium-sage font-sans flex items-center gap-1">
                  {doc.type === 'pdf' ? 'Télécharger' : doc.type === 'contact' ? 'Contacter' : 'Voir'}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION PARTENAIRES - Par catégorie avec accordions */}
      <section id="partenaires" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-editorial-noir mb-4">
              Nos prestataires recommandés
            </h2>
            <p className="text-editorial-noir/60 text-lg max-w-xl mx-auto">
              Prestataires sélectionnés pour leur sérieux et la qualité de leur travail. Contactez-les de la part du domaine.
            </p>
          </motion.div>

          {/* Accordions par catégorie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="multiple" className="space-y-3">
              {Object.entries(partnersByCategory).map(([category, data], categoryIndex) => {
                const IconComponent = data.icon;
                return (
                  <AccordionItem 
                    key={category} 
                    value={category}
                    className="bg-editorial-beige/20 border border-editorial-noir/10 rounded-none"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white flex items-center justify-center border border-editorial-noir/10">
                          <IconComponent className="h-5 w-5 text-premium-sage" />
                        </div>
                        <div className="text-left">
                          <span className="font-serif text-lg text-editorial-noir">{category}</span>
                          <span className="ml-3 text-xs text-editorial-noir/50">({data.partners.length})</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-4 pt-2">
                        {data.partners.map((partner, index) => (
                          <div 
                            key={`${category}-${partner.name}`}
                            className="bg-white p-4 border border-editorial-noir/5"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div>
                                <h4 className="font-serif text-base text-editorial-noir">{partner.name}</h4>
                                <p className="text-editorial-noir/60 text-sm">{partner.description}</p>
                                {partner.price && (
                                  <span className="text-premium-sage text-sm font-medium">{partner.price}</span>
                                )}
                              </div>
                              {partner.tel && (
                                <a 
                                  href={`tel:${partner.tel.replace(/\s/g, '')}`}
                                  className="flex items-center gap-2 text-sm text-editorial-noir/60 hover:text-editorial-noir transition-colors shrink-0"
                                >
                                  <Phone className="h-4 w-4" />
                                  {partner.tel}
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* SECTION INFOS PRATIQUES */}
      <section id="infos" className="py-16 md:py-24 bg-editorial-beige/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-editorial-noir mb-4">
              Informations pratiques
            </h2>
            <p className="text-editorial-noir/60 text-lg max-w-xl mx-auto">
              Toutes les réponses à vos questions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="bg-white border border-editorial-noir/10">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-editorial-noir/10 last:border-0">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline text-left">
                    <span className="font-serif text-lg text-editorial-noir">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5">
                    <p className="text-editorial-noir/60 leading-relaxed">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact rapide */}
          <motion.div 
            className="mt-8 bg-white p-6 border border-editorial-noir/10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-editorial-noir/60 mb-4">Une question ? Contactez Nina, votre référente</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="tel:+33647119669" 
                className="flex items-center gap-2 px-4 py-2 bg-editorial-beige text-editorial-noir text-sm hover:bg-editorial-beige/70 transition-colors"
              >
                <Phone className="h-4 w-4" />
                06 47 11 96 69
              </a>
              <a 
                href="mailto:nina@domainedebadine.com" 
                className="flex items-center gap-2 px-4 py-2 bg-editorial-beige text-editorial-noir text-sm hover:bg-editorial-beige/70 transition-colors"
              >
                <Mail className="h-4 w-4" />
                nina@domainedebadine.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION OUTILS MARIABLE */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-2xl md:text-3xl text-editorial-noir mb-4">
              Vos outils de planification
            </h2>
            
            <p className="text-editorial-noir/60 mb-8">
              Organisez votre mariage sereinement avec les outils gratuits de mariable.fr   
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {bonusTools.map((tool, index) => (
                <motion.span 
                  key={tool}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-editorial-beige/50 text-editorial-noir text-sm border border-editorial-noir/10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Check className="h-4 w-4 text-premium-sage" />
                  {tool}
                </motion.span>
              ))}
            </div>

            <Button 
              asChild
              className="bg-editorial-noir hover:bg-editorial-noir/80 text-white rounded-none px-8 py-6 text-xs tracking-widest uppercase font-sans"
              size="lg"
            >
              <Link to="/register">
                Créer mon compte gratuit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default DomaineDeBadine;
