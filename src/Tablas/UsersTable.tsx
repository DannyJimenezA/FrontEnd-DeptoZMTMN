// import React, { useState, useEffect } from 'react';
// import { DecodedToken, Usuario } from '../Types/Types';
// import Paginacion from '../components/Paginacion';
// import { eliminarEntidad } from '../Helpers/eliminarEntidad';
// import { FaEye, FaTrash } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import ApiRoutes from '../components/ApiRoutes';

// interface UsuariosTableProps {
//   onVerUsuario: (usuario: Usuario) => void;
// }

// const fetchUsuarios = async (): Promise<Usuario[]> => {

//   const token = localStorage.getItem('token');
//   try {
//     const response = await fetch(ApiRoutes.usuarios.usuariosbase, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status} - ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching usuarios:', error);
//     throw error;
//   }
// };

// const UsuariosTable: React.FC<UsuariosTableProps> = ({ onVerUsuario }) => {
//   const [usuarios, setUsuarios] = useState<Usuario[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (token) {
//       try {
//         const decodedToken = jwtDecode<DecodedToken>(token);

//         const hasPermission = decodedToken.permissions.some(
//           (permission: { action: string; resource: string }) =>
//             permission.action === 'GET' && permission.resource === 'users'
//         );

//         if (!hasPermission) {
//           window.alert('No tienes permiso para acceder a esta página.');
//           navigate('/');
//           return;
//         }
//       } catch (error) {
//         console.error('Error al decodificar el token:', error);
//         window.alert('Ha ocurrido un error. Por favor, inicie sesión nuevamente.');
//         navigate('/login');
//         return;
//       }
//     } else {
//       window.alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
//       navigate('/login');
//       return;
//     }

//     const obtenerUsuarios = async () => {
//       try {
//         const usuariosFromAPI = await fetchUsuarios();
//         setUsuarios(usuariosFromAPI);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error al obtener los usuarios:', error);
//         setError('Error al cargar los usuarios.');
//         setLoading(false);
//       }
//     };

//     obtenerUsuarios();
//   }, [navigate]);

//   const indexUltimoUsuario = currentPage * itemsPerPage;
//   const indexPrimerUsuario = indexUltimoUsuario - itemsPerPage;
//   const usuariosActuales = usuarios.slice(indexPrimerUsuario, indexUltimoUsuario);

//   const numeroPaginas = Math.ceil(usuarios.length / itemsPerPage);

//   const manejarEliminarUsuario = async (id: number) => {
//     await eliminarEntidad<Usuario>('users', id, setUsuarios);
//   };

//   if (loading) {
//     return <p>Cargando usuarios...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-semibold mb-4">Lista de Usuarios</h2>

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Apellido</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Email</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Rol</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {usuariosActuales.map((usuario) => (
//               <tr key={usuario.id}>
//                 <td className="px-4 py-2">{usuario.id}</td>
//                 <td className="px-4 py-2">{usuario.nombre}</td>
//                 <td className="px-4 py-2">{usuario.apellido1} {usuario.apellido2}</td>
//                 <td className="px-4 py-2">{usuario.cedula}</td>
//                 <td className="px-4 py-2">{usuario.email}</td>
//                 {/* <td className="px-4 py-2">{usuario.roles?.name}</td> */}
//                 <td className="px-4 py-2">
//   {usuario.roles && usuario.roles.length > 0
//     ? usuario.roles.map((rol) => rol.name).join(', ')
//     : 'Sin rol'}
// </td>
//                 <td className="px-4 py-2 space-x-2">
//                   <button className="text-green-500 hover:text-green-700" onClick={() => onVerUsuario(usuario)}>
//                     <FaEye /> Ver
//                   </button>
//                   <button className="text-red-500 hover:text-red-700" onClick={() => manejarEliminarUsuario(usuario.id)}>
//                     <FaTrash /> Eliminar
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Paginacion
//         currentPage={currentPage}
//         totalPages={numeroPaginas}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//         onItemsPerPageChange={setItemsPerPage}
//       />
//     </div>
//   );
// };

// export default UsuariosTable;

import React, { useState, useEffect } from 'react';
import { DecodedToken, Usuario } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import SearchBar from '../components/SearchBar'; // Importar el componente de búsqueda
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../components/ApiRoutes';
import "../styles/TableButtons.css"

interface UsuariosTableProps {
  onVerUsuario: (usuario: Usuario) => void;
}

const fetchUsuarios = async (): Promise<Usuario[]> => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(ApiRoutes.usuarios.usuariosbase, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    throw error;
  }
};

const UsuariosTable: React.FC<UsuariosTableProps> = ({ onVerUsuario }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchText, setSearchText] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('nombre'); // Define el criterio de búsqueda
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);

        const hasPermission = decodedToken.permissions.some(
          (permission: { action: string; resource: string }) =>
            permission.action === 'GET' && permission.resource === 'users'
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

    const obtenerUsuarios = async () => {
      try {
        const usuariosFromAPI = await fetchUsuarios();
        setUsuarios(usuariosFromAPI);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        setError('Error al cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuarios();
  }, [navigate]);

  // Función para filtrar los usuarios según el criterio de búsqueda y el texto de búsqueda
  const obtenerUsuariosFiltrados = () => {
    return usuarios.filter((usuario) =>
      searchBy === 'nombre'
        ? usuario.nombre.toLowerCase().includes(searchText.toLowerCase())
        : searchBy === 'cedula'
        ? usuario.cedula.toLowerCase().includes(searchText.toLowerCase())
        : usuario.email.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const usuariosFiltrados = obtenerUsuariosFiltrados();
  const indexUltimoUsuario = currentPage * itemsPerPage;
  const indexPrimerUsuario = indexUltimoUsuario - itemsPerPage;
  const usuariosActuales = usuariosFiltrados.slice(indexPrimerUsuario, indexUltimoUsuario);
  const numeroPaginas = Math.ceil(usuariosFiltrados.length / itemsPerPage);

  const manejarEliminarUsuario = async (id: number) => {
    await eliminarEntidad<Usuario>('users', id, setUsuarios);
  };

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Lista de Usuarios</h2>

      {/* Barra de búsqueda */}
      <SearchBar
        onSearch={setSearchText}
        searchBy={searchBy}
        onSearchByChange={setSearchBy}
      />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Apellido</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Rol</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuariosActuales.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-4 py-2">{usuario.id}</td>
                <td className="px-4 py-2">{usuario.nombre}</td>
                <td className="px-4 py-2">
                  {usuario.apellido1} {usuario.apellido2}
                </td>
                <td className="px-4 py-2">{usuario.cedula}</td>
                <td className="px-4 py-2">{usuario.email}</td>
                <td className="px-4 py-2">
                  {usuario.roles && usuario.roles.length > 0
                    ? usuario.roles.map((rol) => rol.name).join(', ')
                    : 'Sin rol'}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button className="button-view" onClick={() => onVerUsuario(usuario)}>
                    <FaEye />
                  </button>
                  <button className="button-delete" onClick={() => manejarEliminarUsuario(usuario.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginacion
        currentPage={currentPage}
        totalPages={numeroPaginas}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default UsuariosTable;
