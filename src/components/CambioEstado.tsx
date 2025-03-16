import React, { useState } from 'react';

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
  className = "" 
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const manejarClick = () => {
    setMostrarModal(true); // Abrir modal
  };

  const confirmarCambio = () => {
    onEstadoCambiado(id, nuevoEstado);
    setMostrarModal(false); // Cerrar modal
  };

  return (
    <>
      <button onClick={manejarClick} className={`estado-boton ${className}`}>
        {label}
      </button>

      {/* Modal */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmación</h3>
            <p>¿Estás seguro de cambiar el estado a <strong>{nuevoEstado}</strong>?</p>
            <div className="modal-buttons">
              <button onClick={confirmarCambio} className="btn-confirmar">Sí, cambiar</button>
              <button onClick={() => setMostrarModal(false)} className="btn-cancelar">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EstadoCambioButton;
