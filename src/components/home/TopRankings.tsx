import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const TopRankings = () => {
  const [rankings, setRankings] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('rankings' as any)
        .select('*, fighter:fighters!rankings_fighter_id_fkey(id, name, wins, losses, draws)')
        .eq('is_p4p', true).order('rank').limit(8);
      setRankings(data || []);
    };
    load();
  }, []);

  return (
    <section className="container py-12">
      <div className="flex items-center justify-between">
        <h2 className="section-title">P4P Рейтинг</h2>
        <Link to="/rankings" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">Все рейтинги <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border bg-card">
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
            {rankings.map((entry: any) => (
              <tr key={entry.id} className="border-b last:border-0 transition-colors hover:bg-secondary/50">
                <td className="px-4 py-3 font-display font-bold text-foreground">{entry.rank}</td>
                <td className="px-4 py-3"><Link to={`/fighters/${entry.fighter?.id}`} className="font-medium text-foreground hover:text-accent transition-colors">{entry.fighter?.name}</Link></td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{entry.weight_class}</td>
                <td className="px-4 py-3 text-muted-foreground">{entry.fighter?.wins}-{entry.fighter?.losses}-{entry.fighter?.draws}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">{entry.rating?.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  {entry.change > 0 && <span className="inline-flex items-center gap-0.5 text-emerald-600"><TrendingUp className="h-3 w-3" />+{entry.change}</span>}
                  {entry.change < 0 && <span className="inline-flex items-center gap-0.5 text-destructive"><TrendingDown className="h-3 w-3" />{entry.change}</span>}
                  {entry.change === 0 && <Minus className="mx-auto h-3 w-3 text-muted-foreground" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TopRankings;
