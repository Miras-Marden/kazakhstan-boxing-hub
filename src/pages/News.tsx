import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { news } from '@/data/mockData';

const News = () => {
  const [category, setCategory] = useState('all');
  const categories = ['all', ...Array.from(new Set(news.map(n => n.category)))];

  const filtered = useMemo(() => {
    return news
      .filter(n => category === 'all' || n.category === category)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [category]);

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

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {filtered.map((article) => (
            <article key={article.id} className="group rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md hover:border-accent">
              <div className="p-6">
                <div className="flex items-center gap-2">
                  {article.featured && (
                    <span className="rounded-full gold-gradient px-2.5 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">Featured</span>
                  )}
                  <span className="text-xs text-muted-foreground">{article.category}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-xl font-bold text-foreground group-hover:text-accent transition-colors">{article.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default News;
