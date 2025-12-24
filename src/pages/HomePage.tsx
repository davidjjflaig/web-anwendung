import { BookOpenIcon, PlusCircleIcon, PencilSquareIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import  { Link } from 'react-router-dom';
import  { ProtectedCard } from '../components/ProtectedCard';

export default function HomePage({ isloggedin }: { isloggedin: boolean }) {
  return (
    <div className="flex flex-col items-center gap-10">
      {/* ... */}

      <section className="grid gap-6 w-full max-w-4xl md:grid-cols-3">
        <Link to="/buecher" className="card bg-base-100 shadow hover:shadow-lg transition">
          <div className="card-body">
            <BookOpenIcon className="h-10 w-10 text-primary mb-2" />
            <h2 className="card-title">Bücher suchen</h2>
            <p>Alle vorhandenen Bücher anzeigen und filtern.</p>
          </div>
        </Link>

        <ProtectedCard to="/buecher/neu" isloggedin={isloggedin}>
          <PlusCircleIcon className="h-10 w-10 text-primary mb-2" />
          <h2 className="card-title">Neues Buch anlegen</h2>
          <p>Ein neues Buch im System erfassen.</p>
        </ProtectedCard>

        <ProtectedCard to="/buecher/select" isloggedin={isloggedin}>
          <PencilSquareIcon className="h-10 w-10 text-primary mb-2" />
          <h2 className="card-title">Buch bearbeiten</h2>
          <p>Ein vorhandenes Buch zur Bearbeitung auswählen.</p>
        </ProtectedCard>

        {!isloggedin && (
          <Link to="/login" className="card bg-base-100 shadow hover:shadow-lg transition">
            <div className="card-body">
              <UserCircleIcon className="h-10 w-10 text-primary mb-2" />
              <h2 className="card-title">Login</h2>
              <p>Am System anmelden, um geschützte Funktionen zu nutzen.</p>
            </div>
          </Link>
        )}
      </section>
    </div>
  );
}
