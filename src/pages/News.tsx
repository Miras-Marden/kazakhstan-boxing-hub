import { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const News = () => {
  useDocumentTitle('Новости', 'Последние новости казахстанского бокса');
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('news' as any).select('*').eq('status', 'published').order('published_at', { ascending: false });
      setNewsList(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const categories = ['all', ...Array.from(new Set(newsList.map((n: any) => n.category).filter(Boolean)))];

  const filtered = useMemo(() => {
    return newsList.filter((n: any) => category === 'all' || n.category === category);
  }, [category, newsList]);

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Новости</h1>
        <p className="mt-2 text-muted-foreground">Последние новости казахстанского бокса</p>

        <div className="mt-6 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              {cat === 'all' ? 'Все' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-40" />)}</div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {filtered.map((article: any) => (
              <article key={article.id} className="group rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md hover:border-accent">
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    {article.featured && (
                      <span className="rounded-full gold-gradient px-2.5 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">Featured</span>
                    )}
                    <span className="text-xs text-muted-foreground">{article.category}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {article.published_at && new Date(article.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-bold text-foreground group-hover:text-accent transition-colors">{article.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                  {article.tags && article.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {article.tags.map((tag: string) => (
                        <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
            {filtered.length === 0 && <p className="col-span-2 py-8 text-center text-muted-foreground">Нет новостей</p>}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default News;
