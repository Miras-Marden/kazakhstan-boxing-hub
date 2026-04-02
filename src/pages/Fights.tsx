import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const Fights = () => {
  const [fights, setFights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('fights' as any)
        .select('*, fighter1:fighters!fights_fighter1_id_fkey(id, name), fighter2:fighters!fights_fighter2_id_fkey(id, name), event:events!fights_event_id_fkey(id, name)')
        .order('date', { ascending: false });
      setFights(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return fights.filter((f: any) =>
      f.fighter1?.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.fighter2?.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.event?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, fights]);

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Поединки</h1>
        <p className="mt-2 text-muted-foreground">Все зарегистрированные поединки</p>
        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Поиск по боксёру или событию..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        {loading ? <div className="mt-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div> : (
          <div className="mt-6 space-y-4">
            {filtered.map((fight: any) => (
              <div key={fight.id} className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(fight.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  {fight.event && <Link to={`/events/${fight.event.id}`} className="hover:text-accent">{fight.event.name}</Link>}
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex-1 text-right">
                    <Link to={`/fighters/${fight.fighter1?.id}`} className={`font-display text-lg font-bold transition-colors hover:text-accent ${fight.winner_id === fight.fighter1?.id ? 'text-foreground' : 'text-muted-foreground'}`}>{fight.fighter1?.name}</Link>
                    {fight.winner_id === fight.fighter1?.id && <p className="text-xs text-accent font-semibold">Победитель</p>}
                  </div>
                  <div className="flex flex-col items-center px-4">
                    <span className="rounded-md bg-primary px-4 py-1.5 font-display text-sm font-bold text-primary-foreground">{fight.method}</span>
                    <span className="mt-1 text-xs text-muted-foreground">Раунд {fight.rounds}/{fight.scheduled_rounds}</span>
                  </div>
                  <div className="flex-1">
                    <Link to={`/fighters/${fight.fighter2?.id}`} className={`font-display text-lg font-bold transition-colors hover:text-accent ${fight.winner_id === fight.fighter2?.id ? 'text-foreground' : 'text-muted-foreground'}`}>{fight.fighter2?.name}</Link>
                    {fight.winner_id === fight.fighter2?.id && <p className="text-xs text-accent font-semibold">Победитель</p>}
                  </div>
                </div>
                <div className="mt-3 flex justify-center gap-3 text-xs text-muted-foreground">
                  <span>{fight.weight_class}</span><span>·</span><span>{fight.city}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Fights;
