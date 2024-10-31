import React, { useState, useEffect } from 'react';
import { DecodedToken, Precario } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton'; // Importa el componente de filtro por estado
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface PrecarioTableProps {
  onVerPrecario: (precario: Precario) => void;
}

const fetchPrecarios = async (): Promise<Precario[]> => {
  const urlBase = 'http://localhost:3000/Precario';
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(urlBase, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`,
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
            permission.action === 'GET' && permission.resource === 'concesion'
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
