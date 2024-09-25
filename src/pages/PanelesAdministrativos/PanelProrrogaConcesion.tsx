import React, { useEffect, useState } from 'react';
import "../../styles/Administrativos/TablaProrrogaConcesion.css";
import { FaFilePdf } from 'react-icons/fa';

// Interfaz para las prórrogas
interface Prorroga {
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

// Función para obtener las prórrogas desde la API
const fetchProrrogas = async (): Promise<Prorroga[]> => {

  const urlBase = 'http://localhost:3000/Prorrogas/';  // Ruta para obtener las prórrogas

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

  // Función para ver los archivos PDF asociados a una prórroga
  const manejarVer = async (id: number) => {
    const baseUrl = 'http://localhost:3000/'; // URL base del servidor
    const endpoint = `${baseUrl}Prorrogas/${id}/archivo`; // Endpoint que coincide con la ruta en el backend
  
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
      const response = await fetch(`http://localhost:3000/Prorrogas/${id}/aceptar`, {
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
      const response = await fetch(`http://localhost:3000/prorrogas/${id}/denegar`, {
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
      const response = await fetch(`http://localhost:3000/prorrogas/${id}`, {
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
            <th>Nombre</th>
            <th>Apellidos </th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prorrogas.map((prorroga) => (
            <tr key={prorroga.id}>
              <td>{prorroga.IdUser ? prorroga.IdUser.nombre : 'Nombre no disponible'}</td>
              <td>{prorroga.IdUser ? `${prorroga.IdUser.apellido1} ${prorroga.IdUser.apellido2}` : 'Apellidos no disponibles'}</td>
              <td>{prorroga.ArchivoAdjunto ? (<FaFilePdf style={{ cursor: 'pointer'}} onClick={() => manejarVer(prorroga.ArchivoAdjunto)} title="ver archivo" /> ) : (
                'No disponible'
              )}</td>
              <td>{prorroga.IdEstado ? prorroga.IdEstado.descripcion : 'Estado no disponible'}</td>
              <td>
                <button onClick={() => manejarAceptar(prorroga.id)}>Aceptar</button>
                <button onClick={() => manejarDenegar(prorroga.id)}>Denegar</button>
                <button onClick={() => manejarVer(prorroga.id)}>Ver PDF</button>
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
