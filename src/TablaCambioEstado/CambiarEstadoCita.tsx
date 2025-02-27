import React from 'react';
import ApiRoutes from '../components/ApiRoutes';

interface CambiarEstadoCitaProps {
  id: number;
  nuevoEstado: string;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void; // Callback para notificar el cambio
  label: string;  // Etiqueta del botón
}

const CambiarEstadoCita: React.FC<CambiarEstadoCitaProps> = ({ id, nuevoEstado, onEstadoCambiado, label }) => {

  const manejarClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }

      const response = await fetch(`${ApiRoutes.citas}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la cita');
      }

      // Notificar al componente padre sobre el cambio de estado
      onEstadoCambiado(id, nuevoEstado);

    } catch (error) {
      console.error('Error al cambiar el estado de la cita:', error);
      alert('Hubo un error al cambiar el estado de la cita.');
    }
  };

  return (
    <button onClick={manejarClick} className="btn-cambiar-estado">
      {label}
    </button>
  );
};

export default CambiarEstadoCita;
