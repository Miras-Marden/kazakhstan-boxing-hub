import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const weightClasses = [
  'Минимальный', 'Наилегчайший', 'Легчайший', 'Суперлегчайший',
  'Полулёгкий', 'Суперполулёгкий', 'Лёгкий', 'Суперлёгкий',
  'Полусредний', 'Суперполусредний', 'Средний', 'Суперсредний',
  'Полутяжёлый', 'Тяжёлый', 'Супертяжёлый'
];

const Fighters = () => {
  const [fighters, setFighters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [weightFilter, setWeightFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('fighters' as any).select('*').order('rating', { ascending: false });
      setFighters(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return fighters.filter((f: any) => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
        (f.name_en && f.name_en.toLowerCase().includes(search.toLowerCase()));
      const matchWeight = weightFilter === 'all' || f.weight_class === weightFilter;
      const matchStatus = statusFilter === 'all' || f.status === statusFilter;
      return matchSearch && matchWeight && matchStatus;
    });
  }, [search, weightFilter, statusFilter, fighters]);

  const statusLabel = (s: string) => {
    switch (s) { case 'active': return 'Активен'; case 'inactive': return 'Неактивен'; case 'retired': return 'Завершил'; default: return s; }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Боксёры</h1>
        <p className="mt-2 text-muted-foreground">База данных казахстанских профессиональных боксёров</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Поиск по имени..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={weightFilter} onValueChange={setWeightFilter}>
            <SelectTrigger className="w-full sm:w-48"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Категория" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {weightClasses.map((wc) => (<SelectItem key={wc} value={wc}>{wc}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Статус" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="inactive">Неактивные</SelectItem>
              <SelectItem value="retired">Завершившие</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="mt-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-lg border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary">
                    <th className="px-4 py-3 text-left font-semibold text-secondary-foreground">Боксёр</th>
                    <th className="hidden px-4 py-3 text-left font-semibold text-secondary-foreground md:table-cell">Город</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary-foreground">Категория</th>
                    <th className="px-4 py-3 text-center font-semibold text-secondary-foreground">Рекорд</th>
                    <th className="hidden px-4 py-3 text-center font-semibold text-secondary-foreground sm:table-cell">KO</th>
                    <th className="px-4 py-3 text-right font-semibold text-secondary-foreground">Рейтинг</th>
                    <th className="hidden px-4 py-3 text-center font-semibold text-secondary-foreground sm:table-cell">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((fighter: any) => (
                    <tr key={fighter.id} className="border-b last:border-0 transition-colors hover:bg-secondary/50">
                      <td className="px-4 py-3">
                        <Link to={`/fighters/${fighter.id}`} className="flex items-center gap-3 font-medium text-foreground hover:text-accent transition-colors">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"><User className="h-4 w-4 text-muted-foreground" /></div>
                          <div><p>{fighter.name}</p>{fighter.name_en && <p className="text-xs text-muted-foreground">{fighter.name_en}</p>}</div>
                        </Link>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{fighter.city}</td>
                      <td className="px-4 py-3 text-muted-foreground">{fighter.weight_class}</td>
                      <td className="px-4 py-3 text-center font-mono text-foreground">{fighter.wins}-{fighter.losses}-{fighter.draws}</td>
                      <td className="hidden px-4 py-3 text-center text-muted-foreground sm:table-cell">{fighter.knockouts}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">{fighter.rating?.toLocaleString()}</td>
                      <td className="hidden px-4 py-3 text-center sm:table-cell">
                        <Badge variant={fighter.status === 'active' ? 'default' : 'secondary'} className={fighter.status === 'active' ? 'gold-gradient text-accent-foreground border-0' : ''}>
                          {statusLabel(fighter.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <p className="py-8 text-center text-muted-foreground">Боксёры не найдены</p>}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Fighters;
