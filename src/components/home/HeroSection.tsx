import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const HeroSection = () => (
  <section className="relative overflow-hidden navy-gradient text-primary-foreground">
    {/* Background logo placeholder */}
    <div className="absolute inset-0 flex items-center justify-center opacity-5">
      <div className="h-[500px] w-[500px] rounded-full border-[40px] border-current" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/30" />

    <div className="container relative z-10 py-20 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
          KPBF <span className="text-accent">REC</span>
        </h1>
        <p className="mt-4 text-lg text-primary-foreground/80 md:text-xl">
          Онлайн-база данных казахстанского профессионального бокса
        </p>
        <p className="mt-2 text-sm text-primary-foreground/60">
          Боксёры · Рейтинги · Поединки · События · Новости
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/fighters">
            <Button className="gold-gradient text-accent-foreground font-semibold px-6 border-0">Боксёры</Button>
          </Link>
          <Link to="/rankings">
            <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">Рейтинги</Button>
          </Link>
          <Link to="/events">
            <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">События</Button>
          </Link>
          <Link to="/news">
            <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">Новости</Button>
          </Link>
        </div>

        <div className="mt-8">
          <Link to="/search" className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-5 py-2.5 text-sm text-primary-foreground/70 transition-colors hover:bg-primary-foreground/20">
            <Search className="h-4 w-4" />
            Поиск боксёров, боёв, событий...
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
