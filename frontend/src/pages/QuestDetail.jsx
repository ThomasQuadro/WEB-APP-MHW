import { useParams, Link } from 'react-router-dom';
import { getQuest } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function QuestDetail() {
  const { id } = useParams();
  const { data: quest, loading, error } = useFetch(() => getQuest(id), [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!quest) return null;

  return (
    <div className="page detail-page">
      <Link to="/quests" className="back-link">← Retour aux quêtes</Link>
      <h1>{quest.name}</h1>

      <div className="detail-grid">
        <section className="detail-section">
          <h2>Informations</h2>
          <table className="info-table">
            <tbody>
              <tr><td>Rang</td><td>{quest.rank}</td></tr>
              <tr><td>Catégorie</td><td>{quest.category}</td></tr>
              {quest.stars && <tr><td>Étoiles</td><td>{quest.stars}★</td></tr>}
              {quest.timeLimit && <tr><td>Temps limite</td><td>{quest.timeLimit} min</td></tr>}
              {quest.zenny && <tr><td>Récompense Zenny</td><td>{quest.zenny} z</td></tr>}
            </tbody>
          </table>
        </section>

        {quest.objectives?.length > 0 && (
          <section className="detail-section">
            <h2>Objectifs</h2>
            <ul>
              {quest.objectives.map((obj, i) => (
                <li key={i}>{obj.description}</li>
              ))}
            </ul>
          </section>
        )}

        {quest.rewards?.length > 0 && (
          <section className="detail-section full-width">
            <h2>Récompenses</h2>
            <table className="rewards-table">
              <thead>
                <tr><th>Item</th><th>Quantité</th><th>% Chance</th></tr>
              </thead>
              <tbody>
                {quest.rewards.map((r, i) => (
                  <tr key={i}>
                    <td>{r.item?.name}</td>
                    <td>{r.quantity}</td>
                    <td>{r.chance}%</td>
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
