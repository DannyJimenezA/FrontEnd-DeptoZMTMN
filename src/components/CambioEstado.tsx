import React from 'react';

interface EstadoCambioButtonProps {
  id: number;
  nuevoEstado: string;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
  label: string;
  className?: string; 
}

const EstadoCambioButton: React.FC<EstadoCambioButtonProps> = ({ 
  id, 
  nuevoEstado, 
  onEstadoCambiado, 
  label, 
  className = "" // Valor por defecto si no se pasa className
}) => {
  const manejarClick = () => {
    onEstadoCambiado(id, nuevoEstado);
  };

  return (
    <button onClick={manejarClick} className={`estado-boton ${className}`}>
      {label}
    </button>
  );
};

export default EstadoCambioButton;
