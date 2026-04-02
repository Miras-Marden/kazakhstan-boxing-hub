import { supabase } from '@/integrations/supabase/client';

type Role = 'admin' | 'editor' | 'user';

async function getCurrentUserRoles(): Promise<Role[]> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return [];

  const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
  return (data || []).map((row: any) => row.role as Role);
}

function ensureEditorOrAdmin(roles: Role[]): void {
  if (!roles.includes('admin') && !roles.includes('editor')) {
    throw new Error('Недостаточно прав для изменения данных.');
  }
}

function ensureAdmin(roles: Role[]): void {
  if (!roles.includes('admin')) {
    throw new Error('Требуются права администратора.');
  }
}

export const api = {
  async getFighters() {
    return supabase.from('fighters').select('*').order('rating', { ascending: false });
  },

  async getFights() {
    return supabase.from('fights').select('*').order('date', { ascending: false });
  },

  async getRankings() {
    return supabase.from('rankings').select('*').order('rank', { ascending: true });
  },

  async getNews() {
    return supabase.from('news').select('*').order('published_at', { ascending: false });
  },

  async createFight(payload: Record<string, unknown>) {
    const roles = await getCurrentUserRoles();
    ensureEditorOrAdmin(roles);
    const result = await supabase.from('fights').insert(payload).select().single();
    await supabase.rpc('recalculate_rankings');
    return result;
  },

  async updateFight(id: string, payload: Record<string, unknown>) {
    const roles = await getCurrentUserRoles();
    ensureEditorOrAdmin(roles);
    const result = await supabase.from('fights').update(payload).eq('id', id).select().single();
    await supabase.rpc('recalculate_rankings');
    return result;
  },

  async deleteFight(id: string) {
    const roles = await getCurrentUserRoles();
    ensureAdmin(roles);
    const result = await supabase.from('fights').delete().eq('id', id);
    await supabase.rpc('recalculate_rankings');
    return result;
  },
};
