// import React, { useEffect, useState } from 'react';
// import Paginacion from '../components/Paginacion';
// import FiltroFecha from '../components/FiltroFecha';
// import SearchFilterBar from '../components/SearchFilterBar';
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
//   const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
//   const [searchText, setSearchText] = useState<string>('');
//   const [searchBy, setSearchBy] = useState<string>('nombreDenunciante');
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
//             permission.action === 'GET' && permission.resource === 'denuncia'
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
//       } catch (error) {
//         console.error('Error al obtener las denuncias:', error);
//         setError('Error al cargar las denuncias.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     obtenerDenuncias();
//   }, []);

//   const obtenerDenunciasFiltradas = () => {
//     let denunciasFiltradas = denuncias;

//     if (filtroEstado !== 'todos') {
//       denunciasFiltradas = denunciasFiltradas.filter((denuncia) => denuncia.status === filtroEstado);
//     }

//     if (fechaFiltro) {
//       const fechaSeleccionada = fechaFiltro.toISOString().split('T')[0];
//       denunciasFiltradas = denunciasFiltradas.filter((denuncia) => denuncia.Date === fechaSeleccionada);
//     }

//     if (searchText) {
//       denunciasFiltradas = denunciasFiltradas.filter((denuncia) =>
//         searchBy === 'nombreDenunciante'
//           ? denuncia.nombreDenunciante?.toLowerCase().includes(searchText.toLowerCase())
//           : denuncia.cedulaDenunciante?.toLowerCase().includes(searchText.toLowerCase())
//       );
//     }

//     return denunciasFiltradas;
//   };

//   const denunciasFiltradas = obtenerDenunciasFiltradas();
//   const indiceUltimaDenuncia = currentPage * itemsPerPage;
//   const indicePrimeraDenuncia = indiceUltimaDenuncia - itemsPerPage;
//   const denunciasActuales = denunciasFiltradas.slice(indicePrimeraDenuncia, indiceUltimaDenuncia);
//   const numeroPaginas = Math.ceil(denunciasFiltradas.length / itemsPerPage);

//   const manejarVer = (denuncia: Denuncia) => {
//     onVerDenuncia(denuncia);
//   };

//   const { abrirModalEliminar, ModalEliminar } = eliminarEntidad<Denuncia>('denuncia', setDenuncias);

//   if (loading) return <p>Cargando denuncias...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-semibold mb-4">Listado de Denuncias</h2>

//       <SearchFilterBar
//         searchPlaceholder="Buscar por nombre o cédula..."
//         searchText={searchText}
//         onSearchTextChange={setSearchText}
//         searchByOptions={[
//           { value: 'nombreDenunciante', label: 'Nombre' },
//           { value: 'cedulaDenunciante', label: 'Cédula' },
//         ]}
//         selectedSearchBy={searchBy}
//         onSearchByChange={setSearchBy}
//         extraFilters={
//           <div className="flex flex-wrap items-end gap-2">
//             <select
//               value={filtroEstado}
//               onChange={(e) => setFiltroEstado(e.target.value)}
//               className="text-sm py-2 px-3 border border-gray-300 rounded-md w-44"
//             >
//               <option value="todos">Todos</option>
//               <option value="Pendiente">Pendiente</option>
//               <option value="Aprobada">Aprobada</option>
//               <option value="Denegada">Denegada</option>
//             </select>

//             <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />
//           </div>
//         }
//       />

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre del Denunciante</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula del Denunciante</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha Creación</th>
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
//                 <td className="px-4 py-2">{denuncia.status}</td>
//                 <td className="px-4 py-2 space-x-2">
//                   <button onClick={() => manejarVer(denuncia)} className="button-view">
//                     <FaEye />
//                   </button>
//                   <button className="button-delete" onClick={() => abrirModalEliminar(denuncia.id)}>
//                     <FaTrash />
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

//       <ModalEliminar />
//     </div>
//   );
// };

// export default TablaDenuncias;

