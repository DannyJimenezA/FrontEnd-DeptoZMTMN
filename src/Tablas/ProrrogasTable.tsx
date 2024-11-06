import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, Prorroga } from '../Types/Types';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton'; // Importa el componente de filtro por estado
import { FaEye, FaTrash } from 'react-icons/fa';
import ApiRoutes from '../components/ApiRoutes';

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
  const [filtroEstado, setFiltroEstado] = useState<string>('todos'); // Estado para el filtro de estado
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
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las prórrogas:', error);
        setError('Error al cargar las prórrogas.');
        setLoading(false);
      }
    };
  
    obtenerProrrogas();
  }, [navigate]);

  const obtenerProrrogasFiltradas = () => {
    if (filtroEstado === 'todos') return prorrogas;
    return prorrogas.filter((prorroga) => prorroga.Status === filtroEstado);
  };

  const prorrogasFiltradas = obtenerProrrogasFiltradas();
  const indexUltimaProrroga = currentPage * itemsPerPage;
  const indexPrimeraProrroga = indexUltimaProrroga - itemsPerPage;
  const prorrogasActuales = prorrogasFiltradas.slice(indexPrimeraProrroga, indexUltimaProrroga);

  const numeroPaginas = Math.ceil(prorrogasFiltradas.length / itemsPerPage);

  const manejarEliminarProrroga = async (id: number) => {
    await eliminarEntidad<Prorroga>('Prorrogas', id, setProrrogas);
  };

  if (loading) {
    return <p>Cargando prórrogas...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Prórrogas de Concesiones</h2>

      {/* Componente de filtro por estado */}
      <FilterButtons onFilterChange={setFiltroEstado} />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre Solicitante</th>
              {/* <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Apellidos Solicitante</th> */}
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
                {/* <td className="px-4 py-2">
                  {prorroga.user?.apellido1 && prorroga.user?.apellido2
                    ? `${prorroga.user.apellido1} ${prorroga.user.apellido2}`
                    : 'Apellidos no disponibles'}
                </td> */}
                <td className="px-4 py-2">{prorroga.user?.cedula}</td>
                <td className="px-4 py-2">{prorroga.Date}</td>
                <td className="px-4 py-2">{prorroga.Status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerProrroga(prorroga)} className="text-green-500 hover:text-green-700"><FaEye /> Ver</button>
                  <button onClick={() => manejarEliminarProrroga(prorroga.id)} className="text-red-500 hover:text-red-700"><FaTrash /> Eliminar</button>
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

export default TablaProrrogas;
