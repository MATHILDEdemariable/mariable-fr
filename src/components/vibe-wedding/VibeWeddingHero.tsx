import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import PremiumHeader from '@/components/home/PremiumHeader';
interface VibeWeddingHeroProps {
  onStartConversation: (message: string) => void;
}
const VibeWeddingHero: React.FC<VibeWeddingHeroProps> = ({
  onStartConversation
}) => {
  const [input, setInput] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "Faites de votre mariage une expérience exceptionnelle";
  const placeholders = ["Décrivez votre projet de mariage...", "Ex: Mariage champêtre 80 invités en Provence, budget 25 000€", "Ex: Mariage élégant à Paris pour 100 personnes", "Ex: Mariage bohème à Lyon, 60 invités, budget 20 000€"];

  // Typing effect for title
  useEffect(() => {
    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [displayedText]);
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onStartConversation(input.trim());
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return <>
    <PremiumHeader />
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: 'url(https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/visuels/club%20mariable.png)'
    }} />
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          
        </div>

        {/* Title with typing effect */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight min-h-[120px] sm:min-h-[140px] flex items-center justify-center drop-shadow-lg">
          {displayedText}
          {isTyping && <span className="animate-pulse ml-1">|</span>}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-12 max-w-2xl mx-auto font-light drop-shadow-md">
          Organisez vous-même le jour-j simplement, avec marIAble
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholders[placeholderIndex]} className="flex-1 min-h-[80px] sm:min-h-[100px] text-base sm:text-lg border-2 border-transparent focus:border-premium-sage resize-none animate-fade-in" style={{
              animation: 'fade-in 0.5s ease-in-out'
            }} />
              <Button type="submit" disabled={!input.trim()} size="lg" className="font-semibold px-8 py-6 text-lg h-auto sm:self-end bg-[premium-sage-medium] bg-wedding-olive text-stone-50">
                <Send className="w-5 h-5 mr-2" />
                Lancer
              </Button>
            </div>
            
            {/* Quick examples */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-muted-foreground">Essayez :</span>
              {["Je cherche un photographe à Paris", "Je cherche un lieu en Provence", "Je cherche un traiteur à Lyon"].map((example, idx) => <button key={idx} type="button" onClick={() => setInput(example)} className="text-xs sm:text-sm px-3 py-1.5 rounded-full text-white backdrop-blur-sm transition-colors bg-premium-sage bg-[premium-sage-medium]">
                  {example}
                </button>)}
            </div>
          </div>
        </form>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 text-white/90 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span>Gratuit pour commencer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span>Budget personnalisé</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <span>Planning automatique</span>
          </div>
        </div>
      </div>
    </div>
  </>;
};
export default VibeWeddingHero;