import{ useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, Prorroga } from '../Types/Types';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton'; // Importa el componente de filtro por estado
import { FaEye, FaTrash } from 'react-icons/fa';

interface ProrrogasTableProps {
  onVerProrroga: (prorroga: Prorroga) => void;
}

const baseUrl = 'http://localhost:3000/';

// Función para obtener las prórrogas desde la API
const fetchProrrogas = async (): Promise<Prorroga[]> => {
  const urlBase = `${baseUrl}Prorrogas/`;

  try {
    const response = await fetch(urlBase, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
  const [filtroEstado, setFiltroEstado] = useState<string>('todos'); // Estado para el filtro de estado
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
  
        // Verificar si el usuario tiene permiso para acceder a 'prorrogas'
        const hasPermission = decodedToken.permissions.some(
          (permission: { action: string; resource: string }) =>
            permission.action === 'GET' && permission.resource === 'appointments'
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
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las prórrogas:', error);
        setError('Error al cargar las prórrogas.');
        setLoading(false);
      }
    };
  
    obtenerProrrogas();
  }, [navigate]);

    // Cálculo de las prorrogas que se mostrarán en la página actual
    //const indexUltimaProrroga = currentPage * itemsPerPage;
   // const indexPrimeraProrroga = indexUltimaProrroga - itemsPerPage;
   // const prorrogasActuales = prorrogas.slice(indexPrimeraProrroga, indexUltimaProrroga);
  
   // const numeroPaginas = Math.ceil(prorrogas.length / itemsPerPage);


  // Filtrar las prórrogas según el estado seleccionado
  const obtenerProrrogasFiltradas = () => {
    if (filtroEstado === 'todos') return prorrogas;
    return prorrogas.filter((prorroga) => prorroga.Status === filtroEstado);
  };


  // Cálculo de las prórrogas que se mostrarán en la página actual
  const prorrogasFiltradas = obtenerProrrogasFiltradas();
  const indexUltimaProrroga = currentPage * itemsPerPage;
  const indexPrimeraProrroga = indexUltimaProrroga - itemsPerPage;
  const prorrogasActuales = prorrogasFiltradas.slice(indexPrimeraProrroga, indexUltimaProrroga);

  const numeroPaginas = Math.ceil(prorrogasFiltradas.length / itemsPerPage);

  // Función para eliminar una prórroga usando el helper eliminarEntidad
  const manejarEliminarProrroga = async (id: number) => {
    await eliminarEntidad<Prorroga>('Prorrogas', id, setProrrogas); // Usamos el helper para eliminar
  };

  // Mostrar pantalla de carga
  if (loading) {
    return <p>Cargando prórrogas...</p>;
  }

  // Mostrar errores si los hay
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <h2>Prórrogas de Concesiones</h2>

      {/* Componente de filtro por estado */}
      <FilterButtons onFilterChange={setFiltroEstado} />

      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Solicitante</th>
            <th>Apellidos Solicitante</th>
            <th>Cédula Solicitante</th>
            <th>Fecha Creacion</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prorrogasActuales.map((prorroga) => (
            <tr key={prorroga.id}>
              <td>{prorroga.id}</td>
              <td>{prorroga.user?.nombre || 'Nombre no disponible'}</td>
              <td>
                {prorroga.user?.apellido1 && prorroga.user?.apellido2
                  ? `${prorroga.user.apellido1} ${prorroga.user.apellido2}`
                  : 'Apellidos no disponibles'}
              </td>
              <td>{prorroga.user?.cedula}</td>
              <td>{prorroga.Date}</td>
              <td>{prorroga.Status || 'Pendiente'}</td>
              <td>
                <button onClick={() => onVerProrroga(prorroga)}>
                  <FaEye /> Ver
                </button>
                <button onClick={() => manejarEliminarProrroga(prorroga.id)}>
                  <FaTrash /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default TablaProrrogas;
