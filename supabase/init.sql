-- ─── Schéma auth (GoTrue le remplit, on crée juste le schéma) ────────────────
CREATE SCHEMA IF NOT EXISTS auth;

-- Fonction auth.uid() lue par les policies RLS (lit le claim "sub" du JWT)
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT NULLIF(
    current_setting('request.jwt.claims', true)::json->>'sub', ''
  )::uuid
$$;

-- ─── Rôles PostgREST ──────────────────────────────────────────────────────────
CREATE ROLE anon         NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role  NOLOGIN BYPASSRLS;

-- postgres (superuser) peut switcher vers ces rôles — utilisé par PostgREST
GRANT anon          TO postgres;
GRANT authenticated TO postgres;
GRANT service_role  TO postgres;

-- ─── Permissions schéma public ────────────────────────────────────────────────
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES    TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON ROUTINES  TO anon, authenticated, service_role;

-- ─── Tables applicatives MHW ──────────────────────────────────────────────────
CREATE TABLE mhw_profiles (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        NOT NULL UNIQUE,
  pseudo_ingame TEXT,
  platform      TEXT        CHECK (platform IN ('PC', 'PS', 'Xbox')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_weapons (
  user_id    UUID    NOT NULL,
  weapon_id  INTEGER NOT NULL,
  is_crafted BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, weapon_id)
);

CREATE TABLE user_armors (
  user_id    UUID    NOT NULL,
  armor_id   INTEGER NOT NULL,
  is_crafted BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, armor_id)
);

CREATE TABLE user_quests (
  user_id         UUID    NOT NULL,
  quest_id        INTEGER NOT NULL,
  is_completed    BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMPTZ,
  PRIMARY KEY (user_id, quest_id)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE mhw_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_weapons  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_armors   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile" ON mhw_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own weapons" ON user_weapons  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own armors"  ON user_armors   FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own quests"  ON user_quests   FOR ALL USING (auth.uid() = user_id);

-- Grants explicites pour les tables déjà créées
GRANT ALL ON mhw_profiles, user_weapons, user_armors, user_quests
  TO anon, authenticated, service_role;
