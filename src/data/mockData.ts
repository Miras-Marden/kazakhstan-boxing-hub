export interface Fighter {
  id: string;
  name: string;
  nameKz?: string;
  nameEn?: string;
  photo?: string;
  dateOfBirth: string;
  city: string;
  nationality: string;
  stance: string;
  weightClass: string;
  wins: number;
  losses: number;
  draws: number;
  knockouts: number;
  rating: number;
  p4pRank?: number;
  status: 'active' | 'inactive' | 'retired';
  bio?: string;
}

export interface Fight {
  id: string;
  date: string;
  eventId: string;
  eventName: string;
  weightClass: string;
  fighter1Id: string;
  fighter1Name: string;
  fighter2Id: string;
  fighter2Name: string;
  winnerId?: string;
  result: string;
  method: string;
  rounds: number;
  scheduledRounds: number;
  venue: string;
  city: string;
}

export interface BoxingEvent {
  id: string;
  name: string;
  date: string;
  city: string;
  venue: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  fightCount: number;
  description?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  featured: boolean;
  coverImage?: string;
}

export interface RankingEntry {
  rank: number;
  fighterId: string;
  fighterName: string;
  record: string;
  rating: number;
  change: number;
  weightClass: string;
}

export const weightClasses = [
  'Минимальный', 'Наилегчайший', 'Легчайший', 'Суперлегчайший',
  'Полулёгкий', 'Суперполулёгкий', 'Лёгкий', 'Суперлёгкий',
  'Полусредний', 'Суперполусредний', 'Средний', 'Суперсредний',
  'Полутяжёлый', 'Тяжёлый', 'Супертяжёлый'
];

export const fighters: Fighter[] = [
  {
    id: '1', name: 'Геннадий Головкин', nameEn: 'Gennady Golovkin', nameKz: 'Геннадий Головкин',
    dateOfBirth: '1982-04-08', city: 'Караганда', nationality: 'Казахстан',
    stance: 'Правша', weightClass: 'Средний', wins: 42, losses: 2, draws: 1, knockouts: 37,
    rating: 9850, p4pRank: 1, status: 'retired',
    bio: 'Легенда казахстанского бокса, бывший объединённый чемпион мира в среднем весе.'
  },
  {
    id: '2', name: 'Жанибек Алимханулы', nameEn: 'Janibek Alimkhanuly', nameKz: 'Жәнібек Әлімханұлы',
    dateOfBirth: '1993-01-24', city: 'Алматы', nationality: 'Казахстан',
    stance: 'Правша', weightClass: 'Средний', wins: 15, losses: 0, draws: 0, knockouts: 10,
    rating: 9200, p4pRank: 3, status: 'active',
    bio: 'Действующий чемпион мира WBO в среднем весе.'
  },
  {
    id: '3', name: 'Бектемир Меликузиев', nameEn: 'Bektemir Melikuziev',
    dateOfBirth: '1996-09-22', city: 'Шымкент', nationality: 'Казахстан',
    stance: 'Левша', weightClass: 'Суперсредний', wins: 11, losses: 1, draws: 0, knockouts: 10,
    rating: 8500, p4pRank: 8, status: 'active',
    bio: 'Перспективный нокаутёр в суперсреднем весе.'
  },
  {
    id: '4', name: 'Канат Ислам', nameEn: 'Kanat Islam',
    dateOfBirth: '1984-10-15', city: 'Атырау', nationality: 'Казахстан',
    stance: 'Правша', weightClass: 'Суперполусредний', wins: 27, losses: 1, draws: 0, knockouts: 19,
    rating: 8100, p4pRank: 10, status: 'inactive',
    bio: 'Опытный боец, бывший претендент на титул чемпиона мира.'
  },
  {
    id: '5', name: 'Данияр Елеусинов', nameEn: 'Daniyar Yeleussinov',
    dateOfBirth: '1991-03-13', city: 'Караганда', nationality: 'Казахстан',
    stance: 'Правша', weightClass: 'Полусредний', wins: 12, losses: 1, draws: 0, knockouts: 7,
    rating: 8300, p4pRank: 6, status: 'active',
    bio: 'Олимпийский чемпион 2016 года, перешедший в профессионалы.'
  },
  {
    id: '6', name: 'Камшыбек Кункабаев', nameEn: 'Kamshybek Kunkabayev',
    dateOfBirth: '1995-06-20', city: 'Астана', nationality: 'Казахстан',
    stance: 'Правша', weightClass: 'Тяжёлый', wins: 5, losses: 0, draws: 0, knockouts: 4,
    rating: 7800, p4pRank: 12, status: 'active',
    bio: 'Перспективный тяжеловес, бронзовый призёр Олимпийских игр.'
  },
  {
    id: '7', name: 'Серик Сапиев', nameEn: 'Serik Sapiyev',
    dateOfBirth: '1983-08-12', city: 'Караганда', nationality: 'Казахстан',
    stance: 'Правша', weightClass: 'Полусредний', wins: 0, losses: 0, draws: 0, knockouts: 0,
    rating: 9500, status: 'retired',
    bio: 'Олимпийский чемпион 2012 года, обладатель Кубка Вэла Баркера.'
  },
  {
    id: '8', name: 'Абильхан Аманкул', nameEn: 'Abilkhan Amankul',
    dateOfBirth: '1997-11-05', city: 'Алматы', nationality: 'Казахстан',
    stance: 'Правша', weightClass: 'Суперсредний', wins: 3, losses: 0, draws: 0, knockouts: 2,
    rating: 7200, status: 'active',
    bio: 'Молодой профессионал с сильным любительским опытом.'
  },
];

