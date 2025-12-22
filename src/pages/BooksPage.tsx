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
    rating: '',
    lieferbar: false
  });

const ladeBuecher = async (page: number = 0) => {
  setLoading(true);
  setError('');
  try {
    const query: Record<string, string> = {
      page: page.toString(),
      size: '5'
    };
    if (filters.titel) query.titel = filters.titel;
    if (filters.art) query.art = filters.art;
    if (filters.rating) query.rating = filters.rating;
    if (filters.lieferbar) query.lieferbar = 'true';

    const result = await find(query);
    setData(result);
  } catch (err: unknown) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'Fehler beim Laden der Bücher!';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Büchersuche</h1>

      <div className="card bg-base-100 shadow-xl p-6 border border-base-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Titel</span></label>
            <input 
              type="text" 
              placeholder="z.B. Clean Code"
              className="input input-bordered focus:input-primary" 
              value={filters.titel} 
              onChange={e => setFilters({...filters, titel: e.target.value})} 
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Mindest-Rating</span></label>
            <select className="select select-bordered" value={filters.rating} 
                    onChange={e => setFilters({...filters, rating: e.target.value})}>
              <option value="">Alle Bewertungen</option>
              {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Sterne</option>)}
            </select>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-4">
              <input type="checkbox" className="checkbox checkbox-primary" checked={filters.lieferbar} 
                     onChange={e => setFilters({...filters, lieferbar: e.target.checked})} />
              <span className="label-text font-semibold">Sofort lieferbar</span>
            </label>
          </div>

          <button onClick={() => ladeBuecher(0)} className="btn btn-primary shadow-md" disabled={loading}>
            Suchen
          </button>
        </div>
      </div>

      {loading && <BookLoader />}

      {error && <div className="alert alert-error shadow-lg"><span>{error}</span></div>}

      {!loading && data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.content.map((buch) => (
              <div key={buch.id} className="card bg-base-100 shadow-md border border-base-200">
  <div className="card-body">
    <div className="flex justify-between items-start">
      <h2 className="card-title text-xl">{buch.titel?.titel || 'Kein Titel'}</h2>
      <div className="badge badge-outline badge-sm">{buch.art}</div>
    </div>
    
    <p className="text-sm opacity-60 italic min-h-[1.25rem]">
      {buch.titel?.untertitel && buch.titel.untertitel !== 'null' ? buch.titel.untertitel : ''}
    </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-primary">{buch.preis} €</span>
                    <button className="btn btn-sm btn-ghost gap-1" onClick={() => navigate(`/buecher/${buch.id}`)}>
                      Details ↗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-12">
            <div className="join border border-base-300">
              <button 
                className="join-item btn btn-sm" 
                disabled={data.page.number === 0} 
                onClick={() => ladeBuecher(data.page.number - 1)}
              >
                «
              </button>
              <button className="join-item btn btn-sm no-animation cursor-default bg-base-200">
                Seite {data.page.number + 1} / {data.page.totalPages}
              </button>
              <button 
                className="join-item btn btn-sm" 
                disabled={data.page.number >= data.page.totalPages - 1} 
                onClick={() => ladeBuecher(data.page.number + 1)}
              >
                »
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}