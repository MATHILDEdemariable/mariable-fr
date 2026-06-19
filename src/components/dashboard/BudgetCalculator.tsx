
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Euro, ArrowRight, ArrowLeft, Info, Download, FileText } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

type Step = 1 | 2 | 3 | 4 | 5;
type Region = string;
type Season = 'haute' | 'basse';
type ServiceLevel = 'economique' | 'abordable' | 'premium' | 'luxe';
type CalculatorMode = 'unknown' | 'known';

interface BudgetLine {
  name: string;
  amount: number;
  basePrice: number;
  color: string;
}

interface BudgetEstimate {
  total: number;
  breakdown: BudgetLine[];
}

const CATEGORY_KEYS = ['lieu','traiteur','photo','dj','deco','tenues','papeterie','autres'] as const;
type CatKey = typeof CATEGORY_KEYS[number];

const CATEGORY_META: Record<CatKey, { percentage: number; color: string }> = {
  lieu:      { percentage: 0.35, color: '#7F9474' },
  traiteur:  { percentage: 0.35, color: '#948970' },
  photo:     { percentage: 0.08, color: '#A99E89' },
  dj:        { percentage: 0.04, color: '#C6BCA9' },
  deco:      { percentage: 0.07, color: '#8E9196' },
  tenues:    { percentage: 0.05, color: '#1A1F2C' },
  papeterie: { percentage: 0.02, color: '#B8A99A' },
  autres:    { percentage: 0.04, color: '#aaadb0' },
};

const CATEGORY_MINIMUMS: Record<ServiceLevel, { photo: number; dj: number; traiteurParInvite: number }> = {
  economique: { photo: 800,  dj: 600,  traiteurParInvite: 50 },
  abordable:  { photo: 1200, dj: 1000, traiteurParInvite: 70 },
  premium:    { photo: 1800, dj: 1800, traiteurParInvite: 100 },
  luxe:       { photo: 3000, dj: 2500, traiteurParInvite: 150 }
};

const REGIONS = [
  'Île-de-France','Provence-Alpes-Côte d\'Azur','Auvergne-Rhône-Alpes','Nouvelle-Aquitaine',
  'Occitanie','Bretagne','Pays de la Loire','Grand Est','Hauts-de-France','Normandie',
  'Bourgogne-Franche-Comté','Centre-Val de Loire','Corse'
];

