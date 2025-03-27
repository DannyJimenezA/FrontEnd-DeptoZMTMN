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
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            width: '300px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            <h3>Confirmación</h3>
            <p>¿Estás seguro de cambiar el estado a <strong>{nuevoEstado}</strong>?</p>
            <div className="modal-buttons" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '20px'
            }}>
              <button
                onClick={confirmarCambio}
                style={{
                  backgroundColor: '#4caf50', // Verde
                  color: 'white',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '6px',
                  
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Aceptar
              </button>
              <button
                onClick={() => setMostrarModal(false)}
                style={{
                  backgroundColor: '#f44336', // Rojo
                  color: 'white',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EstadoCambioButton;
