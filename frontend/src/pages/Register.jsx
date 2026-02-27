import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signUp(email, password);
    setLoading(false);
    if (err) return setError(err.message);
    setMessage('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
  }

  return (
    <div className="auth-container">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <label>Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>Mot de passe
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>
        <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
      </form>
    </div>
  );
}
