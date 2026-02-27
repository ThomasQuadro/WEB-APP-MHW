import { useParams, Link } from 'react-router-dom';
import { getArmorPiece } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function ArmorDetail() {
  const { id } = useParams();
  const { data: armor, loading, error } = useFetch(() => getArmorPiece(id), [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!armor) return null;

  return (
    <div className="page detail-page">
      <Link to="/armor" className="back-link">← Retour aux armures</Link>
      <h1>{armor.name}</h1>
      <span className="tag">{armor.type}</span>

      <div className="detail-grid">
        <section className="detail-section">
          <h2>Stats</h2>
          <table className="info-table">
            <tbody>
              <tr><td>Rareté</td><td>{armor.rarity}</td></tr>
              <tr><td>Défense (base)</td><td>{armor.defense?.base}</td></tr>
              <tr><td>Défense (max)</td><td>{armor.defense?.max}</td></tr>
              <tr><td>Défense (augm.)</td><td>{armor.defense?.augmented}</td></tr>
            </tbody>
          </table>
        </section>

        {armor.resistances && (
          <section className="detail-section">
            <h2>Résistances</h2>
            <table className="info-table">
              <tbody>
                {Object.entries(armor.resistances).map(([el, val]) => (
                  <tr key={el}>
                    <td className={`element-${el}`}>{el}</td>
                    <td>{val > 0 ? `+${val}` : val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {armor.skills?.length > 0 && (
          <section className="detail-section">
            <h2>Compétences</h2>
            <ul>
              {armor.skills.map((s, i) => (
                <li key={i}>{s.skill_name} +{s.level}</li>
              ))}
            </ul>
          </section>
        )}

        {armor.slots?.length > 0 && (
          <section className="detail-section">
            <h2>Emplacements</h2>
            <ul className="tag-list">
              {armor.slots.map((s, i) => (
                <li key={i} className="tag">Lv {s.rank}</li>
              ))}
            </ul>
          </section>
        )}

        {armor.crafting?.materials?.length > 0 && (
          <section className="detail-section full-width">
            <h2>Matériaux de craft</h2>
            <ul>
              {armor.crafting.materials.map((m, i) => (
                <li key={i}>{m.item?.name} × {m.quantity}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
