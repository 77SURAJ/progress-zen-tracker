-- 1) Add timezone to profiles (non-breaking)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Asia/Kolkata';

-- 2) Create daily_progress table
CREATE TABLE IF NOT EXISTS public.daily_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_date date NOT NULL,
  wake_3am boolean DEFAULT false,
  morning_salad boolean DEFAULT false,
  breakfast jsonb DEFAULT '[]'::jsonb,
  snack jsonb DEFAULT '[]'::jsonb,
  dinner jsonb DEFAULT '[]'::jsonb,
  study_sessions jsonb DEFAULT '[]'::jsonb,
  classes jsonb DEFAULT '[]'::jsonb,
  exercise_done boolean DEFAULT false,
  bedtime timestamptz,
  wake_time timestamptz,
  points_total numeric DEFAULT 0,
  points_breakdown jsonb DEFAULT '{}'::jsonb,
  ai_insights jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT daily_progress_user_date_unique UNIQUE (user_id, entry_date)
);

-- Indexes for daily_progress
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON public.daily_progress (user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_daily_progress_created_at ON public.daily_progress (created_at);

-- Enable RLS and policies for daily_progress
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'daily_progress' AND policyname = 'daily_progress_select_own'
  ) THEN
    CREATE POLICY "daily_progress_select_own"
    ON public.daily_progress
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'daily_progress' AND policyname = 'daily_progress_insert_own'
  ) THEN
    CREATE POLICY "daily_progress_insert_own"
    ON public.daily_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'daily_progress' AND policyname = 'daily_progress_update_own'
  ) THEN
    CREATE POLICY "daily_progress_update_own"
    ON public.daily_progress
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3) Create study_logs table
CREATE TABLE IF NOT EXISTS public.study_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_date date NOT NULL,
  slot text NOT NULL,
  start_ts timestamptz,
  end_ts timestamptz,
  duration_minutes integer,
  completed boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_logs_user_date ON public.study_logs (user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_study_logs_created_at ON public.study_logs (created_at);

ALTER TABLE public.study_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='study_logs' AND policyname='study_logs_select_own'
  ) THEN
    CREATE POLICY "study_logs_select_own" ON public.study_logs FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='study_logs' AND policyname='study_logs_insert_own'
  ) THEN
    CREATE POLICY "study_logs_insert_own" ON public.study_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='study_logs' AND policyname='study_logs_update_own'
  ) THEN
    CREATE POLICY "study_logs_update_own" ON public.study_logs FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 4) Create meal_logs table
CREATE TABLE IF NOT EXISTS public.meal_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_date date,
  meal_type text, -- breakfast | snack | dinner
  item text,
  quantity text,
  calories numeric,
  junk boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meal_logs_user_date ON public.meal_logs (user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_meal_logs_created_at ON public.meal_logs (created_at);

ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meal_logs' AND policyname='meal_logs_select_own'
  ) THEN
    CREATE POLICY "meal_logs_select_own" ON public.meal_logs FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meal_logs' AND policyname='meal_logs_insert_own'
  ) THEN
    CREATE POLICY "meal_logs_insert_own" ON public.meal_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meal_logs' AND policyname='meal_logs_update_own'
  ) THEN
    CREATE POLICY "meal_logs_update_own" ON public.meal_logs FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5) Create animations table (for 3D triggers/assets metadata)
CREATE TABLE IF NOT EXISTS public.animations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text,
  glb_path text,
  trigger jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_animations_user ON public.animations (user_id);
CREATE INDEX IF NOT EXISTS idx_animations_name ON public.animations (name);

ALTER TABLE public.animations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='animations' AND policyname='animations_select_own'
  ) THEN
    CREATE POLICY "animations_select_own" ON public.animations FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='animations' AND policyname='animations_insert_own'
  ) THEN
    CREATE POLICY "animations_insert_own" ON public.animations FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='animations' AND policyname='animations_update_own'
  ) THEN
    CREATE POLICY "animations_update_own" ON public.animations FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 6) Create points_config table (key-value weights)
CREATE TABLE IF NOT EXISTS public.points_config (
  id serial PRIMARY KEY,
  key text UNIQUE,
  value numeric,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_points_config_key ON public.points_config (key);

ALTER TABLE public.points_config ENABLE ROW LEVEL SECURITY;

-- Allow read for all authenticated users; restrict writes to own/userless configs later if needed
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='points_config' AND policyname='points_config_read_all'
  ) THEN
    CREATE POLICY "points_config_read_all" ON public.points_config FOR SELECT USING (true);
  END IF;
END $$;

-- 7) Timestamp update triggers
DO $$ BEGIN
  -- profiles updated_at trigger
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE t.tgname='update_profiles_updated_at' AND n.nspname='public' AND c.relname='profiles'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- daily_progress
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE t.tgname='update_daily_progress_updated_at' AND n.nspname='public' AND c.relname='daily_progress'
  ) THEN
    CREATE TRIGGER update_daily_progress_updated_at
    BEFORE UPDATE ON public.daily_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- study_logs
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE t.tgname='update_study_logs_updated_at' AND n.nspname='public' AND c.relname='study_logs'
  ) THEN
    CREATE TRIGGER update_study_logs_updated_at
    BEFORE UPDATE ON public.study_logs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- meal_logs
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE t.tgname='update_meal_logs_updated_at' AND n.nspname='public' AND c.relname='meal_logs'
  ) THEN
    CREATE TRIGGER update_meal_logs_updated_at
    BEFORE UPDATE ON public.meal_logs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- animations
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE t.tgname='update_animations_updated_at' AND n.nspname='public' AND c.relname='animations'
  ) THEN
    CREATE TRIGGER update_animations_updated_at
    BEFORE UPDATE ON public.animations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;
