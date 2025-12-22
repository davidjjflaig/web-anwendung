import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { find, type BuchPage } from '../API/BuchApi';
import { BookLoader } from '../components/BookLoader';

export default function BooksPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<BuchPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    titel: '',
    art: '',
    lieferbar: false,
  });

  const ladeDaten = async (pageTarget: number = 1) => {
    setLoading(true);
    setError('');
    try {
      const query: Record<string, string> = {
        page: pageTarget.toString(),
        size: '5',
      };
      if (filters.titel) query.titel = filters.titel;
      if (filters.art) query.art = filters.art;
      if (filters.lieferbar) query.lieferbar = 'true';

      const result = await find(query);
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Büchersuche</h1>
      <div className="card bg-base-100 shadow-xl p-6 border border-base-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Titel..."
            value={filters.titel}
            onChange={(e) => setFilters({ ...filters, titel: e.target.value })}
          />
          <label className="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={filters.lieferbar}
              onChange={(e) => setFilters({ ...filters, lieferbar: e.target.checked })}
            />
            <span className="label-text font-bold">Nur lieferbare</span>
          </label>
          <button onClick={() => ladeDaten(1)} className="btn btn-primary" disabled={loading}>
            Suchen
          </button>
        </div>
      </div>

      {loading && <BookLoader />}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.content.map((buch) => (
              <div key={buch.id} className="card bg-base-100 shadow-md border border-base-200">
                <div className="card-body">
                  <h2 className="card-title text-xl">{buch.titel?.titel || 'Kein Titel'}</h2>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-outline" onClick={() => navigate(`/buecher/${buch.id}`)}>
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <div className="join">
              <button className="join-item btn btn-sm" disabled={data.page.number === 0} onClick={() => ladeDaten(data.page.number)}>«</button>
              <button className="join-item btn btn-sm no-animation">Seite {data.page.number + 1} / {data.page.totalPages}</button>
              <button className="join-item btn btn-sm" disabled={data.page.number >= data.page.totalPages - 1} onClick={() => ladeDaten(data.page.number + 2)}>»</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}