export const fights: Fight[] = [
  {
    id: '1', date: '2024-12-14', eventId: '1', eventName: 'KPBF Championship Night',
    weightClass: 'Средний', fighter1Id: '2', fighter1Name: 'Жанибек Алимханулы',
    fighter2Id: '3', fighter2Name: 'Бектемир Меликузиев', winnerId: '2',
    result: 'Победа', method: 'UD', rounds: 12, scheduledRounds: 12,
    venue: 'Almaty Arena', city: 'Алматы'
  },
  {
    id: '2', date: '2024-11-23', eventId: '2', eventName: 'Astana Boxing Gala',
    weightClass: 'Полусредний', fighter1Id: '5', fighter1Name: 'Данияр Елеусинов',
    fighter2Id: '4', fighter2Name: 'Канат Ислам', winnerId: '5',
    result: 'Победа', method: 'TKO', rounds: 8, scheduledRounds: 10,
    venue: 'Barys Arena', city: 'Астана'
  },
  {
    id: '3', date: '2024-10-05', eventId: '3', eventName: 'Kazakhstan Fight Night',
    weightClass: 'Тяжёлый', fighter1Id: '6', fighter1Name: 'Камшыбек Кункабаев',
    fighter2Id: '8', fighter2Name: 'Абильхан Аманкул', winnerId: '6',
    result: 'Победа', method: 'KO', rounds: 3, scheduledRounds: 8,
    venue: 'Almaty Arena', city: 'Алматы'
  },
  {
    id: '4', date: '2025-02-15', eventId: '4', eventName: 'Central Asia Boxing Cup',
    weightClass: 'Средний', fighter1Id: '2', fighter1Name: 'Жанибек Алимханулы',
    fighter2Id: '8', fighter2Name: 'Абильхан Аманкул', winnerId: '2',
    result: 'Победа', method: 'SD', rounds: 12, scheduledRounds: 12,
    venue: 'Saryarka Arena', city: 'Караганда'
  },
];

