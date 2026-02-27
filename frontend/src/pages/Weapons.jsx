import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWeapons, getWeaponsProgress, toggleWeapon } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const WEAPON_TYPES = [
  'great-sword', 'sword-and-shield', 'dual-blades', 'long-sword',
  'hammer', 'hunting-horn', 'lance', 'gunlance', 'switch-axe',
  'charge-blade', 'insect-glaive', 'bow', 'heavy-bowgun', 'light-bowgun',
];

export default function Weapons() {
  const { user } = useAuth();
  const { data: weapons, loading, error } = useFetch(getWeapons);
  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    getWeaponsProgress().then(data => {
      const map = {};
      data.forEach(w => { map[w.weapon_id] = w.is_crafted; });
      setProgress(map);
    });
  }, [user]);

  async function handleToggle(weaponId) {
    if (!user) return;
    const newVal = !progress[weaponId];
    setProgress(prev => ({ ...prev, [weaponId]: newVal }));
    try {
      await toggleWeapon(weaponId, newVal);
    } catch {
      setProgress(prev => ({ ...prev, [weaponId]: !newVal }));
    }
  }

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const filtered = weapons?.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || w.type === typeFilter;
    return matchSearch && matchType;
  });

  const crafted = filtered?.filter(w => progress[w.id]).length ?? 0;

  return (
    <div className="page">
      <h1>Armes</h1>
      {user && (
        <p className="progress-summary">
          Craftées : {crafted} / {filtered?.length ?? 0}
        </p>
      )}
      <div className="filters">
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher une arme..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">Tous les types</option>
          {WEAPON_TYPES.map(t => (
            <option key={t} value={t}>{t.replace(/-/g, ' ')}</option>
          ))}
        </select>
      </div>
      <div className="card-grid">
        {filtered?.map(weapon => (
          <div key={weapon.id} className={`card ${progress[weapon.id] ? 'crafted' : ''}`}>
            <Link to={`/weapons/${weapon.id}`} className="card-link">
              <h3>{weapon.name}</h3>
              <p className="muted">{weapon.type?.replace(/-/g, ' ')}</p>
              {weapon.rarity && <p className="muted">Rareté {weapon.rarity}</p>}
            </Link>
            {user && (
              <button
                className={`toggle-btn ${progress[weapon.id] ? 'active' : ''}`}
                onClick={() => handleToggle(weapon.id)}
              >
                {progress[weapon.id] ? 'Craftée ✓' : 'Marquer craftée'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
