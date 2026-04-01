import { Users, Swords, Trophy, Calendar } from 'lucide-react';
import { fighters, fights, events, weightClasses } from '@/data/mockData';

const stats = [
  { label: 'Боксёров', value: fighters.length, icon: Users, color: 'text-accent' },
  { label: 'Поединков', value: fights.length, icon: Swords, color: 'text-accent' },
  { label: 'Весовых категорий', value: weightClasses.length, icon: Trophy, color: 'text-accent' },
  { label: 'Событий', value: events.filter(e => e.status === 'upcoming').length, icon: Calendar, color: 'text-accent' },
];

const StatsCards = () => (
  <section className="container -mt-8 relative z-20">
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card text-center">
          <stat.icon className={`mx-auto h-6 w-6 ${stat.color}`} />
          <p className="mt-2 font-display text-3xl font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default StatsCards;
