/**
 * Detailansicht für ein einzelnes Buch.
 *
 * Lädt Buchdaten anhand der ID aus der URL, zeigt alle relevanten
 * Informationen an und ermöglicht – bei ausreichender Berechtigung –
 * das Löschen des Buches.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { findById, deleteBuch, type Buch } from '../API/BuchApi';

/**
 * Seite zur Anzeige der Details eines Buches.
 *
 * Verwendet die Buch-ID aus den Routenparametern, um die Daten
 * vom Backend zu laden. Unterstützt Lade- und Fehlerzustände
 * sowie administrative Aktionen wie das Löschen eines Buches.
 *
 * @returns React-Seite für Buchdetails
 */
export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [buch, setBuch] = useState<Buch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = !!Cookies.get('token');

  /**
   * Lädt die Buchdaten vom Backend, sobald sich die Buch-ID ändert.
   */
  useEffect(() => {
    if (!id) return;

    const ladeBuch = async () => {
      try {
        setLoading(true);
        const buchDaten = await findById(Number(id));
        setBuch(buchDaten);
      } catch {
        setError('Buch konnte nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };

    ladeBuch();
  }, [id]);

  /**
   * Simuliert das Hinzufügen des Buches zum Warenkorb.
   */
  const handlebuy = async () => {
    alert('In den Warenkorb gelegt!');
  };

  /**
   * Löscht das aktuell angezeigte Buch nach Benutzerbestätigung.
   *
   * Erfordert ein gültiges Authentifizierungs-Token.
   */
  const handleDelete = async () => {
    if (!buch || !window.confirm(`Möchtest du "${buch.titel.titel}" wirklich löschen?`)) return;

    const token = Cookies.get('token');
    if (!token) return;

    try {
      await deleteBuch(buch.id, token);
      alert('Buch gelöscht!');
      navigate('/buecher');
    } catch {
      alert('Fehler beim Löschen!');
    }
  };

  if (loading)
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (error || !buch)
    return <div className="alert alert-error">{error || 'Buch nicht gefunden'}</div>;

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <button onClick={() => navigate('/buecher')} className="btn btn-ghost mb-4">
        ← Zurück
      </button>

      <div className="card lg:card-side bg-base-100 shadow-xl border border-base-200">
        <figure className="bg-base-200 min-h-[300px] lg:w-1/3 flex items-center justify-center">
          <span className="text-9xl select-none text-base-content/20">📖</span>
        </figure>

        <div className="card-body lg:w-2/3">
          <div className="flex justify-between items-start">
            <h2 className="card-title text-4xl font-bold">{buch.titel?.titel}</h2>
            <div className="badge badge-secondary">{buch.art}</div>
          </div>

          {buch.titel?.untertitel && buch.titel.untertitel !== 'null' && (
            <p className="text-xl italic opacity-70">{buch.titel.untertitel}</p>
          )}

          <div>
            <div className="font-bold text-sm uppercase opacity-50">Bewertung</div>
            <div className="mt-1">
              <div className="rating rating-md rating-half pointer-events-none">
                <input type="radio" className="rating-hidden" />

                {[1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    type="radio"
                    className="mask mask-star-2 bg-yellow-400"
                    checked={buch.rating === i}
                    readOnly
                  />
                ))}
              </div>
            </div>
          </div>

          {Array.isArray(buch.schlagwoerter) && buch.schlagwoerter.length > 0 && (
            <div className="mb-4">
              <div className="font-bold text-sm uppercase opacity-50">Schlagwörter</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {buch.schlagwoerter.map((tag) => (
                  <span key={tag} className="badge badge-outline">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {buch.datum && !Number.isNaN(new Date(buch.datum).getTime()) && (
              <div>
                <div className="font-bold text-sm uppercase opacity-50">Erscheinungsdatum</div>
                <div className="mt-1">{new Date(buch.datum).toLocaleDateString('de-DE')}</div>
              </div>
            )}

            {buch.homepage && (
              <div>
                <div className="font-bold text-sm uppercase opacity-50">Homepage</div>
                <div className="mt-1">
                  <a
                    className="link link-primary break-words"
                    href={
                      buch.homepage.startsWith('http') ? buch.homepage : `https://${buch.homepage}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {buch.homepage}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="divider"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="stat-title text-sm uppercase font-bold opacity-50">Preis</div>
              <div className="stat-value text-primary">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                  buch.preis,
                )}
              </div>
            </div>
          </div>

          <div className="card-actions justify-end mt-8 gap-2">
            {isAdmin && (
              <button onClick={handleDelete} className="btn btn-error text-white">
                Löschen
              </button>
            )}
            <button
              className="btn btn-primary btn-wide"
              disabled={!buch.lieferbar}
              onClick={handlebuy}
            >
              In den Warenkorb
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
