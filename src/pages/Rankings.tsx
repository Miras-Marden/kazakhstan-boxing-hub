import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const Rankings = () => {
  const [p4p, setP4p] = useState<any[]>([]);
  const [byWeight, setByWeight] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: p4pData }, { data: weightData }] = await Promise.all([
        supabase.from('rankings' as any).select('*, fighter:fighters!rankings_fighter_id_fkey(id, name, wins, losses, draws)').eq('is_p4p', true).order('rank'),
        supabase.from('rankings' as any).select('*, fighter:fighters!rankings_fighter_id_fkey(id, name, wins, losses, draws)').eq('is_p4p', false).order('rank'),
      ]);
      setP4p(p4pData || []);
      setByWeight(weightData || []);
      setLoading(false);
    };
    load();
  }, []);

  const weightClasses = [...new Set(byWeight.map((r: any) => r.weight_class))];

  return (
    <Layout>
      <div className="navy-gradient text-primary-foreground py-10">
        <div className="container">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-accent" />
            <div><h1 className="font-display text-3xl font-bold md:text-4xl">Рейтинги</h1><p className="mt-1 text-primary-foreground/70">Рейтинговая система KPBF REC</p></div>
          </div>
        </div>
      </div>
      <div className="container py-8">
        {loading ? <Skeleton className="h-64 w-full" /> : (
          <Tabs defaultValue="p4p">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="p4p">P4P Рейтинг</TabsTrigger>
              <TabsTrigger value="weight">По категориям</TabsTrigger>
            </TabsList>
            <TabsContent value="p4p" className="mt-6">
              <div className="overflow-hidden rounded-lg border bg-card">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-secondary">
                    <th className="px-4 py-3 text-left font-semibold text-secondary-foreground">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary-foreground">Боксёр</th>
                    <th className="hidden px-4 py-3 text-left font-semibold text-secondary-foreground sm:table-cell">Категория</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary-foreground">Рекорд</th>
                    <th className="px-4 py-3 text-right font-semibold text-secondary-foreground">Рейтинг</th>
                    <th className="px-4 py-3 text-center font-semibold text-secondary-foreground">Δ</th>
                  </tr></thead>
                  <tbody>
                    {p4p.map((entry: any) => (
                      <tr key={entry.id} className="border-b last:border-0 transition-colors hover:bg-secondary/50">
                        <td className="px-4 py-4"><span className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-display font-bold text-sm ${entry.rank <= 3 ? 'gold-gradient text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>{entry.rank}</span></td>
                        <td className="px-4 py-4"><Link to={`/fighters/${entry.fighter?.id}`} className="font-semibold text-foreground hover:text-accent transition-colors">{entry.fighter?.name}</Link></td>
                        <td className="hidden px-4 py-4 text-muted-foreground sm:table-cell">{entry.weight_class}</td>
                        <td className="px-4 py-4 font-mono text-muted-foreground">{entry.fighter?.wins}-{entry.fighter?.losses}-{entry.fighter?.draws}</td>
                        <td className="px-4 py-4 text-right font-bold text-foreground">{entry.rating?.toLocaleString()}</td>
                        <td className="px-4 py-4 text-center">
                          {entry.change > 0 && <span className="inline-flex items-center gap-0.5 text-emerald-600"><TrendingUp className="h-3 w-3" />+{entry.change}</span>}
                          {entry.change < 0 && <span className="inline-flex items-center gap-0.5 text-destructive"><TrendingDown className="h-3 w-3" />{entry.change}</span>}
                          {entry.change === 0 && <Minus className="mx-auto h-3 w-3 text-muted-foreground" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="weight" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {weightClasses.map((wc) => {
                  const wcFighters = byWeight.filter((r: any) => r.weight_class === wc);
                  return (
                    <div key={wc} className="rounded-lg border bg-card p-5">
                      <h3 className="font-display font-bold text-foreground">{wc}</h3>
                      <div className="mt-3 space-y-2">
                        {wcFighters.map((f: any, i: number) => (
                          <div key={f.id} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <span className="font-display font-bold text-muted-foreground">{i + 1}</span>
                              <Link to={`/fighters/${f.fighter?.id}`} className="text-foreground hover:text-accent">{f.fighter?.name}</Link>
                            </span>
                            <span className="text-muted-foreground">{f.rating?.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Rankings;
