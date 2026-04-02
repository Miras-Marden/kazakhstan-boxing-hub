import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const LatestNews = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('news' as any).select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(4);
      setNews(data || []);
    };
    load();
  }, []);

  return (
    <section className="container py-12">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Последние новости</h2>
        <Link to="/news" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">Все новости <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {news.map((article: any) => (
          <div key={article.id} className="group rounded-lg border bg-card p-5 transition-all hover:shadow-md hover:border-accent">
            <div className="flex items-center gap-2">
              {article.featured && <span className="rounded-full gold-gradient px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">Featured</span>}
              <span className="text-xs text-muted-foreground">{article.category}</span>
            </div>
            <h3 className="mt-2 font-display text-lg font-bold text-foreground group-hover:text-accent transition-colors">{article.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
            <p className="mt-3 text-xs text-muted-foreground">{article.published_at && new Date(article.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestNews;
