import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [pseudo, setPseudo] = useState('');
  const [platform, setPlatform] = useState('PC');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile()
      .then((profile) => {
        if (profile) {
          setPseudo(profile.pseudo_ingame || '');
          setPlatform(profile.platform || 'PC');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await updateProfile({ pseudo_ingame: pseudo, platform });
      setMessage('Profil mis à jour !');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loader">Chargement du profil...</div>;

  return (
    <div className="page">
      <h1>Mon Profil</h1>
      <p className="muted">Compte : {user.email}</p>

      <form onSubmit={handleSubmit} className="profile-form">
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <label>Pseudo in-game
          <input
            type="text"
            value={pseudo}
            onChange={e => setPseudo(e.target.value)}
            placeholder="Ton pseudo MHW"
          />
        </label>

        <label>Plateforme
          <select value={platform} onChange={e => setPlatform(e.target.value)}>
            <option value="PC">PC</option>
            <option value="PS">PlayStation</option>
            <option value="Xbox">Xbox</option>
          </select>
        </label>

        <button type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
