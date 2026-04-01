import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { fighters, fights } from '@/data/mockData';
import { ArrowLeft, User, MapPin, Calendar, Trophy, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FighterDetail = () => {
  const { id } = useParams();
  const fighter = fighters.find(f => f.id === id);
  const fighterFights = fights.filter(f => f.fighter1Id === id || f.fighter2Id === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!fighter) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Боксёр не найден</p>
          <Link to="/fighters" className="mt-4 inline-block text-accent hover:underline">← К списку боксёров</Link>
        </div>
      </Layout>
    );
  }

  const totalFights = fighter.wins + fighter.losses + fighter.draws;
  const koPercent = totalFights > 0 ? Math.round((fighter.knockouts / totalFights) * 100) : 0;
  const winPercent = totalFights > 0 ? Math.round((fighter.wins / totalFights) * 100) : 0;
  const age = Math.floor((Date.now() - new Date(fighter.dateOfBirth).getTime()) / 31557600000);

  const statusLabel = (s: string) => {
    switch (s) {
      case 'active': return 'Активен';
      case 'inactive': return 'Неактивен';
      case 'retired': return 'Завершил карьеру';
      default: return s;
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="navy-gradient text-primary-foreground">
        <div className="container py-8">
          <Link to="/fighters" className="inline-flex items-center gap-1 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Боксёры
          </Link>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/10">
              <User className="h-12 w-12 text-primary-foreground/50" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold md:text-4xl">{fighter.name}</h1>
                <Badge className={fighter.status === 'active' ? 'gold-gradient text-accent-foreground border-0' : 'bg-primary-foreground/10 text-primary-foreground/70 border-0'}>
                  {statusLabel(fighter.status)}
                </Badge>
              </div>
              {fighter.nameEn && <p className="mt-1 text-primary-foreground/60">{fighter.nameEn}</p>}

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{fighter.city}, {fighter.nationality}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{age} лет</span>
                <span>{fighter.stance}</span>
                <span>{fighter.weightClass}</span>
              </div>

              {/* Record */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
                {[
                  { label: 'Победы', value: fighter.wins, accent: true },
                  { label: 'Поражения', value: fighter.losses },
                  { label: 'Ничьи', value: fighter.draws },
                  { label: 'Нокауты', value: fighter.knockouts },
                  { label: 'KO%', value: `${koPercent}%` },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-primary-foreground/5 p-3 text-center">
                    <p className={`font-display text-2xl font-bold ${stat.accent ? 'text-accent' : ''}`}>{stat.value}</p>
                    <p className="text-xs text-primary-foreground/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {fighter.bio && (
              <div>
                <h2 className="section-title text-xl">Биография</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{fighter.bio}</p>
              </div>
            )}

            {/* Fight history */}
            <div>
              <h2 className="section-title text-xl">История боёв</h2>
              {fighterFights.length === 0 ? (
                <p className="mt-3 text-muted-foreground">Нет зарегистрированных боёв</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {fighterFights.map((fight) => {
                    const isWinner = fight.winnerId === fighter.id;
                    const opponentName = fight.fighter1Id === fighter.id ? fight.fighter2Name : fight.fighter1Name;
                    const opponentId = fight.fighter1Id === fighter.id ? fight.fighter2Id : fight.fighter1Id;
                    return (
                      <div key={fight.id} className="flex items-center gap-4 rounded-lg border bg-card p-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-display font-bold text-sm ${isWinner ? 'gold-gradient text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>
                          {isWinner ? 'W' : 'L'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Link to={`/fighters/${opponentId}`} className="font-medium text-foreground hover:text-accent truncate">{opponentName}</Link>
                            <span className="text-xs text-muted-foreground">{fight.method} R{fight.rounds}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{fight.eventName} · {new Date(fight.date).toLocaleDateString('ru-RU')}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-5">
              <h3 className="font-display font-bold text-foreground">Статистика</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Рейтинг</span><span className="font-semibold text-foreground">{fighter.rating.toLocaleString()}</span></div>
                {fighter.p4pRank && <div className="flex justify-between"><span className="text-muted-foreground">P4P позиция</span><span className="font-semibold text-accent">#{fighter.p4pRank}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Процент побед</span><span className="font-semibold text-foreground">{winPercent}%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Всего боёв</span><span className="font-semibold text-foreground">{totalFights}</span></div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-5">
              <h3 className="font-display font-bold text-foreground">Информация</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Дата рождения</span><span className="text-foreground">{new Date(fighter.dateOfBirth).toLocaleDateString('ru-RU')}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Возраст</span><span className="text-foreground">{age}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Стойка</span><span className="text-foreground">{fighter.stance}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Категория</span><span className="text-foreground">{fighter.weightClass}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FighterDetail;
