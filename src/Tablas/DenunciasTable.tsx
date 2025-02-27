// import React, { useEffect, useState } from 'react';
// import Paginacion from '../components/Paginacion';
// import FilterButtons from '../components/FilterButton';
// import { DecodedToken, Denuncia } from '../Types/Types';
// import { eliminarEntidad } from '../Helpers/eliminarEntidad';
// import { FaEye, FaTrash } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import ApiRoutes from '../components/ApiRoutes';

// const fetchDenuncias = async (): Promise<Denuncia[]> => {
//   const token = localStorage.getItem('token');
//   try {
//     const response = await fetch(ApiRoutes.denuncias, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status} - ${response.statusText}`);
//     }

//     const data: Denuncia[] = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching denuncias:', error);
//     throw error;
//   }
// };

// interface TablaDenunciasProps {
//   onVerDenuncia: (denuncia: Denuncia) => void;
// }

// const TablaDenuncias: React.FC<TablaDenunciasProps> = ({ onVerDenuncia }) => {
//   const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filtroEstado, setFiltroEstado] = useState<string>('todos');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode<DecodedToken>(token);
//         const hasPermission = decodedToken.permissions.some(
//           (permission) => permission.action === 'GET' && permission.resource === 'denuncia'
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

//     const obtenerDenuncias = async () => {
//       try {
//         const denunciasFromAPI = await fetchDenuncias();
//         setDenuncias(denunciasFromAPI);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error al obtener las denuncias:', error);
//         setError('Error al cargar las denuncias.');
//         setLoading(false);
//       }
//     };

//     obtenerDenuncias();
//   }, []);

//   const obtenerDenunciasFiltradas = () => {
//     if (filtroEstado === 'todos') return denuncias;
//     return denuncias.filter((denuncia) => denuncia.Status === filtroEstado);
//   };

//   const denunciasFiltradas = obtenerDenunciasFiltradas();
//   const indiceUltimaDenuncia = currentPage * itemsPerPage;
//   const indicePrimeraDenuncia = indiceUltimaDenuncia - itemsPerPage;
//   const denunciasActuales = denunciasFiltradas.slice(indicePrimeraDenuncia, indiceUltimaDenuncia);
//   const numeroPaginas = Math.ceil(denunciasFiltradas.length / itemsPerPage);

//   const manejarVer = (denuncia: Denuncia) => {
//     onVerDenuncia(denuncia);
//   };

//   const manejarEliminarDenuncia = async (id: number) => {
//     await eliminarEntidad<Denuncia>('denuncia', id, setDenuncias);
//   };

//   if (loading) {
//     return <p>Cargando denuncias...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-semibold mb-4">Listado de Denuncias</h2>

//       {/* Componente de filtro */}
//       <FilterButtons onFilterChange={setFiltroEstado} />

//       {/* Contenedor de la tabla con overflow y ajuste de tamaño */}
//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre del Denunciante</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula del Denunciante</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha Creacion</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Tipo de Denuncia</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Lugar de Denuncia</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Estado</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {denunciasActuales.map((denuncia) => (
//               <tr key={denuncia.id}>
//                 <td className="px-4 py-2">{denuncia.id}</td>
//                 <td className="px-4 py-2">{denuncia.nombreDenunciante || 'Anónimo'}</td>
//                 <td className="px-4 py-2">{denuncia.cedulaDenunciante || 'Anónimo'}</td>
//                 <td className="px-4 py-2">{denuncia.Date}</td>
//                 <td className="px-4 py-2">{denuncia.tipoDenuncia?.descripcion || 'Tipo no disponible'}</td>
//                 <td className="px-4 py-2">{denuncia.lugarDenuncia?.descripcion || 'Lugar no disponible'}</td>
//                 <td className="px-4 py-2">{denuncia.Status}</td>
//                 <td className="px-4 py-2 space-x-2">
//                   <button onClick={() => manejarVer(denuncia)} className="text-green-500 hover:text-green-700"><FaEye /> Ver</button>
//                   <button onClick={() => manejarEliminarDenuncia(denuncia.id)} className="text-red-500 hover:text-red-700"><FaTrash /> Eliminar</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Componente de Paginación */}
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

// export default TablaDenuncias;

