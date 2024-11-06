import React, { useEffect, useState } from 'react';
import { CopiaExpediente, DecodedToken } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../components/ApiRoutes';

interface ExpedientesTableProps {
  onVerExpediente: (expediente: CopiaExpediente) => void;
}

const fetchExpedientes = async (): Promise<CopiaExpediente[]> => {

  const token = localStorage.getItem('token');
  try {
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
  } catch (error) {
    console.error('Error fetching expedientes:', error);
    throw error;
  }
};

const ExpedientesTable: React.FC<ExpedientesTableProps> = ({ onVerExpediente }) => {
  const [expedientes, setExpedientes] = useState<CopiaExpediente[]>([]);
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

        // Validar permisos
        const hasPermission = decodedToken.permissions.some(
          (permission: { action: string; resource: string }) =>
            permission.action === 'GET' && permission.resource === 'copia_expediente'
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

    const obtenerExpedientes = async () => {
      try {
        const expedientesFromAPI = await fetchExpedientes();
        setExpedientes(expedientesFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los expedientes:', error);
        setError('Error al cargar los expedientes.');
        setLoading(false);
      }
    };

    obtenerExpedientes();
  }, [navigate]);

  const obtenerExpedientesFiltrados = () => {
    if (filtroEstado === 'todos') return expedientes;
    return expedientes.filter((expediente) => expediente.status === filtroEstado);
  };

  const expedientesFiltrados = obtenerExpedientesFiltrados();
  const indexUltimoExpediente = currentPage * itemsPerPage;
  const indexPrimerExpediente = indexUltimoExpediente - itemsPerPage;
  const expedientesActuales = expedientesFiltrados.slice(indexPrimerExpediente, indexUltimoExpediente);

  const numeroPaginas = Math.ceil(expedientesFiltrados.length / itemsPerPage);

  const manejarEliminarExpediente = async (id: number) => {
    await eliminarEntidad<CopiaExpediente>('expedientes', id, setExpedientes);
  };

  if (loading) return <p>Cargando expedientes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Solicitudes de Expedientes</h2>

      {/* Componente de filtro por estado */}
      <FilterButtons onFilterChange={setFiltroEstado} />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Número Expediente</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha Creación</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expedientesActuales.map((expediente) => (
              <tr key={expediente.idExpediente}>
                <td className="px-4 py-2">{expediente.idExpediente}</td>
                <td className="px-4 py-2">{expediente.nombreSolicitante}</td>
                <td className="px-4 py-2">{expediente.numeroExpediente}</td>
                <td className="px-4 py-2">{expediente.Date}</td>
                <td className="px-4 py-2">{expediente.status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerExpediente(expediente)} className="text-green-500 hover:text-green-700">
                    <FaEye /> Ver
                  </button>
                  <button onClick={() => manejarEliminarExpediente(expediente.idExpediente)} className="text-red-500 hover:text-red-700">
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

export default ExpedientesTable;
