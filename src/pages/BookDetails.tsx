import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Stelle sicher, dass 'Buch' in BuchApi.ts exportiert ist!
import { findById, type Buch } from '../API/BuchApi';

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [buch, setBuch] = useState<Buch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const ladeBuch = async () => {
      try {
        setLoading(true);
        const buchDaten = await findById(Number(id));
        setBuch(buchDaten);
      } catch (err) {
        console.error(err);
        setError('Buch konnte nicht geladen werden. Existiert die ID?');
      } finally {
        setLoading(false);
      }
    };

    ladeBuch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !buch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="alert alert-error max-w-md">
          <span>{error || 'Buch nicht gefunden'}</span>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/buecher')}>
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <button onClick={() => navigate('/buecher')} className="btn btn-ghost mb-4 gap-2">
        ← Zurück
      </button>

      <div className="card lg:card-side bg-base-100 shadow-xl border border-base-200 overflow-visible">
        <figure className="bg-base-200 min-h-[300px] lg:w-1/3 flex items-center justify-center">
          <span className="text-9xl select-none">📖</span>
        </figure>

        <div className="card-body lg:w-2/3">
          
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <h2 className="card-title text-4xl font-bold">{buch.titel?.title}</h2>
              <div className="badge badge-secondary badge-outline uppercase font-bold p-3">
                {buch.art}
              </div>
            </div>
            
            {buch.titel?.untertitel && (
              <p className="text-xl text-base-content/70 italic">
                {buch.titel.untertitel}
              </p>
            )}
          </div>

          <div className="divider my-2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div>
              <div className="stat-title text-lg">Preis</div>
              <div className="stat-value text-primary mb-2">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(buch.preis)}
              </div>
              
              <div className={`alert ${buch.lieferbar ? 'alert-success' : 'alert-warning'} py-2`}>
                <span className="font-bold text-sm">
                  {buch.lieferbar ? '✅ Sofort lieferbar' : '⚠️ Derzeit nicht lieferbar'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between border-b border-base-200 pb-1">
                <span className="font-semibold opacity-70">ISBN:</span>
                <span className="font-mono">{buch.isbn}</span>
              </div>
              
              <div className="flex justify-between border-b border-base-200 pb-1">
                <span className="font-semibold opacity-70">Bewertung:</span>
                <div className="rating rating-sm rating-half">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <input 
                      key={star} 
                      type="radio" 
                      className="mask mask-star-2 bg-orange-400 cursor-default" 
                      checked={star <= buch.rating} 
                      readOnly 
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between border-b border-base-200 pb-1">
                <span className="font-semibold opacity-70">Erschienen:</span>
                <span>{buch.datum ? new Date(buch.datum).toLocaleDateString() : 'Unbekannt'}</span>
              </div>

              {buch.homepage && (
                <div className="pt-2">
                  <a href={buch.homepage} target="_blank" rel="noreferrer" className="link link-primary">
                    Zur Verlagshomepage ↗
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="card-actions justify-end mt-8">
            <button className="btn btn-primary btn-wide" disabled={!buch.lieferbar}>
              In den Warenkorb
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}