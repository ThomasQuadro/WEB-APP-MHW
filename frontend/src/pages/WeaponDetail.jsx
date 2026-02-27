import { useParams, Link } from 'react-router-dom';
import { getWeapon } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function WeaponDetail() {
  const { id } = useParams();
  const { data: weapon, loading, error } = useFetch(() => getWeapon(id), [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!weapon) return null;

  return (
    <div className="page detail-page">
      <Link to="/weapons" className="back-link">← Retour aux armes</Link>
      <h1>{weapon.name}</h1>
      <span className="tag">{weapon.type?.replace(/-/g, ' ')}</span>

      <div className="detail-grid">
        <section className="detail-section">
          <h2>Stats</h2>
          <table className="info-table">
            <tbody>
              <tr><td>Rareté</td><td>{weapon.rarity}</td></tr>
              <tr><td>Attaque</td><td>{weapon.attack?.display}</td></tr>
              {weapon.elderseal && <tr><td>Elderseal</td><td>{weapon.elderseal}</td></tr>}
              {weapon.attributes?.affinity && (
                <tr><td>Affinité</td><td>{weapon.attributes.affinity}%</td></tr>
              )}
              {weapon.attributes?.defense && (
                <tr><td>Défense</td><td>{weapon.attributes.defense}</td></tr>
              )}
            </tbody>
          </table>
        </section>

        {weapon.elements?.length > 0 && (
          <section className="detail-section">
            <h2>Éléments</h2>
            <ul className="tag-list">
              {weapon.elements.map(el => (
                <li key={el.type} className={`tag element-${el.type}`}>
                  {el.type} {el.damage} {el.hidden ? '(caché)' : ''}
                </li>
              ))}
            </ul>
          </section>
        )}

        {weapon.slots?.length > 0 && (
          <section className="detail-section">
            <h2>Emplacements</h2>
            <ul className="tag-list">
              {weapon.slots.map((s, i) => (
                <li key={i} className="tag">Lv {s.rank}</li>
              ))}
            </ul>
          </section>
        )}

        {weapon.crafting && (
          <section className="detail-section full-width">
            <h2>Craft</h2>
            {weapon.crafting.craftable && (
              <>
                <h3>Matériaux nécessaires</h3>
                <ul>
                  {weapon.crafting.craftingMaterials?.map((m, i) => (
                    <li key={i}>{m.item?.name} × {m.quantity}</li>
                  ))}
                </ul>
              </>
            )}
            {weapon.crafting.upgradeMaterials?.length > 0 && (
              <>
                <h3>Upgrade depuis</h3>
                <ul>
                  {weapon.crafting.upgradeMaterials.map((m, i) => (
                    <li key={i}>{m.item?.name} × {m.quantity}</li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
