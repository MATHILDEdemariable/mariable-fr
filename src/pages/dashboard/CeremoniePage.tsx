import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, Clock, Users, Music, CheckCircle2, FileText, AlertCircle, Download,
  Mic, TreePine, Sparkles, MessageSquare, Calendar, MapPin, Volume2, Sun,
  CloudRain, Church, BookOpen, Cross, Crown, Flower2, PartyPopper, Share2, Lock
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

const FUND_ICONS = [Clock, AlertCircle, MapPin];

const CeremoniePage: React.FC = () => {
  const { t, i18n } = useTranslation('ceremonie');

  const { executeAction: executeActionLaique, showPremiumModal: showModalLaique, closePremiumModal: closeModalLaique, isPremium, feature: featureLaique, description: descriptionLaique } = usePremiumAction({
    feature: t('common.premiumLaiqueFeature'),
    description: t('common.premiumLaiqueDescription')
  });

  const { executeAction: executeActionCatholique, showPremiumModal: showModalCatholique, closePremiumModal: closeModalCatholique, feature: featureCatholique, description: descriptionCatholique } = usePremiumAction({
    feature: t('common.premiumCatholiqueFeature'),
    description: t('common.premiumCatholiqueDescription')
  });

  // ========== DONNÉES LAÏQUE ==========
  const fondamentaux = (t('laique.fondamentaux', { returnObjects: true }) as Array<{ label: string; value: string }>) || [];
  const deroulementEtapes = ((t('laique.deroulementEtapes', { returnObjects: true }) as Array<{ titre: string; description: string }>) || []).map((e, i) => ({ numero: i + 1, ...e }));
  const typesOfficiants = (t('laique.typesOfficiants', { returnObjects: true }) as Array<{ type: string; avantages: string[]; vigilances: string[] }>) || [];
  const rituels = (t('laique.rituels', { returnObjects: true }) as Array<{ nom: string; description: string; conseils: string }>) || [];
  const rolesProches = (t('laique.rolesProches', { returnObjects: true }) as Array<{ role: string; description: string }>) || [];
  const alternativesTimides = (t('laique.alternativesTimides', { returnObjects: true }) as string[]) || [];
  const voeuxPreparationItems = (t('laique.voeuxPreparationItems', { returnObjects: true }) as string[]) || [];
  const voeuxStructureItems = (t('laique.voeuxStructureItems', { returnObjects: true }) as Array<{ title: string; desc: string }>) || [];
  const voeuxConseilsItems = (t('laique.voeuxConseilsItems', { returnObjects: true }) as string[]) || [];
  const planBItems = (t('laique.planBItems', { returnObjects: true }) as string[]) || [];
  const sonoItems = (t('laique.sonoItems', { returnObjects: true }) as string[]) || [];
  const amenagementItems = (t('laique.amenagementItems', { returnObjects: true }) as string[]) || [];
  const programmationMusicale = (t('laique.programmationMusicale', { returnObjects: true }) as Array<{ moment: string; type: string; conseil: string }>) || [];
  const retroplanning = (t('laique.retroplanning', { returnObjects: true }) as Array<{ delai: string; action: string }>) || [];
  const checklistJourJ = (t('laique.checklistJourJ', { returnObjects: true }) as Array<{ categorie: string; items: string[] }>) || [];

  // ========== DONNÉES CATHOLIQUE ==========
  const documentsCatholicite = (t('catholique.documentsCatholicite', { returnObjects: true }) as Array<{ document: string; nature: string; validite: string }>) || [];
  const piliersMariage = (t('catholique.piliersMariage', { returnObjects: true }) as Array<{ pilier: string; definition: string; pratique: string }>) || [];
  const derouleCatholique = ((t('catholique.derouleCatholique', { returnObjects: true }) as Array<{ titre: string; description: string }>) || []).map((e, i) => ({ numero: i + 1, ...e }));
  const musiqueSacree = (t('catholique.musiqueSacree', { returnObjects: true }) as Array<{ moment: string; exemples: string }>) || [];
  const traditionsSortie = (t('catholique.traditionsSortie', { returnObjects: true }) as Array<{ tradition: string; signification: string; contrainte: string }>) || [];
  const checklistCatholique = (t('catholique.checklistCatholique', { returnObjects: true }) as Array<{ categorie: string; items: string[] }>) || [];
  const rolesTemoinsItems = (t('catholique.rolesTemoinsItems', { returnObjects: true }) as string[]) || [];
  const rolesEnfantsItems = (t('catholique.rolesEnfantsItems', { returnObjects: true }) as string[]) || [];
  const rolesPhotosItems = (t('catholique.rolesPhotosItems', { returnObjects: true }) as string[]) || [];

  const pdfNotes = (t('pdf.notes', { returnObjects: true }) as string[]) || [];
  const localeDate = i18n.language?.startsWith('en') ? 'en-US' : 'fr-FR';

  // ========== PDF LAÏQUE ==========
  const handleExportPDFLaique = () => {
    executeActionLaique(() => {
      const pdf = new jsPDF();
      pdf.setFillColor(139, 137, 114);
      pdf.rect(0, 0, 210, 35, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("MARIABLE", 20, 18);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(t('pdf.headerLaique'), 20, 28);
      let yPosition = 50;
      const drawCheckbox = (x: number, y: number) => { pdf.setDrawColor(100, 100, 100); pdf.setLineWidth(0.5); pdf.rect(x, y - 3, 4, 4); };
      checklistJourJ.forEach(cat => {
        pdf.setFontSize(14); pdf.setFont("helvetica", "bold"); pdf.setTextColor(139, 137, 114);
        pdf.text(cat.categorie, 20, yPosition); yPosition += 8;
        pdf.setFontSize(11); pdf.setFont("helvetica", "normal"); pdf.setTextColor(60, 60, 60);
        cat.items.forEach(item => { drawCheckbox(20, yPosition); pdf.text(item, 28, yPosition); yPosition += 7; });
        yPosition += 5;
      });
      yPosition += 5;
      pdf.setFontSize(14); pdf.setFont("helvetica", "bold"); pdf.setTextColor(139, 137, 114);
      pdf.text(t('pdf.retroplanningTitle'), 20, yPosition); yPosition += 10;
      pdf.setFontSize(10); pdf.setFont("helvetica", "normal"); pdf.setTextColor(60, 60, 60);
      retroplanning.forEach(item => {
        pdf.setFont("helvetica", "bold"); pdf.text(item.delai, 25, yPosition);
        pdf.setFont("helvetica", "normal");
        const lines = pdf.splitTextToSize(item.action, 150);
        pdf.text(lines, 50, yPosition); yPosition += (lines.length * 5) + 5;
      });
      pdf.setFillColor(245, 244, 240); pdf.rect(0, 270, 210, 27, 'F');
      pdf.setFontSize(9); pdf.setTextColor(100, 100, 100);
      pdf.text("www.mariable.fr", 20, 282);
      pdf.text(t('pdf.generatedOn') + " " + new Date().toLocaleDateString(localeDate), 150, 282);
      pdf.save("checklist-ceremonie-laique.pdf");
      toast.success(t('common.downloadedToastLaique'));
    });
  };

  // ========== PDF CATHOLIQUE ==========
  const handleExportPDFCatholique = () => {
    executeActionCatholique(() => {
      const pdf = new jsPDF();
      pdf.setFillColor(139, 137, 114); pdf.rect(0, 0, 210, 35, 'F');
      pdf.setTextColor(255, 255, 255); pdf.setFontSize(24); pdf.setFont("helvetica", "bold");
      pdf.text("MARIABLE", 20, 18);
      pdf.setFontSize(10); pdf.setFont("helvetica", "normal");
      pdf.text(t('pdf.headerCatholique'), 20, 28);
      let yPosition = 50;
      const drawCheckbox = (x: number, y: number) => { pdf.setDrawColor(100, 100, 100); pdf.setLineWidth(0.5); pdf.rect(x, y - 3, 4, 4); };
      checklistCatholique.forEach(cat => {
        pdf.setFontSize(14); pdf.setFont("helvetica", "bold"); pdf.setTextColor(139, 137, 114);
        pdf.text(cat.categorie, 20, yPosition); yPosition += 8;
        pdf.setFontSize(11); pdf.setFont("helvetica", "normal"); pdf.setTextColor(60, 60, 60);
        cat.items.forEach(item => { drawCheckbox(20, yPosition); pdf.text(item, 28, yPosition); yPosition += 7; });
        yPosition += 5;
      });
      yPosition += 10;
      pdf.setFontSize(14); pdf.setFont("helvetica", "bold"); pdf.setTextColor(139, 137, 114);
      pdf.text(t('pdf.notesTitle'), 20, yPosition); yPosition += 10;
      pdf.setFontSize(10); pdf.setFont("helvetica", "normal"); pdf.setTextColor(60, 60, 60);
      pdfNotes.forEach(note => { pdf.text("- " + note, 25, yPosition); yPosition += 7; });
      pdf.setFillColor(245, 244, 240); pdf.rect(0, 270, 210, 27, 'F');
      pdf.setFontSize(9); pdf.setTextColor(100, 100, 100);
      pdf.text("www.mariable.fr", 20, 282);
      pdf.text(t('pdf.generatedOn') + " " + new Date().toLocaleDateString(localeDate), 150, 282);
      pdf.save("checklist-mariage-catholique.pdf");
      toast.success(t('common.downloadedToastCatholique'));
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-serif text-foreground">{t('page.title')}</h1>
            <p className="text-muted-foreground text-sm">{t('page.subtitle')}</p>
          </div>
        </div>

        <Tabs defaultValue="laique" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="laique" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {t('tabs.laique')}
            </TabsTrigger>
            <TabsTrigger value="catholique" className="flex items-center gap-2">
              <Church className="h-4 w-4" />
              {t('tabs.catholique')}
            </TabsTrigger>
          </TabsList>

          {/* ==================== LAÏQUE ==================== */}
          <TabsContent value="laique" className="space-y-6">
            <div className="flex justify-end gap-2">
              <Button onClick={() => { navigator.clipboard.writeText('https://www.mariable.fr/ceremonie-laique'); toast.success(t('common.shareToast')); }} variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />{t('common.share')}
              </Button>
              <Button onClick={handleExportPDFLaique} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                {!isPremium && <Lock className="h-4 w-4" />}
                <Download className="h-4 w-4" />{t('common.downloadChecklist')}
              </Button>
            </div>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />{t('laique.fondamentauxTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {fondamentaux.map((item, index) => {
                    const Icon = FUND_ICONS[index] || Clock;
                    return (
                      <div key={index} className="p-4 border rounded-lg bg-muted/50 text-center">
                        <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-muted-foreground mt-4 italic text-center">{t('laique.fondamentauxIntro')}</p>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />{t('laique.derouleTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-primary/20" />
                  <div className="space-y-4">
                    {deroulementEtapes.map((etape, index) => (
                      <div key={index} className="relative flex items-start gap-4">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold shrink-0 text-sm">{etape.numero}</div>
                        <div className="flex-1 pb-2">
                          <h3 className="font-medium text-foreground">{etape.titre}</h3>
                          <p className="text-sm text-muted-foreground">{etape.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><Mic className="h-5 w-5 text-primary" />{t('laique.officiantTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {typesOfficiants.map((officiant, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white">
                      <h4 className="font-medium text-center mb-3 text-primary">{officiant.type}</h4>
                      <div className="mb-3">
                        <p className="text-xs font-medium text-green-700 mb-1">{t('laique.officiantAvantages')}</p>
                        <ul className="space-y-1">{officiant.avantages.map((a, i) => <li key={i} className="text-xs text-muted-foreground">- {a}</li>)}</ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-amber-700 mb-1">{t('laique.officiantVigilances')}</p>
                        <ul className="space-y-1">{officiant.vigilances.map((v, i) => <li key={i} className="text-xs text-muted-foreground">- {v}</li>)}</ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><TreePine className="h-5 w-5 text-primary" />{t('laique.rituelsTitle')}</CardTitle></CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {rituels.map((rituel, index) => (
                    <AccordionItem key={index} value={`rituel-${index}`}>
                      <AccordionTrigger className="text-sm font-medium">{rituel.nom}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-2">{rituel.description}</p>
                        <p className="text-xs text-primary italic">{t('common.advice')} : {rituel.conseils}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><Users className="h-5 w-5 text-primary" />{t('laique.prochesTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-sm">{t('laique.prochesRolesTitle')}</h4>
                    <div className="space-y-2">
                      {rolesProches.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{item.role}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-sm">{t('laique.prochesTimidesTitle')}</h4>
                    <ul className="space-y-2">
                      {alternativesTimides.map((alt, index) => <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="text-primary">-</span>{alt}</li>)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" />{t('laique.voeuxTitle')}</CardTitle></CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="preparation">
                    <AccordionTrigger className="text-sm font-medium">{t('laique.voeuxPreparation')}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">{voeuxPreparationItems.map((it, i) => <li key={i}>- {it}</li>)}</ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="structure">
                    <AccordionTrigger className="text-sm font-medium">{t('laique.voeuxStructure')}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        {voeuxStructureItems.map((it, i) => (
                          <div key={i} className="p-2 bg-muted/50 rounded">
                            <p className="font-medium text-primary">{it.title}</p>
                            <p className="text-muted-foreground">{it.desc}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="conseils">
                    <AccordionTrigger className="text-sm font-medium">{t('laique.voeuxConseils')}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">{voeuxConseilsItems.map((it, i) => <li key={i}>- {it}</li>)}</ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />{t('laique.logistiqueTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2"><CloudRain className="h-5 w-5 text-primary" /><h4 className="font-medium text-sm">{t('laique.planBTitle')}</h4></div>
                    <ul className="text-xs text-muted-foreground space-y-1">{planBItems.map((it, i) => <li key={i}>- {it}</li>)}</ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2"><Volume2 className="h-5 w-5 text-primary" /><h4 className="font-medium text-sm">{t('laique.sonoTitle')}</h4></div>
                    <ul className="text-xs text-muted-foreground space-y-1">{sonoItems.map((it, i) => <li key={i}>- {it}</li>)}</ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2"><Sun className="h-5 w-5 text-primary" /><h4 className="font-medium text-sm">{t('laique.amenagementTitle')}</h4></div>
                    <ul className="text-xs text-muted-foreground space-y-1">{amenagementItems.map((it, i) => <li key={i}>- {it}</li>)}</ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><Music className="h-5 w-5 text-primary" />{t('laique.musiqueTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">{t('laique.musiqueColMoment')}</th>
                      <th className="text-left py-2 px-3 font-medium">{t('laique.musiqueColType')}</th>
                      <th className="text-left py-2 px-3 font-medium">{t('laique.musiqueColConseil')}</th>
                    </tr></thead>
                    <tbody>{programmationMusicale.map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 px-3 font-medium text-primary">{item.moment}</td>
                        <td className="py-2 px-3 text-muted-foreground">{item.type}</td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">{item.conseil}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic">{t('laique.musiqueNote')}</p>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />{t('laique.retroplanningTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {retroplanning.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                      <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded shrink-0">{item.delai}</span>
                      <p className="text-sm text-muted-foreground">{item.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />{t('laique.checklistTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {checklistJourJ.map((cat, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-primary mb-2">{cat.categorie}</h4>
                      <ul className="space-y-1">
                        {cat.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-4 h-4 border rounded flex-shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-muted-foreground italic">{t('laique.citation')}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== CATHOLIQUE ==================== */}
          <TabsContent value="catholique" className="space-y-6">
            <div className="flex justify-end gap-2">
              <Button onClick={() => { navigator.clipboard.writeText('https://www.mariable.fr/ceremonie-catholique'); toast.success(t('common.shareToast')); }} variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />{t('common.share')}
              </Button>
              <Button onClick={handleExportPDFCatholique} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                {!isPremium && <Lock className="h-4 w-4" />}
                <Download className="h-4 w-4" />{t('common.downloadChecklist')}
              </Button>
            </div>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><Church className="h-5 w-5 text-primary" />{t('catholique.introTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">{t('catholique.introDuree')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('catholique.introDureeValue')}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">{t('catholique.introPreparation')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('catholique.introPreparationValue')}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <Cross className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">{t('catholique.introNature')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('catholique.introNatureValue')}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic text-center">{t('catholique.introQuote')}</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="flex items-start gap-3 py-4">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">{t('common.important')}</p>
                  <p className="text-sm text-amber-700">{t('catholique.alertText')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />{t('catholique.dossierTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-muted/50">
                      <th className="text-left py-2 px-3 font-medium">{t('catholique.dossierColDocument')}</th>
                      <th className="text-left py-2 px-3 font-medium">{t('catholique.dossierColNature')}</th>
                      <th className="text-left py-2 px-3 font-medium">{t('catholique.dossierColValidite')}</th>
                    </tr></thead>
                    <tbody>{documentsCatholicite.map((doc, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 px-3 font-medium">{doc.document}</td>
                        <td className="py-2 px-3 text-muted-foreground">{doc.nature}</td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">{doc.validite}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><Users className="h-5 w-5 text-primary" />{t('catholique.mixtesTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-primary mb-2">{t('catholique.mixteCardTitle')}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{t('catholique.mixteCardText')}</p>
                    <p className="text-xs text-muted-foreground italic">{t('catholique.mixteCardNote')}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-primary mb-2">{t('catholique.disparityCardTitle')}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{t('catholique.disparityCardText')}</p>
                    <p className="text-xs text-muted-foreground italic">{t('catholique.disparityCardNote')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><Crown className="h-5 w-5 text-primary" />{t('catholique.piliersTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {piliersMariage.map((pilier, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-primary mb-1">{pilier.pilier}</h4>
                      <p className="text-sm font-medium text-foreground mb-1">{pilier.definition}</p>
                      <p className="text-xs text-muted-foreground">{pilier.pratique}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic text-center">{t('catholique.piliersNote')}</p>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />{t('catholique.preparationTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">{t('catholique.prepPretreTitle')}</h4>
                    <p className="text-sm text-muted-foreground">{t('catholique.prepPretreText')}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">{t('catholique.prepCpmTitle')}</h4>
                    <p className="text-sm text-muted-foreground">{t('catholique.prepCpmText')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />{t('catholique.derouleTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-primary/20" />
                  <div className="space-y-4">
                    {derouleCatholique.map((etape, i) => (
                      <div key={i} className="relative flex items-start gap-4">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold shrink-0 text-sm">{etape.numero}</div>
                        <div className="flex-1 pb-2">
                          <h3 className="font-medium text-foreground">{etape.titre}</h3>
                          <p className="text-sm text-muted-foreground">{etape.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><Flower2 className="h-5 w-5 text-primary" />{t('catholique.decoTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">{t('catholique.decoAutelTitle')}</h4>
                    <p className="text-xs text-muted-foreground">{t('catholique.decoAutelText')}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">{t('catholique.decoAlleeTitle')}</h4>
                    <p className="text-xs text-muted-foreground">{t('catholique.decoAlleeText')}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">{t('catholique.decoBougiesTitle')}</h4>
                    <p className="text-xs text-muted-foreground">{t('catholique.decoBougiesText')}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic text-center">{t('catholique.decoNote')}</p>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><Music className="h-5 w-5 text-primary" />{t('catholique.musiqueTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-muted/50">
                      <th className="text-left py-2 px-3 font-medium">{t('catholique.musiqueColMoment')}</th>
                      <th className="text-left py-2 px-3 font-medium">{t('catholique.musiqueColExemples')}</th>
                    </tr></thead>
                    <tbody>{musiqueSacree.map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 px-3 font-medium text-primary">{item.moment}</td>
                        <td className="py-2 px-3 text-muted-foreground">{item.exemples}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic">{t('catholique.musiqueNote')}</p>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><Users className="h-5 w-5 text-primary" />{t('catholique.rolesTitle')}</CardTitle></CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="temoins">
                    <AccordionTrigger className="text-sm font-medium">{t('catholique.rolesTemoinsTitle')}</AccordionTrigger>
                    <AccordionContent><ul className="space-y-2 text-sm text-muted-foreground">{rolesTemoinsItems.map((it, i) => <li key={i}>- {it}</li>)}</ul></AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="enfants">
                    <AccordionTrigger className="text-sm font-medium">{t('catholique.rolesEnfantsTitle')}</AccordionTrigger>
                    <AccordionContent><ul className="space-y-2 text-sm text-muted-foreground">{rolesEnfantsItems.map((it, i) => <li key={i}>- {it}</li>)}</ul></AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="photographes">
                    <AccordionTrigger className="text-sm font-medium">{t('catholique.rolesPhotosTitle')}</AccordionTrigger>
                    <AccordionContent><ul className="space-y-2 text-sm text-muted-foreground">{rolesPhotosItems.map((it, i) => <li key={i}>- {it}</li>)}</ul></AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><PartyPopper className="h-5 w-5 text-primary" />{t('catholique.sortieTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-muted/50">
                      <th className="text-left py-2 px-3 font-medium">{t('catholique.sortieColTradition')}</th>
                      <th className="text-left py-2 px-3 font-medium">{t('catholique.sortieColSignification')}</th>
                      <th className="text-left py-2 px-3 font-medium">{t('catholique.sortieColContrainte')}</th>
                    </tr></thead>
                    <tbody>{traditionsSortie.map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 px-3 font-medium">{item.tradition}</td>
                        <td className="py-2 px-3 text-muted-foreground">{item.signification}</td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">{item.contrainte}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic text-center">{t('catholique.sortieNote')}</p>
              </CardContent>
            </Card>

            <Card className="border-editorial-border">
              <CardHeader><CardTitle className="font-serif text-foreground flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />{t('catholique.checklistTitle')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {checklistCatholique.map((cat, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-primary mb-2">{cat.categorie}</h4>
                      <ul className="space-y-1">
                        {cat.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-4 h-4 border rounded flex-shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-muted-foreground italic">{t('catholique.citation')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <PremiumModal isOpen={showModalLaique} onClose={closeModalLaique} feature={featureLaique} description={descriptionLaique} />
      <PremiumModal isOpen={showModalCatholique} onClose={closeModalCatholique} feature={featureCatholique} description={descriptionCatholique} />
    </>
  );
};

export default CeremoniePage;
