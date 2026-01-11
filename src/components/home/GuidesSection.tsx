import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Download, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const guides = [
  {
    id: 1,
    title: "Guide Jour-J",
    description: "Retroplanning complet et conseils pour le jour de votre mariage",
    pdfUrl: "/guides/guide-jour-j.pdf",
    icon: "📅",
  },
  {
    id: 2,
    title: "Guide Organisation Débutants",
    description: "Par où commencer ? Les bases pour bien démarrer votre organisation",
    pdfUrl: "/guides/guide-organisation.pdf",
    icon: "🎯",
  },
  {
    id: 3,
    title: "Guide Prestataires",
    description: "Comment choisir et négocier avec vos prestataires mariage",
    pdfUrl: "/guides/guide-prestataires.pdf",
    icon: "🤝",
  },
  {
    id: 4,
    title: "Checklist Mariée",
    description: "Liste complète de tout ce dont la mariée a besoin",
    pdfUrl: "/guides/checklist-mariee.pdf",
    icon: "👰",
  },
  {
    id: 5,
    title: "Checklist Proche",
    description: "Guide pour les témoins et proches qui aident à l'organisation",
    pdfUrl: "/guides/checklist-proche.pdf",
    icon: "💝",
  },
];

const GuidesSection = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleDownload = (guide: typeof guides[0]) => {
    if (isLoggedIn) {
      // Téléchargement direct
      window.open(guide.pdfUrl, '_blank');
    } else {
      // Redirection vers inscription
      toast.info("Créez un compte gratuit pour télécharger nos guides exclusifs", {
        action: {
          label: "S'inscrire",
          onClick: () => navigate('/register?redirect=dashboard/guides')
        }
      });
      navigate('/register?redirect=dashboard/guides');
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-10 bg-[#F5F4F0]">
      <div className="container max-w-6xl mx-auto">
        {/* Titre centré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir">
            Nos guides gratuits
          </h2>
          <p className="text-[#666666] mt-4 max-w-xl mx-auto">
            Téléchargez nos guides pratiques pour vous accompagner dans l'organisation de votre mariage
          </p>
        </motion.div>

        {/* Grid 5 colonnes sur desktop, 2 sur tablet, 1 sur mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Icône */}
              <div className="text-4xl mb-4">{guide.icon}</div>

              {/* Badge Gratuit */}
              <span className="inline-block text-xs uppercase tracking-widest text-[#3D5A3D] font-medium bg-[#3D5A3D]/10 px-2 py-1 rounded mb-3">
                Gratuit
              </span>

              {/* Titre */}
              <h3 className="font-serif text-lg text-[#0F0F0F] mb-2 line-clamp-2">
                {guide.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#666666] font-sans line-clamp-3 mb-4">
                {guide.description}
              </p>

              {/* Bouton Télécharger */}
              <Button
                onClick={() => handleDownload(guide)}
                variant="outline"
                size="sm"
                className="w-full border-[#0F0F0F] text-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white rounded-none gap-2 group-hover:border-[#3D5A3D] group-hover:text-[#3D5A3D]"
              >
                {isLoggedIn ? (
                  <>
                    <Download className="h-4 w-4" />
                    Télécharger
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Créer un compte
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/guides')}
            className="border-[#0F0F0F] text-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white px-8 py-5 text-sm uppercase tracking-widest rounded-none"
          >
            Voir tous les guides
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GuidesSection;