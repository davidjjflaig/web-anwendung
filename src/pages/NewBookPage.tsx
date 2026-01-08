import { useForm, useFieldArray } from 'react-hook-form';
import { createBuch, type BuchCreate } from '../API/BuchApi';
import Cookies from 'js-cookie';
import { BookLoader } from '../components/BookLoader';
import { ErrorAlert } from '../components/ErrorAlert';
import { useState } from 'react';

const ISBN_REGEX = /^(97(8|9))?[\d-]{9,17}[\dX]$/;

export default function NewBookPage() {
  type FormModel = Omit<BuchCreate, 'schlagwoerter' | 'datum'> & {
    schlagwoerterInput: string;
    datum: string;
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormModel>({
    defaultValues: {
      art: 'EPUB',
      lieferbar: true,
      rating: 0,
      abbildungen: [{ beschriftung: '', contentType: '' }],
      schlagwoerterInput: '',
      titel: { titel: '', untertitel: '' },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'abbildungen',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const token = Cookies.get('token') || '';

  const onSubmit = async (form: FormModel) => {
    setLoading(true);
    setError('');
    try {
      const buch: BuchCreate = {
        isbn: form.isbn.replace(/-/g, ''),
        rating: form.rating,
        art: form.art,
        preis: form.preis,
        rabatt: form.rabatt,
        lieferbar: !!form.lieferbar,
        datum: form.datum ? new Date(form.datum) : new Date(),
        homepage: form.homepage,
        schlagwoerter: form.schlagwoerterInput
          ? form.schlagwoerterInput
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        titel: {
          titel: form.titel.titel,
          untertitel: form.titel.untertitel,
        },
        abbildungen:
          form.abbildungen?.map((a) => ({
            beschriftung: a.beschriftung,
            contentType: a.contentType,
          })) ?? [],
      };

      await createBuch(buch, token);
      alert('Buch erstellt ✅');
      reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <BookLoader />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label htmlFor="titel" className="label">
            <span className="label-text font-bold">Titel</span>
          </label>
          <input
            id="titel"
            type="text"
            className="input input-bordered"
            aria-label='Titel'
            {...register('titel.titel', { required: true })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="untertitel" className="label">
            <span className="label-text font-bold">Untertitel</span>
          </label>
          <input
            id="untertitel"
            type="text"
            className="input input-bordered"
            aria-label='Untertitel'
            {...register('titel.untertitel')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label htmlFor="isbn" className="label">
            <span className="label-text font-bold">ISBN</span>
          </label>
          <input
            id="isbn"
            type="text"
            className="input input-bordered"
            {...register('isbn', {
              required: true,
              pattern: { value: ISBN_REGEX, message: 'Ungültige ISBN' },
            })}
          />
          {errors.isbn && (
            <div className="text-error text-sm mt-1">
              <span>{errors.isbn.message}</span>
            </div>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="art" className="label">
            <span className="label-text font-bold">Art</span>
          </label>
          <select
            id="art"
            className="select select-bordered"
            {...register('art', { required: true })}
          >
            <option value="EPUB">EPUB</option>
            <option value="HARDCOVER">Hardcover</option>
            <option value="PAPERBACK">Paperback</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-control">
          <label htmlFor="rating" className="label">
            <span className="label-text font-bold">Rating</span>
          </label>
          <input
            id="rating"
            type="number"
            min={0}
            max={5}
            step={1}
            className="input input-bordered"
            {...register('rating', { valueAsNumber: true })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="preis" className="label">
            <span className="label-text font-bold">Preis</span>
          </label>
          <input
            id="preis"
            type="number"
            step="0.01"
            className="input input-bordered"
            {...register('preis', { valueAsNumber: true, required: true })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="rabatt" className="label">
            <span className="label-text font-bold">Rabatt</span>
          </label>
          <input
            id="rabatt"
            type="number"
            step="0.01"
            min={0}
            max={1}
            className="input input-bordered"
            {...register('rabatt', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="form-control">
        <label htmlFor="lieferbar" className="label cursor-pointer gap-4">
          <input
            id="lieferbar"
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register('lieferbar')}
          />
          <span className="label-text font-bold">Lieferbar</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label htmlFor="datum" className="label">
            <span className="label-text font-bold">Erscheinungsdatum</span>
          </label>
          <input id="datum" type="date" className="input input-bordered" {...register('datum')} />
        </div>

        <div className="form-control">
          <label htmlFor="homepage" className="label">
            <span className="label-text font-bold">Homepage</span>
          </label>
          <input
            id="homepage"
            type="url"
            className="input input-bordered"
            {...register('homepage')}
          />
        </div>
      </div>

      <div className="form-control">
        <label htmlFor="schlagwoerter" className="label">
          <span className="label-text font-bold">Schlagwörter (kommagetrennt)</span>
        </label>
        <input
          id="schlagwoerter"
          type="text"
          className="input input-bordered"
          {...register('schlagwoerterInput')}
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text font-bold">Abbildungen</span>
        </label>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-2">
            <div className="form-control">
              <label htmlFor={`abbildung-beschriftung-${index}`} className="label">
                <span className="label-text">Beschriftung</span>
              </label>
              <input
                id={`abbildung-beschriftung-${index}`}
                className="input input-bordered"
                {...register(`abbildungen.${index}.beschriftung` as const)}
              />
            </div>

            <div className="form-control">
              <label htmlFor={`abbildung-content-${index}`} className="label">
                <span className="label-text">Content-Type</span>
              </label>
              <input
                id={`abbildung-content-${index}`}
                className="input input-bordered"
                {...register(`abbildungen.${index}.contentType` as const)}
              />
            </div>

            <button type="button" className="btn btn-sm btn-outline" onClick={() => remove(index)}>
              Entfernen
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-sm mt-2"
          onClick={() => append({ beschriftung: '', contentType: '' })}
        >
          Abbildung hinzufügen
        </button>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">
          Buch erstellen
        </button>
        <button type="button" className="btn" onClick={() => reset()}>
          Zurücksetzen
        </button>
      </div>

      {error && <ErrorAlert message={error} />}
    </form>
  );
}
