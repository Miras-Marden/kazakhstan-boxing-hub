import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Search as SearchIcon, User, Calendar, Newspaper, Swords } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const SearchPage = () => {
  useDocumentTitle('Поиск');
  const [query, setQuery] = useState('');
  const [fighters, setFighters] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [newsList, setNews] = useState<any[]>([]);
  const [fights, setFights] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [{ data: f }, { data: e }, { data: n }, { data: fi }] = await Promise.all([
        supabase.from('fighters' as any).select('id, name, name_en, weight_class, wins, losses, draws'),
        supabase.from('events' as any).select('id, name, city, date'),
        supabase.from('news' as any).select('id, title, category, published_at, slug').eq('status', 'published'),
        supabase.from('fights' as any).select('id, date, weight_class, method, fighter1:fighters!fights_fighter1_id_fkey(id, name), fighter2:fighters!fights_fighter2_id_fkey(id, name)'),
      ]);
      setFighters(f || []); setEvents(e || []); setNews(n || []); setFights(fi || []);
    };
    load();
  }, []);

  const results = useMemo(() => {
    if (query.length < 2) return { fighters: [], events: [], news: [], fights: [] };
    const q = query.toLowerCase();
    return {
      fighters: fighters.filter((f: any) => f.name?.toLowerCase().includes(q) || f.name_en?.toLowerCase().includes(q)),
      events: events.filter((e: any) => e.name?.toLowerCase().includes(q) || e.city?.toLowerCase().includes(q)),
      news: newsList.filter((n: any) => n.title?.toLowerCase().includes(q)),
      fights: fights.filter((f: any) => f.fighter1?.name?.toLowerCase().includes(q) || f.fighter2?.name?.toLowerCase().includes(q)),
    };
  }, [query, fighters, events, newsList, fights]);

  const totalResults = results.fighters.length + results.events.length + results.news.length + results.fights.length;

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Поиск</h1>
        <div className="relative mt-6 max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input autoFocus placeholder="Поиск боксёров, событий, боёв, новостей..." value={query} onChange={(e) => setQuery(e.target.value)} className="h-12 pl-12 text-base" />
        </div>
        {query.length >= 2 && <p className="mt-4 text-sm text-muted-foreground">Найдено: {totalResults}</p>}

        {results.fighters.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><User className="h-5 w-5 text-accent" /> Боксёры</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {results.fighters.map((f: any) => (
                <Link key={f.id} to={`/fighters/${f.id}`} className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:border-accent transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary shrink-0"><User className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="min-w-0"><p className="font-medium text-foreground truncate">{f.name}</p><p className="text-xs text-muted-foreground">{f.weight_class} · {f.wins}-{f.losses}-{f.draws}</p></div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.fights.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><Swords className="h-5 w-5 text-accent" /> Бои</h2>
            <div className="mt-3 space-y-2">
              {results.fights.slice(0, 10).map((f: any) => (
                <div key={f.id} className="rounded-lg border bg-card p-3">
                  <p className="font-medium text-foreground">{f.fighter1?.name} vs {f.fighter2?.name}</p>
                  <p className="text-xs text-muted-foreground">{f.weight_class} · {f.method} · {new Date(f.date).toLocaleDateString('ru-RU')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.events.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><Calendar className="h-5 w-5 text-accent" /> События</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {results.events.map((e: any) => (
                <Link key={e.id} to={`/events/${e.id}`} className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:border-accent transition-colors">
                  <div><p className="font-medium text-foreground">{e.name}</p><p className="text-xs text-muted-foreground">{e.city} · {new Date(e.date).toLocaleDateString('ru-RU')}</p></div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.news.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><Newspaper className="h-5 w-5 text-accent" /> Новости</h2>
            <div className="mt-3 space-y-2">
              {results.news.map((n: any) => (
                <div key={n.id} className="rounded-lg border bg-card p-3">
                  <p className="font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.category} · {n.published_at && new Date(n.published_at).toLocaleDateString('ru-RU')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {query.length >= 2 && totalResults === 0 && <p className="mt-8 text-center text-muted-foreground">Ничего не найдено по запросу «{query}»</p>}
      </div>
    </Layout>
  );
};

export default SearchPage;
