import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/Global.css';
import { Cita, DecodedToken } from '../Types/Types';
import { FaEye, FaTrash } from 'react-icons/fa';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton';
import ApiRoutes from '../components/ApiRoutes';
import FiltroFecha from '../components/FiltroFecha';
import SearchBar from '../components/SearchBar'; // Importa el componente de búsqueda
import "../styles/TableButtons.css"

interface CitasTableProps {
  onVerCita: (cita: Cita) => void;
}

const fetchCitas = async (): Promise<Cita[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');
  
  try {
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

    const data: Cita[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching citas:', error);
    throw error;
  }
};

const TablaCitas: React.FC<CitasTableProps> = ({ onVerCita }) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState<string>(''); // Estado para el texto de búsqueda
  const [searchBy, setSearchBy] = useState<string>('nombre'); // Estado para el criterio de búsqueda
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const hasPermission = decodedToken.permissions.some(
        (permission) => permission.action === 'GET' && permission.resource === 'appointments'
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

    const obtenerCitas = async () => {
      try {
        const citasFromAPI = await fetchCitas();
        setCitas(citasFromAPI);
      } catch (error) {
        console.error('Error al obtener las citas:', error);
        setError('Error al cargar las citas.');
      } finally {
        setLoading(false);
      }
    };

    obtenerCitas();
  }, [navigate]);

  const manejarEliminar = async (id: number) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar la cita?');
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      alert('No tienes permisos para realizar esta acción.');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.citas.crearcita}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          alert('No tienes permisos para eliminar esta cita.');
        } else {
          alert('Error al eliminar la cita.');
        }
        throw new Error(`Error al eliminar la cita con ID: ${id}`);
      }

      setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
      console.log(`Cita con ID: ${id} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  if (loading) return <p>Cargando citas...</p>;
  if (error) return <p>{error}</p>;

  const obtenerCitasFiltradas = () => {
    let citasFiltradas = citas;

    if (filtroEstado !== 'todos') {
      citasFiltradas = citasFiltradas.filter((cita) => cita.status === filtroEstado);
    }

    if (fechaFiltro) {
      const fechaSeleccionada = fechaFiltro.toISOString().split('T')[0];
      citasFiltradas = citasFiltradas.filter((cita) => cita.date === fechaSeleccionada);
    }

    if (searchText) {
      citasFiltradas = citasFiltradas.filter((cita) =>
        searchBy === 'nombre'
          ? cita.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
          : cita.user?.cedula?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return citasFiltradas;
  };

  const citasFiltradas = obtenerCitasFiltradas();
  const indexUltimaCita = currentPage * itemsPerPage;
  const indexPrimeraCita = indexUltimaCita - itemsPerPage;
  const citasActuales = citasFiltradas.slice(indexPrimeraCita, indexUltimaCita);
  const totalPages = Math.ceil(citasFiltradas.length / itemsPerPage);

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Citas Programadas</h2>

      {/* Barra de búsqueda */}
      <SearchBar
        onSearch={setSearchText}
        searchBy={searchBy}
        onSearchByChange={setSearchBy}
      />
      {/* Filtro por fecha */}
      <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />

      {/* Filtro por estado */}
      <FilterButtons onFilterChange={setFiltroEstado} />


      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
                <td className="px-4 py-2">{cita.date} {cita.time}</td>
                <td className="px-4 py-2">{cita.user?.cedula || 'No disponible'}</td>
                <td className="px-4 py-2">{cita.user?.nombre || 'No disponible'}</td>
                <td className="px-4 py-2">{cita.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerCita(cita)} className="button-view">
                    <FaEye /> Ver
                  </button>
                  <button onClick={() => manejarEliminar(cita.id)} className="button-delete">
                    <FaTrash /> Eliminar
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