const BudgetCalculator: React.FC = () => {
  const { t, i18n } = useTranslation('weddingDay');
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showEstimate, setShowEstimate] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode | null>(null);
  
  const [region, setRegion] = useState<Region>('Pays de la Loire');
  const [season, setSeason] = useState<Season>('basse');
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel>('premium');
  const [guestsCount, setGuestsCount] = useState<number>(100);
  
  const [knownBudget, setKnownBudget] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<CatKey[]>([
    'lieu', 'traiteur', 'photo', 'dj', 'deco'
  ]);
  
  const [budgetEstimate, setBudgetEstimate] = useState<BudgetEstimate>({ total: 0, breakdown: [] });

  const formatCurrency = (amount: number) => {
    const locale = i18n.language.startsWith('en') ? 'en-GB' : 'fr-FR';
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleModeSelection = (mode: CalculatorMode) => {
    setCalculatorMode(mode);
    setCurrentStep(1);
    if (mode === 'known') setShowEstimate(false);
  };

  const calculateKnownBudgetAllocation = () => {
    const totalBudget = parseFloat(knownBudget) || 0;
    if (totalBudget <= 0) {
      toast({ title: t('budgetCalc.errorTitle'), description: t('budgetCalc.errorInvalidBudget'), variant: 'destructive' });
      return;
    }
    const breakdown: BudgetLine[] = [];
    let totalPercentage = 0;
    selectedCategories.forEach(key => {
      const meta = CATEGORY_META[key];
      const amount = Math.round(totalBudget * meta.percentage);
      totalPercentage += meta.percentage;
      breakdown.push({
        name: t(`budgetCalc.categories.${key}`),
        amount, basePrice: amount, color: meta.color
      });
    });
    if (totalPercentage < 1) {
      const remaining = totalBudget - breakdown.reduce((sum, item) => sum + item.amount, 0);
      if (remaining > 0) {
        breakdown.push({
          name: t('budgetCalc.unallocated'),
          amount: remaining, basePrice: remaining, color: '#cccccc'
        });
      }
    }
    setBudgetEstimate({ total: totalBudget, breakdown });
    setShowEstimate(true);
  };

  const toggleCategory = (category: CatKey) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  };

  const calculateUnknownBudget = () => {
    const basePricePerGuest: Record<ServiceLevel, number> = {
      'economique': 90, 'abordable': 115, 'premium': 155, 'luxe': 200
    };
    const regionMultipliers: Record<string, number> = {
      'Île-de-France': 1.3, 'Provence-Alpes-Côte d\'Azur': 1.2, 'Corse': 1.15,
      'Auvergne-Rhône-Alpes': 1.1, 'Bretagne': 1.0, 'Pays de la Loire': 1.0,
    };
    const seasonMultiplier = season === 'haute' ? 1.15 : 1.0;
    const basePrice = basePricePerGuest[serviceLevel];
    const regionMultiplier = regionMultipliers[region] || 1.0;
    const finalPricePerGuest = basePrice * regionMultiplier * seasonMultiplier;
    let totalBudget = Math.round(finalPricePerGuest * guestsCount);
    const minimums = CATEGORY_MINIMUMS[serviceLevel];
    const traiteurMinimum = minimums.traiteurParInvite * guestsCount;
    const photoMinimum = minimums.photo;
    const djMinimum = minimums.dj;
    const finalTraiteur = Math.max(traiteurMinimum, totalBudget * 0.35);
    const finalPhoto = Math.max(photoMinimum, totalBudget * 0.08);
    const finalDJ = Math.max(djMinimum, totalBudget * 0.04);
    const fixedBudget = finalTraiteur + finalPhoto + finalDJ;
    let budgetAdjusted = false;
    if (fixedBudget > totalBudget * 0.60) {
      totalBudget = Math.round(fixedBudget / 0.47);
      budgetAdjusted = true;
    }
    const remainingBudget = totalBudget - fixedBudget;
    const otherPct = {
      lieu: 0.35 / 0.53, deco: 0.07 / 0.53, tenues: 0.05 / 0.53,
      papeterie: 0.02 / 0.53, autres: 0.04 / 0.53,
    };
    const breakdown: BudgetLine[] = [
      { name: t('budgetCalc.categories.lieu'), amount: Math.round(remainingBudget * otherPct.lieu), basePrice: Math.round(remainingBudget * otherPct.lieu), color: '#7F9474' },
      { name: t('budgetCalc.categories.traiteurWithCount', { rate: minimums.traiteurParInvite, count: guestsCount }), amount: finalTraiteur, basePrice: finalTraiteur, color: '#948970' },
      { name: t('budgetCalc.categories.photo'), amount: finalPhoto, basePrice: finalPhoto, color: '#A99E89' },
      { name: t('budgetCalc.categories.dj'), amount: finalDJ, basePrice: finalDJ, color: '#C6BCA9' },
      { name: t('budgetCalc.categories.deco'), amount: Math.round(remainingBudget * otherPct.deco), basePrice: Math.round(remainingBudget * otherPct.deco), color: '#8E9196' },
      { name: t('budgetCalc.categories.tenues'), amount: Math.round(remainingBudget * otherPct.tenues), basePrice: Math.round(remainingBudget * otherPct.tenues), color: '#1A1F2C' },
      { name: t('budgetCalc.categories.papeterie'), amount: Math.round(remainingBudget * otherPct.papeterie), basePrice: Math.round(remainingBudget * otherPct.papeterie), color: '#B8A99A' },
      { name: t('budgetCalc.categories.autres'), amount: Math.round(remainingBudget * otherPct.autres), basePrice: Math.round(remainingBudget * otherPct.autres), color: '#aaadb0' },
    ];
    setBudgetEstimate({ total: totalBudget, breakdown });
    if (budgetAdjusted) {
      toast({ title: t('budgetCalc.budgetAdjusted'), description: t('budgetCalc.budgetAdjustedDesc', { level: serviceLevel }) });
    }
    setShowEstimate(true);
  };

  const handleExportPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(t('budgetCalc.pdf.title'), 20, 20);
      doc.setFontSize(16);
      doc.text(`${t('budgetCalc.pdf.totalLabel')} ${formatCurrency(budgetEstimate.total)}`, 20, 40);
      doc.setFontSize(12);
      doc.text(t('budgetCalc.pdf.breakdownLabel'), 20, 55);
      let yPos = 65;
      budgetEstimate.breakdown.forEach((item) => {
        doc.text(`${item.name}: ${formatCurrency(item.amount)}`, 25, yPos);
        yPos += 10;
        if (yPos > 270) { doc.addPage(); yPos = 20; }
      });
      if (calculatorMode === 'unknown') {
        yPos += 10;
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        doc.text(t('budgetCalc.pdf.paramsLabel'), 20, yPos); yPos += 10;
        doc.text(`${t('budgetCalc.pdf.guests')} ${guestsCount}`, 25, yPos); yPos += 8;
        doc.text(`${t('budgetCalc.pdf.region')} ${region}`, 25, yPos); yPos += 8;
        doc.text(`${t('budgetCalc.pdf.season')} ${season === 'haute' ? t('budgetCalc.pdf.highSeason') : t('budgetCalc.pdf.lowSeason')}`, 25, yPos); yPos += 8;
        doc.text(`${t('budgetCalc.pdf.level')} ${serviceLevel}`, 25, yPos);
      }
      doc.save(`budget-mariage-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast({ title: t('budgetCalc.pdf.successTitle'), description: t('budgetCalc.pdf.successDesc') });
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast({ title: t('budgetCalc.errorTitle'), description: t('budgetCalc.pdf.errorDesc'), variant: 'destructive' });
    }
  };

  const renderModeSelection = () => (
    <div className="space-y-6 p-3 sm:p-4 max-w-full overflow-hidden">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-serif mb-4">{t('budgetCalc.chooseMethod')}</h2>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-2">{t('budgetCalc.chooseMethodDesc')}</p>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <Button variant="outline" className="w-full h-auto p-3 sm:p-4 md:p-6 flex flex-col items-start text-left hover:bg-wedding-cream/20 overflow-hidden" onClick={() => handleModeSelection('known')}>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 w-full">
            <Euro className="h-5 w-5 text-wedding-olive flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-lg font-medium break-words">{t('budgetCalc.knowMyBudget')}</span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground text-left break-words">{t('budgetCalc.knowMyBudgetDesc')}</p>
        </Button>
        <Button variant="outline" className="w-full h-auto p-3 sm:p-4 md:p-6 flex flex-col items-start text-left hover:bg-wedding-cream/20 overflow-hidden" onClick={() => handleModeSelection('unknown')}>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 w-full">
            <Calculator className="h-5 w-5 text-wedding-olive flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-lg font-medium break-words">{t('budgetCalc.dontKnowMyBudget')}</span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground text-left break-words">{t('budgetCalc.dontKnowMyBudgetDesc')}</p>
        </Button>
      </div>
    </div>
  );

  const renderKnownBudgetMode = () => (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-full overflow-hidden">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-serif mb-2 sm:mb-4">{t('budgetCalc.knownTitle')}</h2>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-1 sm:px-2 break-words">{t('budgetCalc.knownSubtitle')}</p>
      </div>
      <div className="space-y-4 sm:space-y-6 max-w-full">
        <div>
          <Label htmlFor="knownBudget" className="text-base md:text-lg mb-4 block">{t('budgetCalc.totalBudgetLabel')}</Label>
          <Input type="number" id="knownBudget" value={knownBudget} onChange={(e) => setKnownBudget(e.target.value)} className="py-4 md:py-6 text-base md:text-lg" placeholder={t('budgetCalc.totalBudgetPlaceholder')} min="1000" max="200000" />
        </div>
        <div>
          <Label className="text-base md:text-lg mb-4 block">{t('budgetCalc.categoriesLabel')}</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORY_KEYS.map((key) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox id={key} checked={selectedCategories.includes(key)} onCheckedChange={() => toggleCategory(key)} />
                <Label htmlFor={key} className="text-sm flex-1">
                  {t(`budgetCalc.categories.${key}`)} ({Math.round(CATEGORY_META[key].percentage * 100)}%)
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={calculateKnownBudgetAllocation} className="w-full bg-wedding-olive hover:bg-wedding-olive/90 py-6 text-lg" disabled={!knownBudget || selectedCategories.length === 0}>
          <Calculator className="h-5 w-5 mr-2" />
          {t('budgetCalc.calculateAllocation')}
        </Button>
      </div>
    </div>
  );

  const renderUnknownBudgetMode = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-full overflow-hidden">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-serif mb-2 sm:mb-4">{t('budgetCalc.step1Title')}</h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-1 sm:px-2">{t('budgetCalc.step1Subtitle')}</p>
          </div>
          <div>
            <Label>{t('budgetCalc.regionLabel')}</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setCurrentStep(2)} className="w-full bg-wedding-olive hover:bg-wedding-olive/90 py-6 text-lg">
            {t('budgetCalc.next')} <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      );
    }
    if (currentStep === 2) {
      return (
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-full overflow-hidden">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-serif mb-2 sm:mb-4">{t('budgetCalc.step2Title')}</h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-1 sm:px-2">{t('budgetCalc.step2Subtitle')}</p>
          </div>
          <RadioGroup value={season} onValueChange={(v) => setSeason(v as Season)}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="haute" id="haute" />
                <Label htmlFor="haute" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('budgetCalc.highSeason')}</div>
                  <p className="text-sm text-muted-foreground">{t('budgetCalc.highSeasonDesc')}</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="basse" id="basse" />
                <Label htmlFor="basse" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('budgetCalc.lowSeason')}</div>
                  <p className="text-sm text-muted-foreground">{t('budgetCalc.lowSeasonDesc')}</p>
                </Label>
              </div>
            </div>
          </RadioGroup>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" /> {t('budgetCalc.back')}
            </Button>
            <Button onClick={() => setCurrentStep(3)} className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90">
              {t('budgetCalc.next')} <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }
    if (currentStep === 3) {
      return (
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-full overflow-hidden">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-serif mb-2 sm:mb-4">{t('budgetCalc.step3Title')}</h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-1 sm:px-2">{t('budgetCalc.step3Subtitle')}</p>
          </div>
          <div>
            <Label>{t('budgetCalc.guestsLabel')}</Label>
            <Input type="number" value={guestsCount} onChange={(e) => setGuestsCount(parseInt(e.target.value) || 0)} className="py-6 text-lg" placeholder="100" min="10" max="500" />
            <p className="text-sm text-muted-foreground mt-2">{t('budgetCalc.guestsHint')}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" /> {t('budgetCalc.back')}
            </Button>
            <Button onClick={() => setCurrentStep(4)} className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90" disabled={guestsCount < 10}>
              {t('budgetCalc.next')} <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }
    if (currentStep === 4) {
      const levels = [
        { value: 'economique', label: t('budgetCalc.economic'), desc: t('budgetCalc.economicDesc') },
        { value: 'abordable',  label: t('budgetCalc.affordable'), desc: t('budgetCalc.affordableDesc') },
        { value: 'premium',    label: t('budgetCalc.premium'), desc: t('budgetCalc.premiumDesc') },
        { value: 'luxe',       label: t('budgetCalc.luxury'), desc: t('budgetCalc.luxuryDesc') },
      ];
      return (
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-full overflow-hidden">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-serif mb-2 sm:mb-4">{t('budgetCalc.step4Title')}</h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-1 sm:px-2">{t('budgetCalc.step4Subtitle')}</p>
          </div>
          <RadioGroup value={serviceLevel} onValueChange={(v) => setServiceLevel(v as ServiceLevel)}>
            <div className="space-y-4">
              {levels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value={level.value} id={level.value} />
                  <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                    <div className="font-medium">{level.label}</div>
                    <p className="text-sm text-muted-foreground">{level.desc}</p>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" /> {t('budgetCalc.back')}
            </Button>
            <Button onClick={calculateUnknownBudget} className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90">
              <Calculator className="h-5 w-5 mr-2" /> {t('budgetCalc.calculate')}
            </Button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderResults = () => {
    if (!showEstimate || !budgetEstimate.breakdown.length) return null;
    const isKnownMode = calculatorMode === 'known';
    return (
      <div className="space-y-6 md:space-y-8 p-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-4">
            {isKnownMode ? t('budgetCalc.resultsAllocationTitle') : t('budgetCalc.resultsEstimateTitle')}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground px-2">
            {isKnownMode ? t('budgetCalc.resultsAllocationSubtitle') : t('budgetCalc.resultsEstimateSubtitle')}
          </p>
        </div>
        <div className="text-center py-6 md:py-8">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-serif mb-4" style={{ color: '#4CAF50' }}>
            {isKnownMode ? t('budgetCalc.totalAllocated') : t('budgetCalc.totalEstimated')}
          </h3>
          <p className="text-2xl md:text-3xl lg:text-4xl text-wedding-olive font-medium">
            {formatCurrency(budgetEstimate.total)}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mt-2 px-2">
            {isKnownMode ? t('budgetCalc.totalAllocatedDesc') : t('budgetCalc.totalEstimatedDesc')}
          </p>
        </div>
        <div className="h-56 sm:h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie data={budgetEstimate.breakdown} cx="50%" cy="50%" innerRadius={40} outerRadius="80%" paddingAngle={2} dataKey="amount" nameKey="name"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#7F9474', strokeWidth: 0.5 }} strokeWidth={1} stroke="#f8f6f0">
                {budgetEstimate.breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg md:text-2xl font-serif mb-4">{t('budgetCalc.detailedBreakdown')}</h3>
          <div className="space-y-4 md:space-y-6">
            {budgetEstimate.breakdown.map((item, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm md:text-base break-words">{item.name}</span>
                  </div>
                  <span className="font-medium text-sm md:text-base ml-2 flex-shrink-0">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground bg-gray-50 p-4 rounded-md">
          <Info size={18} className="shrink-0 mt-0.5" />
          <p>{isKnownMode ? t('budgetCalc.infoAllocated') : t('budgetCalc.infoEstimated')}</p>
        </div>
        {!isKnownMode && (
          <div>
            <h3 className="text-lg md:text-2xl font-serif mb-4">{t('budgetCalc.estimateParamsTitle')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border p-3 rounded">
                <p className="text-sm font-medium">{t('budgetCalc.guestsParam')}</p>
                <p>{guestsCount} {t('budgetCalc.guestsUnit')}</p>
              </div>
              <div className="border p-3 rounded">
                <p className="text-sm font-medium">{t('budgetCalc.regionParam')}</p>
                <p>{region}</p>
              </div>
              <div className="border p-3 rounded">
                <p className="text-sm font-medium">{t('budgetCalc.seasonParam')}</p>
                <p>{season === 'haute' ? t('budgetCalc.highSeasonShort') : t('budgetCalc.lowSeasonShort')}</p>
              </div>
              <div className="border p-3 rounded">
                <p className="text-sm font-medium">{t('budgetCalc.levelParam')}</p>
                <p className="capitalize">{serviceLevel}</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button variant="outline" onClick={() => { setShowEstimate(false); setCalculatorMode(null); setCurrentStep(1); }} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" /> {t('budgetCalc.newEstimate')}
          </Button>
          <Button onClick={handleExportPDF} className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90">
            <Download className="h-4 w-4 mr-2" /> {t('budgetCalc.exportPdf')}
          </Button>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('budgetCalc.exportHint')}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden max-w-full">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
          {t('budgetCalc.cardTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden p-0 sm:p-6 max-w-full">
        {!calculatorMode && renderModeSelection()}
        {calculatorMode === 'known' && !showEstimate && renderKnownBudgetMode()}
        {calculatorMode === 'unknown' && !showEstimate && renderUnknownBudgetMode()}
        {showEstimate && renderResults()}
      </CardContent>
    </Card>
  );
};

export default BudgetCalculator;
