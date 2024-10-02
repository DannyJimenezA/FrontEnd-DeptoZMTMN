import { useEffect, useState } from 'react';
import "../../styles/Administrativos/TablaSolicitudConcesio.css";

// Interfaz para las solicitudes
interface Solicitud {
  id: number;
  ArchivoAdjunto: string;
  IdUser: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
  };
  IdEstado: {
    id: number;
    descripcion: string;
  };
}

// Función para obtener las solicitudes desde la API
const fetchSolicitudes = async (): Promise<Solicitud[]> => {
  const urlBase = 'http://localhost:3000/concesiones/';  // Nueva ruta para obtener las solicitudes

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

    const data: Solicitud[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching solicitudes:', error);
    throw error;
  }
};

const TablaSolicitudes1: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const solicitudesFromAPI = await fetchSolicitudes();
        setSolicitudes(solicitudesFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
        setError('Error al cargar las solicitudes.');
        setLoading(false);
      }
    };

    obtenerSolicitudes();
  }, []);

  // Función para ver los archivos PDF asociados a una solicitud
  const manejarVer = async (id: number) => {
    const baseUrl = 'http://localhost:3000/'; // URL base del servidor
    const endpoint = `${baseUrl}concesiones/${id}/archivo`; // Endpoint para obtener archivos adjuntos de una solicitud

    try {
      const response = await fetch(endpoint); // Realiza la solicitud al backend
      if (!response.ok) {
        throw new Error('Error al obtener los archivos adjuntos.');
      }

      const data = await response.json(); // Parsear la respuesta del backend
      const archivosAdjuntos = data.archivosAdjuntos; // Obtener los archivos adjuntos

      if (archivosAdjuntos && archivosAdjuntos.length > 0) {
        archivosAdjuntos.forEach((archivo: string) => {
          const pdfUrl = baseUrl + archivo; // Construir la URL completa del archivo
          window.open(pdfUrl, '_blank'); // Abrir el PDF en una nueva pestaña
        });
      } else {
        console.error('No hay archivos adjuntos para ver.');
      }
    } catch (error) {
      console.error('Error al cargar los archivos adjuntos:', error);
    }
  };

  const manejarAceptar = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/concesiones/${id}/aceptar`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error al aceptar la solicitud con ID: ${id}`);
      }
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud.id === id ? { ...solicitud, IdEstado: { id: solicitud.IdEstado.id, descripcion: 'aceptada' } } : solicitud
        )
      );
      console.log(`Solicitud con ID: ${id} aceptada`);
    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
    }
  };

  const manejarDenegar = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/concesiones/${id}/denegar`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error al denegar la solicitud con ID: ${id}`);
      }
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud.id === id ? { ...solicitud, IdEstado: { id: solicitud.IdEstado.id, descripcion: 'denegada' } } : solicitud
        )
      );
      console.log(`Solicitud con ID: ${id} denegada`);
    } catch (error) {
      console.error('Error al denegar la solicitud:', error);
    }
  };

  const manejarEliminar = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/concesiones/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar la solicitud con ID: ${id}`);
      }
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.filter((solicitud) => solicitud.id !== id)
      );
      console.log(`Solicitud con ID: ${id} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error);
    }
  };

  if (loading) {
    return <p>Cargando solicitudes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <h2>Solicitudes Enviadas</h2>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Archivo Adjunto</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id}>
              <td>{solicitud.id}</td>
              <td>{solicitud.IdUser ? solicitud.IdUser.nombre : 'Nombre no disponible'}</td>
              <td>{solicitud.IdUser ? `${solicitud.IdUser.apellido1} ${solicitud.IdUser.apellido2}` : 'Apellidos no disponibles'}</td>
              <td>{solicitud.ArchivoAdjunto ? (
                <span
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => manejarVer(solicitud.id)} // Llama a la función con el ID de la solicitud
                >
                  Ver PDF
                </span>
              ) : (
                'No disponible'
              )}</td>
              <td>{solicitud.IdEstado ? solicitud.IdEstado.descripcion : 'Estado no disponible'}</td>
              <td>
                <button onClick={() => manejarAceptar(solicitud.id)}>Aceptar</button>
                <button onClick={() => manejarDenegar(solicitud.id)}>Denegar</button>
                <button onClick={() => manejarVer(solicitud.id)}>Ver PDF</button>
                <button onClick={() => manejarEliminar(solicitud.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSolicitudes1;
