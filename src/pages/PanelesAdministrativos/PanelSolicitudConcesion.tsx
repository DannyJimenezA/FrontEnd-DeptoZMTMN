import { useEffect, useState } from 'react';
import "../../styles/Administrativos/TablaSolicitudConcesio.css";

// Interfaz para las solicitudes
interface Solicitud {
  id: number;
  ArchivoAdjunto: string;
  IdUser: {
    id: number; 
  };
}

// Función para obtener las solicitudes desde la API
const fetchSolicitudes = async (): Promise<Solicitud[]> => {
  const urlBase = 'http://localhost:3006/concesiones';
  
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

const TablaSolicitudes1 : React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const solicitudesFromAPI = await fetchSolicitudes();
        setSolicitudes(solicitudesFromAPI);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
      }
    };

    obtenerSolicitudes();
  }, []);

  const manejarAceptar = (id: number) => {
    console.log(`Aceptar solicitud con ID: ${id}`);
  };

  const manejarDenegar = (id: number) => {
    console.log(`Denegar solicitud con ID: ${id}`);
  };

  const manejarVer = (id: number) => {
    console.log(`Ver detalles de la solicitud con ID: ${id}`);
  };

  const manejarEliminar = (id: number) => {
    console.log(`Eliminar solicitud con ID: ${id}`);
  };

  return (
    <div className="tabla-container">
      <h2>Solicitudes Enviadas</h2>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Archivo Adjunto</th>
            <th>ID Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id}>
              <td>{solicitud.id}</td>
              <td>{solicitud.ArchivoAdjunto}</td>
              <td>{solicitud.IdUser ? solicitud.IdUser.id : 'ID no disponible'}</td>{/* Acceder correctamente al ID del usuario */}
              <td>
                <button onClick={() => manejarAceptar(solicitud.id)}>Aceptar</button>
                <button onClick={() => manejarDenegar(solicitud.id)}>Denegar</button>
                <button onClick={() => manejarVer(solicitud.id)}>Ver</button>
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