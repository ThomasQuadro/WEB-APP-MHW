-- Exécuter dans l'éditeur SQL de Supabase

-- Profils utilisateurs
CREATE TABLE mhw_profiles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  pseudo_ingame TEXT,
  platform    TEXT CHECK (platform IN ('PC', 'PS', 'Xbox')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Armes craftées par l'utilisateur
CREATE TABLE user_weapons (
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weapon_id   INTEGER NOT NULL,
  is_crafted  BOOLEAN DEFAULT FALSE,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, weapon_id)
);

-- Armures craftées par l'utilisateur
CREATE TABLE user_armors (
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  armor_id    INTEGER NOT NULL,
  is_crafted  BOOLEAN DEFAULT FALSE,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, armor_id)
);

-- Quêtes complétées par l'utilisateur
CREATE TABLE user_quests (
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quest_id         INTEGER NOT NULL,
  is_completed     BOOLEAN DEFAULT FALSE,
  completion_date  TIMESTAMPTZ,
  PRIMARY KEY (user_id, quest_id)
);

-- RLS : chaque utilisateur n'accède qu'à ses propres données
ALTER TABLE mhw_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_weapons  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_armors   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile"  ON mhw_profiles  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own weapons"  ON user_weapons  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own armors"   ON user_armors   FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own quests"   ON user_quests   FOR ALL USING (auth.uid() = user_id);