import React, { useEffect, useState } from 'react';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton';
import FiltroFecha from '../components/FiltroFecha';
import SearchBar from '../components/SearchBar';
import { DecodedToken, Denuncia } from '../Types/Types';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../components/ApiRoutes';

const fetchDenuncias = async (): Promise<Denuncia[]> => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(ApiRoutes.denuncias, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: Denuncia[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching denuncias:', error);
    throw error;
  }
};

interface TablaDenunciasProps {
  onVerDenuncia: (denuncia: Denuncia) => void;
}

const TablaDenuncias: React.FC<TablaDenunciasProps> = ({ onVerDenuncia }) => {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('nombreDenunciante');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const hasPermission = decodedToken.permissions.some(
          (permission) => permission.action === 'GET' && permission.resource === 'denuncia'
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

    const obtenerDenuncias = async () => {
      try {
        const denunciasFromAPI = await fetchDenuncias();
        setDenuncias(denunciasFromAPI);
      } catch (error) {
        console.error('Error al obtener las denuncias:', error);
        setError('Error al cargar las denuncias.');
      } finally {
        setLoading(false);
      }
    };

    obtenerDenuncias();
  }, []);

  const obtenerDenunciasFiltradas = () => {
    let denunciasFiltradas = denuncias;

    if (filtroEstado !== 'todos') {
      denunciasFiltradas = denunciasFiltradas.filter((denuncia) => denuncia.Status === filtroEstado);
    }

    if (fechaFiltro) {
      const fechaSeleccionada = fechaFiltro.toISOString().split('T')[0];
      denunciasFiltradas = denunciasFiltradas.filter((denuncia) => denuncia.Date === fechaSeleccionada);
    }

    if (searchText) {
      denunciasFiltradas = denunciasFiltradas.filter((denuncia) =>
        searchBy === 'nombreDenunciante'
          ? denuncia.nombreDenunciante?.toLowerCase().includes(searchText.toLowerCase())
          : denuncia.cedulaDenunciante?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return denunciasFiltradas;
  };

  const denunciasFiltradas = obtenerDenunciasFiltradas();
  const indiceUltimaDenuncia = currentPage * itemsPerPage;
  const indicePrimeraDenuncia = indiceUltimaDenuncia - itemsPerPage;
  const denunciasActuales = denunciasFiltradas.slice(indicePrimeraDenuncia, indiceUltimaDenuncia);
  const numeroPaginas = Math.ceil(denunciasFiltradas.length / itemsPerPage);

  const manejarVer = (denuncia: Denuncia) => {
    onVerDenuncia(denuncia);
  };

  const manejarEliminarDenuncia = async (id: number) => {
    await eliminarEntidad<Denuncia>('denuncia', id, setDenuncias);
  };

  if (loading) {
    return <p>Cargando denuncias...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Listado de Denuncias</h2>

      {/* Barra de búsqueda */}
      <SearchBar
        onSearch={setSearchText}
        searchBy={searchBy}
        onSearchByChange={setSearchBy}
      />
      {/* Filtro por fecha */}
      <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />

      {/* Componente de filtro por estado */}
      <FilterButtons onFilterChange={setFiltroEstado} />


      {/* Contenedor de la tabla con overflow y ajuste de tamaño */}
      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre del Denunciante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula del Denunciante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha Creacion</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Tipo de Denuncia</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Lugar de Denuncia</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {denunciasActuales.map((denuncia) => (
              <tr key={denuncia.id}>
                <td className="px-4 py-2">{denuncia.id}</td>
                <td className="px-4 py-2">{denuncia.nombreDenunciante || 'Anónimo'}</td>
                <td className="px-4 py-2">{denuncia.cedulaDenunciante || 'Anónimo'}</td>
                <td className="px-4 py-2">{denuncia.Date}</td>
                <td className="px-4 py-2">{denuncia.tipoDenuncia?.descripcion || 'Tipo no disponible'}</td>
                <td className="px-4 py-2">{denuncia.lugarDenuncia?.descripcion || 'Lugar no disponible'}</td>
                <td className="px-4 py-2">{denuncia.Status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => manejarVer(denuncia)} className="button-view">
                    <FaEye /> Ver
                  </button>
                  <button onClick={() => manejarEliminarDenuncia(denuncia.id)} className="button-delete">
                    <FaTrash /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Componente de Paginación */}
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

export default TablaDenuncias;
