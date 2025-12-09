import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Du musst eingeloggt sein!');
      setLoading(false);
      return;
    }

    try {
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
          title: formData.title,
          untertitel: formData.untertitel,
        },
        abbildungen: [],
      };

      await createBuch(neuesBuch, token);
      alert('Buch erfolgreich angelegt!');
      navigate('/buecher');
    } catch (err) {
      console.error(err);
      setError('Fehler beim Anlegen. Ist die ISBN einzigartig?');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Neues Buch erfassen</h1>
      
      {error && <div className="alert alert-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl border border-base-200 p-6 space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Titel</span></label>
            <input name="title" required className="input input-bordered" onChange={handleChange} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Untertitel</span></label>
            <input name="untertitel" className="input input-bordered" onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text">ISBN</span></label>
            <input name="isbn" required placeholder="978-..." className="input input-bordered" onChange={handleChange} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Preis (€)</span></label>
            <input type="number" name="preis" required min="0" step="0.01" className="input input-bordered" onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Art</span></label>
            <select name="art" className="select select-bordered" onChange={handleChange}>
              <option value="HARDCOVER">Hardcover</option>
              <option value="PAPERBACK">Paperback</option>
              <option value="EPUB">E-Book (EPUB)</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Rating (1-5)</span></label>
            <input type="range" name="rating" min="1" max="5" className="range range-primary" step="1" onChange={handleChange} />
            <div className="w-full flex justify-between text-xs px-2"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
          </div>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Homepage URL</span></label>
          <input name="homepage" type="url" className="input input-bordered" onChange={handleChange} />
        </div>

        <div className="form-control w-32">
          <label className="label cursor-pointer">
            <span className="label-text">Lieferbar</span>
            <input type="checkbox" name="lieferbar" className="toggle toggle-success" defaultChecked onChange={handleChange} />
          </label>
        </div>

        <div className="card-actions justify-end mt-6">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/buecher')}>Abbrechen</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Speichere...' : 'Buch anlegen'}
          </button>
        </div>
      </form>
    </div>
  );
}