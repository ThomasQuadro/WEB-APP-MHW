const { getRedis } = require('../config/redis');

const MHW_BASE_URL = 'https://mhw-db.com';
const CACHE_TTL = 86400; // 24h in seconds

async function fetchWithCache(path) {
  const redis = await getRedis();
  const cacheKey = `mhw:${path}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const res = await fetch(`${MHW_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`MHW API error: ${res.status}`);

  const data = await res.json();
  await redis.set(cacheKey, JSON.stringify(data), { EX: CACHE_TTL });
  return data;
}

module.exports = { fetchWithCache };
