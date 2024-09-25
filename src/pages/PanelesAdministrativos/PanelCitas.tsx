import React, { useEffect, useState } from 'react';
import "../../styles/Administrativos/TablaCitas.css";

// Interfaz para las citas
interface Cita {
  id: number;
  description: string;
  date: string; // Nota: Se usa string para las fechas en JSON
  time: string;
  user: { // Cambia `IdUser` por `user` si así lo llamas en el backend
    id: number;
    nombre: string;
    cedula: string;
  };
  status: string;
}

// Función para obtener las citas desde la API
const fetchCitas = async (): Promise<Cita[]> => {
  const urlBase = 'http://localhost:3000/appointments';  // Ruta para obtener las citas
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(urlBase, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 403) {
      throw new Error('No tienes permiso para acceder a estas citas.'); // Manejar caso de error 403
    }

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

  const manejarEliminar = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token){
      console.error('Token no encontrado');
      return;
    }
    const confirmacion = window.confirm('Estas seguro de eliminar la cita?')
    if (!confirmacion) return;
    try {
      const response = await fetch(`http://localhost:3000/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar la cita con ID: ${id}`);
      }
      setCitas((prevCitas) =>
        prevCitas.filter((cita) => cita.id !== id)
      );
      console.log(`Cita con ID: ${id} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };
  const manejarCambioEstado = async (id: number, nuevoEstado: string)=>{
   const token = localStorage.getItem('token');
   if (!token){
    console.error('Token no encontrado');
    return;
   }
   try{
    const response = await fetch(`http://localhost:3000/appointments/${id}/status`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({status: nuevoEstado}),
    });
    if (!response.ok){
      throw new Error(`Error al actualizar el estado de la cita con ID: ${id}`);
    }
    setCitas((prevCitas)=>
      prevCitas.map((cita)=>
        cita.id === id ? {...cita, status: nuevoEstado}:cita
  )
);
console.log(`Estado de la cita con ID: ${id} cambiado a ${nuevoEstado}`);
   }catch(error){
    console.error('Error al cambiar el estado de la cita:', error);

   }
  };

  return (
    <div className="tabla-container">
      <h2>Citas Programadas</h2>
      <table className="tabla-citas">
        <thead>
          <tr>
            <th>ID Cita</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>ID Solicitante</th>
            <th>Nombre </th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{cita.id}</td>
              <td>{cita.description}</td>
              <td>{new Date(cita.date).toLocaleDateString()}</td> {/* Formateo de fecha */}
              <td>{cita.time}</td>
              <td>{cita.user ? `${cita.user.cedula}` : 'ID no disponible'}</td>
              <td>{cita.user ? cita.user.nombre : 'Nombre no disponible'}</td>
              <td>{cita.status}</td>
              <td>
                <button onClick={()=> manejarCambioEstado(cita.id, 'aprobada')}>Aprobar</button>
                <button onClick={()=> manejarCambioEstado(cita.id, 'denegada')}>Denegar</button>
                <button onClick={() => manejarEliminar(cita.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCitas;
