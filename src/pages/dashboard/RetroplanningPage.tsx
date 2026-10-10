import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeddingRetroplanningEmbed from './WeddingRetroplanningEmbed';
import RetroplanningManuel from '@/components/retroplanning/RetroplanningManuel';
import RetroplanningShareButton from '@/components/retroplanning/RetroplanningShareButton';

const RetroplanningPage = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('mode') === 'manual' ? 'manual' : 'ai';
  const aiRetroplanningId = searchParams.get('id');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        const next = new URLSearchParams(searchParams);
        if (value === 'manual') next.set('mode', 'manual'); else next.delete('mode');
        setSearchParams(next, { replace: true });
      }}
      className="space-y-6"
    >
      <TabsList className="grid grid-cols-2 w-full h-auto p-1 bg-muted rounded-none">
        <TabsTrigger value="ai" className="min-h-[48px] rounded-none font-medium text-sm sm:text-base data-[state=active]:bg-foreground data-[state=active]:text-background">
          ✨ {isEnglish ? 'With AI' : 'Avec l\'IA'}
        </TabsTrigger>
        <TabsTrigger value="manual" className="min-h-[48px] rounded-none font-medium text-sm sm:text-base data-[state=active]:bg-foreground data-[state=active]:text-background">
          ✍️ {isEnglish ? 'Manual' : 'Manuel'}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ai" className="space-y-4">
        {aiRetroplanningId && (
          <div className="flex justify-end">
            <RetroplanningShareButton retroplanningId={aiRetroplanningId} />
          </div>
        )}
        <WeddingRetroplanningEmbed />
      </TabsContent>
      <TabsContent value="manual">
        <RetroplanningManuel />
      </TabsContent>
    </Tabs>
  );
};

export default RetroplanningPage;
