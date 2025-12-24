import { LockClosedIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  isloggedin: boolean;
  children: React.ReactNode;
};

export function ProtectedCard({ to, isloggedin, children }: Props) {
  if (!isloggedin) {
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
