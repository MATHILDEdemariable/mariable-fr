import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Camera, Utensils, Flower2, Music, Heart, Gem, Check, ArrowRight, Phone, Mail, FileText, ClipboardList, Armchair, Instagram, Calendar, MapPin, Users, Clock, CreditCard, ChevronDown } from 'lucide-react';
import SEO from '@/components/SEO';
import PremiumHeader from '@/components/home/PremiumHeader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
const heroImage = "https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/visuels/DOMAINEFONTAINEPAGE.png";

// Partenaires recommandés du domaine
const partners = [{
  icon: Camera,
  category: "Photo & Vidéo",
  name: "Studio Lumière",
  benefit: "-10% ou album offert",
  tel: "06 12 34 56 78",
  email: "contact@studiolumiere.fr"
}, {
  icon: Camera,
  category: "Photo & Vidéo",
  name: "Créa'Film",
  benefit: "Drone inclus",
  tel: "06 98 76 54 32",
  email: "info@creafilm.fr"
}, {
  icon: Utensils,
  category: "Traiteur",
  name: "Maison Gourmet",
  benefit: "Vaisselle premium offerte",
  tel: "06 11 22 33 44",
  email: "contact@maisongourmet.fr"
}, {
  icon: Utensils,
  category: "Traiteur",
  name: "L'Art des Saveurs",
  benefit: "Mise en bouche offerte",
  tel: "06 55 66 77 88",
  email: "info@artsaveurs.fr"
}, {
  icon: Flower2,
  category: "Fleuriste",
  name: "Fleurs d'Exception",
  benefit: "-15% + bouquet offert",
  tel: "06 22 33 44 55",
  email: "contact@fleursexception.fr"
}, {
  icon: Music,
  category: "DJ & Animation",
  name: "DJ Max Events",
  benefit: "1h supplémentaire offerte",
  tel: "06 33 44 55 66",
  email: "contact@djmaxevents.fr"
}, {
  icon: Heart,
  category: "Robes & Costumes",
  name: "Atelier Mariée",
  benefit: "Jusqu'à -150€",
  tel: "06 44 55 66 77",
  email: "contact@ateliermariee.fr"
}, {
  icon: Gem,
  category: "Alliances & Bijoux",
  name: "Joaillerie du Sud",
  benefit: "Gravure offerte",
  tel: "06 55 66 77 88",
  email: "contact@joailleriedusud.fr"
}];

// Étapes du parcours mariage
const journeySteps = [{
  number: "1",
  title: "Signature du contrat",
  description: "Félicitations ! Votre date est maintenant réservée. Vous recevrez une confirmation par email avec tous les détails.",
  icon: FileText
}, {
  number: "2",
  title: "Visite technique",
  description: "Planifiez votre visite technique pour valider l'installation, les accès et les détails logistiques de votre réception.",
  icon: MapPin
}, {
  number: "3",
  title: "Choix des prestataires",
  description: "Consultez nos partenaires recommandés ci-dessous et bénéficiez d'avantages exclusifs négociés pour vous.",
  icon: Users
}, {
  number: "4",
  title: "Réunion de coordination",
  description: "1 mois avant le jour J, nous organisons une réunion pour finaliser le déroulé et répondre à vos dernières questions.",
  icon: Calendar
}, {
  number: "5",
  title: "Le Jour J",
  description: "Notre équipe vous accueille et vous accompagne tout au long de cette journée exceptionnelle.",
  icon: Heart
}];

// Documents et ressources
const documents = [{
  icon: Armchair,
  title: "Mobilier disponible",
  description: "Consultez la liste du mobilier inclus dans la location",
  url: "#",
  // Placeholder URL
  type: "pdf"
}, {
  icon: FileText,
  title: "Conditions générales",
  description: "Rappel des conditions de location et d'annulation",
  url: "#",
  // Placeholder URL
  type: "pdf"
}, {
  icon: ClipboardList,
  title: "Règlement intérieur",
  description: "Les règles à respecter pour le bon déroulement",
  url: "#",
  // Placeholder URL
  type: "pdf"
}, {
  icon: Instagram,
  title: "Inspiration",
  description: "Découvrez les mariages célébrés au domaine",
  url: "https://instagram.com/domainedelafontaine",
  // Placeholder
  type: "link"
}];

// Outils Mariable
const bonusTools = ['Checklist IA', 'Budget', 'Invités', 'Planning Jour J', 'Plan de table', 'Calculatrice boisson'];

