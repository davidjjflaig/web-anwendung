import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { findById, updateBuch, buchtoBuchPutDto, type BuchPutDto } from '../API/BuchApi';
import { useParams, useNavigate } from 'react-router-dom';
import { BookLoader } from '../components/BookLoader';

export function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  useEffect(() => {
    async function load() {
      try {
        const buch = await findById(buchId);
        reset(buchtoBuchPutDto(buch));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [buchId, reset]);

  const onSubmit = async (data: BuchPutDto) => {
    const token = Cookies.get('token');
    if (!token) return;
    try {
      await updateBuch({
        id: buchId,
        buch: data,
        token,
      });
      alert('Buch aktualisiert ✅');
      navigate(`/buecher/${buchId}`);
    } catch {
      alert('Fehler beim Aktualisieren');
    }
  };

  if (loading) return <BookLoader />;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buch bearbeiten</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">ISBN</span>
          </label>
          <input
            className="input input-bordered w-full"
            {...register('isbn', { required: true })}
          />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={!isDirty}>
          Speichern
        </button>
      </form>
    </div>
  );
}
