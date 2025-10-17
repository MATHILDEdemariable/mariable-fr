import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, CheckCircle } from 'lucide-react';

const SecuritySection = () => {
  return (
    <section className="max-w-4xl mx-auto mb-16">
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-serif">Sécurité & Conformité</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Propulsé par <strong>Stripe Connect (DSP2)</strong>, avec KYC, LCB-FT, chiffrement TLS, et tokens de paiement. 
          Mariable n'héberge ni ne stocke les cartes bancaires.
        </p>

        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="flex items-center gap-2">
            <Lock className="h-3 w-3" /> Compliant UE
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3" /> Certifié Stripe
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Shield className="h-3 w-3" /> DSP2
          </Badge>
        </div>
      </Card>
    </section>
  );
};

export default SecuritySection;
