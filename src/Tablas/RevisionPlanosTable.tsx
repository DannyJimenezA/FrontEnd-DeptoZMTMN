import React, { useState, useEffect } from 'react';
import { DecodedToken, RevisionPlano } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton'; // Importar el componente de filtro por estado
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface RevisionplanoTableProps {
  onVerRevisionPlano: (RevisionPlano: RevisionPlano) => void;
}

const fetchRevisionplano = async (): Promise<RevisionPlano[]> => {
  const urlBase = 'http://localhost:3000/Revision-Plano';
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
    console.error('Error fetching Revisionplano:', error);
    throw error;
  }
};

const RevisionplanoTable: React.FC<RevisionplanoTableProps> = ({ onVerRevisionPlano }) => {
  const [Revisionplano, setRevisionplano] = useState<RevisionPlano[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos'); // Estado para el filtro de estado
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        console.log(decodedToken.permissions);
        console.log(decodedToken); // Imprime el token decodificado
  
        // Validar que 'permissions' exista y sea un array
        const hasPermission = decodedToken.permissions.some(
          (permission: { action: string; resource: string }) =>
            permission.action === 'GET' && permission.resource === 'revisionplano'
        );
  
        if (!hasPermission) {
          window.alert('No tienes permiso para acceder a esta página.');
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        window.alert('Ha ocurrido un error. Por favor, inicie sesión nuevamente.');
        navigate('/login');
        return;
      }
    } else {
      window.alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
      navigate('/login');
      return;
    }
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

  // Filtrar las solicitudes de revisión de planos según el estado seleccionado
  const obtenerRevisionplanoFiltradas = () => {
    if (filtroEstado === 'todos') return Revisionplano;
    return Revisionplano.filter((plano) => plano.status === filtroEstado);
  };

  const RevisionplanoFiltradas = obtenerRevisionplanoFiltradas();
  const indexUltimaRevisionPlano = currentPage * itemsPerPage;
  const indexPrimeraRevisionPlano = indexUltimaRevisionPlano - itemsPerPage;
  const RevisionplanoActuales = RevisionplanoFiltradas.slice(indexPrimeraRevisionPlano, indexUltimaRevisionPlano);

  const numeroPaginas = Math.ceil(RevisionplanoFiltradas.length / itemsPerPage);

  // Función para eliminar una solicitud de revisión de plano
  const manejarEliminarRevisionPlano = async (id: number) => {
    await eliminarEntidad<RevisionPlano>('Revision-Plano', id, setRevisionplano);
  };

  if (loading) {
    return <p>Cargando solicitudes de revisión de planos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <div className="tabla-container">
        <h2>Solicitudes de Revisión de Planos</h2>

        {/* Componente de filtro por estado */}
        <FilterButtons onFilterChange={setFiltroEstado} />

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
            {RevisionplanoActuales.map((RevisionPlano) => (
              <tr key={RevisionPlano.id}>
                <td>{RevisionPlano.id}</td>
                <td>{RevisionPlano.user?.nombre}</td>
                <td>{RevisionPlano.user?.apellido1}</td>
                <td>{RevisionPlano.user?.cedula}</td>
                <td>{RevisionPlano.Date}</td>
                <td>{RevisionPlano.status || 'Pendiente'}</td>
                <td>
                  <button onClick={() => onVerRevisionPlano(RevisionPlano)}><FaEye /> Ver</button>
                  <button onClick={() => manejarEliminarRevisionPlano(RevisionPlano.id)}><FaTrash /> Eliminar</button>
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
