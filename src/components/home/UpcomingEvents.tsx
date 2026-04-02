import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const UpcomingEvents = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('events' as any).select('*').eq('status', 'upcoming').order('date').limit(6);
      setEvents(data || []);
    };
    load();
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="bg-secondary/50 py-12">
      <div className="container">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Ближайшие события</h2>
          <Link to="/events" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">Все события <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => (
            <Link key={event.id} to={`/events/${event.id}`} className="group rounded-lg border bg-card p-5 transition-all hover:shadow-md hover:border-accent">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" />{new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <h3 className="mt-2 font-display text-lg font-bold text-foreground group-hover:text-accent transition-colors">{event.name}</h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{event.venue}, {event.city}</div>
              <p className="mt-3 text-sm text-muted-foreground">{event.fight_count} поединков</p>
              {event.description && <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
