import React, { useEffect, useState } from 'react';
import { FaTrash, FaEye, FaPlus } from 'react-icons/fa';  // Iconos para ver, eliminar, y agregar
import AsignarPermisosForm from '../TablaVista/AsignarPermisosForm';  // Importa el componente para asignar permisos
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

  if (loading) return <p className="text-center">Cargando roles...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // Si hay un rol seleccionado, muestra el formulario de asignar permisos
  if (rolSeleccionado) {
    return (
      <AsignarPermisosForm rol={rolSeleccionado} onCancelar={manejarVolverAListaRoles} />
    );
  }

  // Si no hay rol seleccionado, muestra la tabla de roles
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Roles</h2>
      {/* Botón para crear nuevo rol */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 flex items-center" onClick={onCrearRol}>
        <FaPlus className="mr-2" /> Crear Nuevo Rol
      </button>

      {/* Tabla de roles */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nombre del Rol</th>
            <th className="py-2 px-4 border-b">Usuarios</th>
            <th className="py-2 px-4 border-b">Permisos</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => (
            <tr key={rol.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{rol.id}</td>
              <td className="py-2 px-4 border-b">{rol.name}</td>
              <td className="py-2 px-4 border-b">
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
              <td className="py-2 px-4 border-b">
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
              <td className="py-2 px-4 border-b flex space-x-2">
                <button onClick={() => manejarVerDetalles(rol)} className="text-blue-500 hover:underline">
                  <FaEye /> Ver
                </button>
                <button onClick={() => manejarEliminar(rol.id)} className="text-red-500 hover:underline">
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
