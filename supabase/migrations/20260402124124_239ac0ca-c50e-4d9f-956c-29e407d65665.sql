
-- Weight classes reference table
CREATE TABLE public.weight_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_en TEXT,
  name_kz TEXT,
  min_weight NUMERIC,
  max_weight NUMERIC,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles (separate table per security guidelines)
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Fighters table
CREATE TABLE public.fighters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  name_kz TEXT,
  slug TEXT UNIQUE,
  photo_url TEXT,
  date_of_birth DATE,
  city TEXT,
  nationality TEXT DEFAULT 'Казахстан',
  stance TEXT DEFAULT 'Правша',
  weight_class_id UUID REFERENCES public.weight_classes(id),
  weight_class TEXT,
  wins INT NOT NULL DEFAULT 0,
  losses INT NOT NULL DEFAULT 0,
  draws INT NOT NULL DEFAULT 0,
  knockouts INT NOT NULL DEFAULT 0,
  rating INT NOT NULL DEFAULT 0,
  p4p_rank INT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'retired')),
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  date DATE NOT NULL,
  city TEXT,
  venue TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  fight_count INT NOT NULL DEFAULT 0,
  description TEXT,
  poster_url TEXT,
  organizer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fights table
CREATE TABLE public.fights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  event_id UUID REFERENCES public.events(id),
  weight_class TEXT,
  fighter1_id UUID REFERENCES public.fighters(id),
  fighter2_id UUID REFERENCES public.fighters(id),
  winner_id UUID REFERENCES public.fighters(id),
  result TEXT,
  method TEXT,
  rounds INT,
  scheduled_rounds INT,
  venue TEXT,
  city TEXT,
  referee TEXT,
  judge1 TEXT,
  judge1_score TEXT,
  judge2 TEXT,
  judge2_score TEXT,
  judge3 TEXT,
  judge3_score TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rankings table
CREATE TABLE public.rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fighter_id UUID REFERENCES public.fighters(id) ON DELETE CASCADE NOT NULL,
  weight_class TEXT NOT NULL,
  rank INT NOT NULL,
  rating INT NOT NULL DEFAULT 0,
  change INT NOT NULL DEFAULT 0,
  is_p4p BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ranking history snapshots
CREATE TABLE public.ranking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fighter_id UUID REFERENCES public.fighters(id) ON DELETE CASCADE NOT NULL,
  weight_class TEXT,
  rank INT NOT NULL,
  rating INT NOT NULL,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_p4p BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- News table
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ,
  featured BOOLEAN NOT NULL DEFAULT false,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_classes ENABLE ROW LEVEL SECURITY;

-- Public read access for content tables
CREATE POLICY "Public read fighters" ON public.fighters FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read fights" ON public.fights FOR SELECT USING (true);
CREATE POLICY "Public read rankings" ON public.rankings FOR SELECT USING (true);
CREATE POLICY "Public read ranking_history" ON public.ranking_history FOR SELECT USING (true);
CREATE POLICY "Public read published news" ON public.news FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read weight_classes" ON public.weight_classes FOR SELECT USING (true);

-- Profile policies
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User roles: admins can manage, users can read own
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Editor/Admin write access
CREATE POLICY "Editors manage fighters" ON public.fighters FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors manage fights" ON public.fights FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors manage rankings" ON public.rankings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors manage ranking_history" ON public.ranking_history FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors manage news" ON public.news FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage weight_classes" ON public.weight_classes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Indexes
CREATE INDEX idx_fighters_weight_class ON public.fighters(weight_class);
CREATE INDEX idx_fighters_status ON public.fighters(status);
CREATE INDEX idx_fighters_rating ON public.fighters(rating DESC);
CREATE INDEX idx_fights_date ON public.fights(date DESC);
CREATE INDEX idx_fights_event ON public.fights(event_id);
CREATE INDEX idx_rankings_weight_class ON public.rankings(weight_class);
CREATE INDEX idx_rankings_p4p ON public.rankings(is_p4p) WHERE is_p4p = true;
CREATE INDEX idx_news_status ON public.news(status);
CREATE INDEX idx_news_published ON public.news(published_at DESC);
