import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Trash2, Users, Swords, Calendar, Newspaper, Trophy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Admin = () => {
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

// --- Fighter Manager ---
const FighterManager = () => {
  const { toast } = useToast();
  const [fighters, setFighters] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', name_en: '', city: '', nationality: 'Казахстан', stance: 'Правша', weight_class: '', status: 'active', bio: '' });

  const load = async () => {
    const { data } = await supabase.from('fighters').select('*').order('rating', { ascending: false });
    setFighters(data || []);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zа-яё0-9-]/gi, '');
    const { error } = await supabase.from('fighters').insert({ ...form, slug });
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Боксёр добавлен' }); setShowForm(false); setForm({ name: '', name_en: '', city: '', nationality: 'Казахстан', stance: 'Правша', weight_class: '', status: 'active', bio: '' }); load(); }
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
        <Button onClick={() => setShowForm(!showForm)} size="sm"><Plus className="mr-1 h-4 w-4" />Добавить</Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 rounded-lg border bg-card p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Имя (рус)</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Имя (англ)</Label><Input value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} /></div>
            <div className="space-y-2"><Label>Город</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
            <div className="space-y-2"><Label>Категория</Label><Input value={form.weight_class} onChange={e => setForm({ ...form, weight_class: e.target.value })} /></div>
            <div className="space-y-2"><Label>Стойка</Label>
              <Select value={form.stance} onValueChange={v => setForm({ ...form, stance: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Правша">Правша</SelectItem><SelectItem value="Левша">Левша</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Статус</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Активен</SelectItem><SelectItem value="inactive">Неактивен</SelectItem><SelectItem value="retired">Завершил</SelectItem></SelectContent></Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Биография</Label><Input value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
          <Button type="submit"><Save className="mr-1 h-4 w-4" />Сохранить</Button>
        </form>
      )}

      <div className="mt-4 overflow-hidden rounded-lg border bg-card">
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
                <td className="px-4 py-3 text-right"><Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Fight Manager ---
const FightManager = () => {
  const { toast } = useToast();
  const [fights, setFights] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from('fights').select('*, fighter1:fighters!fights_fighter1_id_fkey(name), fighter2:fighters!fights_fighter2_id_fkey(name), event:events!fights_event_id_fkey(name)').order('date', { ascending: false });
    setFights(data || []);
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="mt-6">
      <h2 className="font-display text-xl font-bold text-foreground">Управление боями</h2>
      <div className="mt-4 space-y-3">
        {fights.map(f => (
          <div key={f.id} className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">{new Date(f.date).toLocaleDateString('ru-RU')} · {f.event?.name}</p>
            <p className="mt-1 font-display font-bold text-foreground">{f.fighter1?.name} vs {f.fighter2?.name}</p>
            <p className="text-sm text-muted-foreground">{f.method} · {f.weight_class}</p>
          </div>
        ))}
        {fights.length === 0 && <p className="text-muted-foreground">Нет боёв</p>}
      </div>
    </div>
  );
};

// --- Event Manager ---
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
          <div className="space-y-2"><Label>Описание</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <Button type="submit"><Save className="mr-1 h-4 w-4" />Сохранить</Button>
        </form>
      )}
      <div className="mt-4 space-y-3">
        {events.map(e => (
          <div key={e.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div><p className="font-display font-bold text-foreground">{e.name}</p><p className="text-sm text-muted-foreground">{new Date(e.date).toLocaleDateString('ru-RU')} · {e.city}</p></div>
            <Badge variant={e.status === 'upcoming' ? 'default' : 'secondary'}>{e.status === 'upcoming' ? 'Предстоящее' : e.status === 'completed' ? 'Завершено' : 'Отменено'}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- News Manager ---
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
      ...form,
      slug,
      author_id: user?.id,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    });
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Новость добавлена' }); setShowForm(false); load(); }
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
          <div className="space-y-2"><Label>Контент</Label><Input value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
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
            <Badge variant={n.status === 'published' ? 'default' : 'secondary'}>{n.status === 'published' ? 'Опубликовано' : 'Черновик'}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- User Manager (admin only) ---
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
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary">
            <th className="px-4 py-3 text-left">Имя</th><th className="px-4 py-3 text-left">Роли</th>
          </tr></thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/50">
                <td className="px-4 py-3 font-medium text-foreground">{p.full_name || 'Не указано'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
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
  );
};

export default Admin;
