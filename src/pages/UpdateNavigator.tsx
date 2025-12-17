import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SelectBookPage() {
  const [id, setId] = useState('');
  const navigate = useNavigate();

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
