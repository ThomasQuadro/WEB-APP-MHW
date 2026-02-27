# MHW Companion

Application web Monster Hunter World — suivi de progression, données du jeu.

## Stack

| Couche | Technologie |
|---|---|
| Frontend | React 18 + Vite (port 3000) |
| Backend | Node.js + Express (port 8080) |
| Base de données | Supabase (PostgreSQL) |
| Cache | Redis (TTL 24h) |
| API données | mhw-db.com |

## Mise en route

### 1. Supabase

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Exécute `supabase_schema.sql` dans l'éditeur SQL
3. Récupère `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (Settings → API → service_role) et `SUPABASE_ANON_KEY` (anon public)

### 2. Backend

```bash
cd backend
cp .env.example .env
# Remplis les variables dans .env
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Remplis les variables dans .env
npm install
npm run dev
```

## Variables d'environnement

### backend/.env

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
REDIS_URL=redis://localhost:6379
PORT=8080
```

### frontend/.env

```
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Structure

```
.
├── backend/
│   └── src/
│       ├── config/         supabase.js, redis.js
│       ├── middleware/     auth.js (JWT Supabase)
│       ├── routes/         monsters, weapons, armor, quests, profile, progress
│       ├── services/       mhwApi.js (fetch + cache Redis)
│       └── index.js
├── frontend/
│   └── src/
│       ├── components/     Navbar, PrivateRoute, Loader, ErrorMessage
│       ├── contexts/       AuthContext.jsx
│       ├── hooks/          useFetch.js
│       ├── pages/          Home, Login, Register, Profile, Monsters, Weapons, Armor, Quests + détails
│       ├── services/       api.js, supabase.js
│       └── App.jsx
└── supabase_schema.sql
```

## API Backend

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | /api/monsters | — | Liste des monstres |
| GET | /api/monsters/:id | — | Détail monstre |
| GET | /api/weapons | — | Liste des armes |
| GET | /api/weapons/:id | — | Détail arme |
| GET | /api/armor | — | Liste des armures |
| GET | /api/armor/:id | — | Détail armure |
| GET | /api/quests | — | Liste des quêtes |
| GET | /api/quests/:id | — | Détail quête |
| GET | /api/profile | JWT | Profil utilisateur |
| PUT | /api/profile | JWT | Mise à jour profil |
| GET | /api/progress/weapons | JWT | Armes craftées |
| PUT | /api/progress/weapons/:id | JWT | Toggle arme craftée |
| GET | /api/progress/armor | JWT | Armures craftées |
| PUT | /api/progress/armor/:id | JWT | Toggle armure craftée |
| GET | /api/progress/quests | JWT | Quêtes complétées |
| PUT | /api/progress/quests/:id | JWT | Toggle quête complétée |