import React, { useEffect, useState } from 'react';
import Paginacion from '../components/Paginacion';
import FiltroFecha from '../components/FiltroFecha';
import SearchFilterBar from '../components/SearchFilterBar';
import { DecodedToken, Denuncia } from '../Types/Types';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../components/ApiRoutes';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const fetchDenuncias = async (): Promise<Denuncia[]> => {
  const token = localStorage.getItem('token');
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

  return await response.json();
};

interface TablaDenunciasProps {
  onVerDenuncia: (denuncia: Denuncia) => void;
}

const TablaDenuncias: React.FC<TablaDenunciasProps> = ({ onVerDenuncia }) => {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState('nombreDenunciante');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      MySwal.fire('Error', 'No se ha encontrado un token de acceso.', 'error');
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const hasPermission = decodedToken.permissions.some(
        (p) => p.action === 'GET' && p.resource === 'denuncia'
      );
      if (!hasPermission) {
        MySwal.fire('Acceso Denegado', 'No tienes permiso para acceder a esta página.', 'error');
        navigate('/');
        return;
      }
    } catch (err) {
      MySwal.fire('Error', 'Error al validar el token.', 'error');
      navigate('/login');
      return;
    }

    const cargarDenuncias = async () => {
      try {
        const data = await fetchDenuncias();
        setDenuncias(data);
      } catch (err) {
        setError('Error al cargar las denuncias.');
      } finally {
        setLoading(false);
      }
    };

    cargarDenuncias();
  }, [navigate]);

  const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: '¿Eliminar denuncia?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ApiRoutes.denuncias}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setDenuncias(prev => prev.filter(d => d.id !== id));
        MySwal.fire('Eliminada', 'La denuncia ha sido eliminada.', 'success');
      } else {
        MySwal.fire('Error', 'No se pudo eliminar la denuncia.', 'error');
      }
    }
  };

  const filtradas = denuncias.filter(d => {
    const matchEstado = filtroEstado === 'todos' || d.status === filtroEstado;
    const matchFecha = !fechaFiltro || d.Date === fechaFiltro.toISOString().split('T')[0];
    const matchTexto = searchBy === 'nombreDenunciante'
      ? d.nombreDenunciante?.toLowerCase().includes(searchText.toLowerCase())
      : d.cedulaDenunciante?.toLowerCase().includes(searchText.toLowerCase());

    return matchEstado && matchFecha && matchTexto;
  });

  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const paginaActual = filtradas.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(filtradas.length / itemsPerPage);

  if (loading) return <p>Cargando denuncias...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Listado de Denuncias</h2>

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre o cédula..."
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombreDenunciante', label: 'Nombre' },
          { value: 'cedulaDenunciante', label: 'Cédula' },
        ]}
        selectedSearchBy={searchBy}
        onSearchByChange={setSearchBy}
        extraFilters={
          <div className="flex flex-wrap items-end gap-2">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="text-sm py-2 px-3 border border-gray-300 rounded-md w-44"
            >
              <option value="todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Denegada">Denegada</option>
            </select>

            <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />
          </div>
        }
      />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Cédula</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Lugar</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginaActual.map((denuncia) => (
              <tr key={denuncia.id}>
                <td className="px-4 py-2">{denuncia.id}</td>
                <td className="px-4 py-2">{denuncia.nombreDenunciante || 'Anónimo'}</td>
                <td className="px-4 py-2">{denuncia.cedulaDenunciante || 'Anónimo'}</td>
                <td className="px-4 py-2">{denuncia.Date}</td>
                <td className="px-4 py-2">{denuncia.tipoDenuncia?.descripcion || 'Tipo no disponible'}</td>
                <td className="px-4 py-2">{denuncia.lugarDenuncia?.descripcion || 'Lugar no disponible'}</td>
                <td className="px-4 py-2">{denuncia.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerDenuncia(denuncia)} className="button-view">
                    <FaEye />
                  </button>
                  <button onClick={() => handleDelete(denuncia.id)} className="button-delete">
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
        totalPages={totalPaginas}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default TablaDenuncias;
