import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) return setError(err.message);
    navigate('/');
  }

  return (
    <div className="auth-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error">{error}</p>}
        <label>Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>Mot de passe
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
      </form>
    </div>
  );
}
