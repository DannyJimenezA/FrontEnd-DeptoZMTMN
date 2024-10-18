import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Para decodificar el token JWT
// import "../../styles/Administrativos/TablaRevisionPlanos.css"; // Asegúrate de tener el archivo CSS correcto

// Interfaz para la revisión de planos
interface RevisionPlano {
  id: number;
  NumeroExpediente: string;
  NumeroPlano: string;
  ArchivosAdjuntos: string;
  Status?: string;
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

const baseUrl = 'http://localhost:3000/'; // URL base del servidor

// Función para obtener los datos de revisión de planos desde la API
const fetchRevisiones = async (): Promise<RevisionPlano[]> => {
  const urlBase = `${baseUrl}revision-plano/`;

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

    const data: RevisionPlano[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching revisiones:', error);
    throw error;
  }
};

const TablaRevisionPlanos: React.FC = () => {
  const [revisiones, setRevisiones] = useState<RevisionPlano[]>([]);
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

    const obtenerRevisiones = async () => {
      try {
        const revisionesFromAPI = await fetchRevisiones();
        setRevisiones(revisionesFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las revisiones:', error);
        setError('Error al cargar las revisiones.');
        setLoading(false);
      }
    };

    obtenerRevisiones();
  }, [navigate]);

  const manejarCambioEstado = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}revision-plano/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ Status: nuevoEstado }),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar el estado de la revisión con ID: ${id}`);
      }
      setRevisiones((prevRevisiones) =>
        prevRevisiones.map((revision) =>
          revision.id === id ? { ...revision, Status: nuevoEstado } : revision
        )
      );
      window.alert(`Estado de la revisión con ID: ${id} cambiado a "${nuevoEstado}".`);
    } catch (error) {
      console.error('Error al cambiar el estado de la revisión:', error);
    }
  };

  const manejarEliminar = async (id: number) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta revisión?');
    if (!confirmacion) return;

    try {
      const response = await fetch(`${baseUrl}revision-plano/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar la revisión con ID: ${id}`);
      }

      setRevisiones((prevRevisiones) =>
        prevRevisiones.filter((revision) => revision.id !== id)
      );
      window.alert(`Revisión con ID: ${id} eliminada exitosamente.`);
    } catch (error) {
      console.error('Error al eliminar la revisión:', error);
    }
  };

  const manejarVerArchivo = (archivoUrl: string | undefined) => {
    if (archivoUrl && archivoUrl !== 'undefined') {
      window.open(`${baseUrl}${archivoUrl}`, '_blank');
    } else {
      alert('El archivo no está disponible.');
    }
  };

  if (loading) {
    return <p>Cargando revisiones...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <h2>Revisiones de Planos</h2>
      <table className="tabla-revisiones">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Número de Expediente</th>
            <th>Número de Plano</th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {revisiones.map((revision) => (
            <tr key={revision.id}>
              <td>{revision.user?.nombre || 'Nombre no disponible'}</td>
              <td>{revision.user?.apellido1 && revision.user?.apellido2 ? `${revision.user.apellido1} ${revision.user.apellido2}` : 'Apellidos no disponibles'}</td>
              <td>{revision.NumeroExpediente}</td>
              <td>{revision.NumeroPlano}</td>
              <td>
                {revision.ArchivosAdjuntos ? (
                  JSON.parse(revision.ArchivosAdjuntos).map((archivo: string, index: number) => (
                    <button key={index} onClick={() => manejarVerArchivo(archivo)}>
                      Ver archivo {index + 1}
                    </button>
                  ))
                ) : (
                  'No disponible'
                )}
              </td>
              <td>{revision.Status || 'pendiente'}</td>
              <td>
                <button onClick={() => manejarCambioEstado(revision.id, 'aprobada')}>Aprobar</button>
                <button onClick={() => manejarCambioEstado(revision.id, 'denegada')}>Denegar</button>
                <button onClick={() => manejarEliminar(revision.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaRevisionPlanos;
