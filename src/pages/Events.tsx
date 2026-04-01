import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { events } from '@/data/mockData';
import { Calendar, MapPin, Swords } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Events = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return events
      .filter(e => statusFilter === 'all' || e.status === statusFilter)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [statusFilter]);

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
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">События</h1>
        <p className="mt-2 text-muted-foreground">Турниры и боксёрские вечера</p>

        <div className="mt-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="upcoming">Предстоящие</SelectItem>
              <SelectItem value="completed">Завершённые</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`} className="group rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:border-accent">
              <div className="flex items-center justify-between">
                <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'} className={event.status === 'upcoming' ? 'gold-gradient text-accent-foreground border-0' : ''}>
                  {statusLabel(event.status)}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Swords className="h-3.5 w-3.5" />
                  {event.fightCount} боёв
                </div>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-foreground group-hover:text-accent transition-colors">{event.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.venue}, {event.city}</p>
              </div>
              {event.description && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{event.description}</p>}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Events;
