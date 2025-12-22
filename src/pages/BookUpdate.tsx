import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { findById, updateBuch, buchtoBuchPutDto, type BuchPutDto } from '../API/BuchApi';
import { useParams, useNavigate } from 'react-router-dom';
import { BookLoader } from '../components/BookLoader';

export function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const buchId = Number(id);
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<BuchPutDto>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    findById(buchId).then(buch => {
      reset(buchtoBuchPutDto(buch));
      setLoading(false);
    });
  }, [buchId, reset]);

  const onSubmit = async (data: BuchPutDto) => {
    const token = Cookies.get('token');
    if (token) {
      await updateBuch({ id: buchId, buch: data, token });
      navigate(`/buecher/${buchId}`);
    }
  };

  if (loading) return <BookLoader />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto p-4">
      <input className="input input-bordered w-full" {...register('isbn')} />
      <button type="submit" className="btn btn-primary" disabled={!isDirty}>Speichern</button>
    </form>
  );
}