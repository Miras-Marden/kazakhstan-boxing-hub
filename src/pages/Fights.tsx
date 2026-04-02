import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const Fights = () => {
  useDocumentTitle('Поединки', 'Все зарегистрированные поединки казахстанского бокса');
  const [fights, setFights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [weightFilter, setWeightFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const { isFavorite, toggle } = useFavorites('fight');

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

  const weightClasses = useMemo(() => [...new Set(fights.map((f: any) => f.weight_class).filter(Boolean))], [fights]);

  const filtered = useMemo(() => {
    return fights.filter((f: any) => {
      const matchSearch = f.fighter1?.name?.toLowerCase().includes(search.toLowerCase()) ||
        f.fighter2?.name?.toLowerCase().includes(search.toLowerCase()) ||
        f.event?.name?.toLowerCase().includes(search.toLowerCase());
      const matchWeight = weightFilter === 'all' || f.weight_class === weightFilter;
      const matchResult = resultFilter === 'all' ||
        (resultFilter === 'ko' && (f.method === 'KO' || f.method === 'TKO')) ||
        (resultFilter === 'decision' && (f.method === 'UD' || f.method === 'SD' || f.method === 'MD')) ||
        (resultFilter === 'draw' && f.method === 'Draw');
      return matchSearch && matchWeight && matchResult;
    });
  }, [search, weightFilter, resultFilter, fights]);

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Поединки</h1>
        <p className="mt-2 text-muted-foreground">Все зарегистрированные поединки</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Поиск по боксёру или событию..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={weightFilter} onValueChange={setWeightFilter}>
            <SelectTrigger className="w-full sm:w-48"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Категория" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {weightClasses.map(wc => <SelectItem key={wc} value={wc}>{wc}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={resultFilter} onValueChange={setResultFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Результат" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все результаты</SelectItem>
              <SelectItem value="ko">KO/TKO</SelectItem>
              <SelectItem value="decision">Решение</SelectItem>
              <SelectItem value="draw">Ничья</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? <div className="mt-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div> : (
          <div className="mt-6 space-y-4">
            {filtered.map((fight: any) => (
              <div key={fight.id} className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(fight.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <div className="flex items-center gap-2">
                    {fight.event && <Link to={`/events/${fight.event.id}`} className="hover:text-accent">{fight.event.name}</Link>}
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggle(fight.id)}>
                      <Heart className={`h-4 w-4 ${isFavorite(fight.id) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex-1 text-right">
                    <Link to={`/fighters/${fight.fighter1?.id}`} className={`font-display text-base font-bold transition-colors hover:text-accent sm:text-lg ${fight.winner_id === fight.fighter1?.id ? 'text-foreground' : 'text-muted-foreground'}`}>{fight.fighter1?.name}</Link>
                    {fight.winner_id === fight.fighter1?.id && <p className="text-xs text-accent font-semibold">Победитель</p>}
                  </div>
                  <div className="flex flex-col items-center px-2 sm:px-4">
                    <span className="rounded-md bg-primary px-3 py-1.5 font-display text-xs font-bold text-primary-foreground sm:text-sm sm:px-4">{fight.method}</span>
                    <span className="mt-1 text-xs text-muted-foreground">R{fight.rounds}/{fight.scheduled_rounds}</span>
                  </div>
                  <div className="flex-1">
                    <Link to={`/fighters/${fight.fighter2?.id}`} className={`font-display text-base font-bold transition-colors hover:text-accent sm:text-lg ${fight.winner_id === fight.fighter2?.id ? 'text-foreground' : 'text-muted-foreground'}`}>{fight.fighter2?.name}</Link>
                    {fight.winner_id === fight.fighter2?.id && <p className="text-xs text-accent font-semibold">Победитель</p>}
                  </div>
                </div>
                <div className="mt-3 flex justify-center gap-3 text-xs text-muted-foreground">
                  <span>{fight.weight_class}</span><span>·</span><span>{fight.city}</span>
                </div>
                {(fight.judge1 || fight.referee) && (
                  <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground border-t pt-2">
                    {fight.referee && <span>Рефери: {fight.referee}</span>}
                    {fight.judge1 && <span>{fight.judge1}: {fight.judge1_score}</span>}
                    {fight.judge2 && <span>{fight.judge2}: {fight.judge2_score}</span>}
                    {fight.judge3 && <span>{fight.judge3}: {fight.judge3_score}</span>}
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && <p className="py-8 text-center text-muted-foreground">Бои не найдены</p>}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Fights;
