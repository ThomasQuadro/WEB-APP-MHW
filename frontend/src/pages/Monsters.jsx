import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getMonsters } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function Monsters() {
  const { data: monsters, loading, error } = useFetch(getMonsters);
  const [search, setSearch] = useState('');

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const filtered = monsters?.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <h1>Monstres</h1>
      <input
        className="search-input"
        type="text"
        placeholder="Rechercher un monstre..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="card-grid">
        {filtered?.map(monster => (
          <Link to={`/monsters/${monster.id}`} key={monster.id} className="card">
            <h3>{monster.name}</h3>
            <p className="muted">{monster.type}</p>
            <p className="muted">{monster.species}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
