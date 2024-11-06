import React, { useEffect, useState } from 'react';
import { FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import AsignarPermisosForm from '../TablaVista/AsignarPermisosForm';
import { DecodedToken, Role } from '../Types/Types';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../components/ApiRoutes';

interface RolesTableProps {
  onCrearRol: () => void;
}

const fetchRoles = async (): Promise<Role[]> => {

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(ApiRoutes.roles, {
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
      users: role.users || [],
      permissions: role.permissions || []
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
  const [rolSeleccionado, setRolSeleccionado] = useState<Role | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);

        const hasPermission = decodedToken.permissions.some(
          (permission: { action: string; resource: string }) =>
            permission.action === 'GET' && permission.resource === 'roles'
        );

        if (!hasPermission) {
          window.alert('No tienes permiso para acceder a esta página.');
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        window.alert('Ha ocurrido un error. Por favor, inicie sesión nuevamente.');
        navigate('/login');
        return;
      }
    } else {
      window.alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
      navigate('/login');
      return;
    }

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
  }, [navigate]);

  const manejarVerDetalles = (rol: Role) => {
    setRolSeleccionado(rol);
  };

  const manejarEliminar = async (id: number) => {
    const token = localStorage.getItem('token');
    const confirmacion = window.confirm('¿Estás seguro de eliminar este rol?');
    if (!confirmacion) return;

    try {
      const response = await fetch(`${ApiRoutes.roles}/${id}`, {
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
    setRolSeleccionado(null);
  };

  if (loading) return <p className="text-center">Cargando roles...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  if (rolSeleccionado) {
    return (
      <AsignarPermisosForm rol={rolSeleccionado} onCancelar={manejarVolverAListaRoles} />
    );
  }

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-bold mb-4">Lista de Roles</h2>

//       <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 flex items-center" onClick={onCrearRol}>
//         <FaPlus className="mr-2" /> Crear Nuevo Rol
//       </button>

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="py-2 px-4 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
//               <th className="py-2 px-4 text-left text-sm font-semibold text-gray-500 uppercase">Nombre del Rol</th>
//               {/* <th className="py-2 px-4 text-left text-sm font-semibold text-gray-500 uppercase">Usuarios</th> */}
//               <th className="py-2 px-4 text-left text-sm font-semibold text-gray-500 uppercase">Permisos</th>
//               <th className="py-2 px-4 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {roles.map((rol) => (
//               <tr key={rol.id} className="hover:bg-gray-100">
//                 <td className="py-2 px-4">{rol.id}</td>
//                 <td className="py-2 px-4">{rol.name}</td>
//                 {/* <td className="py-2 px-4">
//                   {rol.users.length > 0 ? (
//                     <ul>
//                       {rol.users.map((user) => (
//                         <li key={user.id}>{user.nombre}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     'No asignado'
//                   )}
//                 </td> */}
//                 <td className="py-2 px-4">
//                   {rol.permissions.length > 0 ? (
//                     <ul>
//                       {rol.permissions.map((permiso) => (
//                         <li key={permiso.id}>{permiso.resource}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     'Permisos por defecto'
//                   )}
//                 </td>
//                 <td className="py-2 px-4 flex space-x-2">
//                   <button onClick={() => manejarVerDetalles(rol)} className="text-blue-500 hover:text-blue-700">
//                     <FaEye /> Ver
//                   </button>
//                   <button onClick={() => manejarEliminar(rol.id)} className="text-red-500 hover:text-red-700">
//                     <FaTrash /> Eliminar
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RolesTable;


return (
  <div className="flex flex-col h-screen p-4"> {/* Contenedor principal con flex */}
    <h2 className="text-2xl font-bold mb-4 text-center">Lista de Roles</h2>
    <div className="mb-4 flex justify-between"> {/* Contenedor para el menú de opciones */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={onCrearRol}>
        <FaPlus className="mr-2" /> Crear Nuevo Rol
      </button>
    </div>

    <div className="overflow-y-auto flex-1"> {/* Contenedor de la tabla que permite desplazamiento vertical */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nombre del Rol</th>
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
                <div className="max-h-24 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                  {rol.permissions.length > 0 ? (
                    <ul>
                      {rol.permissions.map((permiso) => (
                        <li key={permiso.id}>{permiso.resource}</li>
                      ))}
                    </ul>
                  ) : (
                    'Sin permisos'
                  )}
                </div>
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
  </div>
);
};


export default RolesTable;