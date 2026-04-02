import { useEffect, useState } from 'react';
import { Users, Swords, Trophy, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const StatsCards = () => {
  const [stats, setStats] = useState({ fighters: 0, fights: 0, weightClasses: 0, upcoming: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ count: f }, { count: fi }, { count: wc }, { count: ev }] = await Promise.all([
        supabase.from('fighters' as any).select('*', { count: 'exact', head: true }),
        supabase.from('fights' as any).select('*', { count: 'exact', head: true }),
        supabase.from('weight_classes' as any).select('*', { count: 'exact', head: true }),
        supabase.from('events' as any).select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
      ]);
      setStats({ fighters: f || 0, fights: fi || 0, weightClasses: wc || 0, upcoming: ev || 0 });
    };
    load();
  }, []);

  const items = [
    { label: 'Боксёров', value: stats.fighters, icon: Users },
    { label: 'Поединков', value: stats.fights, icon: Swords },
    { label: 'Весовых категорий', value: stats.weightClasses, icon: Trophy },
    { label: 'Событий', value: stats.upcoming, icon: Calendar },
  ];

  return (
    <section className="container -mt-8 relative z-20">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((stat) => (
          <div key={stat.label} className="stat-card text-center">
            <stat.icon className="mx-auto h-6 w-6 text-accent" />
            <p className="mt-2 font-display text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsCards;
