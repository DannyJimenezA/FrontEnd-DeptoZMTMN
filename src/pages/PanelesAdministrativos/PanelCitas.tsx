import React, { useEffect, useState } from 'react';
import "../../styles/Administrativos/TablaCitas.css";

// Interfaz para las citas
interface Cita {
  idCita: number;
  descripcion: string;
  fecha: string; // Nota: Se usa string para las fechas en JSON
  IdUser: {
    id: number;
    nombre: string;
  };
}

// Función para obtener las citas desde la API
const fetchCitas = async (): Promise<Cita[]> => {
  const urlBase = 'http://localhost:3006/citas/';  // Ruta para obtener las citas

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

    const data: Cita[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching citas:', error);
    throw error;
  }
};

const TablaCitas: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerCitas = async () => {
      try {
        const citasFromAPI = await fetchCitas();
        setCitas(citasFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las citas:', error);
        setError('Error al cargar las citas.');
        setLoading(false);
      }
    };

    obtenerCitas();
  }, []);

  const manejarEliminar = async (idCita: number) => {
    try {
      const response = await fetch(`http://localhost:3006/citas/${idCita}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar la cita con ID: ${idCita}`);
      }
      setCitas((prevCitas) =>
        prevCitas.filter((cita) => cita.idCita !== idCita)
      );
      console.log(`Cita con ID: ${idCita} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  if (loading) {
    return <p>Cargando citas...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <h2>Citas Programadas</h2>
      <table className="tabla-citas">
        <thead>
          <tr>
            <th>ID Cita</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>ID Solicitante</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.idCita}>
              <td>{cita.idCita}</td>
              <td>{cita.descripcion}</td>
              <td>{new Date(cita.fecha).toLocaleString()}</td> {/* Formateo de fecha */}
              <td>{cita.IdUser ? `${cita.IdUser.nombre}` : 'ID no disponible'}</td>
              <td>
                <button onClick={() => manejarEliminar(cita.idCita)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCitas;
