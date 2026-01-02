import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { findById, updateBuch, buchtoBuchPutDto, type BuchPutDto } from '../API/BuchApi';
import { useParams } from 'react-router-dom';
import { BookLoader } from '../components/BookLoader';

export function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    throw new Error('Keine Buch-ID angegeben');
  }
  const buchId = Number(id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<BuchPutDto>();

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    async function load() {
      try {
        const buch = await findById(buchId);
        reset(buchtoBuchPutDto(buch));
        setLoading(false);
      } catch (error) {
        alert(`Fehler beim Laden des Buches: ${error}`);
      }
    }
    load();
  }, [buchId, reset]);

  const onSubmit = async (data: BuchPutDto) => {
    await updateBuch({
      id: buchId,
      buch: data,
      token,
    });
    alert('Buch aktualisiert ✅');
  };

  if (loading) return <BookLoader />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <input className="input input-bordered w-full" {...register('isbn', { required: true })} />
      <input
        type="number"
        className="input input-bordered w-full"
        {...register('rating', { valueAsNumber: true, min: 1, max: 5 })}
      />

      <select className="select select-bordered w-full" {...register('art')}>
        <option value="HARDCOVER">Hardcover</option>
        <option value="PAPERBACK">Paperback</option>
        <option value="EPUB">EPUB</option>
      </select>

      <input
        type="number"
        step="0.01"
        className="input input-bordered w-full"
        {...register('preis', { valueAsNumber: true })}
      />

      <label className="flex gap-2 items-center">
        <input type="checkbox" {...register('lieferbar')} />
        Lieferbar
      </label>

      <input
        type="date"
        className="input input-bordered w-full"
        {...register('datum', {
          setValueAs: (v) => new Date(v),
        })}
      />

      <input
        className="input input-bordered w-full"
        {...register('schlagwoerter', {
          setValueAs: (v) => (typeof v === 'string' ? v.split(',').map((s) => s.trim()) : v),
        })}
      />

      <button type="submit" className="btn btn-primary" disabled={!isDirty}>
        Speichern
      </button>
    </form>
  );
}
