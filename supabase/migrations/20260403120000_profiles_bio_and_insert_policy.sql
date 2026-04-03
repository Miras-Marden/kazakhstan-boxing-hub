-- Профиль пользователя: биография и возможность создать строку профиля при первом входе
-- (если триггер on_auth_user_created ещё не развёрнут в новом проекте).

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio TEXT;

CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Если триггер регистрации не создал роль, пользователь может один раз добавить роль user.
CREATE POLICY "Users bootstrap own user role" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND role = 'user'
    AND NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid())
  );
