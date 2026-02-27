import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuests, getQuestsProgress, toggleQuest } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const RANKS = ['low', 'high', 'master'];

export default function Quests() {
  const { user } = useAuth();
  const { data: quests, loading, error } = useFetch(getQuests);
  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState('');
  const [rankFilter, setRankFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    getQuestsProgress().then(data => {
      const map = {};
      data.forEach(q => { map[q.quest_id] = q.is_completed; });
      setProgress(map);
    });
  }, [user]);

  async function handleToggle(questId) {
    if (!user) return;
    const newVal = !progress[questId];
    setProgress(prev => ({ ...prev, [questId]: newVal }));
    try {
      await toggleQuest(questId, newVal);
    } catch {
      setProgress(prev => ({ ...prev, [questId]: !newVal }));
    }
  }

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const filtered = quests?.filter(q => {
    const matchSearch = q.name.toLowerCase().includes(search.toLowerCase());
    const matchRank = rankFilter === 'all' || q.rank?.toLowerCase() === rankFilter;
    return matchSearch && matchRank;
  });

  const completed = filtered?.filter(q => progress[q.id]).length ?? 0;

  return (
    <div className="page">
      <h1>Quêtes</h1>
      {user && (
        <p className="progress-summary">Complétées : {completed} / {filtered?.length ?? 0}</p>
      )}
      <div className="filters">
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher une quête..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={rankFilter} onChange={e => setRankFilter(e.target.value)}>
          <option value="all">Tous les rangs</option>
          {RANKS.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
        </select>
      </div>
      <div className="card-grid">
        {filtered?.map(quest => (
          <div key={quest.id} className={`card ${progress[quest.id] ? 'completed' : ''}`}>
            <Link to={`/quests/${quest.id}`} className="card-link">
              <h3>{quest.name}</h3>
              <p className="muted">{quest.rank} — {quest.category}</p>
              {quest.stars && <p className="muted">{quest.stars}★</p>}
            </Link>
            {user && (
              <button
                className={`toggle-btn ${progress[quest.id] ? 'active' : ''}`}
                onClick={() => handleToggle(quest.id)}
              >
                {progress[quest.id] ? 'Complétée ✓' : 'Marquer complétée'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
