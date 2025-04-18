// import React, { useEffect, useState } from 'react';
// import { CopiaExpediente, DecodedToken } from '../Types/Types';
// import Paginacion from '../components/Paginacion';
// import FiltroFecha from '../components/FiltroFecha';
// import SearchFilterBar from '../components/SearchFilterBar';
// import { eliminarEntidad } from '../Helpers/eliminarEntidad';
// import { FaEye, FaTrash } from 'react-icons/fa';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import ApiRoutes from '../components/ApiRoutes';

// interface ExpedientesTableProps {
//   onVerExpediente: (expediente: CopiaExpediente) => void;
// }

// const fetchExpedientes = async (): Promise<CopiaExpediente[]> => {
//   const token = localStorage.getItem('token');
//   const response = await fetch(ApiRoutes.expedientes, {
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

// const ExpedientesTable: React.FC<ExpedientesTableProps> = ({ onVerExpediente }) => {
//   const [expedientes, setExpedientes] = useState<CopiaExpediente[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filtroEstado, setFiltroEstado] = useState('todos');
//   const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
//   const [searchText, setSearchText] = useState('');
//   const [searchBy, setSearchBy] = useState('nombreSolicitante');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
//       return navigate('/login');
//     }

//     try {
//       const decodedToken = jwtDecode<DecodedToken>(token);
//       const hasPermission = decodedToken.permissions.some(
//         (p: { action: string; resource: string; }) => p.action === 'GET' && p.resource === 'copia_expediente'
//       );
//       if (!hasPermission) {
//         alert('No tienes permiso para acceder a esta página.');
//         return navigate('/');
//       }
//     } catch (eror) {
//       alert('Error con el token. Por favor, inicia sesión de nuevo.');
//       return navigate('/login');
//     }

//     const obtener = async () => {
//       try {
//         const data = await fetchExpedientes();
//         setExpedientes(data);
//       } catch {
//         setError('Error al cargar los expedientes.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     obtener();
//   }, [navigate]);

//   const filtrados = () => {
//     let lista = expedientes;

//     if (filtroEstado !== 'todos') {
//       lista = lista.filter((e) => e.status === filtroEstado);
//     }

//     if (fechaFiltro) {
//       const fecha = fechaFiltro.toISOString().split('T')[0];
//       lista = lista.filter((e) => e.Date === fecha);
//     }

//     if (searchText) {
//       lista = lista.filter((e) =>
//         searchBy === 'nombreSolicitante'
//           ? e.nombreSolicitante?.toLowerCase().includes(searchText.toLowerCase())
//           : e.numeroExpediente?.toString().includes(searchText)
//       );
//     }

//     return lista;
//   };

//   const listaFinal = filtrados();
//   const ultima = currentPage * itemsPerPage;
//   const primera = ultima - itemsPerPage;
//   const actuales = listaFinal.slice(primera, ultima);
//   const totalPaginas = Math.ceil(listaFinal.length / itemsPerPage);

//   const { abrirModalEliminar, ModalEliminar } = eliminarEntidad<CopiaExpediente>('expedientes', setExpedientes);

//   if (loading) return <p>Cargando expedientes...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="flex flex-col w-full h-full p-4">
//       <h2 className="text-2xl font-semibold mb-4">Solicitudes de Expedientes</h2>

//       <SearchFilterBar
//         searchPlaceholder="Buscar por nombre o número..."
//         searchText={searchText}
//         onSearchTextChange={setSearchText}
//         searchByOptions={[
//           { value: 'nombreSolicitante', label: 'Nombre' },
//           { value: 'numeroExpediente', label: 'N° Expediente' },
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
//               <option value="Aprobado">Aprobado</option>
//               <option value="Denegado">Denegado</option>
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
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Solicitante</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">N° Expediente</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Estado</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {actuales.map((exp) => (
//               <tr key={exp.idExpediente}>
//                 <td className="px-4 py-2">{exp.idExpediente}</td>
//                 <td className="px-4 py-2">{exp.nombreSolicitante || 'N/A'}</td>
//                 <td className="px-4 py-2">{exp.numeroExpediente}</td>
//                 <td className="px-4 py-2">{exp.Date}</td>
//                 <td className="px-4 py-2">{exp.status || 'Pendiente'}</td>
//                 <td className="px-4 py-2 space-x-2">
//                   <button onClick={() => onVerExpediente(exp)} className="button-view">
//                     <FaEye />
//                   </button>
//                   <button className="button-delete" onClick={() => abrirModalEliminar(exp.idExpediente)}>
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
//         totalPages={totalPaginas}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//         onItemsPerPageChange={setItemsPerPage}
//       />

