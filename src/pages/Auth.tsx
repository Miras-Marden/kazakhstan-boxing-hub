import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    setLoading(false);
    if (error) {
      toast({ title: 'Ошибка входа', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Добро пожаловать!' });
      navigate('/');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: { data: { full_name: regName } },
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Ошибка регистрации', description: error.message, variant: 'destructive' });
    } else if (data.session) {
      toast({ title: 'Регистрация успешна', description: 'Добро пожаловать в KPBF REC.' });
      navigate('/profile');
    } else {
      toast({ title: 'Регистрация успешна', description: 'Проверьте почту для подтверждения email.' });
    }
  };

  return (
    <Layout>
      <div className="container flex items-center justify-center py-16">
        <div className="w-full max-w-md rounded-lg border bg-card p-8">
          <h1 className="font-display text-2xl font-bold text-foreground text-center">KPBF <span className="text-accent">REC</span></h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Войдите или создайте аккаунт</p>

          <Tabs defaultValue="login" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Пароль</Label>
                  <Input id="login-password" type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full gold-gradient text-accent-foreground border-0" disabled={loading}>
                  {loading ? 'Вход...' : 'Войти'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Полное имя</Label>
                  <Input id="reg-name" required value={regName} onChange={e => setRegName(e.target.value)} placeholder="Иван Иванов" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Пароль</Label>
                  <Input id="reg-password" type="password" required minLength={6} value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Минимум 6 символов" />
                </div>
                <Button type="submit" className="w-full gold-gradient text-accent-foreground border-0" disabled={loading}>
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
