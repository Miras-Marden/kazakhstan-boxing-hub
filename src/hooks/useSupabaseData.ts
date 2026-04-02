import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseQuery<T>(
  table: string,
  options?: {
    select?: string;
    order?: { column: string; ascending?: boolean };
    filters?: Array<{ column: string; op: string; value: any }>;
    eq?: Record<string, any>;
    limit?: number;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    let query = (supabase.from(table) as any).select(options?.select || '*');

    if (options?.eq) {
      Object.entries(options.eq).forEach(([col, val]) => {
        query = query.eq(col, val);
      });
    }

    if (options?.filters) {
      options.filters.forEach(f => {
        if (f.op === 'eq') query = query.eq(f.column, f.value);
        else if (f.op === 'ilike') query = query.ilike(f.column, f.value);
        else if (f.op === 'in') query = query.in(f.column, f.value);
      });
    }

    if (options?.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data: result, error: err } = await query;
    setData(result || []);
    setError(err?.message || null);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [table, JSON.stringify(options)]);

  return { data, loading, error, refetch: fetchData };
}
