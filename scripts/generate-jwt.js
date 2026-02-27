#!/usr/bin/env node
/**
 * Génère ANON_KEY et SERVICE_ROLE_KEY à partir du JWT_SECRET.
 *
 * Usage :
 *   node scripts/generate-jwt.js <JWT_SECRET>
 *
 * Exemple :
 *   node scripts/generate-jwt.js my-super-secret-jwt-value-32-chars-min
 *
 * Colle les deux lignes générées dans ton .env.
 */

const crypto = require('crypto');

const secret = process.argv[2];

if (!secret || secret.length < 32) {
  console.error('Erreur : le secret doit faire au moins 32 caractères.');
  console.error('Usage  : node scripts/generate-jwt.js <JWT_SECRET>');
  process.exit(1);
}

function base64url(data) {
  return Buffer.from(data)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function sign(payload) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body   = base64url(JSON.stringify(payload));
  const sig    = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${body}.${sig}`;
}

const iat = Math.floor(Date.now() / 1000);
const exp = iat + 10 * 365 * 24 * 60 * 60; // 10 ans

const anonKey        = sign({ iss: 'supabase', role: 'anon',         iat, exp });
const serviceRoleKey = sign({ iss: 'supabase', role: 'service_role', iat, exp });

console.log(`ANON_KEY=${anonKey}`);
console.log(`SERVICE_ROLE_KEY=${serviceRoleKey}`);
