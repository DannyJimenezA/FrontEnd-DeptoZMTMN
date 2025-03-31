import React, { useState, useEffect } from 'react';
import { DecodedToken, Precario } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FiltroFecha from '../components/FiltroFecha';
import SearchFilterBar from '../components/SearchFilterBar';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../components/ApiRoutes';
import "../styles/TableButtons.css";

interface PrecarioTableProps {
  onVerPrecario: (precario: Precario) => void;
}

const fetchPrecarios = async (): Promise<Precario[]> => {
  const token = localStorage.getItem('token');
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
};

const TablaUsoPrecario: React.FC<PrecarioTableProps> = ({ onVerPrecario }) => {
  const [precarios, setPrecarios] = useState<Precario[]>([]);
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
        const decoded = jwtDecode<DecodedToken>(token);
        const hasPermission = decoded.permissions.some(
          (perm) => perm.action === 'GET' && perm.resource === 'concesion'
        );
        if (!hasPermission) {
          alert('No tienes permiso para acceder a esta página.');
          return navigate('/');
        }
      } catch (error) {
        alert('Error con el token. Por favor, inicia sesión nuevamente.');
        return navigate('/login');
      }
    } else {
      alert('Token no encontrado. Inicia sesión.');
      return navigate('/login');
    }

    const obtenerPrecarios = async () => {
      try {
        const data = await fetchPrecarios();
        setPrecarios(data);
      } catch (err) {
        console.error('Error al obtener los precarios:', err);
        setError('Error al cargar los precarios.');
      } finally {
        setLoading(false);
      }
    };

    obtenerPrecarios();
  }, [navigate]);

  const obtenerPrecariosFiltrados = () => {
    let filtrados = precarios;

    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter((p) => p.status === filtroEstado);
    }

    if (fechaFiltro) {
      const fechaSeleccionada = fechaFiltro.toISOString().split('T')[0];
      filtrados = filtrados.filter((p) => p.Date === fechaSeleccionada);
    }

    if (searchText) {
      filtrados = filtrados.filter((p) =>
        searchBy === 'nombre'
          ? p.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
          : p.user?.cedula?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtrados;
  };

  const precariosFiltrados = obtenerPrecariosFiltrados();
  const indexUltima = currentPage * itemsPerPage;
  const indexPrimera = indexUltima - itemsPerPage;
  const precariosActuales = precariosFiltrados.slice(indexPrimera, indexUltima);
  const numeroPaginas = Math.ceil(precariosFiltrados.length / itemsPerPage);

  const { abrirModalEliminar, ModalEliminar } = eliminarEntidad<Precario>('Precario', setPrecarios);

  if (loading) return <p>Cargando solicitudes de uso precario...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Solicitudes de Uso Precario</h2>

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
            {precariosActuales.map((precario) => (
              <tr key={precario.id}>
                <td className="px-4 py-2">{precario.id}</td>
                <td className="px-4 py-2">{precario.user?.nombre}</td>
                <td className="px-4 py-2">{precario.user?.cedula}</td>
                <td className="px-4 py-2">{precario.Date}</td>
                <td className="px-4 py-2">{precario.status || 'Pendiente'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => onVerPrecario(precario)} className="button-view">
                    <FaEye />
                  </button>
                  <button className="button-delete" onClick={() => abrirModalEliminar(precario.id)}>
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

export default TablaUsoPrecario;
