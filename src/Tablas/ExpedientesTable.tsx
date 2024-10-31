import React, { useEffect, useState } from 'react';
import { CopiaExpediente } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton'; // Importa el componente de filtro por estado
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';

interface ExpedientesTableProps {
  onVerExpediente: (expediente: CopiaExpediente) => void;
}

const fetchExpedientes = async (): Promise<CopiaExpediente[]> => {
  const urlBase = 'http://localhost:3000/expedientes';

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
    console.error('Error fetching expedientes:', error);
    throw error;
  }
};

const ExpedientesTable: React.FC<ExpedientesTableProps> = ({ onVerExpediente }) => {
  const [expedientes, setExpedientes] = useState<CopiaExpediente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos'); // Estado para el filtro de estado
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
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
  }, []);

  // Filtrar los expedientes según el estado seleccionado
  const obtenerExpedientesFiltrados = () => {
    if (filtroEstado === 'todos') return expedientes;
    return expedientes.filter((expediente) => expediente.status === filtroEstado);
  };

  const expedientesFiltrados = obtenerExpedientesFiltrados();
  const indexUltimoExpediente = currentPage * itemsPerPage;
  const indexPrimerExpediente = indexUltimoExpediente - itemsPerPage;
  const expedientesActuales = expedientesFiltrados.slice(indexPrimerExpediente, indexUltimoExpediente);

  const numeroPaginas = Math.ceil(expedientesFiltrados.length / itemsPerPage);

  // Función para eliminar un expediente
  const manejarEliminarExpediente = async (id: number) => {
    try {
      await eliminarEntidad<CopiaExpediente>('expedientes', id, setExpedientes);
      setExpedientes((expedientesAnteriores) =>
        expedientesAnteriores.filter((expediente) => expediente.idExpediente !== id)
      );
    } catch (error) {
      console.error('Error al eliminar el expediente:', error);
    }
  };

  if (loading) {
    return <p>Cargando expedientes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <div className="tabla-container">
        <h2>Solicitudes de Expedientes</h2>

        {/* Componente de filtro por estado */}
        <FilterButtons onFilterChange={setFiltroEstado} />

        <table className="tabla-solicitudes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Solicitante</th>
              <th>Número Expediente</th>
              <th>Fecha Creacion</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {expedientesActuales.map((expediente) => (
              <tr key={expediente.idExpediente}>
                <td>{expediente.idExpediente}</td>
                <td>{expediente.nombreSolicitante}</td>
                <td>{expediente.numeroExpediente}</td>
                <td>{expediente.Date}</td>
                <td>{expediente.status || 'Pendiente'}</td>
                <td>
                  <button onClick={() => onVerExpediente(expediente)}>
                    <FaEye /> Ver
                  </button>
                  <button onClick={() => manejarEliminarExpediente(expediente.idExpediente)}>
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
    </div>
  );
};

export default ExpedientesTable;
