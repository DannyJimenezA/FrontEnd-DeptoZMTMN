import { useState } from 'react';
import ApiRoutes from '../components/ApiRoutes';

interface ModalCrearFechaProps {
  isOpen: boolean;
  onClose: () => void;
  onFechaCreada: () => void;
}

const ModalCrearFecha: React.FC<ModalCrearFechaProps> = ({ isOpen, onClose, onFechaCreada }) => {
  const [nuevaFecha, setNuevaFecha] = useState<string>('');

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
      onFechaCreada();
      onClose();
    } catch (error) {
      console.error('Error al crear la fecha:', error);
      alert(`Error al crear la fecha: Error al crear la fecha. Por favor, inténtalo de nuevo`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Crear Nueva Fecha</h2>
        <div className="space-y-4">
          <input
            type="date"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Fecha (YYYY-MM-DD)"
          />
          <button
            onClick={handleCrearFecha}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Crear fecha
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalCrearFecha;