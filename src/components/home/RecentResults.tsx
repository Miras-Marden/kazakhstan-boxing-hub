import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const RecentResults = () => {
  const [fights, setFights] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('fights' as any)
        .select('*, fighter1:fighters!fights_fighter1_id_fkey(id, name), fighter2:fighters!fights_fighter2_id_fkey(id, name), event:events!fights_event_id_fkey(id, name)')
        .order('date', { ascending: false }).limit(4);
      setFights(data || []);
    };
    load();
  }, []);

  return (
    <section className="container py-12">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Последние результаты</h2>
        <Link to="/fights" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">Все бои <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {fights.map((fight: any) => (
          <div key={fight.id} className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
            <p className="text-xs text-muted-foreground">{new Date(fight.date).toLocaleDateString('ru-RU')} · {fight.event?.name}</p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="flex-1 text-right">
                <Link to={`/fighters/${fight.fighter1?.id}`} className={`font-semibold transition-colors hover:text-accent ${fight.winner_id === fight.fighter1?.id ? 'text-foreground' : 'text-muted-foreground'}`}>{fight.fighter1?.name}</Link>
              </div>
              <div className="flex flex-col items-center">
                <span className="rounded-md bg-primary px-3 py-1 font-display text-xs font-bold text-primary-foreground">{fight.method}</span>
                <span className="mt-1 text-xs text-muted-foreground">R{fight.rounds}</span>
              </div>
              <div className="flex-1">
                <Link to={`/fighters/${fight.fighter2?.id}`} className={`font-semibold transition-colors hover:text-accent ${fight.winner_id === fight.fighter2?.id ? 'text-foreground' : 'text-muted-foreground'}`}>{fight.fighter2?.name}</Link>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">{fight.weight_class} · {fight.city}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentResults;
