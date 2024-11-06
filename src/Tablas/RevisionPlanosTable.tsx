import React, { useState, useEffect } from 'react';
import { DecodedToken, RevisionPlano } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton'; // Importar el componente de filtro por estado
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../components/ApiRoutes';

interface RevisionplanoTableProps {
  onVerRevisionPlano: (RevisionPlano: RevisionPlano) => void;
}

const fetchRevisionplano = async (): Promise<RevisionPlano[]> => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(ApiRoutes.planos, {
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
    console.error('Error fetching Revisionplano:', error);
    throw error;
  }
};

const RevisionplanoTable: React.FC<RevisionplanoTableProps> = ({ onVerRevisionPlano }) => {
  const [Revisionplano, setRevisionplano] = useState<RevisionPlano[]>([]);
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
            permission.action === 'GET' && permission.resource === 'revisionplano'
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

    const obtenerRevisionplano = async () => {
      try {
        const RevisionplanoFromAPI = await fetchRevisionplano();
        setRevisionplano(RevisionplanoFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las Revisionplano:', error);
        setError('Error al cargar las Revisionplano.');
        setLoading(false);
      }
    };

    obtenerRevisionplano();
  }, [navigate]);

  const obtenerRevisionplanoFiltradas = () => {
    if (filtroEstado === 'todos') return Revisionplano;
    return Revisionplano.filter((plano) => plano.status === filtroEstado);
  };

  const RevisionplanoFiltradas = obtenerRevisionplanoFiltradas();
  const indexUltimaRevisionPlano = currentPage * itemsPerPage;
  const indexPrimeraRevisionPlano = indexUltimaRevisionPlano - itemsPerPage;
  const RevisionplanoActuales = RevisionplanoFiltradas.slice(indexPrimeraRevisionPlano, indexUltimaRevisionPlano);

  const numeroPaginas = Math.ceil(RevisionplanoFiltradas.length / itemsPerPage);

  const manejarEliminarRevisionPlano = async (id: number) => {
    await eliminarEntidad<RevisionPlano>('Revision-Plano', id, setRevisionplano);
  };

  if (loading) {
    return <p>Cargando solicitudes de revisión de planos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Solicitudes de Revisión de Planos</h2>

      {/* Componente de filtro por estado */}
      <FilterButtons onFilterChange={setFiltroEstado} />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre Solicitante</th>
              {/* <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Apellido Solicitante</th> */}
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha Creación</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {RevisionplanoActuales.map((RevisionPlano) => (
              <tr key={RevisionPlano.id}>
                <td className="px-4 py-2">{RevisionPlano.id}</td>
                <td className="px-4 py-2">{RevisionPlano.user?.nombre}</td>
                {/* <td className="px-4 py-2">{RevisionPlano.user?.apellido1}</td> */}
                <td className="px-4 py-2">{RevisionPlano.user?.cedula}</td>
                <td className="px-4 py-2">{RevisionPlano.Date}</td>
                <td className="px-4 py-2">{RevisionPlano.status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerRevisionPlano(RevisionPlano)} className="text-green-500 hover:text-green-700">
                    <FaEye /> Ver
                  </button>
                  <button onClick={() => manejarEliminarRevisionPlano(RevisionPlano.id)} className="text-red-500 hover:text-red-700">
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

export default RevisionplanoTable;
