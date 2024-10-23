import React, { useEffect, useState } from 'react';
import { FaTrash, FaEye } from 'react-icons/fa';  // Iconos para ver y eliminar
import { useNavigate } from 'react-router-dom';   // Para la navegación
import CrearRolForm from './CrearRolForm';        // Importar el componente para crear roles
import '../styles/Global.css';                    // Asegúrate de tener estilos globales

// Interfaz para Role
interface Permission {
  id: number;
  name: string;
}

interface User {
  id: number;
  nombre: string;
}

interface Role {
  id: number;
  name: string;
  users: User[];
  permissions: Permission[];
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

    // Asegúrate de que `permissions` y `users` siempre sean arrays
    return data.map((role) => ({
      ...role,
      users: role.users || [],
      permissions: role.permissions || []
    }));
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

const RolesTable: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Función para actualizar la lista de roles después de crear uno nuevo
  const actualizarRoles = async () => {
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

  useEffect(() => {
    actualizarRoles(); // Cargar roles al cargar el componente
  }, []);

  const manejarEliminar = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

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
        throw new Error(`Error al eliminar el rol con ID: ${id}`);
      }

      setRoles((prevRoles) => prevRoles.filter((rol) => rol.id !== id));
      console.log(`Rol con ID: ${id} eliminado`);
    } catch (error) {
      console.error('Error al eliminar el rol:', error);
    }
  };

  const manejarVerDetalles = (id: number) => {
    navigate(`/roles/${id}`);
  };

  if (loading) return <p>Cargando roles...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tabla-container">
      <h2>Lista de Roles</h2>
      
      {/* Formulario para crear un nuevo rol */}
      <CrearRolForm onRolCreado={actualizarRoles} />

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
                      <li key={permiso.id}>{permiso.name}</li>
                    ))}
                  </ul>
                ) : (
                  'Sin permisos'
                )}
              </td>
              <td>
                <button onClick={() => manejarVerDetalles(rol.id)}>
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
