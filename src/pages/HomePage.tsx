import {
  BookOpenIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-10">
      {/* Hero / Begrüßung */}
      <section className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Willkommen zur Buch-Webanwendung</h1>
        <p className="text-lg text-base-content/70">
          Verwalten Sie Bücher, durchsuchen Sie den Bestand und legen Sie neue Einträge an.
        </p>
      </section>

      {/* Kacheln für Navigation */}
      <section className="grid gap-6 w-full max-w-4xl md:grid-cols-3">
        <Link to="/buecher" className="card bg-base-100 shadow hover:shadow-lg transition">
          <div className="card-body">
            <BookOpenIcon className="h-10 w-10 text-primary mb-2" />
            <h2 className="card-title">Bücher suchen</h2>
            <p>Alle vorhandenen Bücher anzeigen und filtern.</p>
          </div>
        </Link>

        <Link to="/buecher/neu" className="card bg-base-100 shadow hover:shadow-lg transition">
          <div className="card-body">
            <PlusCircleIcon className="h-10 w-10 text-primary mb-2" />
            <h2 className="card-title">Neues Buch anlegen</h2>
            <p>Ein neues Buch im System erfassen.</p>
          </div>
        </Link>
        <Link to="/buecher/select" className="card bg-base-100 shadow hover:shadow-lg transition">
          <div className="card-body">
            <PencilSquareIcon className="h-10 w-10 text-primary mb-2" />
            <h2 className="card-title">Buch bearbeiten</h2>
            <p>Ein vorhandenes Buch zur Bearbeitung auswählen.</p>
          </div>
        </Link>

        <Link to="/login" className="card bg-base-100 shadow hover:shadow-lg transition">
          <div className="card-body">
            <UserCircleIcon className="h-10 w-10 text-primary mb-2" />
            <h2 className="card-title">Login</h2>
            <p>Am System anmelden, um geschützte Funktionen zu nutzen.</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
