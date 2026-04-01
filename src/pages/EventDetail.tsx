import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { events, fights } from '@/data/mockData';
import { ArrowLeft, Calendar, MapPin, Swords } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const EventDetail = () => {
  const { id } = useParams();
  const event = events.find(e => e.id === id);
  const eventFights = fights.filter(f => f.eventId === id);

  if (!event) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Событие не найдено</p>
          <Link to="/events" className="mt-4 inline-block text-accent hover:underline">← К списку событий</Link>
        </div>
      </Layout>
    );
  }

  const statusLabel = (s: string) => {
    switch (s) {
      case 'upcoming': return 'Предстоящее';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return s;
    }
  };

  return (
    <Layout>
      <div className="navy-gradient text-primary-foreground py-10">
        <div className="container">
          <Link to="/events" className="inline-flex items-center gap-1 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> События
          </Link>
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold md:text-4xl">{event.name}</h1>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.venue}, {event.city}</span>
                <span className="flex items-center gap-1"><Swords className="h-3.5 w-3.5" />{event.fightCount} боёв</span>
              </div>
            </div>
            <Badge className={event.status === 'upcoming' ? 'gold-gradient text-accent-foreground border-0' : 'bg-primary-foreground/10 text-primary-foreground border-0'}>
              {statusLabel(event.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {event.description && <p className="text-muted-foreground mb-8">{event.description}</p>}

        <h2 className="section-title text-xl">Кард боёв</h2>
        {eventFights.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Бои не найдены</p>
        ) : (
          <div className="mt-4 space-y-4">
            {eventFights.map((fight) => (
              <div key={fight.id} className="rounded-lg border bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-right">
                    <Link to={`/fighters/${fight.fighter1Id}`} className={`font-display font-bold transition-colors hover:text-accent ${fight.winnerId === fight.fighter1Id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {fight.fighter1Name}
                    </Link>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="rounded-md bg-primary px-3 py-1 font-display text-xs font-bold text-primary-foreground">{fight.method}</span>
                    <span className="mt-1 text-xs text-muted-foreground">R{fight.rounds}/{fight.scheduledRounds}</span>
                  </div>
                  <div className="flex-1">
                    <Link to={`/fighters/${fight.fighter2Id}`} className={`font-display font-bold transition-colors hover:text-accent ${fight.winnerId === fight.fighter2Id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {fight.fighter2Name}
                    </Link>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">{fight.weightClass}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventDetail;
