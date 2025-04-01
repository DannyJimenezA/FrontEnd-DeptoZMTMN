import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, Prorroga } from '../Types/Types';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import Paginacion from '../components/Paginacion';
import FiltroFecha from '../components/FiltroFecha';
import SearchFilterBar from '../components/SearchFilterBar';
import { FaEye, FaTrash } from 'react-icons/fa';
import ApiRoutes from '../components/ApiRoutes';
import '../styles/TableButtons.css';

interface ProrrogasTableProps {
  onVerProrroga: (prorroga: Prorroga) => void;
}

const fetchProrrogas = async (): Promise<Prorroga[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(ApiRoutes.prorrogas, {
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

const TablaProrrogas: React.FC<ProrrogasTableProps> = ({ onVerProrroga }) => {
  const [prorrogas, setProrrogas] = useState<Prorroga[]>([]);
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
          (perm) => perm.action === 'GET' && perm.resource === 'prorroga'
        );

        if (!hasPermission) {
          alert('No tienes permiso para acceder a esta página.');
          return navigate('/');
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        alert('Ha ocurrido un error. Por favor, inicia sesión nuevamente.');
        return navigate('/login');
      }
    } else {
      alert('No se ha encontrado un token de acceso. Por favor, inicia sesión.');
      return navigate('/login');
    }

    const cargarProrrogas = async () => {
      try {
        const data = await fetchProrrogas();
        setProrrogas(data);
      } catch (error) {
        console.error('Error al obtener prórrogas:', error);
        setError('Error al cargar las prórrogas.');
      } finally {
        setLoading(false);
      }
    };

    cargarProrrogas();
  }, [navigate]);

  const obtenerFiltradas = () => {
    let resultado = prorrogas;

    if (filtroEstado !== 'todos') {
      resultado = resultado.filter((p) => p.status === filtroEstado);
    }

    if (fechaFiltro) {
      const fecha = fechaFiltro.toISOString().split('T')[0];
      resultado = resultado.filter((p) => p.Date === fecha);
    }

    if (searchText) {
      resultado = resultado.filter((p) =>
        searchBy === 'nombre'
          ? p.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
          : p.user?.cedula?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return resultado;
  };

  const prorrogasFiltradas = obtenerFiltradas();
  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const paginaActual = prorrogasFiltradas.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(prorrogasFiltradas.length / itemsPerPage);

  const { abrirModalEliminar, ModalEliminar } = eliminarEntidad<Prorroga>('prorrogas', setProrrogas);

  if (loading) return <p>Cargando prórrogas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Prórrogas de Concesiones</h2>

      {/* Filtros unificados */}
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
            {paginaActual.map((prorroga) => (
              <tr key={prorroga.id}>
                <td className="px-4 py-2">{prorroga.id}</td>
                <td className="px-4 py-2">{prorroga.user?.nombre || 'No disponible'}</td>
                <td className="px-4 py-2">{prorroga.user?.cedula || 'No disponible'}</td>
                <td className="px-4 py-2">{prorroga.Date}</td>
                <td className="px-4 py-2">{prorroga.status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerProrroga(prorroga)} className="button-view">
                    <FaEye />
                  </button>
                  <button onClick={() => abrirModalEliminar(prorroga.id)} className="button-delete">
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

export default TablaProrrogas;
