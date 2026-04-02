import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Search as SearchIcon, User, Calendar, Newspaper } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [fighters, setFighters] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [newsList, setNews] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [{ data: f }, { data: e }, { data: n }] = await Promise.all([
        supabase.from('fighters' as any).select('id, name, name_en, weight_class, wins, losses, draws'),
        supabase.from('events' as any).select('id, name, city, date'),
        supabase.from('news' as any).select('id, title, category, published_at, slug').eq('status', 'published'),
      ]);
      setFighters(f || []); setEvents(e || []); setNews(n || []);
    };
    load();
  }, []);

  const results = useMemo(() => {
    if (query.length < 2) return { fighters: [], events: [], news: [] };
    const q = query.toLowerCase();
    return {
      fighters: fighters.filter((f: any) => f.name?.toLowerCase().includes(q) || f.name_en?.toLowerCase().includes(q)),
      events: events.filter((e: any) => e.name?.toLowerCase().includes(q) || e.city?.toLowerCase().includes(q)),
      news: newsList.filter((n: any) => n.title?.toLowerCase().includes(q)),
    };
  }, [query, fighters, events, newsList]);

  const totalResults = results.fighters.length + results.events.length + results.news.length;

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Поиск</h1>
        <div className="relative mt-6 max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input autoFocus placeholder="Поиск боксёров, событий, новостей..." value={query} onChange={(e) => setQuery(e.target.value)} className="h-12 pl-12 text-base" />
        </div>
        {query.length >= 2 && <p className="mt-4 text-sm text-muted-foreground">Найдено: {totalResults}</p>}
        {results.fighters.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><User className="h-5 w-5 text-accent" /> Боксёры</h2>
            <div className="mt-3 space-y-2">
              {results.fighters.map((f: any) => (
                <Link key={f.id} to={`/fighters/${f.id}`} className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:border-accent transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"><User className="h-4 w-4 text-muted-foreground" /></div>
                  <div><p className="font-medium text-foreground">{f.name}</p><p className="text-xs text-muted-foreground">{f.weight_class} · {f.wins}-{f.losses}-{f.draws}</p></div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {results.events.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><Calendar className="h-5 w-5 text-accent" /> События</h2>
            <div className="mt-3 space-y-2">
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
                  <p className="text-xs text-muted-foreground">{n.category} · {new Date(n.published_at).toLocaleDateString('ru-RU')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
