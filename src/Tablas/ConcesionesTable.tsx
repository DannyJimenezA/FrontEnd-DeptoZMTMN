import React, { useEffect, useState } from 'react';
import { Concesion, DecodedToken } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FiltroFecha from '../components/FiltroFecha';
import SearchFilterBar from '../components/SearchFilterBar';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../components/ApiRoutes';
import '../styles/TableButtons.css';

interface ConcesionesTableProps {
  onVerConcesion: (concesion: Concesion) => void;
}

const fetchConcesiones = async (): Promise<Concesion[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(ApiRoutes.concesiones, {
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

const ConcesionesTable: React.FC<ConcesionesTableProps> = ({ onVerConcesion }) => {
  const [concesiones, setConcesiones] = useState<Concesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const hasPermission = decodedToken.permissions.some(
          (permission: { action: string; resource: string; }) =>
            permission.action === 'GET' && permission.resource === 'concesion'
        );

        if (!hasPermission) {
          alert('No tienes permiso para acceder a esta página.');
          return navigate('/');
        }
      } catch (error) {
        alert('Error con el token. Por favor, inicia sesión de nuevo.');
        return navigate('/login');
      }
    } else {
      alert('No se encontró token. Inicia sesión.');
      return navigate('/login');
    }

    const obtenerConcesiones = async () => {
      try {
        const data = await fetchConcesiones();
        setConcesiones(data);
      } catch (err) {
        console.error('Error al obtener concesiones:', err);
        setError('Error al cargar las concesiones.');
      } finally {
        setLoading(false);
      }
    };

    obtenerConcesiones();
  }, [navigate]);

  const obtenerConcesionesFiltradas = () => {
    let resultado = concesiones;

    if (filtroEstado !== 'todos') {
      resultado = resultado.filter((c) => c.status === filtroEstado);
    }

    if (fechaFiltro) {
      const fecha = fechaFiltro.toISOString().split('T')[0];
      resultado = resultado.filter((c) => c.Date === fecha);
    }

    if (searchText) {
      resultado = resultado.filter((c) =>
        searchBy === 'nombre'
          ? c.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
          : c.user?.cedula?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return resultado;
  };

  const concesionesFiltradas = obtenerConcesionesFiltradas();
  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const paginaActual = concesionesFiltradas.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(concesionesFiltradas.length / itemsPerPage);

  const { abrirModalEliminar, ModalEliminar } = eliminarEntidad<Concesion>('Concesiones', setConcesiones);

  if (loading) return <p>Cargando concesiones...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Solicitudes de Concesión</h2>

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
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha Creación</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginaActual.map((concesion) => (
              <tr key={concesion.id}>
                <td className="px-4 py-2">{concesion.id}</td>
                <td className="px-4 py-2">{concesion.user?.nombre || 'No disponible'}</td>
                <td className="px-4 py-2">{concesion.user?.cedula || 'No disponible'}</td>
                <td className="px-4 py-2">{concesion.Date}</td>
                <td className="px-4 py-2">{concesion.status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerConcesion(concesion)} className="button-view">
                    <FaEye />
                  </button>
                  <button onClick={() => abrirModalEliminar(concesion.id)} className="button-delete">
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

      <ModalEliminar />
    </div>
  );
};

export default ConcesionesTable;
