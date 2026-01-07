import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Building2, Sparkles, Palette, Gift, Users, Calculator } from 'lucide-react';

const VirtuousCircleSection = () => {
  const nodes = [
    { id: 'couples', label: 'Couples', icon: Heart, color: 'bg-editorial-olive', position: 'top' },
    { id: 'lieux', label: 'Lieux', icon: Building2, color: 'bg-editorial-noir', position: 'right' },
    { id: 'mariable', label: 'Mariable', icon: Sparkles, color: 'bg-editorial-olive', position: 'bottom' },
    { id: 'partenaires', label: 'Partenaires', icon: Palette, color: 'bg-editorial-noir', position: 'left' },
  ];

  const steps = [
    {
      icon: Gift,
      title: "Le lieu envoie son lien Club",
      description: "Chaque lieu partenaire dispose d'un lien unique à partager avec ses couples"
    },
    {
      icon: Users,
      title: "Les mariés découvrent le Club",
      description: "Accès aux prestataires & marques partenaires avec avantages exclusifs"
    },
    {
      icon: Calculator,
      title: "Commission partagée",
      description: "Lorsqu'un couple réserve, la commission est répartie entre Mariable & le lieu"
    }
  ];

  return (
    <section id="cercle-vertueux" className="py-20 bg-editorial-beige scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir uppercase tracking-[2px] mb-4">
            Un Club Exclusif
          </h2>
          <p className="text-editorial-gray text-lg max-w-2xl mx-auto">
            Tout le monde gagne : avantages, visibilité, revenu passif
          </p>
        </motion.div>

        {/* Two columns layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column: Circular Diagram (reduced size) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-sm mx-auto aspect-square"
          >
            {/* SVG Circle with animated arrows */}
            <svg className="w-full h-full" viewBox="0 0 400 400">
              {/* Circular path */}
              <circle
                cx="200"
                cy="200"
                r="140"
                fill="none"
                stroke="#E8E8E8"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
              
              {/* Animated arrows */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "200px 200px" }}
              >
                {[0, 90, 180, 270].map((angle, i) => (
                  <g key={i} transform={`rotate(${angle} 200 200)`}>
                    <path
                      d="M200 60 L210 75 L200 70 L190 75 Z"
                      fill="#3D5A3D"
                    />
                  </g>
                ))}
              </motion.g>
            </svg>

            {/* Nodes */}
            {nodes.map((node, index) => {
              const positions = {
                top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
                right: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
                bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
                left: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2',
              };

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className={`absolute ${positions[node.position as keyof typeof positions]}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${node.color} flex items-center justify-center shadow-lg`}>
                      <node.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-editorial-noir bg-white px-2 py-0.5 shadow-sm">
                      {node.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Column: 3 steps vertically */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl text-editorial-noir mb-6">
              Comment ça marche ?
            </h3>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-editorial-olive/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-editorial-olive" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-editorial-olive text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-editorial-noir mb-1">{step.title}</h4>
                  <p className="text-sm text-editorial-gray">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtuousCircleSection;
