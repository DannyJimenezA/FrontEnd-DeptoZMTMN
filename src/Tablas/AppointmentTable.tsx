// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import '../styles/Global.css';
// import { Cita, DecodedToken } from '../Types/Types';
// import { FaEye, FaTrash } from 'react-icons/fa';
// import Paginacion from '../components/Paginacion';
// import ApiRoutes from '../components/ApiRoutes';
// import FiltroFecha from '../components/FiltroFecha';
// import SearchFilterBar from '../components/SearchFilterBar';
// import "../styles/TableButtons.css";
// import { eliminarEntidad } from '../Helpers/eliminarEntidad';

// interface CitasTableProps {
//   onVerCita: (cita: Cita) => void;
// }

// const fetchCitas = async (): Promise<Cita[]> => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Token no encontrado');

//   const response = await fetch(ApiRoutes.citas.crearcita, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`Error: ${response.status} - ${response.statusText}`);
//   }

//   return await response.json();
// };

// const TablaCitas: React.FC<CitasTableProps> = ({ onVerCita }) => {
//   const [citas, setCitas] = useState<Cita[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filtroEstado, setFiltroEstado] = useState('todos');
//   const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
//   const [searchText, setSearchText] = useState('');
//   const [searchBy, setSearchBy] = useState('nombre');
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
//       navigate('/login');
//       return;
//     }

//     try {
//       const decodedToken = jwtDecode<DecodedToken>(token);
//       const hasPermission = decodedToken.permissions.some(
//         (permission) => permission.action === 'GET' && permission.resource === 'appointments'
//       );
//       if (!hasPermission) {
//         alert('No tienes permiso para acceder a esta página.');
//         navigate('/');
//         return;
//       }
//     } catch (err) {
//       alert('Error al validar el token.');
//       navigate('/login');
//       return;
//     }

//     const obtenerCitas = async () => {
//       try {
//         const citasFromAPI = await fetchCitas();
//         setCitas(citasFromAPI);
//       } catch (error) {
//         setError('Error al cargar las citas.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     obtenerCitas();
//   }, [navigate]);

//   const { abrirModalEliminar, ModalEliminar } = eliminarEntidad<Cita>("appointments", setCitas);

//   if (loading) {
//     return <p className="text-gray-500">Cargando citas...</p>;
//   }

//   const citasFiltradas = citas.filter((cita) => {
//     const matchEstado = filtroEstado === 'todos' || cita.status === filtroEstado;
//     const matchFecha = !fechaFiltro || cita.availableDate.date === fechaFiltro.toISOString().split('T')[0];
//     const matchTexto =
//       searchBy === 'nombre'
//         ? cita.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
//         : cita.user?.cedula?.toLowerCase().includes(searchText.toLowerCase());
//     return matchEstado && matchFecha && matchTexto;
//   });

//   const indexUltimaCita = currentPage * itemsPerPage;
//   const indexPrimeraCita = indexUltimaCita - itemsPerPage;
//   const citasActuales = citasFiltradas.slice(indexPrimeraCita, indexUltimaCita);
//   const totalPages = Math.ceil(citasFiltradas.length / itemsPerPage);

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-semibold mb-4">Citas Programadas</h2>
//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       <SearchFilterBar
//         searchPlaceholder="Buscar por nombre o cédula..."
//         searchText={searchText}
//         onSearchTextChange={setSearchText}
//         searchByOptions={[
//           { value: 'nombre', label: 'Nombre' },
//           { value: 'cedula', label: 'Cédula' },
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
//               <option value="Cancelada">Cancelada</option>
//             </select>
//             <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />
//           </div>
//         }
//       />

