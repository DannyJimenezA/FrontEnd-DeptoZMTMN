import React, { useState, useEffect } from 'react';
import { DecodedToken, Precario } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../components/ApiRoutes';

interface PrecarioTableProps {
  onVerPrecario: (precario: Precario) => void;
}

const fetchPrecarios = async (): Promise<Precario[]> => {

  const token = localStorage.getItem('token');
  try {
    const response = await fetch(ApiRoutes.precarios, {
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
    console.error('Error fetching precarios:', error);
    throw error;
  }
};

const TablaUsoPrecario: React.FC<PrecarioTableProps> = ({ onVerPrecario }) => {
  const [precarios, setPrecarios] = useState<Precario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
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
            permission.action === 'GET' && permission.resource === 'concesion'
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

    const obtenerPrecarios = async () => {
      try {
        const precariosFromAPI = await fetchPrecarios();
        setPrecarios(precariosFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los precarios:', error);
        setError('Error al cargar los precarios.');
        setLoading(false);
      }
    };

    obtenerPrecarios();
  }, [navigate]);

  const obtenerPrecariosFiltrados = () => {
    if (filtroEstado === 'todos') return precarios;
    return precarios.filter((precario) => precario.Status === filtroEstado);
  };

  const precariosFiltrados = obtenerPrecariosFiltrados();
  const indexUltimaSolicitud = currentPage * itemsPerPage;
  const indexPrimeraSolicitud = indexUltimaSolicitud - itemsPerPage;
  const precariosActuales = precariosFiltrados.slice(indexPrimeraSolicitud, indexUltimaSolicitud);

  const numeroPaginas = Math.ceil(precariosFiltrados.length / itemsPerPage);

  const manejarEliminarPrecario = async (id: number) => {
    await eliminarEntidad<Precario>('Precario', id, setPrecarios);
  };

  if (loading) {
    return <p>Cargando solicitudes de uso precario...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Solicitudes de Uso Precario</h2>

      {/* Componente de filtro por estado */}
      <FilterButtons onFilterChange={setFiltroEstado} />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula Solicitante</th>
              {/* <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Apellido</th> */}
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha Creación</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {precariosActuales.map((precario) => (
              <tr key={precario.id}>
                <td className="px-4 py-2">{precario.id}</td>
                <td className="px-4 py-2">{precario.user?.nombre}</td>
                <td className="px-4 py-2">{precario.user?.cedula}</td>
                {/* <td className="px-4 py-2">{precario.user?.apellido1}</td> */}
                <td className="px-4 py-2">{precario.Date}</td>
                <td className="px-4 py-2">{precario.Status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => onVerPrecario(precario)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FaEye /> Ver
                  </button>
                  <button
                    onClick={() => manejarEliminarPrecario(precario.id)}
                    className="text-red-500 hover:text-red-700"
                  >
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
        totalPages={numeroPaginas}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default TablaUsoPrecario;
