import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { findById, updateBuch, buchtoBuchPutDto, type BuchPutDto } from '../API/BuchApi';
import { useParams } from 'react-router-dom';
import { BookLoader } from '../components/BookLoader';
import { ErrorAlert } from '../components/ErrorAlert';
import Cookies from 'js-cookie';

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
  const [error, setError] = useState<string>('');
  const token = Cookies.get('token') || '';

  useEffect(() => {
    async function load() {
      try {
        const buch = await findById(buchId);
        const dto = buchtoBuchPutDto(buch);
        let formValues = dto;
        if (dto.datum) {
          const dateString = new Date(dto.datum).toISOString().split('T')[0];
          formValues = {
            ...dto,
            datum: dateString,
          } as unknown as BuchPutDto;
        }
        reset(formValues);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unbekannter Fehler');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [buchId, reset]);

  const onSubmit = async (data: BuchPutDto) => {
    try {
      await updateBuch({
        id: buchId,
        buch: data,
        token,
      });
      alert('Buch aktualisiert ✅');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler');
    }
  };

  if (loading) return <BookLoader />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div className="form-control">
        <label className="label">
          <span className="label-text">ISBN</span>
        </label>
        <input className="input input-bordered w-full" {...register('isbn', { required: true })} />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Bewertung (1–5)</span>
        </label>
        <input
          type="number"
          className="input input-bordered w-full"
          {...register('rating', { valueAsNumber: true, min: 1, max: 5 })}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Art</span>
        </label>
        <select className="select select-bordered w-full" {...register('art')}>
          <option value="HARDCOVER">Hardcover</option>
          <option value="PAPERBACK">Paperback</option>
          <option value="EPUB">EPUB</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Preis (€)</span>
        </label>
        <input
          type="number"
          step="0.01"
          className="input input-bordered w-full"
          {...register('preis', { valueAsNumber: true })}
        />
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input type="checkbox" className="checkbox" {...register('lieferbar')} />
          <span className="label-text">Lieferbar</span>
        </label>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Erscheinungsdatum</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          {...register('datum', {
            setValueAs: (v) => new Date(v),
          })}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Schlagwörter (kommagetrennt)</span>
        </label>
        <input
          className="input input-bordered w-full"
          {...register('schlagwoerter', {
            setValueAs: (v) => (typeof v === 'string' ? v.split(',').map((s) => s.trim()) : v),
          })}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={!isDirty}>
        Speichern
      </button>
    </form>
  );
}