//       <ModalEliminar />
//     </div>
//   );
// };

// export default ExpedientesTable;

import React, { useEffect, useState } from 'react';
import { CopiaExpediente, DecodedToken } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FiltroFecha from '../components/FiltroFecha';
import SearchFilterBar from '../components/SearchFilterBar';
import { FaEye, FaTrash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../components/ApiRoutes';
import Swal from 'sweetalert2';

interface ExpedientesTableProps {
  onVerExpediente: (expediente: CopiaExpediente) => void;
}

const fetchExpedientes = async (): Promise<CopiaExpediente[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(ApiRoutes.expedientes, {
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

const ExpedientesTable: React.FC<ExpedientesTableProps> = ({ onVerExpediente }) => {
  const [expedientes, setExpedientes] = useState<CopiaExpediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState('nombreSolicitante');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
      return navigate('/login');
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const hasPermission = decodedToken.permissions.some(
        (p: { action: string; resource: string }) =>
          p.action === 'GET' && p.resource === 'copia_expediente'
      );
      if (!hasPermission) {
        alert('No tienes permiso para acceder a esta página.');
        return navigate('/');
      }
    } catch (error) {
      alert('Error con el token. Por favor, inicia sesión de nuevo.');
      return navigate('/login');
    }

    const obtener = async () => {
      try {
        const data = await fetchExpedientes();
        setExpedientes(data);
      } catch {
        setError('Error al cargar los expedientes.');
      } finally {
        setLoading(false);
      }
    };

    obtener();
  }, [navigate]);

  const handleEliminarExpediente = async (idExpediente: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const confirm = await Swal.fire({
      title: '¿Eliminar solicitud de expediente?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${ApiRoutes.expedientes}/${idExpediente}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setExpedientes((prev) =>
            prev.filter((exp) => exp.idExpediente !== idExpediente)
          );
          Swal.fire('¡Eliminado!', 'El expediente ha sido eliminado.', 'success');
        } else {
          throw new Error('No se pudo eliminar');
        }
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar el expediente.', 'error');
      }
    }
  };

  const filtrados = () => {
    let lista = expedientes;

    if (filtroEstado !== 'todos') {
      lista = lista.filter((e) => e.status === filtroEstado);
    }

    if (fechaFiltro) {
      const fecha = fechaFiltro.toISOString().split('T')[0];
      lista = lista.filter((e) => e.Date === fecha);
    }

    if (searchText) {
      lista = lista.filter((e) =>
        searchBy === 'nombreSolicitante'
          ? e.nombreSolicitante?.toLowerCase().includes(searchText.toLowerCase())
          : e.numeroExpediente?.toString().includes(searchText)
      );
    }

    return lista;
  };

  const listaFinal = filtrados();
  const ultima = currentPage * itemsPerPage;
  const primera = ultima - itemsPerPage;
  const actuales = listaFinal.slice(primera, ultima);
  const totalPaginas = Math.ceil(listaFinal.length / itemsPerPage);

  if (loading) return <p>Cargando expedientes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Solicitudes de Expedientes</h2>

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre o número..."
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombreSolicitante', label: 'Nombre' },
          { value: 'numeroExpediente', label: 'N° Expediente' },
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
              <option value="Aprobado">Aprobado</option>
              <option value="Denegado">Denegado</option>
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
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">N° Expediente</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {actuales.map((exp) => (
              <tr key={exp.idExpediente}>
                <td className="px-4 py-2">{exp.idExpediente}</td>
                <td className="px-4 py-2">{exp.nombreSolicitante || 'N/A'}</td>
                <td className="px-4 py-2">{exp.numeroExpediente}</td>
                <td className="px-4 py-2">{exp.Date}</td>
                <td className="px-4 py-2">{exp.status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerExpediente(exp)} className="button-view">
                    <FaEye />
                  </button>
                  <button className="button-delete" onClick={() => handleEliminarExpediente(exp.idExpediente)}>
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

export default ExpedientesTable;
