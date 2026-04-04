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
  profile: { full_name: string | null; avatar_url: string | null; phone: string | null; city: string | null } | null;
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

  const fetchRolesAndProfile = async (userId: string) => {
    const [
      { data: rolesData, error: rolesError },
      { data: profileData, error: profileError }
    ] = await Promise.all([
      supabase.from('user_roles').select('role').eq('user_id', userId),
      supabase.from('profiles').select('full_name, avatar_url, phone, city').eq('id', userId).single(),
    ]);
  
    if (rolesError) {
      console.error('fetchRolesAndProfile rolesError:', rolesError);
    }
  
    if (profileError) {
      console.error('fetchRolesAndProfile profileError:', profileError);
    }
  
    setRoles((rolesData || []).map(r => r.role as AppRole));
    setProfile(profileData || null);
  };

  const refreshProfile = async () => {
    if (user) await fetchRolesAndProfile(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchRolesAndProfile(session.user.id), 0);
      } else {
        setRoles([]);
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchRolesAndProfile(session.user.id);
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
