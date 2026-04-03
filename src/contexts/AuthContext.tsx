import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'editor' | 'user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: AppRole[];
  isAdmin: boolean;
  isEditor: boolean;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    city: string | null;
    bio: string | null;
  } | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, loading: true, roles: [], isAdmin: false, isEditor: false, profile: null,
  signOut: async () => {}, refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [profile, setProfile] = useState<AuthContextType['profile']>(null);

  const fetchRolesAndProfile = async (userId: string, authUser?: User | null) => {
    const [{ data: rolesData }, profileRes] = await Promise.all([
      supabase.from('user_roles').select('role').eq('user_id', userId),
      supabase.from('profiles').select('full_name, avatar_url, phone, city, bio').eq('id', userId).maybeSingle(),
    ]);
    let profileData = profileRes.data;
    let rolesList = (rolesData || []).map(r => r.role as AppRole);

    if (rolesList.length === 0 && authUser) {
      await supabase.from('user_roles').insert({ user_id: userId, role: 'user' });
      const { data: rolesAgain } = await supabase.from('user_roles').select('role').eq('user_id', userId);
      rolesList = (rolesAgain || []).map(r => r.role as AppRole);
    }

    if (!profileData && authUser) {
      const fallbackName =
        (authUser.user_metadata?.full_name as string | undefined)?.trim() ||
        authUser.email?.split('@')[0] ||
        '';
      const { error: insertError } = await supabase.from('profiles').insert({
        id: userId,
        full_name: fallbackName || null,
      });
      if (!insertError) {
        const { data: created } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, phone, city, bio')
          .eq('id', userId)
          .maybeSingle();
        profileData = created;
      }
    }
    setRoles(rolesList);
    setProfile(profileData || null);
  };

  const refreshProfile = async () => {
    if (user) await fetchRolesAndProfile(user.id, user);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchRolesAndProfile(session.user.id, session.user), 0);
      } else {
        setRoles([]);
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchRolesAndProfile(session.user.id, session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = roles.includes('admin');
  const isEditor = roles.includes('editor') || isAdmin;

  return (
    <AuthContext.Provider value={{ user, session, loading, roles, isAdmin, isEditor, profile, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
