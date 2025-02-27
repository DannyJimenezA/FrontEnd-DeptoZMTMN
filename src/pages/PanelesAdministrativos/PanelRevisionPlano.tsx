// PanelRevisionPlano.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "../../styles/Administrativos/PanelRevisionPlano.css";
import { FaFileDownload } from 'react-icons/fa';
import ApiRoutes from '../../components/ApiRoutes';

// Interfaz para la solicitud de revisión de plano
interface RevisionPlano {
  id: number;
  titulo: string;
  descripcion: string;
  archivoAdjunto: string;
  status: string;
  user?: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
  };
}

// Interfaz para el token decodificado
interface DecodedToken {
  roles: string[];
}


// Función para obtener las solicitudes de revisión de plano desde la API
const fetchRevisionPlano = async (): Promise<RevisionPlano[]> => {

  try {
    const response = await fetch(ApiRoutes.planos, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: RevisionPlano[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching revision plano:', error);
    throw error;
  }
};

const PanelRevisionPlano: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<RevisionPlano[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);

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

    const obtenerRevisionPlano = async () => {
      try {
        const revisionPlanoFromAPI = await fetchRevisionPlano();
        setSolicitudes(revisionPlanoFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las solicitudes de revisión de plano:', error);
        setError('Error al cargar las solicitudes de revisión de plano.');
        setLoading(false);
      }
    };

    obtenerRevisionPlano();
  }, [navigate]);

  // Función para manejar el cambio de estado de una solicitud
  const manejarCambioEstado = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.planos}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar el estado de la solicitud con ID: ${id}`);
      }
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud.id === id ? { ...solicitud, status: nuevoEstado } : solicitud
        )
      );
      window.alert(`Estado de la solicitud con ID: ${id} cambiado a "${nuevoEstado}".`);
    } catch (error) {
      console.error('Error al cambiar el estado de la solicitud:', error);
    }
  };

  // Función para descargar el archivo adjunto
  const manejarDescargaArchivo = (archivoUrl: string | undefined) => {
    if (archivoUrl && archivoUrl !== 'undefined') {
      window.open(`${ApiRoutes}${archivoUrl}`, '_blank');
    } else {
      alert('El archivo no está disponible.');
    }
  };

  // Función para eliminar una solicitud
  const manejarEliminar = async (id: number) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta solicitud?');
    if (!confirmacion) return;

    try {
      const response = await fetch(`${ApiRoutes.planos}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar la solicitud con ID: ${id}`);
      }

      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.filter((solicitud) => solicitud.id !== id)
      );
      window.alert(`Solicitud con ID: ${id} eliminada exitosamente.`);
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error);
    }
  };

  if (loading) {
    return <p>Cargando solicitudes de revisión de plano...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <h2>Gestión de Solicitudes de Revisión de Plano</h2>
      <table className="tabla-revision-plano">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Archivo Adjunto</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id}>
              <td>{solicitud.titulo}</td>
              <td>{solicitud.descripcion}</td>
              <td>
                {solicitud.archivoAdjunto ? (
                  <FaFileDownload
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => manejarDescargaArchivo(solicitud.archivoAdjunto)}
                    title="Descargar archivo"
                  />
                ) : (
                  'No disponible'
                )}
              </td>
              <td>{solicitud.status || 'pendiente'}</td>
              <td>
                <button onClick={() => manejarCambioEstado(solicitud.id, 'aprobada')}>Aprobar</button>
                <button onClick={() => manejarCambioEstado(solicitud.id, 'denegada')}>Denegar</button>
                <button onClick={() => manejarEliminar(solicitud.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PanelRevisionPlano;
