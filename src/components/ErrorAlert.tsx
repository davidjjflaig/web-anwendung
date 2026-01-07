import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

type ErrorAlertProps = {
  message: string;
};


export function ErrorAlert({ message }: ErrorAlertProps) {
  const navigate = useNavigate();
  return (
    <div
      key={message}
      className="
        alert alert-error my-4 shadow-lg
        transition-all duration-300
        animate-fade-in
      "
    >
      <ExclamationTriangleIcon className="h-6 w-6 shrink-0" />
      <span>{message}</span>
      <div className="flex-none">
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => navigate(0)}
          aria-label="Seite neu laden"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}
