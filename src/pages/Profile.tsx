import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, Shield, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const Profile = () => {
  useDocumentTitle('Профиль');
  const { user, profile, roles, isAdmin, isEditor, signOut, refreshProfile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favFighters, setFavFighters] = useState<any[]>([]);
  const [favFights, setFavFights] = useState<any[]>([]);
  const [favNews, setFavNews] = useState<any[]>([]);
  const [favEvents, setFavEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
      setPhone(profile.phone || '');
      setCity(profile.city || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const loadFavorites = async () => {
      const { data } = await supabase.from('favorites' as any).select('*').eq('user_id', user.id);
      setFavorites(data || []);
      const fighterIds = (data || []).filter((f: any) => f.item_type === 'fighter').map((f: any) => f.item_id);
      if (fighterIds.length > 0) {
        const { data: fighters } = await supabase.from('fighters' as any).select('id, name, weight_class, wins, losses, draws').in('id', fighterIds);
        setFavFighters(fighters || []);
      } else {
        setFavFighters([]);
      }

      const fightIds = (data || []).filter((f: any) => f.item_type === 'fight').map((f: any) => f.item_id);
      if (fightIds.length > 0) {
        const { data: fights } = await supabase
          .from('fights' as any)
          .select('id, date, method, fighter1:fighters!fights_fighter1_id_fkey(id, name), fighter2:fighters!fights_fighter2_id_fkey(id, name)')
          .in('id', fightIds)
          .order('date', { ascending: false });
        setFavFights(fights || []);
      } else {
        setFavFights([]);
      }

      const newsIds = (data || []).filter((f: any) => f.item_type === 'news').map((f: any) => f.item_id);
      if (newsIds.length > 0) {
        const { data: news } = await supabase.from('news' as any).select('id, title, category, published_at, created_at').in('id', newsIds);
        setFavNews(news || []);
      } else {
        setFavNews([]);
      }

      const eventIds = (data || []).filter((f: any) => f.item_type === 'event').map((f: any) => f.item_id);
      if (eventIds.length > 0) {
        const { data: events } = await supabase.from('events' as any).select('id, name, city, date').in('id', eventIds).order('date', { ascending: false });
        setFavEvents(events || []);
      } else {
        setFavEvents([]);
      }
    };

    loadFavorites();

    const channel = supabase
      .channel(`profile-favorites-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'favorites', filter: `user_id=eq.${user.id}` }, () => {
        loadFavorites();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      avatar_url: avatarUrl || null,
      phone,
      city,
      bio: bio || null,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);

    let emailError: Error | null = null;
    let metaError: Error | null = null;
    if (email && email !== user.email) {
      const { error: authError } = await supabase.auth.updateUser({ email });
      if (authError) emailError = authError;
    }
    const { error: nameMetaErr } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    if (nameMetaErr) metaError = nameMetaErr;

    setSaving(false);
    if (error || emailError || metaError) {
      toast({
        title: 'Ошибка',
        description: error?.message || emailError?.message || metaError?.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Профиль обновлён',
        description: 'Если вы изменили email, подтвердите новый адрес в почте.',
      });
      await refreshProfile();
    }
  };

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  if (loading || !user) return null;

  const roleLabels: Record<string, string> = { admin: 'Администратор', editor: 'Редактор', user: 'Пользователь' };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-bold text-foreground">Профиль</h1>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Выйти
            </Button>
          </div>

          <div className="mt-6 rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile?.full_name || 'Профиль'} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-display text-lg font-bold text-foreground">{profile?.full_name || 'Не указано'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-1 flex gap-1 flex-wrap">
                  {roles.map(role => (
                    <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'} className={role === 'admin' ? 'gold-gradient text-accent-foreground border-0' : ''}>
                      <Shield className="mr-1 h-3 w-3" />
                      {roleLabels[role] || role}
                    </Badge>
                  ))}
                </div>
                {profile?.bio ? (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                ) : null}
              </div>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Полное имя</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Иван Иванов" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label>Фото (URL)</Label>
                <Input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Телефон</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 777 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label>Город</Label>
                  <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Алматы" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>О себе</Label>
                <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Краткая биография или заметки (видны только вам в профиле)" rows={4} className="resize-y min-h-[100px]" />
              </div>
              <Button type="submit" className="gold-gradient text-accent-foreground border-0" disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </form>
          </div>

          {favFighters.length > 0 && (
            <div className="mt-6 rounded-lg border bg-card p-6">
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2"><Heart className="h-5 w-5 text-accent" /> Избранные боксёры</h2>
              <div className="mt-4 space-y-2">
                {favFighters.map(f => (
                  <Link key={f.id} to={`/fighters/${f.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:border-accent transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.weight_class}</p>
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">{f.wins}-{f.losses}-{f.draws}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {favFights.length > 0 && (
            <div className="mt-6 rounded-lg border bg-card p-6">
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2"><Heart className="h-5 w-5 text-accent" /> Избранные бои</h2>
              <div className="mt-4 space-y-2">
                {favFights.map(f => (
                  <Link key={f.id} to="/fights" className="flex items-center justify-between rounded-lg border p-3 hover:border-accent transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{f.fighter1?.name} vs {f.fighter2?.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(f.date).toLocaleDateString('ru-RU')} · {f.method || 'N/A'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {favEvents.length > 0 && (
            <div className="mt-6 rounded-lg border bg-card p-6">
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2"><Heart className="h-5 w-5 text-accent" /> Избранные события</h2>
              <div className="mt-4 space-y-2">
                {favEvents.map(e => (
                  <Link key={e.id} to={`/events/${e.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:border-accent transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString('ru-RU')} · {e.city || 'Казахстан'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {favNews.length > 0 && (
            <div className="mt-6 rounded-lg border bg-card p-6">
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2"><Heart className="h-5 w-5 text-accent" /> Избранные новости</h2>
              <div className="mt-4 space-y-2">
                {favNews.map(n => (
                  <Link key={n.id} to="/news" className="flex items-center justify-between rounded-lg border p-3 hover:border-accent transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.category || 'Новости'} · {new Date(n.published_at || n.created_at).toLocaleDateString('ru-RU')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(isAdmin || isEditor) && (
            <div className="mt-6 rounded-lg border bg-card p-6">
              <h2 className="font-display text-lg font-bold text-foreground">Панель управления</h2>
              <p className="mt-1 text-sm text-muted-foreground">У вас есть права {isAdmin ? 'администратора' : 'редактора'}</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/admin')}>
                Перейти в админ-панель
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
