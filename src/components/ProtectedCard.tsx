/**
 * UI-Komponente für klickbare Karten mit Zugriffsbeschränkung.
 *
 * Die Karte ist nur klickbar, wenn der Benutzer eingeloggt ist.
 * Andernfalls wird sie deaktiviert dargestellt.
 */

import { LockClosedIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

/**
 * Props für die ProtectedCard-Komponente.
 */
type Props = {
  /** Zielpfad, zu dem bei Klick navigiert wird. */
  to: string;

  /** Gibt an, ob der Benutzer aktuell eingeloggt ist. */
  isLoggedIn: boolean;

  /** Inhalt der Karte. */
  children: React.ReactNode;
};

/**
 * Stellt eine Karte dar, die nur für eingeloggte Benutzer klickbar ist.
 *
 * Ist der Benutzer nicht eingeloggt, wird die Karte deaktiviert angezeigt
 * und weist auf die notwendige Anmeldung hin.
 *
 * @param to Zielroute der Karte
 * @param isLoggedIn Login-Status des Benutzers
 * @param children Inhalt der Karte
 * @returns React-Komponente für eine geschützte Karte
 */
export function ProtectedCard({ to, isLoggedIn, children }: Props) {
  if (!isLoggedIn) {
    return (
      <div className="card bg-base-100 shadow opacity-50 cursor-not-allowed relative">
        <div className="card-body">
          <LockClosedIcon className="h-6 w-6 text-error absolute top-4 right-4" />
          {children}
          <p className="text-sm text-error mt-2">Login erforderlich</p>
        </div>
      </div>
    );
  }

  return (
    <Link to={to} className="card bg-base-100 shadow hover:shadow-lg transition">
      <div className="card-body">{children}</div>
    </Link>
  );
}
