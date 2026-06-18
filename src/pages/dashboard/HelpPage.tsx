import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  HelpCircle,
  Play,
  BookOpen,
  MessageCircle,
  Search,
  CheckCircle,
  Calendar,
  Users,
  Calculator,
  FileText,
  Share2,
  Target,
  ListChecks
} from 'lucide-react';
import { useOnboarding } from '@/components/onboarding/OnboardingProvider';

const FEATURE_ICONS = [ListChecks, CheckCircle, Calculator, Target, Users, Calendar, FileText, FileText, Share2];

const HelpPage: React.FC = () => {
  const { t } = useTranslation('weddingDay');
  const { startOnboarding, isCompleted } = useOnboarding();

  const features = (t('help.features', { returnObjects: true }) as Array<{ title: string; description: string; section: string }>) || [];
  const faq = (t('help.faq', { returnObjects: true }) as Array<{ q: string; a: string }>) || [];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{t('help.pageTitle')}</title>
        <meta name="description" content={t('help.pageDescription')} />
      </Helmet>

      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('help.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('help.subtitle')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Play className="h-5 w-5 text-primary" />
            {t('help.tourTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">{t('help.tourCardTitle')}</p>
              <p className="text-sm text-muted-foreground">
                {isCompleted ? t('help.tourCompleted') : t('help.tourPending')}
              </p>
            </div>
            <Button onClick={startOnboarding} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {isCompleted ? t('help.tourStartAgain') : t('help.tourStart')}
            </Button>
          </div>

          {isCompleted && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <CheckCircle className="h-4 w-4" />
              {t('help.tourDone')}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            {t('help.featuresTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index] || FileText;
              return (
                <div key={index} className="flex gap-3 p-3 rounded-lg border bg-card">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{feature.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {t(`help.sections.${feature.section}`)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            {t('help.faqTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faq.map((item, index) => (
            <div key={index}>
              <h3 className="font-medium mb-2">{item.q}</h3>
              <p className="text-sm text-muted-foreground">{item.a}</p>
              {index < faq.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Search className="h-5 w-5 text-primary" />
            {t('help.contactTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{t('help.contactDesc')}</p>
          <Button variant="outline" className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            {t('help.contactBtn')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
