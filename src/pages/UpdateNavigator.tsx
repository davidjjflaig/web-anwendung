/**
 * Navigationsseite zur Auswahl eines Buches für die Bearbeitung.
 *
 * Ermöglicht die Eingabe einer Buch-ID und leitet anschließend
 * zur Bearbeitungsseite des entsprechenden Buches weiter.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Seite zur Auswahl eines Buches für die Bearbeitung.
 *
 * Leitet nach Eingabe einer Buch-ID zur entsprechenden
 * Update-Seite weiter.
 *
 * @returns React-Seite zur Buchauswahl
 */
export function SelectBookPage() {
  const [id, setId] = useState('');
  const navigate = useNavigate();

  /**
   * Verarbeitet das Absenden des Formulars und navigiert
   * zur Bearbeitungsseite des ausgewählten Buches.
   *
   * @param e Formular-Submit-Event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    navigate(`/buecher/update/${id}`);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buch zum Bearbeiten auswählen</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Buch-ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-full">
          Bearbeiten
        </button>
      </form>
    </div>
  );
}