//       <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha y Hora</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula Solicitante</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre Solicitante</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Estado</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {citasActuales.map((cita) => (
//               <tr key={cita.id}>
//                 <td className="px-4 py-2">{cita.id}</td>
//                 <td className="px-4 py-2">{`${cita.availableDate?.date || 'No disponible'} ${cita.horaCita?.hora || ''}`}</td>
//                 <td className="px-4 py-2">{cita.user?.cedula || 'No disponible'}</td>
//                 <td className="px-4 py-2">{cita.user?.nombre || 'No disponible'}</td>
//                 <td className="px-4 py-2">{cita.status}</td>
//                 <td className="px-4 py-2 space-x-2">
//                   <button onClick={() => onVerCita(cita)} className="button-view">
//                     <FaEye />
//                   </button>
//                   <button onClick={() => abrirModalEliminar(cita.id)} className="button-delete">
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
//         totalPages={totalPages}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//         onItemsPerPageChange={setItemsPerPage}
//       />

//       <ModalEliminar />
//     </div>
//   );
// };

// export default TablaCitas;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import '../styles/Global.css';
import { Cita, DecodedToken } from '../Types/Types';
import { FaEye, FaTrash } from 'react-icons/fa';
import Paginacion from '../components/Paginacion';
import ApiRoutes from '../components/ApiRoutes';
import FiltroFecha from '../components/FiltroFecha';
import SearchFilterBar from '../components/SearchFilterBar';
import "../styles/TableButtons.css";

interface CitasTableProps {
  onVerCita: (cita: Cita) => void;
}

const fetchCitas = async (): Promise<Cita[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  const response = await fetch(ApiRoutes.citas.crearcita, {
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

const TablaCitas: React.FC<CitasTableProps> = ({ onVerCita }) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState('nombre');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const hasPermission = decodedToken.permissions.some(
        (permission) => permission.action === 'GET' && permission.resource === 'appointments'
      );
      if (!hasPermission) {
        alert('No tienes permiso para acceder a esta página.');
        navigate('/');
        return;
      }
    } catch (err) {
      alert('Error al validar el token.');
      navigate('/login');
      return;
    }

    const obtenerCitas = async () => {
      try {
        const citasFromAPI = await fetchCitas();
        setCitas(citasFromAPI);
      } catch (error) {
        setError('Error al cargar las citas.');
      } finally {
        setLoading(false);
      }
    };

    obtenerCitas();
  }, [navigate]);

  const eliminarCita = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar cita?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (confirmacion.isConfirmed) {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${ApiRoutes.citas.crearcita}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la cita');
        }

        Swal.fire('¡Eliminada!', 'La cita ha sido eliminada correctamente.', 'success');
        setCitas(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la cita.', 'error');
      }
    }
  };

  if (loading) {
    return <p className="text-gray-500">Cargando citas...</p>;
  }

  const citasFiltradas = citas.filter((cita) => {
    const matchEstado = filtroEstado === 'todos' || cita.status === filtroEstado;
    const matchFecha = !fechaFiltro || cita.availableDate.date === fechaFiltro.toISOString().split('T')[0];
    const matchTexto =
      searchBy === 'nombre'
        ? cita.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
        : cita.user?.cedula?.toLowerCase().includes(searchText.toLowerCase());
    return matchEstado && matchFecha && matchTexto;
  });

  const indexUltimaCita = currentPage * itemsPerPage;
  const indexPrimeraCita = indexUltimaCita - itemsPerPage;
  const citasActuales = citasFiltradas.slice(indexPrimeraCita, indexUltimaCita);
  const totalPages = Math.ceil(citasFiltradas.length / itemsPerPage);

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Citas Programadas</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre o cédula..."
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombre', label: 'Nombre' },
          { value: 'cedula', label: 'Cédula' },
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
              <option value="Cancelada">Cancelada</option>
            </select>
            <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />
          </div>
        }
      />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha y Hora</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {citasActuales.map((cita) => (
              <tr key={cita.id}>
                <td className="px-4 py-2">{cita.id}</td>
                <td className="px-4 py-2">{`${cita.availableDate?.date || 'No disponible'} ${cita.horaCita?.hora || ''}`}</td>
                <td className="px-4 py-2">{cita.user?.cedula || 'No disponible'}</td>
                <td className="px-4 py-2">{cita.user?.nombre || 'No disponible'}</td>
                <td className="px-4 py-2">{cita.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerCita(cita)} className="button-view">
                    <FaEye />
                  </button>
                  <button onClick={() => eliminarCita(cita.id)} className="button-delete">
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
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default TablaCitas;
