import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

// Estructura limpia para tipar las entradas del formulario con react-hook-form
interface ReservationFormInputs {
  date: string;
  time: string;
  number_of_people: number;
  special_requests: string;
}

// Estructura de una reserva devuelta por el Backend
interface ReservationItem {
  id: number;
  date: string;
  time: string;
  number_of_people: number;
  special_requests?: string;
  clienteId?: number;
}

const Reservations = () => {
  const { user } = useAuth(); // Mantenido por si deseas usarlo en la UI más adelante
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const today = new Date().toISOString().split('T')[0];

  // Inicializamos useForm con nuestra interfaz de tipado
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReservationFormInputs>({
    defaultValues: {
      date: '',
      time: '',
      number_of_people: 2,
      special_requests: '',
    }
  });

  const fetchReservations = async (): Promise<void> => {
    try {
      const res = await API.get<ReservationItem[]>('reservas');
      setReservations(res.data);
    } catch (err) {
      console.error('Error al obtener reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Función de envío nativa de react-hook-form (adiós FormEvent)
  const onSubmit: SubmitHandler<ReservationFormInputs> = async (data) => {
    setSubmitting(true);
    setSuccess(false);
    try {
      await API.post('reservas', data);
      setSuccess(true);

      // Resetea el formulario a sus valores por defecto de forma segura
      reset();

      fetchReservations();
    } catch (err) {
      alert('Error al crear la reserva. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    try {
      await API.delete(`reservas/${id}`);
      setReservations((prev) => prev.filter((r: ReservationItem) => r.id !== id));
    } catch {
      alert('Error al cancelar.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-lemon-green font-semibold text-center mb-10">
        Mis Reservas {user?.nombre ? `de ${user.nombre}` : ''}
      </h1>

      {/* Formulario */}
      <div className="card p-8 mb-10">
        <h2 className="text-2xl font-semibold text-lemon-dark mb-6">Nueva reserva</h2>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✅ ¡Reserva creada con éxito!
          </div>
        )}

        {/* handleSubmit intercepta el envío de forma moderna */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Campo: Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              min={today}
              className={`input-field ${errors.date ? 'border-red-400' : ''}`}
              {...register('date', { required: 'La fecha es obligatoria.' })}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>

          {/* Campo: Hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input
              type="time"
              className={`input-field ${errors.time ? 'border-red-400' : ''}`}
              {...register('time', { required: 'La hora es obligatoria.' })}
            />
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
          </div>

          {/* Campo: Número de personas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de personas</label>
            <input
              type="number"
              className={`input-field ${errors.number_of_people ? 'border-red-400' : ''}`}
              {...register('number_of_people', {
                required: 'Este campo es obligatorio.',
                valueAsNumber: true, // Asegura que TypeScript y JS lo traten como número
                min: { value: 1, message: 'Mínimo 1 persona.' },
                max: { value: 20, message: 'Máximo 20 personas.' }
              })}
            />
            {errors.number_of_people && <p className="text-red-500 text-xs mt-1">{errors.number_of_people.message}</p>}
          </div>

          {/* Campo: Solicitudes especiales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Solicitudes especiales</label>
            <input
              type="text"
              placeholder="Alergias, celebraciones, etc."
              className="input-field"
              {...register('special_requests')}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary disabled:opacity-60 cursor-pointer"
            >
              {submitting ? 'Reservando...' : 'Confirmar reserva'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de reservas */}
      <h2 className="text-2xl font-semibold text-lemon-dark mb-4">
        Tus reservas actuales
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-lemon-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reservations.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No tienes reservas todavía.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((r: ReservationItem) => (
            <div key={r.id} className="card p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-lemon-dark">
                  📅 {r.date} — {r.time.slice(0, 5)}
                </p>
                <p className="text-gray-500 text-sm">
                  👥 {r.number_of_people} persona(s)
                  {r.special_requests && ` · ${r.special_requests}`}
                </p>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;