// FAQ / Infos pratiques
const faqItems = [{
  question: "Conditions de paiement",
  answer: "Un acompte de 30% est demandé à la signature du contrat. Le solde est à régler au plus tard 1 mois avant votre mariage. Nous acceptons les virements bancaires et les chèques."
}, {
  question: "Comment planifier une visite ?",
  answer: "Contactez-nous par email ou WhatsApp pour convenir d'un créneau. Les visites sont possibles du mardi au samedi, sur rendez-vous uniquement. Comptez environ 1h30 pour faire le tour complet du domaine."
}, {
  question: "Horaires le jour du mariage",
  answer: "Accès au domaine dès 10h pour l'installation des prestataires. La cérémonie peut débuter à partir de 15h. Fin de soirée à 4h maximum, avec extinction de la musique à 2h."
}, {
  question: "Capacité d'accueil",
  answer: "Le domaine peut accueillir jusqu'à 150 personnes assises pour le dîner et 200 personnes en configuration cocktail. L'hébergement sur place permet d'accueillir 20 personnes."
}, {
  question: "Contact de votre référent",
  answer: "Marie Dupont est votre interlocutrice privilégiée pour toutes vos questions. Vous pouvez la joindre au 06 XX XX XX XX ou par email à marie@domainefontaine.fr."
}];
const DomaineDeLaFontaine = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <>
      <SEO title="Guide d'accueil - Domaine de la Fontaine | Mariable" description="Votre guide personnalisé pour préparer sereinement votre mariage au Domaine de la Fontaine. Partenaires, documents et informations pratiques." />

      <PremiumHeader />

      {/* HERO - Accueil chaleureux */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url("${heroImage}")`
      }} initial={{
        scale: 1.05
      }} animate={{
        scale: 1
      }} transition={{
        duration: 1.5,
        ease: "easeOut"
      }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        
        <motion.div className="relative z-10 text-center px-4 max-w-3xl mx-auto" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }}>
          <motion.h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }}>
            Bienvenue au<br />
            <span className="text-premium-sage-light">Domaine de la Fontaine</span>
          </motion.h1>
          
          <motion.p className="text-xl md:text-2xl text-white/90 mb-8 font-light" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }}>
            Votre guide d'accueil personnalisé pour préparer sereinement votre mariage
          </motion.p>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6
        }}>
            <Button size="lg" onClick={() => scrollToSection('parcours')} className="bg-white text-editorial-noir hover:bg-white/90 rounded-none px-8 py-6 text-sm tracking-widest uppercase font-sans">
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
            {[{
            id: 'parcours',
            label: 'Le parcours'
          }, {
            id: 'documents',
            label: 'Documents'
          }, {
            id: 'partenaires',
            label: 'Partenaires'
          }, {
            id: 'infos',
            label: 'Infos pratiques'
          }].map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="px-4 py-2 text-xs tracking-widest uppercase text-editorial-noir/70 hover:text-editorial-noir border border-editorial-noir/20 hover:border-editorial-noir/40 transition-colors rounded-none">
                {item.label}
              </button>)}
          </div>
        </div>
      </section>

      {/* SECTION PARCOURS - Timeline */}
      <section id="parcours" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
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

            {journeySteps.map((step, index) => <motion.div key={step.number} className={`relative flex items-start gap-6 md:gap-12 mb-12 last:mb-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }}>
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
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* SECTION DOCUMENTS */}
      <section id="documents" className="py-16 md:py-24 bg-editorial-beige/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <h2 className="font-serif text-3xl md:text-4xl text-editorial-noir mb-4">
              Documents et ressources
            </h2>
            <p className="text-editorial-noir/60 text-lg max-w-xl mx-auto">
              Tous les documents utiles pour préparer votre réception
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {documents.map((doc, index) => <motion.a key={doc.title} href={doc.url} target={doc.type === 'link' ? '_blank' : undefined} rel={doc.type === 'link' ? 'noopener noreferrer' : undefined} className="bg-white p-6 border border-editorial-noir/10 hover:border-editorial-noir/30 transition-all group" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }}>
                <div className="w-12 h-12 bg-editorial-beige flex items-center justify-center mb-4 group-hover:bg-premium-sage/20 transition-colors">
                  <doc.icon className="h-6 w-6 text-premium-sage" />
                </div>
                <h3 className="font-serif text-lg text-editorial-noir mb-2">{doc.title}</h3>
                <p className="text-editorial-noir/60 text-sm mb-4">{doc.description}</p>
                <span className="text-xs tracking-widest uppercase text-premium-sage font-sans flex items-center gap-1">
                  {doc.type === 'pdf' ? 'Consulter' : 'Voir'}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </motion.a>)}
          </div>
        </div>
      </section>

      {/* SECTION PARTENAIRES */}
      <section id="partenaires" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <h2 className="font-serif text-3xl md:text-4xl text-editorial-noir mb-4">
              Nos prestataires recommandés
            </h2>
            <p className="text-editorial-noir/60 text-lg max-w-xl mx-auto">
              Des partenaires de confiance avec des avantages négociés pour vous
            </p>
          </motion.div>

          {/* Liste éditorial des partenaires */}
          <div className="space-y-4">
            {partners.map((partner, index) => <motion.div key={`${partner.category}-${partner.name}`} className="bg-editorial-beige/20 border border-editorial-noir/5 p-5" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.05
          }}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Info principale */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white flex items-center justify-center flex-shrink-0 border border-editorial-noir/10">
                      <partner.icon className="h-5 w-5 text-premium-sage" />
                    </div>
                    <div>
                      <span className="text-xs tracking-widest uppercase text-editorial-noir/50 font-sans">{partner.category}</span>
                      <h3 className="font-serif text-lg text-editorial-noir">{partner.name}</h3>
                      <p className="text-premium-sage text-sm font-medium">{partner.benefit}</p>
                    </div>
                  </div>

                  {/* Contacts */}
                  <div className="flex flex-wrap gap-4 ml-14 md:ml-0">
                    <a href={`tel:${partner.tel.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-editorial-noir/60 hover:text-editorial-noir transition-colors">
                      <Phone className="h-4 w-4" />
                      {partner.tel}
                    </a>
                    <a href={`mailto:${partner.email}`} className="flex items-center gap-2 text-sm text-editorial-noir/60 hover:text-editorial-noir transition-colors">
                      <Mail className="h-4 w-4" />
                      {partner.email}
                    </a>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* SECTION INFOS PRATIQUES */}
      <section id="infos" className="py-16 md:py-24 bg-editorial-beige/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <h2 className="font-serif text-3xl md:text-4xl text-editorial-noir mb-4">
              Informations pratiques
            </h2>
            <p className="text-editorial-noir/60 text-lg max-w-xl mx-auto">
              Toutes les réponses à vos questions
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <Accordion type="single" collapsible className="bg-white border border-editorial-noir/10">
              {faqItems.map((item, index) => <AccordionItem key={index} value={`item-${index}`} className="border-b border-editorial-noir/10 last:border-0">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline text-left">
                    <span className="font-serif text-lg text-editorial-noir">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5">
                    <p className="text-editorial-noir/60 leading-relaxed">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </motion.div>

          {/* Contact rapide */}
          <motion.div className="mt-8 bg-white p-6 border border-editorial-noir/10 text-center" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <p className="text-editorial-noir/60 mb-4">Une question ? Contactez votre référent</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+33600000000" className="flex items-center gap-2 px-4 py-2 bg-editorial-beige text-editorial-noir text-sm hover:bg-editorial-beige/70 transition-colors">
                <Phone className="h-4 w-4" />
                06 XX XX XX XX
              </a>
              <a href="mailto:contact@domainefontaine.fr" className="flex items-center gap-2 px-4 py-2 bg-editorial-beige text-editorial-noir text-sm hover:bg-editorial-beige/70 transition-colors">
                <Mail className="h-4 w-4" />
                contact@domainefontaine.fr
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION OUTILS MARIABLE */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <h2 className="font-serif text-2xl md:text-3xl text-editorial-noir mb-4">
              Vos outils de planification
            </h2>
            
            <p className="text-editorial-noir/60 mb-8">
              Organisez votre mariage sereinement avec les outils gratuits de mariable.fr   
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {bonusTools.map((tool, index) => <motion.span key={tool} className="inline-flex items-center gap-1.5 px-4 py-2 bg-editorial-beige/50 text-editorial-noir text-sm border border-editorial-noir/10" initial={{
              opacity: 0,
              scale: 0.9
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.05
            }}>
                  <Check className="h-4 w-4 text-premium-sage" />
                  {tool}
                </motion.span>)}
            </div>

            <Button asChild className="bg-editorial-noir hover:bg-editorial-noir/80 text-white rounded-none px-8 py-6 text-xs tracking-widest uppercase font-sans" size="lg">
              <Link to="/register">
                Créer mon compte gratuit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>;
};
export default DomaineDeLaFontaine;