import React, { useState, useEffect } from 'react';
import { Precario } from '../Types/Types'; // Asegúrate de tener el tipo Precario definido en tus tipos
import Paginacion from '../components/Paginacion';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';  // Importar el helper
import { FaEye, FaTrash } from 'react-icons/fa';

interface PrecarioTableProps {
  onVerPrecario: (precario: Precario) => void;
}

const fetchPrecarios = async (): Promise<Precario[]> => {
  const urlBase = 'http://localhost:3000/Precario'; // Ajusta la URL de tu API

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

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage, setItemsPerPage] = useState(5); // Número de precarios por página

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

  // Cálculo de los precarios que se mostrarán en la página actual
  const indexUltimaSolicitud = currentPage * itemsPerPage;
  const indexPrimeraSolicitud = indexUltimaSolicitud - itemsPerPage;
  const precariosActuales = precarios.slice(indexPrimeraSolicitud, indexUltimaSolicitud);

  const numeroPaginas = Math.ceil(precarios.length / itemsPerPage);

  // Función para eliminar una solicitud de precario usando el helper
  const manejarEliminarPrecario = async (id: number) => {
    await eliminarEntidad<Precario>('Precario', id, setPrecarios);  // Usamos el helper para eliminar
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
        <table className="tabla-solicitudes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cédula Solicitante</th>
              <th>Nombre Solicitante</th>
              <th>Apellido</th>
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
                <td>{precario.Status || 'Pendiente'}</td>
                <td>
                  <button onClick={() => onVerPrecario(precario)}><FaEye />Ver</button>
                  <button onClick={() => manejarEliminarPrecario(precario.id)}><FaTrash />Eliminar</button> {/* Botón para eliminar */}
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
