import { useState } from 'react';
import Cookies from 'js-cookie';
import { getToken } from '../API/BuchApi';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: () => void;
}
export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = await getToken({ username, password });
      Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'strict' });
      onLogin();
      alert('Erfolgreich eingeloggt ✅');
      navigate('/');
    } catch {
      setError('Login fehlgeschlagen. Überprüfe den Benutzernamen und das Passwort.');
    }
  };

  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="card w-96 bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">Anmelden</h2>

          <form onSubmit={handleLogin} className="form-control gap-4">
            <div>
              <label className="label">
                <span className="label-text">Benutzername</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Passwort</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div role="alert" className="alert alert-error text-sm py-2">
                <span>{error}</span>
              </div>
            )}

            <div className="card-actions justify-end mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
