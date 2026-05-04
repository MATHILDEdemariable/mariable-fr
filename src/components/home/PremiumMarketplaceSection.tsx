import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VendorPreviewWidget from './VendorPreviewWidget';
const PremiumMarketplaceSection = () => {
  const { t } = useTranslation('home');
  const selectionProcess = [
    t('marketplace.process.portfolio'),
    t('marketplace.process.quality'),
    t('marketplace.process.references'),
    t('marketplace.process.delays'),
  ];
  return <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-premium-warm text-premium-charcoal border-premium-light">
            {t('marketplace.badge')}
          </Badge>
          <h2 className="text-4xl font-bold text-premium-black mb-6 md:text-4xl">
            {t('marketplace.titleLine1')}
            <br />
            <span className="text-premium-sage">
              {t('marketplace.titleLine2')}
            </span>
          </h2>
          <p className="text-xl text-premium-charcoal max-w-3xl mx-auto">
            {t('marketplace.subtitle')}
          </p>
        </div>

        <div className="mb-16">
          <VendorPreviewWidget />
        </div>

        <div className="bg-premium-warm rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-premium-black mb-6 text-center">
            {t('marketplace.processTitle')}
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {selectionProcess.map((process, index) => <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-premium-sage flex-shrink-0" />
                <span className="text-premium-charcoal font-medium">{process}</span>
              </div>)}
          </div>
        </div>

        <div className="text-center">
          <Link to="/selection">
            <Button size="lg" className="btn-primary text-white px-12 py-4 text-lg font-semibold ripple">
              {t('marketplace.cta')}
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default PremiumMarketplaceSection;