# MHW Companion

Application web Monster Hunter World — suivi de progression, données du jeu.

## Stack

| Couche | Technologie |
|---|---|
| Frontend | React 18 + Vite — Nginx (port 3000) |
| Backend | Node.js + Express (port 8080, interne) |
| Auth | GoTrue (self-hosted, interne) |
| Base de données | PostgreSQL 15 (self-hosted, interne) |
| API REST DB | PostgREST (self-hosted, interne) |
| Gateway | Nginx (port 8000) |
| Cache | Redis (TTL 24h, interne) |
| API données | mhw-db.com |

## Architecture Docker

```
Navigateur
  ├── :3000  →  frontend Nginx  ──  /api/*      →  backend:8080
  │                               (Supabase JS)
  └── :8000  →  gateway Nginx  ──  /auth/v1/*  →  GoTrue:9999
                                └─  /rest/v1/*  →  PostgREST:3000  →  PostgreSQL
```

## Lancer avec Docker

### 1. Générer les clés JWT

```bash
# Choisis un secret robuste (≥ 32 chars) et génère les clés dérivées
node scripts/generate-jwt.js "mon-super-secret-jwt-32-chars-min"
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
# Remplis :
#   POSTGRES_PASSWORD  — mot de passe PostgreSQL
#   JWT_SECRET         — ton secret (même que ci-dessus)
#   ANON_KEY           — copie la ligne ANON_KEY générée
#   SERVICE_ROLE_KEY   — copie la ligne SERVICE_ROLE_KEY générée
```

### 3. Build et démarrage

```bash
docker compose up --build
```

| URL | Service |
|---|---|
| http://localhost:3000 | Application web |
| http://localhost:8000 | Gateway (auth + rest) |

### Commandes utiles

```bash
docker compose up --build -d        # démarrer en arrière-plan
docker compose logs -f backend      # logs backend
docker compose logs -f auth         # logs GoTrue
docker compose logs -f db           # logs PostgreSQL
docker compose down                 # arrêter
docker compose down -v              # arrêter + supprimer les volumes
```

## Structure

```
.
├── docker-compose.yml
├── .env.example
├── gateway/
│   └── nginx.conf          (route /auth/v1 → GoTrue, /rest/v1 → PostgREST)
├── supabase/
│   └── init.sql            (roles PostgREST, tables MHW, RLS, auth.uid())
├── scripts/
│   └── generate-jwt.js     (génère ANON_KEY + SERVICE_ROLE_KEY)
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── config/         supabase.js, redis.js
│       ├── middleware/     auth.js (JWT GoTrue)
│       ├── routes/         monsters, weapons, armor, quests, profile, progress
│       ├── services/       mhwApi.js (fetch + cache Redis)
│       └── index.js
└── frontend/
    ├── Dockerfile          (multi-stage : build Vite → Nginx)
    ├── nginx.conf          (SPA routing + proxy /api → backend)
    └── src/
        ├── components/     Navbar, PrivateRoute, Loader, ErrorMessage
        ├── contexts/       AuthContext.jsx
        ├── hooks/          useFetch.js
        ├── pages/          Home, Login, Register, Profile, Monsters, Weapons, Armor, Quests + détails
        ├── services/       api.js, supabase.js
        └── App.jsx
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
