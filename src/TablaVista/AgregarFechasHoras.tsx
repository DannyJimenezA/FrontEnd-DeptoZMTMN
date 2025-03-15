import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import ApiRoutes from '../components/ApiRoutes';

interface AgregarFechasHorasProps {
  onFechaCreada: () => void;
  onHorasAgregadas: () => void;
  fechasDisponibles: { id: number; date: string }[];
}

const AgregarFechasHoras: React.FC<AgregarFechasHorasProps> = ({ onFechaCreada, onHorasAgregadas, fechasDisponibles }) => {
  const [showFormFecha, setShowFormFecha] = useState<boolean>(false);
  const [showFormHoras, setShowFormHoras] = useState<boolean>(false);
  const [nuevaFecha, setNuevaFecha] = useState<string>('');
  const [nuevasHoras, setNuevasHoras] = useState<string>('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<number | null>(null);
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);

  const handleCrearFecha = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      alert('No tienes permisos para realizar esta acción.');
      return;
    }

    try {
      const responseFecha = await fetch(ApiRoutes.fechaCitas, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ date: nuevaFecha }),
      });

      if (!responseFecha.ok) {
        const errorData = await responseFecha.json();
        console.error('Error al crear la fecha:', errorData);
        throw new Error(`Error al crear la fecha: ${responseFecha.statusText}`);
      }

      const fechaCreada = await responseFecha.json();
      console.log('Fecha creada:', fechaCreada);

      alert('Fecha creada correctamente');
      setNuevaFecha('');
      setShowFormFecha(false);
      onFechaCreada();
    } catch (error) {
      console.error('Error al crear la fecha:', error);
      alert(`Error al crear la fecha: Por favor inténtelo de nuevo`);
    }
  };

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

    if (!nuevasHoras) {
      alert('Ingresa al menos una hora.');
      return;
    }

    try {
      const horas = nuevasHoras.split(',').map((hora) => hora.trim());

      const responseHoras = await fetch(ApiRoutes.horasCitas, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fechaId: fechaSeleccionada,
          hora: horas,
        }),
      });

      if (!responseHoras.ok) {
        const errorData = await responseHoras.json();
        console.error('Error al crear la hora:', errorData);
        throw new Error(errorData.message || 'Error al crear la hora');
      }

      const horaCreada = await responseHoras.json();
      console.log('Hora creada:', horaCreada);

      alert('Hora agregada correctamente');
      setNuevasHoras('');
      setShowFormHoras(false);
      onHorasAgregadas();
    } catch (error) {
      console.error('Error al agregar horas:', error);
      alert(`Error al agregar horas: Por favor inténtelo de nuevo`);
    }
  };

  const handleFechaSeleccionadaChange = async (fechaId: number) => {
    setFechaSeleccionada(fechaId);
    try {
      const response = await fetch(`${ApiRoutes.horasDisponibles}/${fechaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setHorasDisponibles(data.horasDisponibles);
    } catch (error) {
      console.error('Error al obtener las horas disponibles:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 mb-4">
      <div className="flex space-x-4">
        <button
          onClick={() => {
            setShowFormFecha(!showFormFecha);
            setShowFormHoras(false);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          <FaPlus /> {showFormFecha ? 'Ocultar formulario de fecha' : 'Crear nueva fecha'}
        </button>
        <button
          onClick={() => {
            setShowFormHoras(!showFormHoras);
            setShowFormFecha(false);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          <FaPlus /> {showFormHoras ? 'Ocultar formulario de horas' : 'Agregar horas a fecha'}
        </button>
      </div>

      {showFormFecha && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Crear nueva fecha</h3>
          <div className="space-y-2">
            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Fecha (YYYY-MM-DD)"
            />
            <button
              onClick={handleCrearFecha}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Crear fecha
            </button>
          </div>
        </div>
      )}

      {showFormHoras && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Agregar horas a fecha existente</h3>
          <div className="space-y-2">
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
            <input
              type="text"
              value={nuevasHoras}
              onChange={(e) => setNuevasHoras(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Horas (separadas por comas, ej: ##:##, ##:##)"
            />
            <button
              onClick={handleAgregarHoras}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Agregar horas
            </button>
          </div>
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Horas disponibles:</h4>
            <ul>
              {horasDisponibles.map((hora, index) => (
                <li key={index} className="text-sm">
                  {hora}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgregarFechasHoras;