import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { findById, deleteBuch, type Buch } from '../API/BuchApi';

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [buch, setBuch] = useState<Buch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = !!Cookies.get('token');

  useEffect(() => {
    if (!id) return;
    findById(Number(id))
      .then(setBuch)
      .catch(() => setError('Nicht gefunden'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    const token = Cookies.get('token');
    if (buch && token && window.confirm('Löschen?')) {
      await deleteBuch(buch.id, token);
      navigate('/buecher');
    }
  };

  if (loading) return <div className="text-center p-10">Lädt...</div>;
  if (error || !buch) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="card lg:card-side bg-base-100 shadow-xl border">
        <div className="card-body">
          <h2 className="card-title text-4xl font-bold">{buch.titel.titel}</h2>
          <p className="text-xl italic opacity-70">
            {buch.titel.untertitel !== 'null' ? buch.titel.untertitel : ''}
          </p>
          <div className="card-actions justify-end">
            {isAdmin && (
              <button onClick={handleDelete} className="btn btn-error text-white">
                Löschen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
