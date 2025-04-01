import React, { useState, useEffect } from 'react';
import { DecodedToken, RevisionPlano } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FiltroFecha from '../components/FiltroFecha';
import SearchFilterBar from '../components/SearchFilterBar';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../components/ApiRoutes';
import "../styles/TableButtons.css";

interface RevisionplanoTableProps {
  onVerRevisionPlano: (RevisionPlano: RevisionPlano) => void;
}

const fetchRevisionplano = async (): Promise<RevisionPlano[]> => {
  const token = localStorage.getItem('token');
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
};

const RevisionplanoTable: React.FC<RevisionplanoTableProps> = ({ onVerRevisionPlano }) => {
  const [Revisionplano, setRevisionplano] = useState<RevisionPlano[]>([]);
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

    if (!token) {
      alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const hasPermission = decodedToken.permissions.some(
        (p: { action: string; resource: string; }) => p.action === 'GET' && p.resource === 'revisionplano'
      );
      if (!hasPermission) {
        alert('No tienes permiso para acceder a esta página.');
        navigate('/');
        return;
      }
    } catch (error) {
      alert('Error al validar el token.');
      navigate('/login');
      return;
    }

    const obtenerRevisionplano = async () => {
      try {
        const planosAPI = await fetchRevisionplano();
        setRevisionplano(planosAPI);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
        setError('Error al cargar las solicitudes de revisión de planos.');
      } finally {
        setLoading(false);
      }
    };

    obtenerRevisionplano();
  }, [navigate]);

  const { abrirModalEliminar, ModalEliminar } = eliminarEntidad<RevisionPlano>("revision-plano", setRevisionplano);

  const planosFiltrados = Revisionplano.filter((plano) => {
    const matchEstado = filtroEstado === 'todos' || plano.status === filtroEstado;
    const matchFecha = !fechaFiltro || plano.Date === fechaFiltro.toISOString().split('T')[0];
    const matchTexto =
      searchBy === 'nombre'
        ? plano.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
        : plano.user?.cedula?.toLowerCase().includes(searchText.toLowerCase());

    return matchEstado && matchFecha && matchTexto;
  });

  const indexUltima = currentPage * itemsPerPage;
  const indexPrimera = indexUltima - itemsPerPage;
  const planosActuales = planosFiltrados.slice(indexPrimera, indexUltima);
  const totalPages = Math.ceil(planosFiltrados.length / itemsPerPage);

  if (loading) return <p>Cargando solicitudes de revisión de planos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Solicitudes de Revisión de Planos</h2>

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

      {/* Tabla */}
      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
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
            {planosActuales.map((plano) => (
              <tr key={plano.id}>
                <td className="px-4 py-2">{plano.id}</td>
                <td className="px-4 py-2">{plano.user?.nombre}</td>
                <td className="px-4 py-2">{plano.user?.cedula}</td>
                <td className="px-4 py-2">{plano.Date}</td>
                <td className="px-4 py-2">{plano.status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerRevisionPlano(plano)} className="button-view">
                    <FaEye />
                  </button>
                  <button className="button-delete" onClick={() => abrirModalEliminar(plano.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Paginacion
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <ModalEliminar />
    </div>
  );
};

export default RevisionplanoTable;
