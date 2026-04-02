import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const { user, profile, roles, isAdmin, isEditor, signOut, refreshProfile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCity(profile.city || '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      phone,
      city,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Профиль обновлён' });
      await refreshProfile();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-foreground">{profile?.full_name || 'Не указано'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-1 flex gap-1">
                  {roles.map(role => (
                    <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'} className={role === 'admin' ? 'gold-gradient text-accent-foreground border-0' : ''}>
                      <Shield className="mr-1 h-3 w-3" />
                      {roleLabels[role] || role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Полное имя</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Иван Иванов" />
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
              <Button type="submit" className="gold-gradient text-accent-foreground border-0" disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </form>
          </div>

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
