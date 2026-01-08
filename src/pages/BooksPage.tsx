/**
 * Übersichtsseite zur Suche und Anzeige von Büchern.
 *
 * Ermöglicht das Filtern von Büchern nach verschiedenen Kriterien
 * und zeigt die Ergebnisse paginiert an.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { find, type BuchPage } from '../API/BuchApi';
import { BookLoader } from '../components/BookLoader';

/**
 * Seite zur Suche und Anzeige einer Buchliste.
 *
 * Unterstützt Filter wie Titel, Art, Lieferbarkeit, Rating und Preis
 * sowie eine paginierte Darstellung der Ergebnisse.
 *
 * @returns React-Seite für die Buchsuche
 */
export default function BooksPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<BuchPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Filterkriterien für die Buchsuche.
   */
  const [filters, setFilters] = useState({
    titel: '',
    art: '',
    lieferbar: false,
    rating: 0,
    preisMax: undefined as number | undefined,
  });

  /**
   * Lädt Buchdaten vom Backend anhand der aktuellen Filtereinstellungen.
   *
   * @param pageTarget Zielseite für die Pagination (1-basiert)
   */
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
      if (filters.rating) query.rating = filters.rating.toString();
      if (filters.preisMax !== undefined && filters.preisMax !== null)
        query.preis = filters.preisMax.toString();

      const result = await find(query);
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Server-Fehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg p-6 border border-base-200">
        <h1 className="text-2xl font-bold mb-4">Bücher suchen</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <input
            type="text"
            placeholder="Titel..."
            className="input input-bordered"
            value={filters.titel}
            onChange={(e) => setFilters({ ...filters, titel: e.target.value })}
          />
          <div>
            <label htmlFor="art-select" className="label">
              <span className="label-text font-bold">Art</span>
            </label>
            <select
              id="art-select"
              className="select select-bordered w-full"
              value={filters.art}
              onChange={(e) => setFilters({ ...filters, art: e.target.value })}
            >
              <option value="">Alle Arten</option>
              <option value="EPUB">EPUB</option>
              <option value="HARDCOVER">Hardcover</option>
              <option value="PAPERBACK">Paperback</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-4">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={filters.lieferbar}
                onChange={(e) => setFilters({ ...filters, lieferbar: e.target.checked })}
              />
              <span className="label-text font-bold">Nur lieferbare</span>
            </label>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-bold">Rating (min)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1}
                max={5}
                value={filters.rating || 1}
                onChange={(e) => setFilters({ ...filters, rating: parseInt(e.target.value, 10) })}
                aria-label="Rating"
                title="Rating"
                className="range"
              />
              <span className="ml-2 font-bold">
                {filters.rating === 0 ? 'Alle' : filters.rating}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setFilters({ ...filters, rating: 0 })}
              >
                X
              </button>
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-bold">Preis (≤)</span>
            </label>
            <input
              type="number"
              placeholder="≤ Preis"
              className="input input-bordered"
              value={filters.preisMax ?? ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  preisMax: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>

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
                  <h2 className="card-title text-xl">{buch.titel?.titel || 'Unbekannter Titel'}</h2>
                  <p className="text-sm opacity-60">
                    {buch.titel?.untertitel !== 'null' ? buch.titel?.untertitel : ''}
                  </p>
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => navigate(`/buecher/${buch.id}`)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            <div className="join">
              <button
                className="join-item btn btn-sm"
                disabled={data.page.number === 0}
                onClick={() => ladeDaten(data.page.number)}
              >
                «
              </button>

              <button className="join-item btn btn-sm bg-base-200">
                Seite {data.page.number + 1} von {data.page.totalPages}
              </button>

              <button
                className="join-item btn btn-sm"
                disabled={data.page.number >= data.page.totalPages - 1}
                onClick={() => ladeDaten(data.page.number + 2)}
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
