import React, { useEffect, useState } from 'react';
import { FaTrash, FaEye, FaPlus } from 'react-icons/fa';  // Iconos para ver, eliminar, y agregar
import AsignarPermisosForm from '../TablaVista/AsignarPermisosForm';  // Importa el componente para asignar permisos
import '../styles/Global.css';  // Estilos
import { Role, User } from '../Types/Types';  // Asegúrate de importar los tipos correctos

interface RolesTableProps {
  onCrearRol: () => void; // Prop para manejar la creación de un nuevo rol
}
const fetchRoles = async (): Promise<Role[]> => {
  const urlBase = 'http://localhost:3000/roles';  // Ajusta a la ruta de tu API
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(urlBase, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: Role[] = await response.json();
    return data.map((role) => ({
      ...role,
      users: role.users || [], // Asegúrate de que siempre sea un array
      permissions: role.permissions || [] // Asegúrate de que siempre sea un array
    }));
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// El resto de la implementación...

const RolesTable: React.FC<RolesTableProps> = ({ onCrearRol }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rolSeleccionado, setRolSeleccionado] = useState<Role | null>(null); // Estado para el rol seleccionado

  useEffect(() => {
    const cargarRoles = async () => {
      setLoading(true);
      try {
        const rolesFromAPI = await fetchRoles();
        setRoles(rolesFromAPI);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los roles.');
        setLoading(false);
      }
    };
    cargarRoles();
  }, []);

  const manejarVerDetalles = (rol: Role) => {
    setRolSeleccionado(rol);  // Establecer el rol seleccionado
  };

  const manejarEliminar = async (id: number) => {
    const token = localStorage.getItem('token');
    const confirmacion = window.confirm('¿Estás seguro de eliminar este rol?');
    if (!confirmacion) return;

    try {
      const response = await fetch(`http://localhost:3000/roles/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el rol');
      }

      setRoles(roles.filter((rol) => rol.id !== id));
    } catch (error) {
      console.error('Error al eliminar el rol:', error);
    }
  };

  const manejarVolverAListaRoles = () => {
    setRolSeleccionado(null); // Volver a la lista de roles
  };

  if (loading) return <p>Cargando roles...</p>;
  if (error) return <p>{error}</p>;

  // Si hay un rol seleccionado, muestra el formulario de asignar permisos
  if (rolSeleccionado) {
    return (
      <AsignarPermisosForm rol={rolSeleccionado} onCancelar={manejarVolverAListaRoles} />
    );
  }

  // Si no hay rol seleccionado, muestra la tabla de roles
  return (
    <div className="tabla-container">
      <h2>Lista de Roles</h2>
      {/* Botón para crear nuevo rol */}
      <button className="crear-rol-btn" onClick={onCrearRol}>
        <FaPlus /> Crear Nuevo Rol
      </button>

      {/* Tabla de roles */}
      <table className="tabla-roles">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Rol</th>
            <th>Usuarios</th>
            <th>Permisos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => (
            <tr key={rol.id}>
              <td>{rol.id}</td>
              <td>{rol.name}</td>
              <td>
                {rol.users.length > 0 ? (
                  <ul>
                    {rol.users.map((user) => (
                      <li key={user.id}>{user.nombre}</li>
                    ))}
                  </ul>
                ) : (
                  'No asignado'
                )}
              </td>
              <td>
                {rol.permissions.length > 0 ? (
                  <ul>
                    {rol.permissions.map((permiso) => (
                      <li key={permiso.id}>{permiso.resource}</li>
                    ))}
                  </ul>
                ) : (
                  'Sin permisos'
                )}
              </td>
              <td>
                <button onClick={() => manejarVerDetalles(rol)}>
                  <FaEye /> Ver
                </button>
                <button onClick={() => manejarEliminar(rol.id)} className="eliminar-btn">
                  <FaTrash /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolesTable;
