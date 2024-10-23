import React from 'react';

interface CambioEstadoEntidadProps {
  id: number;
  estadoActual: string;
  nuevoEstado: string;
  onChangeEstado: (id: number, nuevoEstado: string) => void;
}

const CambioEstadoEntidad: React.FC<CambioEstadoEntidadProps> = ({ id, estadoActual, nuevoEstado, onChangeEstado }) => {
  const manejarCambioEstado = () => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (confirmacion) {
      onChangeEstado(id, nuevoEstado);
    }
  };

  return (
    <button onClick={manejarCambioEstado}>
      {estadoActual === nuevoEstado ? 'Estado Actual' : `Cambiar a ${nuevoEstado}`}
    </button>
  );
};

export default CambioEstadoEntidad;
