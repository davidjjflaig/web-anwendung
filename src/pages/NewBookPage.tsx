import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { createBuch, type BuchCreate } from '../API/BuchApi';

export default function NewBookPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    untertitel: '',
    preis: 0,
    rating: 1,
    art: 'HARDCOVER',
    homepage: '',
    lieferbar: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('token');
    if (!token) return setError('Login erforderlich');

    try {
      setLoading(true);
      const neuesBuch: BuchCreate = {
        isbn: formData.isbn,
        rating: Number(formData.rating),
        art: formData.art as 'HARDCOVER' | 'PAPERBACK' | 'EPUB',
        preis: Number(formData.preis),
        rabatt: 0,
        lieferbar: formData.lieferbar,
        datum: new Date(),
        homepage: formData.homepage,
        schlagwoerter: ['NEU'],
        titel: {
          titel: formData.title,
          untertitel: formData.untertitel,
        },
        abbildungen: [],
      };
      await createBuch(neuesBuch, token);
      navigate('/buecher');
    } catch (err) {
      setError('Fehler beim Erstellen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Neues Buch</h1>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl border p-6 space-y-4">
        <input
          className="input input-bordered"
          placeholder="Titel"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          className="input input-bordered"
          placeholder="ISBN"
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
        />
        <input
          type="number"
          className="input input-bordered"
          placeholder="Preis"
          onChange={(e) => setFormData({ ...formData, preis: Number(e.target.value) })}
        />
        <div className="card-actions justify-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
}
