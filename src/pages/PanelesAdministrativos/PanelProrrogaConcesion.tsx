import React, { useEffect, useState } from 'react';
import "../../styles/Administrativos/TablaProrrogaConcesion.css";

// Interfaz para las prórrogas
interface Prorroga {
  id: number;
  ArchivoAdjunto: string;
  IdConcesion: {
    id: number; 
  };
  FechaInicio: string;
  FechaFin: string;
}

// Función para obtener las prórrogas desde la API
const fetchProrrogas = async (): Promise<Prorroga[]> => {

  const urlBase = 'http://localhost:3006/prorrogas/';  // Ruta para obtener las prórrogas

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

    const data: Prorroga[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prorrogas:', error);
    throw error;
  }
};

const TablaProrrogas: React.FC = () => {
  const [prorrogas, setProrrogas] = useState<Prorroga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerProrrogas = async () => {
      try {
        const prorrogasFromAPI = await fetchProrrogas();
        setProrrogas(prorrogasFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las prórrogas:', error);
        setError('Error al cargar las prórrogas.');
        setLoading(false);
      }
    };

    obtenerProrrogas();
  }, []);

  // Función para ver el PDF
  const manejarVer = (archivoAdjunto: string) => {
    const baseUrl = 'http://localhost:3006/'; // URL base del servidor
  
    if (archivoAdjunto) {
      const pdfUrl = baseUrl + archivoAdjunto;
      console.log('Abriendo PDF en:', pdfUrl);
      window.open(pdfUrl, '_blank');
    } else {
      console.error('No hay archivo adjunto para ver.');
    }
  };

  const manejarAceptar = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3006/prorrogas/${id}/aceptar`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error al aceptar la prórroga con ID: ${id}`);
      }
      setProrrogas((prevProrrogas) =>
        prevProrrogas.map((prorroga) =>
          prorroga.id === id ? { ...prorroga, estado: 'aceptada' } : prorroga
        )
      );
      console.log(`Prórroga con ID: ${id} aceptada`);
    } catch (error) {
      console.error('Error al aceptar la prórroga:', error);
    }
  };

  const manejarDenegar = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3006/prorrogas/${id}/denegar`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error al denegar la prórroga con ID: ${id}`);
      }
      setProrrogas((prevProrrogas) =>
        prevProrrogas.map((prorroga) =>
          prorroga.id === id ? { ...prorroga, estado: 'denegada' } : prorroga
        )
      );
      console.log(`Prórroga con ID: ${id} denegada`);
    } catch (error) {
      console.error('Error al denegar la prórroga:', error);
    }
  };

  const manejarEliminar = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3006/prorrogas/${id}`, {
        method: 'DELETE',
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

  if (loading) {
    return <p>Cargando prórrogas...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <h2>Prórrogas de Concesiones</h2>
      <table className="tabla-prorrogas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Archivo Adjunto</th>
            <th>ID Concesión</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prorrogas.map((prorroga) => (
            <tr key={prorroga.id}>
              <td>{prorroga.id}</td>
              <td>{prorroga.ArchivoAdjunto}</td>
              <td>{prorroga.IdConcesion ? prorroga.IdConcesion.id : 'ID no disponible'}</td>
              <td>{prorroga.FechaInicio}</td>
              <td>{prorroga.FechaFin}</td>
              <td>
                <button onClick={() => manejarAceptar(prorroga.id)}>Aceptar</button>
                <button onClick={() => manejarDenegar(prorroga.id)}>Denegar</button>
                <button onClick={() => manejarVer(prorroga.ArchivoAdjunto)}>Ver PDF</button>
                <button onClick={() => manejarEliminar(prorroga.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaProrrogas;
