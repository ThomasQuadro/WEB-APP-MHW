import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <h1>MHW Companion</h1>
        <p>Ton compagnon Monster Hunter World — suis ta progression, explore les données du jeu.</p>
        {!user && (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Commencer</Link>
            <Link to="/login" className="btn btn-secondary">Se connecter</Link>
          </div>
        )}
      </div>

      <div className="features-grid">
        <Link to="/monsters" className="feature-card">
          <h2>Monstres</h2>
          <p>Consulte les stats et faiblesses de tous les monstres</p>
        </Link>
        <Link to="/weapons" className="feature-card">
          <h2>Armes</h2>
          <p>Explore l'arbre des armes et coche celles que tu as craftées</p>
        </Link>
        <Link to="/armor" className="feature-card">
          <h2>Armures</h2>
          <p>Consulte les sets d'armures et suis ta progression</p>
        </Link>
        <Link to="/quests" className="feature-card">
          <h2>Quêtes</h2>
          <p>Visualise et coche les quêtes complétées</p>
        </Link>
      </div>
    </div>
  );
}
