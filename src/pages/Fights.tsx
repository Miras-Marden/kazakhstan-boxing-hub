import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { fights } from '@/data/mockData';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Fights = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return fights.filter(f =>
      f.fighter1Name.toLowerCase().includes(search.toLowerCase()) ||
      f.fighter2Name.toLowerCase().includes(search.toLowerCase()) ||
      f.eventName.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search]);

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Поединки</h1>
        <p className="mt-2 text-muted-foreground">Все зарегистрированные поединки</p>

        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Поиск по боксёру или событию..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map((fight) => (
            <div key={fight.id} className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(fight.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <Link to={`/events/${fight.eventId}`} className="hover:text-accent">{fight.eventName}</Link>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex-1 text-right">
                  <Link to={`/fighters/${fight.fighter1Id}`} className={`font-display text-lg font-bold transition-colors hover:text-accent ${fight.winnerId === fight.fighter1Id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {fight.fighter1Name}
                  </Link>
                  {fight.winnerId === fight.fighter1Id && <p className="text-xs text-accent font-semibold">Победитель</p>}
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className="rounded-md bg-primary px-4 py-1.5 font-display text-sm font-bold text-primary-foreground">{fight.method}</span>
                  <span className="mt-1 text-xs text-muted-foreground">Раунд {fight.rounds}/{fight.scheduledRounds}</span>
                </div>
                <div className="flex-1">
                  <Link to={`/fighters/${fight.fighter2Id}`} className={`font-display text-lg font-bold transition-colors hover:text-accent ${fight.winnerId === fight.fighter2Id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {fight.fighter2Name}
                  </Link>
                  {fight.winnerId === fight.fighter2Id && <p className="text-xs text-accent font-semibold">Победитель</p>}
                </div>
              </div>
              <div className="mt-3 flex justify-center gap-3 text-xs text-muted-foreground">
                <span>{fight.weightClass}</span>
                <span>·</span>
                <span>{fight.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Fights;
