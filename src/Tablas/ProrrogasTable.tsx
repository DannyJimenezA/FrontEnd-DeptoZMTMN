import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, Prorroga } from '../Types/Types';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton';
import FiltroFecha from '../components/FiltroFecha';
import SearchBar from '../components/SearchBar';
import { FaEye, FaTrash } from 'react-icons/fa';
import ApiRoutes from '../components/ApiRoutes';
import "../styles/TableButtons.css"

interface ProrrogasTableProps {
  onVerProrroga: (prorroga: Prorroga) => void;
}

// Función para obtener las prórrogas desde la API
const fetchProrrogas = async (): Promise<Prorroga[]> => {
  const token = localStorage.getItem('token');
  try {
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
  } catch (error) {
    console.error('Error fetching prorrogas:', error);
    throw error;
  }
};

const TablaProrrogas: React.FC<ProrrogasTableProps> = ({ onVerProrroga }) => {
  const [prorrogas, setProrrogas] = useState<Prorroga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const hasPermission = decodedToken.permissions.some(
          (permission: { action: string; resource: string }) =>
            permission.action === 'GET' && permission.resource === 'prorroga'
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

    const obtenerProrrogas = async () => {
      try {
        const prorrogasFromAPI = await fetchProrrogas();
        setProrrogas(prorrogasFromAPI);
      } catch (error) {
        console.error('Error al obtener las prórrogas:', error);
        setError('Error al cargar las prórrogas.');
      } finally {
        setLoading(false);
      }
    };

    obtenerProrrogas();
  }, [navigate]);

  const obtenerProrrogasFiltradas = () => {
    let prorrogasFiltradas = prorrogas;

    if (filtroEstado !== 'todos') {
      prorrogasFiltradas = prorrogasFiltradas.filter((prorroga) => prorroga.status === filtroEstado);
    }

    if (fechaFiltro) {
      const fechaSeleccionada = fechaFiltro.toISOString().split('T')[0];
      prorrogasFiltradas = prorrogasFiltradas.filter((prorroga) => prorroga.Date === fechaSeleccionada);
    }

    if (searchText) {
      prorrogasFiltradas = prorrogasFiltradas.filter((prorroga) =>
        searchBy === 'nombre'
          ? prorroga.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
          : prorroga.user?.cedula?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return prorrogasFiltradas;
  };

  const prorrogasFiltradas = obtenerProrrogasFiltradas();
  const indexUltimaProrroga = currentPage * itemsPerPage;
  const indexPrimeraProrroga = indexUltimaProrroga - itemsPerPage;
  const prorrogasActuales = prorrogasFiltradas.slice(indexPrimeraProrroga, indexUltimaProrroga);
  const numeroPaginas = Math.ceil(prorrogasFiltradas.length / itemsPerPage);

  const { abrirModalEliminar, ModalEliminar } = eliminarEntidad<Prorroga>("prorrogas", setProrrogas);

  if (loading) {
    return <p>Cargando prórrogas...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Prórrogas de Concesiones</h2>

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


      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
            {prorrogasActuales.map((prorroga) => (
              <tr key={prorroga.id}>
                <td className="px-4 py-2">{prorroga.id}</td>
                <td className="px-4 py-2">{prorroga.user?.nombre || 'Nombre no disponible'}</td>
                <td className="px-4 py-2">{prorroga.user?.cedula}</td>
                <td className="px-4 py-2">{prorroga.Date}</td>
                <td className="px-4 py-2">{prorroga.status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerProrroga(prorroga)} className="button-view">
                    <FaEye />
                  </button>
                  <button className="button-delete" onClick={() => abrirModalEliminar(prorroga.id)}>
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
      <ModalEliminar />
    </div>
  );
};

export default TablaProrrogas;
