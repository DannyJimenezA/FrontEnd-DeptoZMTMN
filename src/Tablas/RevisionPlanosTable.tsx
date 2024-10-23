import React, { useState, useEffect } from 'react';
import { RevisionPlano } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';  // Importar el helper

interface RevisionplanoTableProps {
  onVerRevisionPlano: (RevisionPlano: RevisionPlano) => void;
}

const fetchRevisionplano = async (): Promise<RevisionPlano[]> => {
  const urlBase = 'http://localhost:3000/Revision-Plano'; // Ajusta la URL de tu API

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
    console.error('Error fetching Revisionplano:', error);
    throw error;
  }
};

const RevisionplanoTable: React.FC<RevisionplanoTableProps> = ({ onVerRevisionPlano }) => {
  const [Revisionplano, setRevisionplano] = useState<RevisionPlano[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage, setItemsPerPage] = useState(5); // Número de Revisionplano por página

  useEffect(() => {
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
  }, []);

  // Cálculo de las Revisionplano que se mostrarán en la página actual
  const indexUltimaRevisionPlano = currentPage * itemsPerPage;
  const indexPrimeraRevisionPlano = indexUltimaRevisionPlano - itemsPerPage;
  const RevisionplanoActuales = Revisionplano.slice(indexPrimeraRevisionPlano, indexUltimaRevisionPlano);

  const numeroPaginas = Math.ceil(Revisionplano.length / itemsPerPage);

  // Función para eliminar una concesión usando el helper
  const manejarEliminarRevisionPlano = async (id: number) => {
    await eliminarEntidad<RevisionPlano>('Revisionplano', id, setRevisionplano);  // Usamos el helper para eliminar
  };

  if (loading) {
    return <p>Cargando Revisionplano...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <div className="tabla-container">
        <h2>Solicitudes de Revisión de Planos</h2>
        <table className="tabla-solicitudes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Cédula</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {RevisionplanoActuales.map((RevisionPlano) => (
              <tr key={RevisionPlano.id}>
                <td>{RevisionPlano.id}</td>
                <td>{RevisionPlano.user?.nombre}</td>
                <td>{RevisionPlano.user?.apellido1}</td>
                <td>{RevisionPlano.user?.cedula}</td>
                <td>{RevisionPlano.Status || 'Pendiente'}</td>
                <td>
                  <button onClick={() => onVerRevisionPlano(RevisionPlano)}>Ver</button>
                  <button onClick={() => manejarEliminarRevisionPlano(RevisionPlano.id)}>Eliminar</button> {/* Botón para eliminar */}
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

export default RevisionplanoTable;
