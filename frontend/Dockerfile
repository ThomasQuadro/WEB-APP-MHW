# ── Stage 1 : build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

# Vite bake les env vars au moment du build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
# VITE_API_URL vide : Nginx proxifie /api → backend (pas besoin d'URL absolue)
ARG VITE_API_URL=""

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2 : serve ──────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
