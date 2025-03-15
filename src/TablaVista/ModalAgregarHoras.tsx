import { useState, useEffect } from 'react';
import ApiRoutes from '../components/ApiRoutes';

interface ModalAgregarHorasProps {
  isOpen: boolean;
  onClose: () => void;
  onHorasAgregadas: () => void;
  fechasDisponibles: { id: number; date: string }[];
}

const ModalAgregarHoras: React.FC<ModalAgregarHorasProps> = ({
  isOpen,
  onClose,
  onHorasAgregadas,
  fechasDisponibles,
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<number | null>(null);
  const [horasSeleccionadas, setHorasSeleccionadas] = useState<string[]>([]);
  const [horasCreadas, setHorasCreadas] = useState<string[]>([]); // Horas ya creadas
  const [loadingHoras, setLoadingHoras] = useState<boolean>(false); // Estado de carga

  // Horas preestablecidas
  const horasPreestablecidas = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', 
    '15:00', '15:30'
  ];

  // Obtener las horas ya creadas para la fecha seleccionada
  const obtenerHorasCreadas = async (fechaId: number) => {
    setLoadingHoras(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(ApiRoutes.horasCitas+`/fecha/${fechaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      // Normalizar las horas: eliminar los segundos
      const horasNormalizadas = data.horasCreadas.map((hora: string) => hora.slice(0, 5));
      setHorasCreadas(horasNormalizadas);
    } catch (error) {
      console.error('Error al obtener las horas creadas:', error);
    } finally {
      setLoadingHoras(false);
    }
  };

  // Actualizar las horas creadas cuando cambia la fecha seleccionada
  useEffect(() => {
    if (fechaSeleccionada) {
      obtenerHorasCreadas(fechaSeleccionada);
    } else {
      setHorasCreadas([]); // Limpiar las horas creadas si no hay fecha seleccionada
    }
  }, [fechaSeleccionada]);

  // Seleccionar todas las horas disponibles
  const seleccionarTodasLasHoras = () => {
    const horasDisponibles = horasPreestablecidas.filter((hora) => !horasCreadas.includes(hora));
    setHorasSeleccionadas(horasDisponibles);
  };

  // Deseleccionar todas las horas
  const deseleccionarTodasLasHoras = () => {
    setHorasSeleccionadas([]);
  };

  // Quitar el check de una hora seleccionada
//   const quitarHoraSeleccionada = (hora: string) => {
//     setHorasSeleccionadas(horasSeleccionadas.filter((h) => h !== hora));
//   };

  // Crear las horas seleccionadas
  const handleAgregarHoras = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      alert('No tienes permisos para realizar esta acción.');
      return;
    }

    if (!fechaSeleccionada) {
      alert('Selecciona una fecha para agregar horas.');
      return;
    }

    if (horasSeleccionadas.length === 0) {
      alert('Selecciona al menos una hora.');
      return;
    }

    try {
      const responseHoras = await fetch(ApiRoutes.horasCitas, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fechaId: fechaSeleccionada,
          hora: horasSeleccionadas,
        }),
      });

      if (!responseHoras.ok) {
        const errorData = await responseHoras.json();
        console.error('Error al crear la hora:', errorData);
        throw new Error(errorData.message || 'Error al crear la hora');
      }

      const horaCreada = await responseHoras.json();
      console.log('Horas creadas:', horaCreada);

      alert('Horas agregadas correctamente');

      // Limpiar las horas seleccionadas
      setHorasSeleccionadas([]);

      // Actualizar las horas creadas
      await obtenerHorasCreadas(fechaSeleccionada);

      // Notificar al componente padre que se agregaron horas
      onHorasAgregadas();

      // Cerrar el modal
      onClose();
    } catch (error) {
      console.error('Error al agregar horas:', error);
      alert(`Error al agregar horas: Por favor, inténtalo de nuevo.`);
    }
  };

  const handleFechaSeleccionadaChange = (fechaId: number) => {
    setFechaSeleccionada(fechaId);
    setHorasSeleccionadas([]); // Limpiar las horas seleccionadas al cambiar la fecha
  };

  const handleSeleccionarHora = (hora: string) => {
    if (horasSeleccionadas.includes(hora)) {
      setHorasSeleccionadas(horasSeleccionadas.filter((h) => h !== hora));
    } else {
      setHorasSeleccionadas([...horasSeleccionadas, hora]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Agregar Horas a Fecha Existente</h2>
        <div className="space-y-4">
          <select
            value={fechaSeleccionada || ''}
            onChange={(e) => handleFechaSeleccionadaChange(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona una fecha</option>
            {fechasDisponibles.map((fecha) => (
              <option key={fecha.id} value={fecha.id}>
                {fecha.date}
              </option>
            ))}
          </select>

          {loadingHoras ? (
            <p>Cargando horas...</p>
          ) : (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Selecciona las horas:</h4>
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={seleccionarTodasLasHoras}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Seleccionar todas
                </button>
                <button
                  onClick={deseleccionarTodasLasHoras}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Deseleccionar todas
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {horasPreestablecidas.map((hora, index) => {
                  const isHoraCreada = horasCreadas.includes(hora); // Verificar si la hora ya fue creada
                  return (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isHoraCreada || horasSeleccionadas.includes(hora)}
                        onChange={() => handleSeleccionarHora(hora)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                        disabled={isHoraCreada} // Deshabilitar si la hora ya fue creada
                      />
                      <span className={isHoraCreada ? 'text-gray-400' : ''}>{hora}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botones de confirmar y cancelar */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={handleAgregarHoras}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarHoras;