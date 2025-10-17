import { Card } from '@/components/ui/card';
import { AlertCircle, Sparkles } from 'lucide-react';

const PainSolutionSection = () => {
  return (
    <section className="max-w-6xl mx-auto mb-16 grid md:grid-cols-2 gap-8">
      {/* Gauche : Pain points */}
      <Card className="p-6 bg-red-50/50 border-red-200">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h3 className="text-xl font-semibold">Les défis du quotidien</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="text-red-500">😓</span>
            <span>15 virements, 15 relances, 15 Excel…</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">⏰</span>
            <span>Acomptes oubliés, soldes en retard…</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">📊</span>
            <span>Temps perdu en administratif…</span>
          </li>
        </ul>
      </Card>

      {/* Droite : Solution */}
      <Card className="p-6 bg-green-50/50 border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-green-500" />
          <h3 className="text-xl font-semibold">Notre solution pour vous</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✅</span>
            <span>Un seul espace de paiement pour tous vos couples</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">📅</span>
            <span>Échéancier intelligent (30% / 70%)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">🔔</span>
            <span>Relances automatiques + reçus</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">💰</span>
            <span>Reversements clairs, regroupés</span>
          </li>
        </ul>
      </Card>
    </section>
  );
};

export default PainSolutionSection;
