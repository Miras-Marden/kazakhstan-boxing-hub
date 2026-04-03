import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Trash2, Users, Swords, Calendar, Newspaper } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { normalizeWinnerId } from '@/lib/fightLogic';

const Admin = () => {
  useDocumentTitle('Панель управления');
  const { user, isAdmin, isEditor, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || (!isAdmin && !isEditor))) {
      navigate('/');
      toast({ title: 'Доступ запрещён', variant: 'destructive' });
    }
  }, [user, isAdmin, isEditor, loading, navigate]);

  if (loading || !user || (!isAdmin && !isEditor)) return null;

  return (
    <Layout>
      <div className="navy-gradient text-primary-foreground py-8">
        <div className="container">
          <h1 className="font-display text-3xl font-bold">Панель управления</h1>
          <p className="mt-1 text-primary-foreground/70">{isAdmin ? 'Администратор' : 'Редактор'}</p>
        </div>
      </div>
      <div className="container py-8">
        <Tabs defaultValue="fighters">
          <TabsList className="flex flex-wrap gap-1">
            <TabsTrigger value="fighters" className="gap-1"><Users className="h-4 w-4" />Боксёры</TabsTrigger>
            <TabsTrigger value="fights" className="gap-1"><Swords className="h-4 w-4" />Бои</TabsTrigger>
            <TabsTrigger value="events" className="gap-1"><Calendar className="h-4 w-4" />События</TabsTrigger>
            <TabsTrigger value="news" className="gap-1"><Newspaper className="h-4 w-4" />Новости</TabsTrigger>
            {isAdmin && <TabsTrigger value="users" className="gap-1"><Users className="h-4 w-4" />Пользователи</TabsTrigger>}
          </TabsList>
          <TabsContent value="fighters"><FighterManager /></TabsContent>
          <TabsContent value="fights"><FightManager /></TabsContent>
          <TabsContent value="events"><EventManager /></TabsContent>
          <TabsContent value="news"><NewsManager /></TabsContent>
          {isAdmin && <TabsContent value="users"><UserManager /></TabsContent>}
        </Tabs>
      </div>
    </Layout>
  );
};

