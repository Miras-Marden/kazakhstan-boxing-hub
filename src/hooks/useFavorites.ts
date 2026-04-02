import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useFavorites(itemType: 'fighter' | 'fight' | 'news' | 'event') {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setFavorites([]); return; }
    const { data } = await supabase
      .from('favorites' as any)
      .select('item_id')
      .eq('user_id', user.id)
      .eq('item_type', itemType);
    setFavorites((data || []).map((f: any) => f.item_id));
  }, [user, itemType]);

  useEffect(() => { load(); }, [load]);

  const toggle = useCallback(async (itemId: string) => {
    if (!user) {
      toast({ title: 'Войдите в аккаунт', description: 'Чтобы добавить в избранное, необходимо авторизоваться.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const isFav = favorites.includes(itemId);
    if (isFav) {
      await supabase.from('favorites' as any).delete().eq('user_id', user.id).eq('item_type', itemType).eq('item_id', itemId);
      setFavorites(prev => prev.filter(id => id !== itemId));
    } else {
      await supabase.from('favorites' as any).insert({ user_id: user.id, item_type: itemType, item_id: itemId });
      setFavorites(prev => [...prev, itemId]);
    }
    setLoading(false);
  }, [user, favorites, itemType, toast]);

  const isFavorite = useCallback((itemId: string) => favorites.includes(itemId), [favorites]);

  return { favorites, toggle, isFavorite, loading };
}
