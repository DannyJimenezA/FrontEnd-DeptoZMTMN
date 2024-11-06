import React, { useEffect, useState } from 'react';
import { Concesion, DecodedToken } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton'; // Importa el componente de filtro
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import '../styles/Botones.css';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../components/ApiRoutes';

interface ConcesionesTableProps {
  onVerConcesion: (concesion: Concesion) => void;
}

const fetchConcesiones = async (): Promise<Concesion[]> => {
 
  const token = localStorage.getItem('token');
  try {
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
  } catch (error) {
    console.error('Error fetching concesiones:', error);
    throw error;
  }
};

const ConcesionesTable: React.FC<ConcesionesTableProps> = ({ onVerConcesion }) => {
  const [concesiones, setConcesiones] = useState<Concesion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos'); // Estado para el filtro
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const hasPermission = decodedToken.permissions.some(
          (permission) => permission.action === 'GET' && permission.resource === 'concesion'
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

    const obtenerConcesiones = async () => {
      try {
        const concesionesFromAPI = await fetchConcesiones();
        setConcesiones(concesionesFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las concesiones:', error);
        setError('Error al cargar las concesiones.');
        setLoading(false);
      }
    };

    obtenerConcesiones();
  }, [navigate]);

  const obtenerConcesionesFiltradas = () => {
    if (filtroEstado === 'todos') return concesiones;
    return concesiones.filter((concesion) => concesion.Status === filtroEstado);
  };

  const concesionesFiltradas = obtenerConcesionesFiltradas();
  const indexUltimaConcesion = currentPage * itemsPerPage;
  const indexPrimeraConcesion = indexUltimaConcesion - itemsPerPage;
  const concesionesActuales = concesionesFiltradas.slice(indexPrimeraConcesion, indexUltimaConcesion);
  const numeroPaginas = Math.ceil(concesionesFiltradas.length / itemsPerPage);

  const manejarEliminarConcesion = async (id: number) => {
    await eliminarEntidad<Concesion>('Concesiones', id, setConcesiones);
  };

  if (loading) {
    return <p>Cargando concesiones...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Solicitudes de Concesión</h2>

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
            {concesionesActuales.map((concesion) => (
              <tr key={concesion.id}>
                <td className="px-4 py-2">{concesion.id}</td>
                <td className="px-4 py-2">{concesion.user?.nombre}</td>
                {/* <td className="px-4 py-2">{concesion.user?.apellido1}</td> */}
                <td className="px-4 py-2">{concesion.user?.cedula}</td>
                <td className="px-4 py-2">{concesion.Date}</td>
                <td className="px-4 py-2">{concesion.Status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerConcesion(concesion)} className="text-green-500 hover:text-green-700"><FaEye /> Ver</button>
                  <button onClick={() => manejarEliminarConcesion(concesion.id)} className="text-red-500 hover:text-red-700"><FaTrash /> Eliminar</button>
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

export default ConcesionesTable;
