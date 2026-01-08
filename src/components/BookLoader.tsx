/**
 * UI-Komponente für Ladezustände im Buch-Kontext.
 */
import { BookOpenIcon } from '@heroicons/react/24/outline';

/**
 * Zeigt einen Ladezustand für Buchdaten an.
 *
 * Wird verwendet, während Buchinformationen vom Backend geladen werden.
 *
 * @returns React-Komponente mit Icon, Spinner und Hinweistext
 */
export function BookLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <BookOpenIcon className="h-10 w-10 animate-bounce text-primary" />
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-sm text-base-content/70">Lade Buch …</p>
    </div>
  );
}
