import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseQuery<T = any>(
  table: string,
  options?: {
    select?: string;
    order?: { column: string; ascending?: boolean };
    eq?: Record<string, any>;
    limit?: number;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    let query = supabase.from(table as any).select(options?.select || '*');

    if (options?.eq) {
      Object.entries(options.eq).forEach(([col, val]) => {
        query = query.eq(col, val) as any;
      });
    }

    if (options?.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending ?? true }) as any;
    }

    if (options?.limit) {
      query = query.limit(options.limit) as any;
    }

    const { data: result, error: err } = await query;
    setData((result as T[]) || []);
    setError(err?.message || null);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [table, JSON.stringify(options)]);

  return { data, loading, error, refetch: fetchData };
}
