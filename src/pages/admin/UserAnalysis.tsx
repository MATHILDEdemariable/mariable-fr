import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, User, Mail, Calendar, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ModuleStat {
  key: string;
  name: string;
  value: number;
  total?: number;
  unit: string;
  extra?: string;
}

interface AnalysisResult {
  user: {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    metadata?: any;
  };
  profile: any;
  modules: ModuleStat[];
  completionScore: number;
  usedModules: number;
  totalModules: number;
}

const UserAnalysis = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('get-user-analysis', {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (!data?.success) {
        toast({
          title: 'Utilisateur introuvable',
          description: data?.error ?? 'Aucun compte avec cet email.',
          variant: 'destructive',
        });
        return;
      }
      setResult(data);
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message ?? 'Échec de la recherche',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const isPremium =
    result?.profile?.subscription_type === 'premium' &&
    (!result?.profile?.subscription_expires_at ||
      new Date(result.profile.subscription_expires_at) > new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-wedding-black">Analyse utilisateur</h1>
        <p className="text-muted-foreground mt-2">
          Recherche un utilisateur par email pour voir son état d'avancement détaillé.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="email"
              placeholder="email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !email.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Rechercher</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Profil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {result.user.email}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Nom</p>
                <p className="font-medium">
                  {result.profile?.first_name || ''} {result.profile?.last_name || ''} {!result.profile?.first_name && !result.profile?.last_name && '—'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Inscription</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {formatDate(result.user.created_at)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Dernière connexion</p>
                <p className="font-medium">{formatDate(result.user.last_sign_in_at)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date de mariage</p>
                <p className="font-medium">{formatDate(result.profile?.wedding_date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Nombre d'invités</p>
                <p className="font-medium">{result.profile?.guest_count ?? '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Abonnement</p>
                <Badge variant={isPremium ? 'default' : 'secondary'} className="gap-1">
                  {isPremium && <Crown className="h-3 w-3" />}
                  {isPremium ? 'Premium' : 'Free'}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Score d'avancement</p>
                <p className="font-medium text-2xl text-wedding-olive">
                  {result.completionScore}% <span className="text-sm text-muted-foreground">({result.usedModules}/{result.totalModules} modules)</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Modules */}
          <Card>
            <CardHeader>
              <CardTitle>État d'avancement par module</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.modules.map((m) => {
                  const status = m.value === 0 ? 'Vide' : m.total && m.value >= m.total ? 'Complété' : 'Commencé';
                  const color = m.value === 0 ? 'bg-gray-100 text-gray-600'
                    : status === 'Complété' ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700';
                  return (
                    <div key={m.key} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{m.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${color}`}>{status}</span>
                      </div>
                      <p className="text-2xl font-bold">{m.value} <span className="text-sm font-normal text-muted-foreground">{m.unit}</span></p>
                      {m.extra && <p className="text-xs text-muted-foreground mt-1">{m.extra}</p>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default UserAnalysis;
