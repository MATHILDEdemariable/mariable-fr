import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  DrinkPlanRow, DRINK_MOMENTS, DRINK_TYPE_COLORS, translateDrinkLabel,
} from '@/components/drinks/DrinksPlanTable';

interface PublicDrinksPlan {
  rows: DrinkPlanRow[];
  wedding_title: string | null;
  wedding_date: string | null;
}

const DrinksPlanPublic: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { i18n } = useTranslation();
  const isEnglish = !!i18n.language?.startsWith('en');
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const [plan, setPlan] = useState<PublicDrinksPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await (supabase as any).rpc('get_public_drinks_plan', { token_value: token });
        if (error) throw error;
        const first = Array.isArray(data) ? data[0] : null;
        setPlan(first ? { ...first, rows: Array.isArray(first.rows) ? first.rows : [] } : null);
      } catch (error) {
        console.error('❌ loadPublicDrinksPlan failed:', error);
        setPlan(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  // Regroupement : jour > moment
  const groups: Record<string, Record<string, DrinkPlanRow[]>> = {};
  (plan?.rows ?? []).forEach((row) => {
    groups[row.day] ??= {};
    (groups[row.day][row.moment] ??= []).push(row);
  });

  return (
    <main className="min-h-screen bg-editorial-beige px-4 py-8">
      <Helmet>
        <title>{tr('Plan des boissons — Mariable', 'Drinks plan — Mariable')}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <img src="/cachet_M.webp" alt="Mariable" className="h-12" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <div>
              <h1 className="font-serif text-3xl">{tr('Plan des boissons', 'Drinks plan')}</h1>
              {plan?.wedding_title && (
                <p className="text-sm text-muted-foreground">
                  {plan.wedding_title}
                  {plan.wedding_date && ` · ${new Date(plan.wedding_date).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR')}`}
                </p>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={() => window.print()} className="print:hidden">
            <Printer className="h-4 w-4 mr-2" /> {tr('Imprimer', 'Print')}
          </Button>
        </header>

        {isLoading ? (
          <p className="text-center text-muted-foreground">{tr('Chargement…', 'Loading…')}</p>
        ) : !plan ? (
          <p className="text-center text-muted-foreground">{tr('Ce lien n’est plus actif.', 'This link is no longer active.')}</p>
        ) : plan.rows.length === 0 ? (
          <p className="text-center text-muted-foreground">{tr('Aucune boisson renseignée.', 'No drinks yet.')}</p>
        ) : (
          Object.keys(groups).sort().map((day) => (
            <section key={day} className="mb-8">
              <h2 className="font-serif text-2xl border-b border-editorial-olive/40 pb-2 mb-4 text-editorial-olive">
                {translateDrinkLabel(day, isEnglish)}
              </h2>
              {Object.keys(groups[day])
                .sort((a, b) => DRINK_MOMENTS.indexOf(a) - DRINK_MOMENTS.indexOf(b))
                .map((moment) => (
                  <div key={moment} className="mb-5">
                    <h3 className="font-serif text-lg mb-2">{translateDrinkLabel(moment, isEnglish)}</h3>
                    <ul className="space-y-2">
                      {groups[day][moment].map((row) => (
                        <li key={row.id} className="bg-background border border-border p-3 flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className={`text-xs px-2 py-1 w-fit ${DRINK_TYPE_COLORS[row.drinkType] ?? 'bg-muted'}`}>
                            {translateDrinkLabel(row.drinkType, isEnglish)}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium">{row.drinkName || '—'}</p>
                            {row.pairing && <p className="text-sm text-muted-foreground">{tr('Avec', 'With')} : {row.pairing}</p>}
                            {row.notes && <p className="text-xs text-muted-foreground italic">{row.notes}</p>}
                          </div>
                          <div className="text-sm text-right">
                            {row.quantity && <p>{row.quantity}</p>}
                            {row.supplier && <p className="text-muted-foreground">{row.supplier}</p>}
                            <p className="text-xs text-editorial-olive">{translateDrinkLabel(row.status, isEnglish)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </section>
          ))
        )}
        <footer className="text-center text-xs text-muted-foreground mt-10">
          {tr('Partagé avec l’app Mariable', 'Shared with the Mariable app')} · mariable.fr
        </footer>
      </div>
    </main>
  );
};

export default DrinksPlanPublic;
