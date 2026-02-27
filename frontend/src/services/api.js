import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL;

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erreur ${res.status}`);
  }
  return res.json();
}

// ── Public MHW data ──

export const getMonsters = () => request('/api/monsters');
export const getMonster = (id) => request(`/api/monsters/${id}`);
export const getWeapons = () => request('/api/weapons');
export const getWeapon = (id) => request(`/api/weapons/${id}`);
export const getArmor = () => request('/api/armor');
export const getArmorPiece = (id) => request(`/api/armor/${id}`);
export const getQuests = () => request('/api/quests');
export const getQuest = (id) => request(`/api/quests/${id}`);

// ── Profile (auth required) ──

export async function getProfile() {
  return request('/api/profile', { headers: await authHeaders() });
}

export async function updateProfile(body) {
  return request('/api/profile', {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
}

// ── Progress (auth required) ──

export async function getWeaponsProgress() {
  return request('/api/progress/weapons', { headers: await authHeaders() });
}

export async function toggleWeapon(weaponId, isCrafted) {
  return request(`/api/progress/weapons/${weaponId}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify({ is_crafted: isCrafted }),
  });
}

export async function getArmorProgress() {
  return request('/api/progress/armor', { headers: await authHeaders() });
}

export async function toggleArmor(armorId, isCrafted) {
  return request(`/api/progress/armor/${armorId}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify({ is_crafted: isCrafted }),
  });
}

export async function getQuestsProgress() {
  return request('/api/progress/quests', { headers: await authHeaders() });
}

export async function toggleQuest(questId, isCompleted) {
  return request(`/api/progress/quests/${questId}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify({ is_completed: isCompleted }),
  });
}
