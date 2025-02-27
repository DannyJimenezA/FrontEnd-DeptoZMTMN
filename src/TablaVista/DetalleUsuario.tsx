import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Usuario } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';

interface DetalleUsuarioProps {
  usuario: Usuario;
  onVolver: () => void;   // Función para volver a la lista de usuarios
  onEstadoCambiado: (id: number, nuevoEstado: boolean) => void; // Función para cambiar el estado (activar/desactivar)
}

const DetalleUsuario: React.FC<DetalleUsuarioProps> = ({ usuario, onVolver }) => {
  const [nuevoRol, setNuevoRol] = useState<string>(''); // Estado para el rol seleccionado
  const [rolesDisponibles, setRolesDisponibles] = useState<{ id: number; name: string }[]>([]); // Roles disponibles
  const [error, setError] = useState<string | null>(null); // Estado para mensajes de error
  const [exito, setExito] = useState<string | null>(null); // Estado para mensajes de éxito
  const [usuarioActualizado, setUsuarioActualizado] = useState<Usuario>(usuario); // Usuario actualizado

  // Función para cargar los roles disponibles desde la API
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        if (!token) {
          throw new Error('Token no disponible');
        }
        const response = await axios.get(`${ApiRoutes.urlBase}/roles`, {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
          },
        });
        setRolesDisponibles(response.data); // Guardar los roles disponibles
      } catch (error) {
        console.error('Error al obtener roles:', error);
        setError('Error al cargar los roles disponibles.');
      }
    };

    cargarRoles();
  }, []);

  // Función para manejar el cambio de estado del usuario (activar/desactivar)
  // const manejarCambioEstado = (nuevoEstado: boolean) => {
  //   onEstadoCambiado(usuario.id, nuevoEstado);
  // };

  // Función para manejar el cambio de rol del usuario
  const manejarCambioRol = async () => {
    if (!nuevoRol.trim()) {
      setError('Seleccione un rol antes de confirmar.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no disponible');
      }

      // Realizar la petición PATCH para actualizar el rol
      const response = await axios.patch(
        `${ApiRoutes.urlBase}/users/${usuario.id}/roles`,
        { roles: [parseInt(nuevoRol)] }, // Convertir el rol seleccionado a número y enviarlo como un array
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExito(`Rol actualizado exitosamente a "${rolesDisponibles.find(r => r.id.toString() === nuevoRol)?.name}".`);
      setError(null); // Limpiar errores

      // Actualizar la información del usuario localmente
      setUsuarioActualizado((prev) => ({
        ...prev,
        roles: [
          {
            id: parseInt(nuevoRol),
            name: rolesDisponibles.find((rol) => rol.id.toString() === nuevoRol)?.name || '',
          },
        ],
      }));

      console.log(response.data); // Depuración
    } catch (error) {
      setError('Error al actualizar el rol del usuario.');
      setExito(null); // Limpiar mensajes de éxito
      console.error('Error al cambiar rol:', error);
    }
  };

  return (
    <div className="detalle-tabla">
      <h3>Detalles del Usuario</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {usuarioActualizado.id}</p>
          <p><strong>Cédula:</strong> {usuarioActualizado.cedula}</p>
          <p><strong>Nombre:</strong> {usuarioActualizado.nombre}</p>
          <p><strong>Apellidos:</strong> {usuarioActualizado.apellido1} {usuarioActualizado.apellido2}</p>
          <p><strong>Teléfono:</strong> {usuarioActualizado.telefono}</p>
          <p><strong>Email:</strong> {usuarioActualizado.email}</p>
          <p><strong>Estado:</strong> {usuarioActualizado.isActive ? 'Activo' : 'Inactivo'}</p>
          <p><strong>Rol Actual:</strong> {usuarioActualizado.roles.length > 0 ? usuarioActualizado.roles[0].name : 'Sin rol asignado'}</p>
        </div>
      </div>

      {/* Mensajes de error o éxito */}
      {error && <p className="mensaje-error">{error}</p>}
      {exito && <p className="mensaje-exito">{exito}</p>}

      {/* Botones para cambiar el estado del usuario
      <div className="estado-botones">
        <button
          className="btn-activar"
          onClick={() => manejarCambioEstado(true)}
          disabled={usuarioActualizado.isActive}
        >
          Activar Usuario
        </button>
        <button
          className="btn-desactivar"
          onClick={() => manejarCambioEstado(false)}
          disabled={!usuarioActualizado.isActive}
        >
          Desactivar Usuario
        </button>
      </div> */}

      {/* Selección y cambio de rol */}
      <div className="rol-asignacion">
        <h4>Asignar Rol</h4>
        <div className="rol-seleccion">
          <select
            value={nuevoRol}
            onChange={(e) => setNuevoRol(e.target.value)}
            className="rol-dropdown"
          >
            <option value="" disabled>
              Seleccione un rol
            </option>
            {rolesDisponibles.map((rol) => (
              <option key={rol.id} value={rol.id.toString()}>
                {rol.name}
              </option>
            ))}
          </select>
          <button
            className="btn-cambiar-rol"
            onClick={manejarCambioRol}
            disabled={!nuevoRol.trim()}
          >
            Cambiar Rol
          </button>
        </div>
      </div>

      {/* Botón para volver a la lista de usuarios */}
      <button className="volver-btn" onClick={onVolver}>
        Volver a la lista de usuarios
      </button>
    </div>
  );
};

export default DetalleUsuario;
