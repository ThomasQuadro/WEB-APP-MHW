import { useParams, Link } from 'react-router-dom';
import { getMonster } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function MonsterDetail() {
  const { id } = useParams();
  const { data: monster, loading, error } = useFetch(() => getMonster(id), [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!monster) return null;

  return (
    <div className="page detail-page">
      <Link to="/monsters" className="back-link">← Retour aux monstres</Link>
      <h1>{monster.name}</h1>

      <div className="detail-grid">
        <section className="detail-section">
          <h2>Informations</h2>
          <table className="info-table">
            <tbody>
              <tr><td>Type</td><td>{monster.type}</td></tr>
              <tr><td>Espèce</td><td>{monster.species}</td></tr>
              <tr><td>Taille</td><td>{monster.elements?.join(', ') || '—'}</td></tr>
            </tbody>
          </table>
        </section>

        {monster.weaknesses?.length > 0 && (
          <section className="detail-section">
            <h2>Faiblesses</h2>
            <ul className="tag-list">
              {monster.weaknesses.map(w => (
                <li key={w.element} className={`tag element-${w.element}`}>
                  {w.element} ({w.stars}★)
                </li>
              ))}
            </ul>
          </section>
        )}

        {monster.resistances?.length > 0 && (
          <section className="detail-section">
            <h2>Résistances</h2>
            <ul className="tag-list">
              {monster.resistances.map(r => (
                <li key={r.element} className="tag">{r.element}</li>
              ))}
            </ul>
          </section>
        )}

        {monster.locations?.length > 0 && (
          <section className="detail-section">
            <h2>Zones</h2>
            <ul className="tag-list">
              {monster.locations.map(l => (
                <li key={l.id} className="tag">{l.name}</li>
              ))}
            </ul>
          </section>
        )}

        {monster.rewards?.length > 0 && (
          <section className="detail-section full-width">
            <h2>Récompenses</h2>
            <table className="rewards-table">
              <thead>
                <tr><th>Item</th><th>Conditions</th><th>% Chance</th><th>Quantité</th></tr>
              </thead>
              <tbody>
                {monster.rewards.map((r, i) => (
                  <tr key={i}>
                    <td>{r.item?.name}</td>
                    <td>{r.conditions?.map(c => c.type).join(', ')}</td>
                    <td>{r.conditions?.[0]?.chance}%</td>
                    <td>{r.conditions?.[0]?.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
}
