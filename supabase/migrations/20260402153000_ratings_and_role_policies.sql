-- Restrict destructive actions to admins only.
DROP POLICY IF EXISTS "Editors manage fighters" ON public.fighters;
DROP POLICY IF EXISTS "Editors manage events" ON public.events;
DROP POLICY IF EXISTS "Editors manage fights" ON public.fights;
DROP POLICY IF EXISTS "Editors manage rankings" ON public.rankings;
DROP POLICY IF EXISTS "Editors manage ranking_history" ON public.ranking_history;
DROP POLICY IF EXISTS "Editors manage news" ON public.news;

CREATE POLICY "Editors insert fighters" ON public.fighters
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors update fighters" ON public.fighters
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete fighters" ON public.fighters
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors insert events" ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors update events" ON public.events
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete events" ON public.events
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors insert fights" ON public.fights
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors update fights" ON public.fights
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete fights" ON public.fights
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors insert rankings" ON public.rankings
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors update rankings" ON public.rankings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete rankings" ON public.rankings
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors insert ranking_history" ON public.ranking_history
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors update ranking_history" ON public.ranking_history
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete ranking_history" ON public.ranking_history
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors insert news" ON public.news
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors update news" ON public.news
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete news" ON public.news
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Recalculate fighter stats and rankings after each fight update.
CREATE OR REPLACE FUNCTION public.recalculate_rankings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.fighters f
  SET
    wins = COALESCE(stats.wins, 0),
    losses = COALESCE(stats.losses, 0),
    draws = COALESCE(stats.draws, 0),
    knockouts = COALESCE(stats.knockouts, 0),
    rating = GREATEST(COALESCE(stats.wins, 0) * 3 + COALESCE(stats.draws, 0) + COALESCE(stats.knockouts, 0) * 2 - COALESCE(stats.losses, 0), 0),
    updated_at = now()
  FROM (
    SELECT
      fighter_id,
      SUM(wins) AS wins,
      SUM(losses) AS losses,
      SUM(draws) AS draws,
      SUM(knockouts) AS knockouts
    FROM (
      SELECT
        fighter1_id AS fighter_id,
        CASE WHEN winner_id = fighter1_id THEN 1 ELSE 0 END AS wins,
        CASE WHEN winner_id = fighter2_id THEN 1 ELSE 0 END AS losses,
        CASE WHEN winner_id IS NULL THEN 1 ELSE 0 END AS draws,
        CASE WHEN winner_id = fighter1_id AND method IN ('KO', 'TKO') THEN 1 ELSE 0 END AS knockouts
      FROM public.fights
      WHERE fighter1_id IS NOT NULL
      UNION ALL
      SELECT
        fighter2_id AS fighter_id,
        CASE WHEN winner_id = fighter2_id THEN 1 ELSE 0 END AS wins,
        CASE WHEN winner_id = fighter1_id THEN 1 ELSE 0 END AS losses,
        CASE WHEN winner_id IS NULL THEN 1 ELSE 0 END AS draws,
        CASE WHEN winner_id = fighter2_id AND method IN ('KO', 'TKO') THEN 1 ELSE 0 END AS knockouts
      FROM public.fights
      WHERE fighter2_id IS NOT NULL
    ) compiled
    GROUP BY fighter_id
  ) stats
  WHERE f.id = stats.fighter_id;

  UPDATE public.fighters
  SET wins = 0, losses = 0, draws = 0, knockouts = 0, rating = 0, updated_at = now()
  WHERE id NOT IN (
    SELECT fighter1_id FROM public.fights WHERE fighter1_id IS NOT NULL
    UNION
    SELECT fighter2_id FROM public.fights WHERE fighter2_id IS NOT NULL
  );

  DELETE FROM public.rankings;

  INSERT INTO public.rankings (fighter_id, weight_class, rank, rating, change, is_p4p, created_at, updated_at)
  SELECT
    ranked.fighter_id,
    ranked.weight_class,
    ranked.rank,
    ranked.rating,
    0,
    false,
    now(),
    now()
  FROM (
    SELECT
      f.id AS fighter_id,
      COALESCE(f.weight_class, 'Без категории') AS weight_class,
      f.rating,
      ROW_NUMBER() OVER (
        PARTITION BY COALESCE(f.weight_class, 'Без категории')
        ORDER BY f.rating DESC, f.wins DESC, f.knockouts DESC, f.updated_at DESC
      ) AS rank
    FROM public.fighters f
  ) ranked;

  INSERT INTO public.rankings (fighter_id, weight_class, rank, rating, change, is_p4p, created_at, updated_at)
  SELECT
    p4p.fighter_id,
    p4p.weight_class,
    p4p.rank,
    p4p.rating,
    0,
    true,
    now(),
    now()
  FROM (
    SELECT
      f.id AS fighter_id,
      COALESCE(f.weight_class, 'Без категории') AS weight_class,
      f.rating,
      ROW_NUMBER() OVER (ORDER BY f.rating DESC, f.wins DESC, f.knockouts DESC, f.updated_at DESC) AS rank
    FROM public.fighters f
  ) p4p;
END;
$$;

GRANT EXECUTE ON FUNCTION public.recalculate_rankings() TO authenticated;

CREATE OR REPLACE FUNCTION public.recalculate_rankings_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.recalculate_rankings();
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trigger_recalculate_rankings_on_fights ON public.fights;
CREATE TRIGGER trigger_recalculate_rankings_on_fights
  AFTER INSERT OR UPDATE OR DELETE ON public.fights
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.recalculate_rankings_trigger();
