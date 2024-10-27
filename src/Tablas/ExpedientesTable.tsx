import React, { useEffect, useState } from 'react';
import { CopiaExpediente } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import { eliminarEntidad } from '../Helpers/eliminarEntidad'; // Helper para eliminación
import { FaEye, FaTrash } from 'react-icons/fa';

interface ExpedientesTableProps {
  onVerExpediente: (expediente: CopiaExpediente) => void;
}

const fetchExpedientes = async (): Promise<CopiaExpediente[]> => {
  const urlBase = 'http://localhost:3000/expedientes';  // Ajusta la ruta según tu API

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

    const data: CopiaExpediente[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching expedientes:', error);
    throw error;
  }
};

const ExpedientesTable: React.FC<ExpedientesTableProps> = ({ onVerExpediente }) => {
  const [expedientes, setExpedientes] = useState<CopiaExpediente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Número de elementos por página

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

  const indexUltimoExpediente = currentPage * itemsPerPage;
  const indexPrimerExpediente = indexUltimoExpediente - itemsPerPage;
  const expedientesActuales = expedientes.slice(indexPrimerExpediente, indexUltimoExpediente);

  const numeroPaginas = Math.ceil(expedientes.length / itemsPerPage);

  // Función para eliminar un expediente
  const manejarEliminarExpediente = async (id: number) => {
    try {
      await eliminarEntidad<CopiaExpediente>('expedientes', id, setExpedientes);  // Elimina del backend
      // Actualiza el estado local filtrando el expediente eliminado
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
                  <button onClick={() => onVerExpediente((expediente))}><FaEye />Ver</button>
                  <button onClick={() => manejarEliminarExpediente(expediente.idExpediente)}><FaTrash />Eliminar</button>
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
