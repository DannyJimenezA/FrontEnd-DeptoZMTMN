import React from 'react';

interface EstadoCambioButtonProps {
  id: number; // ID de la cita
  nuevoEstado: string; // El nuevo estado que se asignará
  onEstadoCambiado: (id: number, nuevoEstado: string) => void; // Función para cambiar el estado
  label: string; // Texto del botón (Aprobar, Denegar, etc.)
}

const EstadoCambioButton: React.FC<EstadoCambioButtonProps> = ({ id, nuevoEstado, onEstadoCambiado, label }) => {
  const manejarClick = () => {
    onEstadoCambiado(id, nuevoEstado); // Llamamos a la función que cambiará el estado
  };

  return (
    <button onClick={manejarClick}>
      {label}
    </button>
  );
};

export default EstadoCambioButton;
