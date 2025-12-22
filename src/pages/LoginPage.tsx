import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getToken } from '../API/BuchApi';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken({ username, password });
      Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'strict' });
      navigate('/buecher');
    } catch (err) {
      setError('Anmeldung fehlgeschlagen');
    }
  };

  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="card w-96 bg-base-100 shadow-xl border p-8">
        <h2 className="card-title justify-center mb-4">Anmelden</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Benutzer"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="alert alert-error text-xs py-2">{error}</div>}
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
