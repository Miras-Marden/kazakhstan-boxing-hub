import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { fighters, fights, events, news } from '@/data/mockData';
import { Search as SearchIcon, User, Swords, Calendar, Newspaper } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchPage = () => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (query.length < 2) return { fighters: [], fights: [], events: [], news: [] };
    const q = query.toLowerCase();
    return {
      fighters: fighters.filter(f => f.name.toLowerCase().includes(q) || f.nameEn?.toLowerCase().includes(q)),
      fights: fights.filter(f => f.fighter1Name.toLowerCase().includes(q) || f.fighter2Name.toLowerCase().includes(q)),
      events: events.filter(e => e.name.toLowerCase().includes(q) || e.city.toLowerCase().includes(q)),
      news: news.filter(n => n.title.toLowerCase().includes(q)),
    };
  }, [query]);

  const totalResults = results.fighters.length + results.fights.length + results.events.length + results.news.length;

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Поиск</h1>
        <div className="relative mt-6 max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Поиск боксёров, боёв, событий, новостей..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 pl-12 text-base"
          />
        </div>

        {query.length >= 2 && (
          <p className="mt-4 text-sm text-muted-foreground">Найдено: {totalResults}</p>
        )}

        {results.fighters.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><User className="h-5 w-5 text-accent" /> Боксёры</h2>
            <div className="mt-3 space-y-2">
              {results.fighters.map(f => (
                <Link key={f.id} to={`/fighters/${f.id}`} className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:border-accent transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"><User className="h-4 w-4 text-muted-foreground" /></div>
                  <div>
                    <p className="font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.weightClass} · {f.wins}-{f.losses}-{f.draws}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.events.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><Calendar className="h-5 w-5 text-accent" /> События</h2>
            <div className="mt-3 space-y-2">
              {results.events.map(e => (
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
              {results.news.map(n => (
                <div key={n.id} className="rounded-lg border bg-card p-3">
                  <p className="font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.category} · {new Date(n.publishedAt).toLocaleDateString('ru-RU')}</p>
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
