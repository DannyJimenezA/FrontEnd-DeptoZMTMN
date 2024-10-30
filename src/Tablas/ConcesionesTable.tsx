import React, { useState, useEffect } from 'react';
import { Concesion } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';  // Importar el helper
import '../styles/Botones.css'
import { FaEye, FaTrash } from 'react-icons/fa';

interface ConcesionesTableProps {
  onVerConcesion: (concesion: Concesion) => void;
}

const fetchConcesiones = async (): Promise<Concesion[]> => {
  const urlBase = 'http://localhost:3000/Concesiones'; // Ajusta la URL de tu API
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(urlBase, {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
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
  }, []);

  const indexUltimaConcesion = currentPage * itemsPerPage;
  const indexPrimeraConcesion = indexUltimaConcesion - itemsPerPage;
  const concesionesActuales = concesiones.slice(indexPrimeraConcesion, indexUltimaConcesion);

  const numeroPaginas = Math.ceil(concesiones.length / itemsPerPage);

  // Función para eliminar una concesión usando el helper
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
    <div>
      <div className="tabla-container">
        <h2>Solicitudes de Concesión</h2>
        <table className="tabla-solicitudes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Solicitante</th>
              <th>Apellidos Solicitante</th>
              <th>Cédula Solicitante</th>
              <th>Fecha Creacion</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {concesionesActuales.map((concesion) => (
              <tr key={concesion.id}>
                <td>{concesion.id}</td>
                <td>{concesion.user?.nombre}</td>
                <td>{concesion.user?.apellido1}</td>
                <td>{concesion.user?.cedula}</td>
                <td>{concesion.Date}</td>
                <td>{concesion.Status || 'Pendiente'}</td>
                <td>
                  <button className="boton-ver" onClick={() => onVerConcesion(concesion)}>
                    <FaEye /> Ver
                  </button>
                  <button onClick={() => manejarEliminarConcesion(concesion.id)}>
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

export default ConcesionesTable;
