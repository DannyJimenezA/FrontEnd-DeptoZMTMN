import React, { useState, useEffect } from 'react';
import { Precario } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton'; // Importa el componente de filtro por estado
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';

interface PrecarioTableProps {
  onVerPrecario: (precario: Precario) => void;
}

const fetchPrecarios = async (): Promise<Precario[]> => {
  const urlBase = 'http://localhost:3000/Precario';

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
    console.error('Error fetching precarios:', error);
    throw error;
  }
};

const TablaUsoPrecario: React.FC<PrecarioTableProps> = ({ onVerPrecario }) => {
  const [precarios, setPrecarios] = useState<Precario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos'); // Estado para el filtro de estado
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
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
  }, []);

  // Filtrar las solicitudes de uso precario según el estado seleccionado
  const obtenerPrecariosFiltrados = () => {
    if (filtroEstado === 'todos') return precarios;
    return precarios.filter((precario) => precario.Status === filtroEstado);
  };

  const precariosFiltrados = obtenerPrecariosFiltrados();
  const indexUltimaSolicitud = currentPage * itemsPerPage;
  const indexPrimeraSolicitud = indexUltimaSolicitud - itemsPerPage;
  const precariosActuales = precariosFiltrados.slice(indexPrimeraSolicitud, indexUltimaSolicitud);

  const numeroPaginas = Math.ceil(precariosFiltrados.length / itemsPerPage);

  // Función para eliminar una solicitud de precario
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
    <div>
      <div className="tabla-container">
        <h2>Solicitudes de Uso Precario</h2>

        {/* Componente de filtro por estado */}
        <FilterButtons onFilterChange={setFiltroEstado} />

        <table className="tabla-solicitudes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cédula Solicitante</th>
              <th>Nombre Solicitante</th>
              <th>Apellido</th>
              <th>Fecha Creacion</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {precariosActuales.map((precario) => (
              <tr key={precario.id}>
                <td>{precario.id}</td>
                <td>{precario.user?.cedula}</td>
                <td>{precario.user?.nombre}</td>
                <td>{precario.user?.apellido1}</td>
                <td>{precario.Date}</td>
                <td>{precario.Status || 'Pendiente'}</td>
                <td>
                  <button onClick={() => onVerPrecario(precario)}><FaEye /> Ver</button>
                  <button onClick={() => manejarEliminarPrecario(precario.id)}><FaTrash /> Eliminar</button>
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
    </div>
  );
};

export default TablaUsoPrecario;
