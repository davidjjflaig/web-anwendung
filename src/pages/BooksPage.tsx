import { useEffect, useState } from 'react';
import { find, type Buch } from '../API/BuchApi';

export default function BooksPage() {
  const [buecher, setBuecher] = useState<Buch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const ladeBuecher = async () => {
      try {
        const data = await find();
        setBuecher(data);
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden der Bücher. (Backend läuft? Zertifikat akzeptiert?)');
      } finally {
        setLoading(false);
      }
    };

    ladeBuecher();
  }, []);

  if (loading)
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (error) return <div className="alert alert-error my-4">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Verfügbare Bücher</h1>
        <div className="badge badge-neutral">{buecher.length} Bücher gefunden</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buecher.map((buch) => (
          <div
            key={buch.id}
            className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-shadow"
          >
            <div className="card-body">
              <h2 className="card-title">
                {buch.titel.title}
                {!buch.lieferbar && (
                  <div className="badge badge-error text-white text-xs">Ausverkauft</div>
                )}
              </h2>

              {}
              {buch.titel?.untertitel && (
                <p className="text-sm opacity-70 italic">{buch.titel.untertitel}</p>
              )}

              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold opacity-50">{buch.art}</span>
                  <div className="rating rating-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <input
                        key={star}
                        type="radio"
                        name={`rating-${buch.id}`}
                        className="mask mask-star-2 bg-orange-400"
                        checked={star === buch.rating}
                        readOnly
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xl font-bold text-primary">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                    buch.preis,
                  )}
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-outline">Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
