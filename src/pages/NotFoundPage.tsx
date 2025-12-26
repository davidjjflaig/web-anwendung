import { Link } from 'react-router-dom';
import { BookOpenIcon } from '@heroicons/react/24/outline';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="flex items-center gap-3 mb-6">
        <BookOpenIcon className="h-12 w-12 text-primary" />
        <span className="text-3xl font-black tracking-tight">BuchApp</span>
      </div>

      <h1 className="text-[8rem] font-black text-primary leading-none">404</h1>

      <p className="mt-4 text-xl opacity-70 max-w-md">
        Die Seite, die du suchst, existiert nicht oder wurde verschoben.
      </p>

      <div className="mt-8 flex gap-4">
        <Link to="/" className="btn btn-primary">
          Startseite
        </Link>

        <Link to="/buecher" className="btn btn-outline">
          Bücherliste
        </Link>
      </div>
    </div>
  );
}
