import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fights } from '@/data/mockData';

const RecentResults = () => {
  const recent = [...fights].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

  return (
    <section className="container py-12">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Последние результаты</h2>
        <Link to="/fights" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
          Все бои <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {recent.map((fight) => (
          <div key={fight.id} className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
            <p className="text-xs text-muted-foreground">{new Date(fight.date).toLocaleDateString('ru-RU')} · {fight.eventName}</p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="flex-1 text-right">
                <Link to={`/fighters/${fight.fighter1Id}`} className={`font-semibold transition-colors hover:text-accent ${fight.winnerId === fight.fighter1Id ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {fight.fighter1Name}
                </Link>
              </div>
              <div className="flex flex-col items-center">
                <span className="rounded-md bg-primary px-3 py-1 font-display text-xs font-bold text-primary-foreground">
                  {fight.method}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">R{fight.rounds}</span>
              </div>
              <div className="flex-1">
                <Link to={`/fighters/${fight.fighter2Id}`} className={`font-semibold transition-colors hover:text-accent ${fight.winnerId === fight.fighter2Id ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {fight.fighter2Name}
                </Link>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">{fight.weightClass} · {fight.city}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentResults;
