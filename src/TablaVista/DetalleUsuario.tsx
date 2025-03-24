import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Usuario } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import '../styles/DetalleUsuario.css'

interface DetalleUsuarioProps {
  usuario: Usuario;
  onVolver: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: boolean) => Promise<void>;
}

const DetalleUsuario: React.FC<DetalleUsuarioProps> = ({ usuario, onVolver }) => {
  const [rolesDisponibles, setRolesDisponibles] = useState<{ id: number; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(usuario.roles.length > 0 ? usuario.roles[0].id : null);
  const [mensaje, setMensaje] = useState<{ tipo: 'error' | 'exito'; texto: string } | null>(null);

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no disponible');

        const response = await axios.get(`${ApiRoutes.urlBase}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRolesDisponibles(response.data);
      } catch (error) {
        console.error('Error al obtener roles:', error);
      }
    };

    cargarRoles();
  }, []);

  const manejarAsignarRol = async () => {
    if (rolSeleccionado === null) {
      setMensaje({ tipo: 'error', texto: 'Seleccione un rol antes de confirmar.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no disponible');

      await axios.patch(
        `${ApiRoutes.urlBase}/users/${usuario.id}/roles`,
        { roles: [rolSeleccionado] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rolNombre = rolesDisponibles.find((r) => r.id === rolSeleccionado)?.name || '';

      setMensaje({ tipo: 'exito', texto: `Rol asignado correctamente: "${rolNombre}".` });

      setTimeout(() => {
        setIsModalOpen(false);
        setMensaje(null);
      }, 2000);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al asignar el rol.' });
      console.error('Error al cambiar rol:', error);
    }
  };

  return (
    <div className="detalle-container">
      <h3>Detalles del Usuario</h3>

      <div className="usuario-info">
        <p><strong>ID:</strong> {usuario.id}</p>
        <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido1} {usuario.apellido2}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Estado:</strong> {usuario.isActive ? 'Activo' : 'Inactivo'}</p>
        <p><strong>Rol Actual:</strong> {usuario.roles.length > 0 ? usuario.roles[0].name : 'Sin rol asignado'}</p>
      </div>

      <div className="botones-container">
        <button className="btn-accion" onClick={() => setIsModalOpen(true)}>Asignar Rol</button>
        <button className="btn-volver" onClick={onVolver}>Volver</button>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Asignar Rol</h3>

            {mensaje ? (
              <p className={`mensaje-${mensaje.tipo}`}>{mensaje.texto}</p>
            ) : (
              <div className="roles-list">
                {rolesDisponibles.map((rol) => (
                  <label key={rol.id} className={`role-option ${rolSeleccionado === rol.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value={rol.id}
                      checked={rolSeleccionado === rol.id}
                      onChange={() => setRolSeleccionado(rol.id)}
                    />
                    <span className="switch">
                      <span className={`circle ${rolSeleccionado === rol.id ? 'active' : ''}`}></span>
                    </span>
                    {rol.name}
                  </label>
                ))}
              </div>
            )}

            <div className="modal-buttons">
              <button onClick={manejarAsignarRol} className="btn-confirmar">Confirmar</button>
              <button onClick={() => setIsModalOpen(false)} className="btn-cancelar">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ESTILOS */}
      <style>{`
        .detalle-container {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 500px;
          margin: auto;
        }
        .usuario-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          text-align: left;
          padding: 10px;
          border-top: 2px solid #007bff;
          margin-bottom: 15px;
        }
        .botones-container {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .btn-accion {
          background: #007bff;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-accion:hover {
          background: #0056b3;
        }
        .btn-volver {
          background: gray;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 320px;
          text-align: center;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
        }
        .roles-list {
          display: flex;
          flex-direction: column;
          align-items: start;
          margin: 10px 0;
        }
        .role-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 0;
          cursor: pointer;
        }
        .switch {
          width: 40px;
          height: 20px;
          background: #ccc;
          border-radius: 10px;
          position: relative;
          transition: background 0.3s ease;
        }
        .switch .circle {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 2px;
          transform: translateY(-50%);
          transition: left 0.3s ease;
        }
        .role-option.selected .switch {
          background: green;
        }
        .role-option.selected .circle {
          left: 22px;
        }
      `}</style>
    </div>
  );
};

export default DetalleUsuario;