export const events: BoxingEvent[] = [
  {
    id: '1', name: 'KPBF Championship Night', date: '2024-12-14',
    city: 'Алматы', venue: 'Almaty Arena', status: 'completed', fightCount: 8,
    description: 'Главное событие года в казахстанском боксе.'
  },
  {
    id: '2', name: 'Astana Boxing Gala', date: '2024-11-23',
    city: 'Астана', venue: 'Barys Arena', status: 'completed', fightCount: 6
  },
  {
    id: '3', name: 'Kazakhstan Fight Night', date: '2024-10-05',
    city: 'Алматы', venue: 'Almaty Arena', status: 'completed', fightCount: 5
  },
  {
    id: '4', name: 'Central Asia Boxing Cup', date: '2025-02-15',
    city: 'Караганда', venue: 'Saryarka Arena', status: 'completed', fightCount: 10
  },
  {
    id: '5', name: 'KPBF Spring Championship', date: '2026-04-25',
    city: 'Астана', venue: 'Barys Arena', status: 'upcoming', fightCount: 12,
    description: 'Весенний чемпионат с участием лучших бойцов Казахстана.'
  },
  {
    id: '6', name: 'Almaty Boxing Festival', date: '2026-05-10',
    city: 'Алматы', venue: 'Almaty Arena', status: 'upcoming', fightCount: 8,
    description: 'Международный фестиваль бокса.'
  },
];

export const news: NewsArticle[] = [
  {
    id: '1', title: 'Алимханулы защитил титул WBO в Алматы',
    slug: 'alimkhanuly-defends-wbo-title',
    excerpt: 'Жанибек Алимханулы успешно защитил титул чемпиона WBO в среднем весе на KPBF Championship Night.',
    content: '', category: 'Результаты', tags: ['Алимханулы', 'WBO', 'Средний вес'],
    publishedAt: '2024-12-15', featured: true
  },
  {
    id: '2', title: 'Кункабаев нокаутировал соперника в третьем раунде',
    slug: 'kunkabayev-ko-victory',
    excerpt: 'Камшыбек Кункабаев продолжает серию нокаутов, остановив соперника в третьем раунде.',
    content: '', category: 'Результаты', tags: ['Кункабаев', 'Тяжёлый вес', 'KO'],
    publishedAt: '2024-10-06', featured: false
  },
  {
    id: '3', title: 'Весенний чемпионат KPBF: анонс карда',
    slug: 'kpbf-spring-championship-announcement',
    excerpt: 'Федерация анонсировала кард весеннего чемпионата с участием 12 поединков.',
    content: '', category: 'Анонсы', tags: ['KPBF', 'Чемпионат', 'Анонс'],
    publishedAt: '2026-03-28', featured: true
  },
  {
    id: '4', title: 'Елеусинов возвращается на ринг',
    slug: 'yeleussinov-comeback',
    excerpt: 'Олимпийский чемпион Данияр Елеусинов объявил о возвращении после длительного перерыва.',
    content: '', category: 'Новости', tags: ['Елеусинов', 'Возвращение'],
    publishedAt: '2026-03-20', featured: false
  },
];

export const p4pRankings: RankingEntry[] = [
  { rank: 1, fighterId: '1', fighterName: 'Геннадий Головкин', record: '42-2-1', rating: 9850, change: 0, weightClass: 'Средний' },
  { rank: 2, fighterId: '7', fighterName: 'Серик Сапиев', record: 'Любитель', rating: 9500, change: 0, weightClass: 'Полусредний' },
  { rank: 3, fighterId: '2', fighterName: 'Жанибек Алимханулы', record: '15-0-0', rating: 9200, change: 1, weightClass: 'Средний' },
  { rank: 4, fighterId: '3', fighterName: 'Бектемир Меликузиев', record: '11-1-0', rating: 8500, change: -1, weightClass: 'Суперсредний' },
  { rank: 5, fighterId: '5', fighterName: 'Данияр Елеусинов', record: '12-1-0', rating: 8300, change: 2, weightClass: 'Полусредний' },
  { rank: 6, fighterId: '4', fighterName: 'Канат Ислам', record: '27-1-0', rating: 8100, change: -1, weightClass: 'Суперполусредний' },
  { rank: 7, fighterId: '6', fighterName: 'Камшыбек Кункабаев', record: '5-0-0', rating: 7800, change: 3, weightClass: 'Тяжёлый' },
  { rank: 8, fighterId: '8', fighterName: 'Абильхан Аманкул', record: '3-0-0', rating: 7200, change: 0, weightClass: 'Суперсредний' },
];
