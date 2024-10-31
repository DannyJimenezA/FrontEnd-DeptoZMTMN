import React, { useEffect, useState } from 'react';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton'; // Importamos el componente de filtro
import { Denuncia } from '../Types/Types';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';

const fetchDenuncias = async (): Promise<Denuncia[]> => {
  const urlBase = 'http://localhost:3000/denuncia';

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

    const data: Denuncia[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching denuncias:', error);
    throw error;
  }
};

interface TablaDenunciasProps {
  onVerDenuncia: (denuncia: Denuncia) => void;
}

const TablaDenuncias: React.FC<TablaDenunciasProps> = ({ onVerDenuncia }) => {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos'); // Estado para el filtro
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const obtenerDenuncias = async () => {
      try {
        const denunciasFromAPI = await fetchDenuncias();
        setDenuncias(denunciasFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las denuncias:', error);
        setError('Error al cargar las denuncias.');
        setLoading(false);
      }
    };

    obtenerDenuncias();
  }, []);

  // Función para filtrar denuncias según el estado seleccionado
  const obtenerDenunciasFiltradas = () => {
    if (filtroEstado === 'todos') return denuncias;
    return denuncias.filter((denuncia) => denuncia.Status === filtroEstado);
  };

  // Paginación
  const denunciasFiltradas = obtenerDenunciasFiltradas();
  const indiceUltimaDenuncia = currentPage * itemsPerPage;
  const indicePrimeraDenuncia = indiceUltimaDenuncia - itemsPerPage;
  const denunciasActuales = denunciasFiltradas.slice(indicePrimeraDenuncia, indiceUltimaDenuncia);
  const numeroPaginas = Math.ceil(denunciasFiltradas.length / itemsPerPage);

  const manejarVer = (denuncia: Denuncia) => {
    onVerDenuncia(denuncia);
  };

  const manejarEliminarDenuncia = async (id: number) => {
    await eliminarEntidad<Denuncia>('denuncia', id, setDenuncias);
  };

  if (loading) {
    return <p>Cargando denuncias...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <h2>Listado de Denuncias</h2>
      
      {/* Componente de filtro */}
      <FilterButtons onFilterChange={setFiltroEstado} />
      
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha Creacion</th>
            <th>Nombre del Denunciante</th>
            <th>Cédula del Denunciante</th>
            <th>Tipo de Denuncia</th>
            <th>Lugar de Denuncia</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {denunciasActuales.map((denuncia) => (
            <tr key={denuncia.id}>
              <td>{denuncia.id}</td>
              <td>{denuncia.Date}</td>
              <td>{denuncia.nombreDenunciante || 'Anónimo'}</td>
              <td>{denuncia.cedulaDenunciante || 'Anónimo'}</td>
              <td>{denuncia.tipoDenuncia?.descripcion || 'Tipo no disponible'}</td>
              <td>{denuncia.lugarDenuncia?.descripcion || 'Lugar no disponible'}</td>
              <td>{denuncia.Status}</td>
              <td>
                <button onClick={() => manejarVer(denuncia)}><FaEye />Ver</button>
                <button onClick={() => manejarEliminarDenuncia(denuncia.id)}><FaTrash />Eliminar</button>
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
  );
};

export default TablaDenuncias;
