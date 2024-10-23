import React, { useEffect, useState } from 'react';
import Paginacion from '../components/Paginacion';  // Importamos el componente actualizado de paginación
import { Denuncia } from '../Types/Types';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';  // Importamos el helper
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
  
  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Estado para manejar el número de ítems por página

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

  const indiceUltimaDenuncia = currentPage * itemsPerPage;
  const indicePrimeraDenuncia = indiceUltimaDenuncia - itemsPerPage;
  const denunciasActuales = denuncias.slice(indicePrimeraDenuncia, indiceUltimaDenuncia);

  const numeroPaginas = Math.ceil(denuncias.length / itemsPerPage);

  const manejarVer = (denuncia: Denuncia) => {
    onVerDenuncia(denuncia);
  };

  // Usar el helper genérico para eliminar la denuncia
  const manejarEliminarDenuncia = async (id: number) => {
    await eliminarEntidad<Denuncia>('denuncia', id, setDenuncias);  // Usamos el helper para eliminar
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
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Denunciante</th>
            <th>Cédula del Denuncaiante</th>
            <th>Tipo de Denuncia</th>
            <th>Lugar de Denuncia</th>
            {/* <th>Archivos Adjuntos</th> */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {denunciasActuales.map((denuncia) => (
            <tr key={denuncia.id}>
              <td>{denuncia.id}</td>
              {denuncia.nombreDenunciante ? (
                <td>{denuncia.nombreDenunciante}</td>
              ) : (
                <td><h3>Anónimo</h3></td>
              )}
              {denuncia.cedulaDenunciante ? (
                <td>{denuncia.cedulaDenunciante}</td>
              ) : (
                <td><h3>Anónimo</h3></td>
              )}
              <td>{denuncia.tipoDenuncia?.descripcion || 'Tipo no disponible'}</td>
              <td>{denuncia.lugarDenuncia?.descripcion || 'Lugar no disponible'}</td>
              
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
