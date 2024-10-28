import React, { useState } from 'react';
import { Usuario } from '../Types/Types';

interface DetalleUsuarioProps {
  usuario: Usuario;
  onVolver: () => void;   // Función para volver a la lista de usuarios
  onEstadoCambiado: (id: number, nuevoEstado: boolean) => void; // Función para cambiar el estado (activar/desactivar)
}

const DetalleUsuario: React.FC<DetalleUsuarioProps> = ({ usuario, onVolver, onEstadoCambiado }) => {

  // Función para manejar el cambio de estado del usuario (activar/desactivar)
  const manejarCambioEstado = (nuevoEstado: boolean) => {
    onEstadoCambiado(usuario.id, nuevoEstado);
  };

  return (
    <div className="detalle-tabla">
      <h3>Detalles del Usuario</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {usuario.id}</p>
          <p><strong>Cédula:</strong> {usuario.cedula}</p>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Apellidos:</strong> {usuario.apellido1} {usuario.apellido2}</p>
          <p><strong>Teléfono:</strong> {usuario.telefono}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Estado:</strong> {usuario.isActive ? 'Activo' : 'Inactivo'}</p>
        </div>
      </div>

      {/* Botones para cambiar el estado del usuario */}
      <div className="estado-botones">
        <button
          className="btn-activar"
          onClick={() => manejarCambioEstado(true)}
          disabled={usuario.isActive}
        >
          Activar Usuario
        </button>
        <button
          className="btn-desactivar"
          onClick={() => manejarCambioEstado(false)}
          disabled={!usuario.isActive}
        >
          Desactivar Usuario
        </button>
      </div>

      {/* Botón para volver a la lista de usuarios */}
      <button className="volver-btn" onClick={onVolver}>
        Volver a la lista de usuarios
      </button>
    </div>
  );
};

export default DetalleUsuario;
