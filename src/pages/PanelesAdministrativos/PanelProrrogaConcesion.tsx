import React, { useEffect, useState } from 'react';
import "../../styles/Administrativos/TablaProrrogaConcesion.css";
import { FaFilePdf } from 'react-icons/fa';

// Interfaz para las prórrogas
interface Prorroga {
  id: number;
  ArchivoProrroga: string;
  Status?: string;
  user: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
  };
  
}
const baseUrl = 'http://localhost:3000/'; // URL base del servidor
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
    
  const endpoint = `${baseUrl}Prorrogas/${id}/archivo`; // Endpoint que coincide con la ruta en el backend
  
  try {
    const response = await fetch(endpoint); // Realiza la solicitud al backend
    if (!response.ok) {
      throw new Error('Error al obtener los archivos adjuntos.');
    }
    
    const data = await response.json(); // Parsear la respuesta del backend
    const archivosAdjuntos = data.archivosAdjuntos; // Obtener los archivos adjuntos

    if (archivosAdjuntos && archivosAdjuntos.length > 0) {
      // Aquí podrías retornar los archivos, pero como ahora estamos llamando a la función desde los íconos
      return archivosAdjuntos; // Retornar los archivos para uso futuro si es necesario
    } else {
      console.error('No hay archivos adjuntos para ver.');
    }
  } catch (error) {
    console.error('Error al cargar los archivos adjuntos:', error);
  }
};
const manejarCambioEstado = async (id: number, nuevoEstado: string)=>{
  const token = localStorage.getItem('token');
  if (!token){
   console.error('Token no encontrado');
   return;
  }
  try{
   const response = await fetch(`http://localhost:3000/Prorrogas/${id}/status`,{
     method: 'PUT',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`,
     },
     body: JSON.stringify({Status: nuevoEstado}),
   });
   if (!response.ok){
     throw new Error(`Error al actualizar el estado de la cita con ID: ${id}`);
   }
   setProrrogas((prevProrrogas)=>
     prevProrrogas.map((prorroga)=>
       prorroga.id === id ? {...prorroga, Status: nuevoEstado}:prorroga
 )
);
console.log(`Estado de la cita con ID: ${id} cambiado a ${nuevoEstado}`);
  }catch(error){
   console.error('Error al cambiar el estado de la cita:', error);

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
              <td>{prorroga.user ? prorroga.user.nombre : 'Nombre no disponible'}</td>
              <td>{prorroga.user ? `${prorroga.user.apellido1} ${prorroga.user.apellido2}` : 'Apellidos no disponibles'}</td>
              <td>{prorroga.ArchivoProrroga ? (
    JSON.parse(prorroga.ArchivoProrroga).map((archivo: string, index: number) => (
      <FaFilePdf
        key={index}
        style={{ cursor: 'pointer', marginRight: '5px' }}
        onClick={() => window.open(`${baseUrl}${archivo}`, '_blank')} // Abre el archivo específico al hacer clic
        title="Ver archivo"
      />
    ))
  ) : (
    'No disponible'
  )}</td>
              <td>{prorroga.Status}</td>
              <td>
              <button onClick={()=> manejarCambioEstado(prorroga.id, 'aprobada')}>Aprobar</button>
              <button onClick={()=> manejarCambioEstado(prorroga.id, 'denegada')}>Denegar</button>
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