const FighterManager = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [fighters, setFighters] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', name_en: '', city: '', nationality: 'Казахстан', stance: 'Правша', weight_class: '', status: 'active', bio: '', date_of_birth: '' });

  const load = async () => {
    const { data } = await supabase.from('fighters').select('*').order('rating', { ascending: false });
    setFighters(data || []);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zа-яё0-9-]/gi, '');
    const payload: any = { ...form, slug };
    if (!payload.date_of_birth) delete payload.date_of_birth;
    const { error } = editingId
      ? await supabase.from('fighters').update(payload).eq('id', editingId)
      : await supabase.from('fighters').insert(payload);
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else {
      toast({ title: editingId ? 'Боксёр обновлён' : 'Боксёр добавлен' });
      setShowForm(false);
      setEditingId(null);
      setForm({ name: '', name_en: '', city: '', nationality: 'Казахстан', stance: 'Правша', weight_class: '', status: 'active', bio: '', date_of_birth: '' });
      load();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('fighters').delete().eq('id', id);
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Удалено' }); load(); }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Управление боксёрами</h2>
        <Button onClick={() => { setShowForm(!showForm); if (showForm) setEditingId(null); }} size="sm"><Plus className="mr-1 h-4 w-4" />Добавить</Button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 rounded-lg border bg-card p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Имя (рус)</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Имя (англ)</Label><Input value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} /></div>
            <div className="space-y-2"><Label>Дата рождения</Label><Input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} /></div>
            <div className="space-y-2"><Label>Город</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
            <div className="space-y-2"><Label>Категория</Label><Input value={form.weight_class} onChange={e => setForm({ ...form, weight_class: e.target.value })} /></div>
            <div className="space-y-2"><Label>Стойка</Label>
              <Select value={form.stance} onValueChange={v => setForm({ ...form, stance: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Правша">Правша</SelectItem><SelectItem value="Левша">Левша</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Статус</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Активен</SelectItem><SelectItem value="inactive">Неактивен</SelectItem><SelectItem value="retired">Завершил</SelectItem></SelectContent></Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Биография</Label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
          <Button type="submit"><Save className="mr-1 h-4 w-4" />{editingId ? 'Обновить' : 'Сохранить'}</Button>
        </form>
      )}
      <div className="mt-4 overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-secondary">
              <th className="px-4 py-3 text-left">Имя</th><th className="hidden md:table-cell px-4 py-3 text-left">Категория</th><th className="px-4 py-3 text-center">Рекорд</th><th className="px-4 py-3 text-right">Рейтинг</th><th className="px-4 py-3"></th>
            </tr></thead>
            <tbody>
              {fighters.map(f => (
                <tr key={f.id} className="border-b last:border-0 hover:bg-secondary/50">
                  <td className="px-4 py-3 font-medium text-foreground">{f.name}</td>
                  <td className="hidden md:table-cell px-4 py-3 text-muted-foreground">{f.weight_class}</td>
                  <td className="px-4 py-3 text-center font-mono">{f.wins}-{f.losses}-{f.draws}</td>
                  <td className="px-4 py-3 text-right font-semibold">{f.rating}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(f.id);
                          setForm({
                            name: f.name || '',
                            name_en: f.name_en || '',
                            city: f.city || '',
                            nationality: f.nationality || 'Казахстан',
                            stance: f.stance || 'Правша',
                            weight_class: f.weight_class || '',
                            status: f.status || 'active',
                            bio: f.bio || '',
                            date_of_birth: f.date_of_birth || '',
                          });
                          setShowForm(true);
                        }}
                      >
                        Ред.
                      </Button>
                      {isAdmin && <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FightManager = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [fights, setFights] = useState<any[]>([]);
  const [fighters, setFighters] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFightId, setEditingFightId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fighter1_id: '', fighter2_id: '', event_id: '', date: '', weight_class: '',
    scheduled_rounds: '12', rounds: '', method: '', result: '', winner_id: '',
    referee: '', judge1: '', judge1_score: '', judge2: '', judge2_score: '', judge3: '', judge3_score: '',
    city: '', venue: '', notes: ''
  });

  const load = async () => {
    const [{ data: fData }, { data: fighterData }, { data: eventData }] = await Promise.all([
      supabase.from('fights').select('*, fighter1:fighters!fights_fighter1_id_fkey(name), fighter2:fighters!fights_fighter2_id_fkey(name), event:events!fights_event_id_fkey(name)').order('date', { ascending: false }),
      supabase.from('fighters').select('id, name').order('name'),
      supabase.from('events').select('id, name').order('date', { ascending: false }),
    ]);
    setFights(fData || []);
    setFighters(fighterData || []);
    setEvents(eventData || []);
  };
  useEffect(() => {
    load();

    const channel = supabase
      .channel('admin-fights-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fights' }, () => {
        load();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.fighter1_id && form.fighter1_id === form.fighter2_id) {
      toast({ title: 'Ошибка', description: 'Нельзя выбрать одного и того же боксёра для двух углов.', variant: 'destructive' });
      return;
    }

    const payload: any = {
      fighter1_id: form.fighter1_id || null,
      fighter2_id: form.fighter2_id || null,
      event_id: form.event_id || null,
      date: form.date,
      weight_class: form.weight_class,
      scheduled_rounds: parseInt(form.scheduled_rounds) || 12,
      rounds: parseInt(form.rounds) || null,
      method: form.method || null,
      result: form.result || null,
      winner_id: normalizeWinnerId(form.winner_id),
      referee: form.referee || null,
      judge1: form.judge1 || null, judge1_score: form.judge1_score || null,
      judge2: form.judge2 || null, judge2_score: form.judge2_score || null,
      judge3: form.judge3 || null, judge3_score: form.judge3_score || null,
      city: form.city || null, venue: form.venue || null, notes: form.notes || null,
    };
    const { error } = editingFightId
      ? await supabase.from('fights').update(payload).eq('id', editingFightId)
      : await supabase.from('fights').insert(payload);
    if (error) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
      return;
    }

    const { error: recalcError } = await supabase.rpc('recalculate_rankings');
    if (recalcError) {
      toast({ title: 'Бой добавлен', description: 'Бой сохранён, но пересчёт рейтингов не выполнен автоматически.', variant: 'destructive' });
    } else {
      toast({ title: editingFightId ? 'Бой обновлён' : 'Бой добавлен', description: 'Данные сохранены, рейтинги пересчитаны.' });
    }

    setShowForm(false);
    setEditingFightId(null);
    setForm({
      fighter1_id: '', fighter2_id: '', event_id: '', date: '', weight_class: '',
      scheduled_rounds: '12', rounds: '', method: '', result: '', winner_id: '',
      referee: '', judge1: '', judge1_score: '', judge2: '', judge2_score: '', judge3: '', judge3_score: '',
      city: '', venue: '', notes: ''
    });
    load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('fights').delete().eq('id', id);
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Удалено' }); load(); }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Управление боями</h2>
        <Button onClick={() => { setShowForm(!showForm); if (showForm) setEditingFightId(null); }} size="sm"><Plus className="mr-1 h-4 w-4" />Добавить</Button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 rounded-lg border bg-card p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Боксёр 1 (красный угол)</Label>
              <Select value={form.fighter1_id} onValueChange={v => setForm({ ...form, fighter1_id: v })}><SelectTrigger><SelectValue placeholder="Выберите боксёра" /></SelectTrigger>
                <SelectContent>{fighters.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Боксёр 2 (синий угол)</Label>
              <Select value={form.fighter2_id} onValueChange={v => setForm({ ...form, fighter2_id: v })}><SelectTrigger><SelectValue placeholder="Выберите боксёра" /></SelectTrigger>
                <SelectContent>{fighters.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Событие</Label>
              <Select value={form.event_id} onValueChange={v => setForm({ ...form, event_id: v })}><SelectTrigger><SelectValue placeholder="Выберите событие" /></SelectTrigger>
                <SelectContent>{events.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Дата</Label><Input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div className="space-y-2"><Label>Весовая категория</Label><Input value={form.weight_class} onChange={e => setForm({ ...form, weight_class: e.target.value })} /></div>
            <div className="space-y-2"><Label>Запланировано раундов</Label><Input type="number" value={form.scheduled_rounds} onChange={e => setForm({ ...form, scheduled_rounds: e.target.value })} /></div>
            <div className="space-y-2"><Label>Раундов (результат)</Label><Input type="number" value={form.rounds} onChange={e => setForm({ ...form, rounds: e.target.value })} /></div>
            <div className="space-y-2"><Label>Метод победы</Label>
              <Select value={form.method} onValueChange={v => setForm({ ...form, method: v })}><SelectTrigger><SelectValue placeholder="Метод" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="UD">UD (Единогласное)</SelectItem>
                  <SelectItem value="SD">SD (Раздельное)</SelectItem>
                  <SelectItem value="MD">MD (Большинством)</SelectItem>
                  <SelectItem value="KO">KO</SelectItem>
                  <SelectItem value="TKO">TKO</SelectItem>
                  <SelectItem value="DQ">DQ (Дисквалификация)</SelectItem>
                  <SelectItem value="Draw">Ничья</SelectItem>
                  <SelectItem value="NC">NC (Не состоялся)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Победитель</Label>
              <Select value={form.winner_id} onValueChange={v => setForm({ ...form, winner_id: v })}><SelectTrigger><SelectValue placeholder="Победитель" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Нет (ничья)</SelectItem>
                  {form.fighter1_id && <SelectItem value={form.fighter1_id}>{fighters.find(f => f.id === form.fighter1_id)?.name || 'Боксёр 1'}</SelectItem>}
                  {form.fighter2_id && <SelectItem value={form.fighter2_id}>{fighters.find(f => f.id === form.fighter2_id)?.name || 'Боксёр 2'}</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Город</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
            <div className="space-y-2"><Label>Площадка</Label><Input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Рефери</Label><Input value={form.referee} onChange={e => setForm({ ...form, referee: e.target.value })} /></div>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Судьи</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1"><Label className="text-xs">Судья 1</Label><Input value={form.judge1} onChange={e => setForm({ ...form, judge1: e.target.value })} placeholder="Имя" /><Input value={form.judge1_score} onChange={e => setForm({ ...form, judge1_score: e.target.value })} placeholder="Счёт" /></div>
            <div className="space-y-1"><Label className="text-xs">Судья 2</Label><Input value={form.judge2} onChange={e => setForm({ ...form, judge2: e.target.value })} placeholder="Имя" /><Input value={form.judge2_score} onChange={e => setForm({ ...form, judge2_score: e.target.value })} placeholder="Счёт" /></div>
            <div className="space-y-1"><Label className="text-xs">Судья 3</Label><Input value={form.judge3} onChange={e => setForm({ ...form, judge3: e.target.value })} placeholder="Имя" /><Input value={form.judge3_score} onChange={e => setForm({ ...form, judge3_score: e.target.value })} placeholder="Счёт" /></div>
          </div>
          <div className="space-y-2"><Label>Заметки</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
          <Button type="submit"><Save className="mr-1 h-4 w-4" />{editingFightId ? 'Обновить' : 'Сохранить'}</Button>
        </form>
      )}
      <div className="mt-4 space-y-3">
        {fights.map(f => (
          <div key={f.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div>
              <p className="text-xs text-muted-foreground">{new Date(f.date).toLocaleDateString('ru-RU')} · {f.event?.name}</p>
              <p className="mt-1 font-display font-bold text-foreground">{f.fighter1?.name} vs {f.fighter2?.name}</p>
              <p className="text-sm text-muted-foreground">{f.method} · {f.weight_class}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingFightId(f.id);
                  setForm({
                    fighter1_id: f.fighter1_id || '',
                    fighter2_id: f.fighter2_id || '',
                    event_id: f.event_id || '',
                    date: f.date || '',
                    weight_class: f.weight_class || '',
                    scheduled_rounds: String(f.scheduled_rounds || 12),
                    rounds: f.rounds ? String(f.rounds) : '',
                    method: f.method || '',
                    result: f.result || '',
                    winner_id: f.winner_id || '',
                    referee: f.referee || '',
                    judge1: f.judge1 || '',
                    judge1_score: f.judge1_score || '',
                    judge2: f.judge2 || '',
                    judge2_score: f.judge2_score || '',
                    judge3: f.judge3 || '',
                    judge3_score: f.judge3_score || '',
                    city: f.city || '',
                    venue: f.venue || '',
                    notes: f.notes || '',
                  });
                  setShowForm(true);
                }}
              >
                Ред.
              </Button>
              {isAdmin && <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
            </div>
          </div>
        ))}
        {fights.length === 0 && <p className="text-muted-foreground">Нет боёв</p>}
      </div>
    </div>
  );
};

const EventManager = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', city: '', venue: '', status: 'upcoming', description: '' });

  const load = async () => {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: false });
    setEvents(data || []);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '');
    const { error } = await supabase.from('events').insert({ ...form, slug });
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Событие добавлено' }); setShowForm(false); load(); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Удалено' }); load(); }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Управление событиями</h2>
        <Button onClick={() => setShowForm(!showForm)} size="sm"><Plus className="mr-1 h-4 w-4" />Добавить</Button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 rounded-lg border bg-card p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Название</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Дата</Label><Input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div className="space-y-2"><Label>Город</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
            <div className="space-y-2"><Label>Площадка</Label><Input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Описание</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          <Button type="submit"><Save className="mr-1 h-4 w-4" />Сохранить</Button>
        </form>
      )}
      <div className="mt-4 space-y-3">
        {events.map(e => (
          <div key={e.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div><p className="font-display font-bold text-foreground">{e.name}</p><p className="text-sm text-muted-foreground">{new Date(e.date).toLocaleDateString('ru-RU')} · {e.city}</p></div>
            <div className="flex items-center gap-2">
              <Badge variant={e.status === 'upcoming' ? 'default' : 'secondary'}>{e.status === 'upcoming' ? 'Предстоящее' : e.status === 'completed' ? 'Завершено' : 'Отменено'}</Badge>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewsManager = () => {
  const { toast } = useToast();
  const [newsList, setNewsList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: '', status: 'draft', featured: false });
  const { user } = useAuth();

  const load = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    setNewsList(data || []);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zа-яё0-9-]/gi, '');
    const { error } = await supabase.from('news').insert({
      ...form, slug, author_id: user?.id,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    });
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Новость добавлена' }); setShowForm(false); load(); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Удалено' }); load(); }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Управление новостями</h2>
        <Button onClick={() => setShowForm(!showForm)} size="sm"><Plus className="mr-1 h-4 w-4" />Добавить</Button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 rounded-lg border bg-card p-6 space-y-4">
          <div className="space-y-2"><Label>Заголовок</Label><Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div className="space-y-2"><Label>Краткое описание</Label><Input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></div>
          <div className="space-y-2"><Label>Контент</Label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Категория</Label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Результаты, Анонсы..." /></div>
            <div className="space-y-2"><Label>Статус</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Черновик</SelectItem><SelectItem value="published">Опубликовано</SelectItem></SelectContent></Select>
            </div>
          </div>
          <Button type="submit"><Save className="mr-1 h-4 w-4" />Сохранить</Button>
        </form>
      )}
      <div className="mt-4 space-y-3">
        {newsList.map(n => (
          <div key={n.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div><p className="font-display font-bold text-foreground">{n.title}</p><p className="text-sm text-muted-foreground">{n.category} · {new Date(n.created_at).toLocaleDateString('ru-RU')}</p></div>
            <div className="flex items-center gap-2">
              <Badge variant={n.status === 'published' ? 'default' : 'secondary'}>{n.status === 'published' ? 'Опубликовано' : 'Черновик'}</Badge>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserManager = () => {
  const [profiles, setProfiles] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*, user_roles(role)');
    setProfiles(data || []);
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="mt-6">
      <h2 className="font-display text-xl font-bold text-foreground">Пользователи</h2>
      <div className="mt-4 overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-secondary">
              <th className="px-4 py-3 text-left">Имя</th><th className="px-4 py-3 text-left">Роли</th>
            </tr></thead>
            <tbody>
              {profiles.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/50">
                  <td className="px-4 py-3 font-medium text-foreground">{p.full_name || 'Не указано'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {(p.user_roles || []).map((r: any) => (
                        <Badge key={r.role} variant="secondary">{r.role}</Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
