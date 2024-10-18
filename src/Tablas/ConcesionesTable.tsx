import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Para decodificar el token JWT
// import "../../styles/Administrativos/TablaConcesiones.css";
import { FaFilePdf } from 'react-icons/fa';

// Interfaz para las concesiones
interface Concesion {
  id: number;
  ArchivoAdjunto: string;
  Status?: string;
  user?: {
    cedula: number;
    nombre: string;
    apellido1: string;
  };
}

// Interfaz para el token decodificado
interface DecodedToken {
  roles: string[];
}

// Función para obtener las concesiones desde la API
const fetchConcesiones = async (): Promise<Concesion[]> => {
  const urlBase = 'http://localhost:3000/Concesiones';

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

    const data: Concesion[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching concesiones:', error);
    throw error;
  }
};

const TablaConcesiones: React.FC = () => {
  const [concesiones, setConcesiones] = useState<Concesion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token); // Decodificar el token para obtener roles

        if (!decodedToken.roles.includes('admin')) {
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
  }, [navigate]);

  const manejarVer = (archivo: string | string[]) => {
    let archivoFinal = Array.isArray(archivo) ? archivo[0] : archivo;
    archivoFinal = archivoFinal.replace(/[\[\]"]/g, '');

    if (archivoFinal) {
      const fileUrl = `http://localhost:3000/${archivoFinal}`;
      window.open(fileUrl, '_blank');
    } else {
      console.error('No hay archivo adjunto para ver.');
    }
  };

  const manejarCambioEstadoConcesion = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/Concesiones/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Status: nuevoEstado }),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar el estado de la concesión con ID: ${id}`);
      }
      setConcesiones((prevConcesiones) =>
        prevConcesiones.map((concesion) =>
          concesion.id === id ? { ...concesion, Status: nuevoEstado } : concesion
        )
      );
    } catch (error) {
      console.error('Error al cambiar el estado de la concesión:', error);
    }
  };

  const manejarEliminarConcesion = async (id: number) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta concesión?');
    if (!confirmacion) return;

    try {
      const response = await fetch(`http://localhost:3000/Concesiones/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar la concesión con ID: ${id}`);
      }

      setConcesiones((prevConcesiones) =>
        prevConcesiones.filter((concesion) => concesion.id !== id)
      );
      console.log(`Concesión con ID: ${id} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la concesión:', error);
    }
  };

  if (loading) {
    return <p>Cargando concesiones...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <h2>Solicitudes de Concesión</h2>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {concesiones.map((concesion) => (
            <tr key={concesion.id}>
              <td>{concesion.id}</td>
              <td>{concesion.user?.cedula}</td>
              <td>{concesion.user?.nombre}</td>
              <td>{concesion.user?.apellido1}</td>
              <td>
                {concesion.ArchivoAdjunto ? (
                  JSON.parse(concesion.ArchivoAdjunto).map((archivo: string, index: number) => (
                    <FaFilePdf
                      key={index}
                      style={{ cursor: 'pointer', marginRight: '5px' }}
                      onClick={() => manejarVer(archivo)}
                      title="Ver archivo"
                    />
                  ))
                ) : (
                  'No disponible'
                )}
              </td>
              <td>{concesion.Status || 'Pendiente'}</td>
              <td>
                <button onClick={() => manejarCambioEstadoConcesion(concesion.id, 'aprobada')}>Aprobar</button>
                <button onClick={() => manejarCambioEstadoConcesion(concesion.id, 'denegada')}>Denegar</button>
                <button onClick={() => manejarEliminarConcesion(concesion.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaConcesiones;
