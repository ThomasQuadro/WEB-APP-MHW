import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">MHW Companion</Link>
      <div className="navbar-links">
        <Link to="/monsters">Monstres</Link>
        <Link to="/weapons">Armes</Link>
        <Link to="/armor">Armures</Link>
        <Link to="/quests">Quêtes</Link>
        {user ? (
          <>
            <Link to="/profile">Profil</Link>
            <button onClick={handleSignOut} className="btn-link">Déconnexion</button>
          </>
        ) : (
          <Link to="/login">Connexion</Link>
        )}
      </div>
    </nav>
  );
}
