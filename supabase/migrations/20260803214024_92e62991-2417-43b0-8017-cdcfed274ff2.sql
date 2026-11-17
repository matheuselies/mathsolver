CREATE TABLE public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL,
  nickname_key text GENERATED ALWAYS AS (lower(nickname)) STORED,
  phase integer NOT NULL DEFAULT 1,
  streak integer NOT NULL DEFAULT 0,
  checkpoint integer NOT NULL DEFAULT 1,
  completed boolean NOT NULL DEFAULT false,
  total_correct integer NOT NULL DEFAULT 0,
  total_wrong integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX players_nickname_key_idx ON public.players (nickname_key);

GRANT ALL ON public.players TO service_role;

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages players" ON public.players FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
