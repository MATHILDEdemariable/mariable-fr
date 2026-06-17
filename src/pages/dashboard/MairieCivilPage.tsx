import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  FileCheck,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  FileText,
  AlertCircle,
  Info,
  MapPin,
  Scale,
  Download,
  Printer,
  Heart,
  Globe,
  UserCheck,
  ExternalLink,
  Share2,
  Lock
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

const CONDITION_ICONS = [Calendar, Heart, Users, Scale];
const LIEU_ICONS = [Building2, Users];
const DOC_ICONS = [FileCheck, FileText, FileText, Users, UserCheck, Scale];

const LIEN_URLS = [
  "https://www.service-public.gouv.fr/particuliers/vosdroits/R1406",
  "https://www.service-public.gouv.fr/particuliers/vosdroits/R42837",
  "https://www.service-public.gouv.fr/particuliers/vosdroits/F948",
];

const MairieCivilPage: React.FC = () => {
  const { t, i18n } = useTranslation('weddingDay');
  const { executeAction, showPremiumModal, closePremiumModal, isPremium, feature, description } = usePremiumAction({
    feature: t('mairie.premiumFeature'),
    description: t('mairie.premiumDesc')
  });

  const conditions = t('mairie.conditions', { returnObjects: true }) as string[];
  const lieuxMariage = t('mairie.lieux', { returnObjects: true }) as Array<{ titre: string; description: string }>;
  const liensTitres = t('mairie.liens', { returnObjects: true }) as Array<{ titre: string }>;
  const documentsIndispensables = t('mairie.documents', { returnObjects: true }) as Array<{ title: string; description: string; detail: string }>;
  const delaisBans = t('mairie.bans', { returnObjects: true }) as Array<{ semaines: string; condition: string }>;
  const situationsParticulieres = t('mairie.situations', { returnObjects: true }) as Array<{ titre: string; documents: string[] }>;
  const etapes = t('mairie.etapes', { returnObjects: true }) as Array<{ numero: number; title: string; description: string; delai: string }>;
  const knowItems = t('mairie.knowItems', { returnObjects: true }) as string[];

  const handleExportPDF = () => {
    executeAction(() => {
      const pdf = new jsPDF();

      pdf.setFillColor(139, 137, 114);
      pdf.rect(0, 0, 210, 35, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("MARIABLE", 20, 18);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(t('mairie.pdf.subtitle'), 20, 28);

      let yPosition = 50;

      const drawCheckbox = (x: number, y: number) => {
        pdf.setDrawColor(100, 100, 100);
        pdf.setLineWidth(0.5);
        pdf.rect(x, y - 3, 4, 4);
      };

      pdf.setTextColor(139, 137, 114);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(t('mairie.pdf.mandatory'), 20, yPosition);
      yPosition += 10;

      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      const checklistItems = t('mairie.pdf.items', { returnObjects: true }) as string[];
      checklistItems.forEach(item => {
        drawCheckbox(20, yPosition);
        pdf.text(item, 28, yPosition);
        yPosition += 7;
      });

      yPosition += 8;

      pdf.setTextColor(139, 137, 114);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(t('mairie.pdf.ifApplicable'), 20, yPosition);
      yPosition += 10;

      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      const optionalItems = t('mairie.pdf.optional', { returnObjects: true }) as string[];
      optionalItems.forEach(item => {
        drawCheckbox(20, yPosition);
        pdf.text(item, 28, yPosition);
        yPosition += 7;
      });

      yPosition += 8;

      pdf.setTextColor(139, 137, 114);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(t('mairie.pdf.delaysTitle'), 20, yPosition);
      yPosition += 10;

      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const delays = t('mairie.pdf.delays', { returnObjects: true }) as string[];
      delays.forEach(d => {
        pdf.text(d, 25, yPosition);
        yPosition += 7;
      });

      yPosition += 5;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(100, 100, 100);
      pdf.text(t('mairie.pdf.note1'), 20, yPosition);
      yPosition += 5;
      pdf.text(t('mairie.pdf.note2'), 20, yPosition);

      pdf.setFillColor(245, 244, 240);
      pdf.rect(0, 270, 210, 27, 'F');

      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont("helvetica", "normal");
      pdf.text("www.mariable.fr", 20, 282);
      const locale = i18n.language.startsWith('en') ? 'en-US' : 'fr-FR';
      pdf.text(`${t('mairie.pdf.generatedOn')} ${new Date().toLocaleDateString(locale)}`, 150, 282);

      pdf.save("checklist-mariage-civil.pdf");
      toast.success(t('mairie.pdfDownloaded'));
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('mairie.pageTitle')}</title>
        <meta name="description" content={t('mairie.pageDescription')} />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-black">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-foreground">{t('mairie.title')}</h1>
              <p className="text-muted-foreground text-sm">{t('mairie.subtitle')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText('https://www.mariable.fr/mariage-civil');
                toast.success(t('mairie.linkCopied'));
              }}
              variant="outline"
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              {t('mairie.share')}
            </Button>
            <Button
              onClick={handleExportPDF}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {!isPremium && <Lock className="h-4 w-4" />}
              <Download className="h-4 w-4" />
              {t('mairie.downloadPdf')}
            </Button>
          </div>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-800">{t('mairie.importantLabel')}</p>
              <p className="text-sm text-amber-700">{t('mairie.importantText')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              {t('mairie.conditionsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {conditions.map((text, index) => {
                const Icon = CONDITION_ICONS[index] || Calendar;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{text}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
              {t('mairie.conditionsNote')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {t('mairie.lieuxTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {lieuxMariage.map((lieu, index) => {
                const Icon = LIEU_ICONS[index] || Building2;
                return (
                  <div key={index} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-sm">{lieu.titre}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{lieu.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2 text-xs text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <p><strong>{t('mairie.parisLabel')}</strong> {t('mairie.parisText')}</p>
              <p><strong>{t('mairie.capacityLabel')}</strong> {t('mairie.capacityText')}</p>
              <p><strong>{t('mairie.datesLabel')}</strong> {t('mairie.datesText')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              {t('mairie.documentsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {documentsIndispensables.map((doc, index) => {
                const Icon = DOC_ICONS[index] || FileText;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      <p className="text-xs text-primary mt-1">{doc.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t('mairie.bansTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {delaisBans.map((delai, index) => (
                <div key={index} className="text-center p-4 border rounded-lg bg-white">
                  <div className="text-3xl font-bold text-primary mb-1">{delai.semaines}</div>
                  <div className="text-sm font-medium mb-2">{t('mairie.bansWeeks')}</div>
                  <p className="text-xs text-muted-foreground">{delai.condition}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {t('mairie.situationsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {situationsParticulieres.map((situation, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-sm font-medium">
                    {situation.titre}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {situation.documents.map((doc, docIndex) => (
                        <li key={docIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              {t('mairie.howTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-primary/20" />

              <div className="space-y-6">
                {etapes.map((etape, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-black text-white font-bold shrink-0">
                      {etape.numero}
                    </div>

                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground">{etape.title}</h3>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                          {etape.delai}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{etape.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-editorial-border">
          <CardHeader>
            <CardTitle className="font-serif text-foreground flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              {t('mairie.liensTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {liensTitres.map((lien, index) => (
                <a
                  key={index}
                  href={LIEN_URLS[index]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border rounded-lg bg-white hover:bg-muted/50 transition-colors group"
                >
                  <ExternalLink className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-foreground">{lien.titre}</span>
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic text-center">
              {t('mairie.liensNote')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-start gap-3 py-4">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-blue-800">{t('mairie.knowTitle')}</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                {knowItems.map((it, i) => (
                  <li key={i}>• {it}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            {t('mairie.printChecklist')}
          </Button>
        </div>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature={feature}
        description={description}
      />
    </>
  );
};

export default MairieCivilPage;
