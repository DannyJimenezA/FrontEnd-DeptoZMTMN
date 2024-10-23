import React from 'react';

interface ModalProps {
  isOpen: boolean;          // Controla si el modal está abierto o cerrado
  onClose: () => void;      // Función para cerrar el modal
  title?: string;           // Título opcional del modal
  children: React.ReactNode; // Contenido del modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // No renderizar el modal si está cerrado

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botón para cerrar el modal */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        
        {/* Título opcional */}
        {title && <h2 className="modal-title">{title}</h2>}

        {/* Contenido dinámico */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
