import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type ErrorAlertProps = {
  message: string;
};

export function ErrorAlert({ message }: ErrorAlertProps) {
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
    </div>
  );
}
