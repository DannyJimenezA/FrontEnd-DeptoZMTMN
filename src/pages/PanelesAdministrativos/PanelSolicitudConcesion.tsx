import React, { useEffect, useState } from 'react';
import "../../styles/Administrativos/TablaProrrogaConcesion.css";
import { FaFilePdf } from 'react-icons/fa';

interface Prorroga {
  id: number;
  ArchivoAdjunto: string;
  Status?: string;
}

interface Concesion {
  id: number;
  ArchivoAdjunto: string;
  Status?: string; // Añadimos Status aquí también
}

interface SolicitudesResponse {
  concesiones: Concesion[];
  prorrogas: Prorroga[];
}

const baseUrl = 'http://localhost:3000/';

const fetchSolicitudes = async (): Promise<SolicitudesResponse> => {
  const urlBase = 'http://localhost:3000/solicitudes';

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

    const data: SolicitudesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching solicitudes:', error);
    throw error;
  }
};

const TablaSolicitudes: React.FC = () => {
  const [prorrogas, setProrrogas] = useState<Prorroga[]>([]);
  const [concesiones, setConcesiones] = useState<Concesion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const solicitudesFromAPI = await fetchSolicitudes();
        setProrrogas(solicitudesFromAPI.prorrogas);
        setConcesiones(solicitudesFromAPI.concesiones);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
        setError('Error al cargar las solicitudes.');
        setLoading(false);
      }
    };

    obtenerSolicitudes();
  }, []);

  const manejarVer = (archivo: string) => {
    if (archivo) {
      window.open(`${baseUrl}${archivo}`, '_blank');
    } else {
      console.error('No hay archivo adjunto para ver.');
    }
  };

  const manejarCambioEstado = async (id: number, nuevoEstado: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/Prorrogas/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ Status: nuevoEstado }),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar el estado de la prórroga con ID: ${id}`);
      }
      setProrrogas((prevProrrogas) =>
        prevProrrogas.map((prorroga) =>
          prorroga.id === id ? { ...prorroga, Status: nuevoEstado } : prorroga
        )
      );
      console.log(`Estado de la prórroga con ID: ${id} cambiado a ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado de la prórroga:', error);
    }
  };

  const manejarCambioEstadoConcesion = async (id: number, nuevoEstado: string) => {
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
          'Authorization': `Bearer ${token}`,
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
      console.log(`Estado de la concesión con ID: ${id} cambiado a ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado de la concesión:', error);
    }
  };

  // Nueva función para eliminar una prórroga
  const manejarEliminarProrroga = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/Prorrogas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar la prórroga con ID: ${id}`);
      }
      setProrrogas((prevProrrogas) =>
        prevProrrogas.filter((prorroga) => prorroga.id !== id)
      );
      console.log(`Prórroga con ID: ${id} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la prórroga:', error);
    }
  };

  // Nueva función para eliminar una concesión
  const manejarEliminarConcesion = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/Concesiones/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
    return <p>Cargando solicitudes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <h2>Solicitudes de Concesiones y Prórrogas</h2>

      {/* Tabla para Concesiones */}
      <h3>Concesiones</h3>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {concesiones.map((concesion) => (
            <tr key={concesion.id}>
              <td>{concesion.id}</td>
              <td>
                {concesion.ArchivoAdjunto ? (
                  <FaFilePdf
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => manejarVer(concesion.ArchivoAdjunto)}
                    title="Ver archivo"
                  />
                ) : (
                  'No disponible'
                )}
              </td>
              <td>{concesion.Status}</td>
              <td>
                <button onClick={() => manejarCambioEstadoConcesion(concesion.id, 'aprobada')}>Aprobar</button>
                <button onClick={() => manejarCambioEstadoConcesion(concesion.id, 'denegada')}>Denegar</button>
                <button onClick={() => manejarEliminarConcesion(concesion.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabla para Prórrogas */}
      <h3>Prórrogas</h3>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prorrogas.map((prorroga) => (
            <tr key={prorroga.id}>
              <td>{prorroga.id}</td>
              <td>
                {prorroga.ArchivoAdjunto ? (
                  <FaFilePdf
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => manejarVer(prorroga.ArchivoAdjunto)}
                    title="Ver archivo"
                  />
                ) : (
                  'No disponible'
                )}
              </td>
              <td>{prorroga.Status}</td>
              <td>
                <button onClick={() => manejarCambioEstado(prorroga.id, 'aprobada')}>Aprobar</button>
                <button onClick={() => manejarCambioEstado(prorroga.id, 'denegada')}>Denegar</button>
                <button onClick={() => manejarEliminarProrroga(prorroga.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSolicitudes;
