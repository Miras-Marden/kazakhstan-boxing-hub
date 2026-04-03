import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, MapPin, Swords } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [fights, setFights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: ev }, { data: fightData }] = await Promise.all([
        supabase.from('events' as any).select('*').eq('id', id).single(),
        supabase.from('fights' as any).select('*, fighter1:fighters!fights_fighter1_id_fkey(id, name), fighter2:fighters!fights_fighter2_id_fkey(id, name)').eq('event_id', id),
      ]);
      setEvent(ev);
      setFights(fightData || []);
      setLoading(false);
    };
    load();
  }, [id]);

  useDocumentTitle(
    event?.name || 'Событие',
    event ? `${event.name} — кард, дата и результаты боёв` : 'Детали боксёрского события',
  );

  if (loading) return <Layout><div className="container py-16"><Skeleton className="h-64 w-full" /></div></Layout>;
  if (!event) return (
    <Layout><div className="container py-16 text-center"><p className="text-muted-foreground">Событие не найдено</p><Link to="/events" className="mt-4 inline-block text-accent hover:underline">← К списку</Link></div></Layout>
  );

  const statusLabel = (s: string) => { switch (s) { case 'upcoming': return 'Предстоящее'; case 'completed': return 'Завершено'; case 'cancelled': return 'Отменено'; default: return s; } };

  return (
    <Layout>
      <div className="navy-gradient text-primary-foreground py-10">
        <div className="container">
          <Link to="/events" className="inline-flex items-center gap-1 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"><ArrowLeft className="h-4 w-4" /> События</Link>
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold md:text-4xl">{event.name}</h1>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.venue}, {event.city}</span>
                <span className="flex items-center gap-1"><Swords className="h-3.5 w-3.5" />{event.fight_count} боёв</span>
              </div>
            </div>
            <Badge className={event.status === 'upcoming' ? 'gold-gradient text-accent-foreground border-0' : 'bg-primary-foreground/10 text-primary-foreground border-0'}>{statusLabel(event.status)}</Badge>
          </div>
        </div>
      </div>
      <div className="container py-8">
        {event.description && <p className="text-muted-foreground mb-8">{event.description}</p>}
        <h2 className="section-title text-xl">Кард боёв</h2>
        {fights.length === 0 ? <p className="mt-4 text-muted-foreground">Бои не найдены</p> : (
          <div className="mt-4 space-y-4">
            {fights.map((fight: any) => (
              <div key={fight.id} className="rounded-lg border bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-right">
                    <Link to={`/fighters/${fight.fighter1?.id}`} className={`font-display font-bold transition-colors hover:text-accent ${fight.winner_id === fight.fighter1?.id ? 'text-foreground' : 'text-muted-foreground'}`}>{fight.fighter1?.name}</Link>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="rounded-md bg-primary px-3 py-1 font-display text-xs font-bold text-primary-foreground">{fight.method}</span>
                    <span className="mt-1 text-xs text-muted-foreground">R{fight.rounds}/{fight.scheduled_rounds}</span>
                  </div>
                  <div className="flex-1">
                    <Link to={`/fighters/${fight.fighter2?.id}`} className={`font-display font-bold transition-colors hover:text-accent ${fight.winner_id === fight.fighter2?.id ? 'text-foreground' : 'text-muted-foreground'}`}>{fight.fighter2?.name}</Link>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">{fight.weight_class}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventDetail;
