import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArmor, getArmorProgress, toggleArmor } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function Armor() {
  const { user } = useAuth();
  const { data: armors, loading, error } = useFetch(getArmor);
  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    getArmorProgress().then(data => {
      const map = {};
      data.forEach(a => { map[a.armor_id] = a.is_crafted; });
      setProgress(map);
    });
  }, [user]);

  async function handleToggle(armorId) {
    if (!user) return;
    const newVal = !progress[armorId];
    setProgress(prev => ({ ...prev, [armorId]: newVal }));
    try {
      await toggleArmor(armorId, newVal);
    } catch {
      setProgress(prev => ({ ...prev, [armorId]: !newVal }));
    }
  }

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const filtered = armors?.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const crafted = filtered?.filter(a => progress[a.id]).length ?? 0;

  return (
    <div className="page">
      <h1>Armures</h1>
      {user && (
        <p className="progress-summary">Craftées : {crafted} / {filtered?.length ?? 0}</p>
      )}
      <input
        className="search-input"
        type="text"
        placeholder="Rechercher une armure..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="card-grid">
        {filtered?.map(armor => (
          <div key={armor.id} className={`card ${progress[armor.id] ? 'crafted' : ''}`}>
            <Link to={`/armor/${armor.id}`} className="card-link">
              <h3>{armor.name}</h3>
              <p className="muted">{armor.type}</p>
              <p className="muted">Rareté {armor.rarity}</p>
            </Link>
            {user && (
              <button
                className={`toggle-btn ${progress[armor.id] ? 'active' : ''}`}
                onClick={() => handleToggle(armor.id)}
              >
                {progress[armor.id] ? 'Craftée ✓' : 'Marquer craftée'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
