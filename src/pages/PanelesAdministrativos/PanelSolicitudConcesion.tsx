import React, { useEffect, useState } from 'react';
import "../../styles/Administrativos/TablaSolicitudConcesio.css"


interface Solicitud {
  id: string;
  nombre: string;
  apellido: string;
  estado: string; 
}

const TablaSolicitudes: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  
  useEffect(() => {
    
    const obtenerSolicitudes = async () => {
      const datosFicticios: Solicitud[] = [
        { id: '1', nombre: 'Juan', apellido: 'Pérez', estado: 'pendiente' },
        { id: '2', nombre: 'Ana', apellido: 'Gómez', estado: 'pendiente' },
        { id: '3', nombre: 'Luis', apellido: 'Ramírez', estado: 'pendiente' },
      ];
      setSolicitudes(datosFicticios);
    };

    obtenerSolicitudes();
  }, []);

 
  const manejarAceptar = (id: string) => {
   
    console.log(`Aceptar solicitud con ID: ${id}`);
  };

  const manejarDenegar = (id: string) => {
    
    console.log(`Denegar solicitud con ID: ${id}`);
  };

  const manejarVer = (id: string) => {
    
    console.log(`Ver detalles de la solicitud con ID: ${id}`);
  };

  const manejarEliminar = (id: string) => {
   
    console.log(`Eliminar solicitud con ID: ${id}`);
  };

  return (
    <div className="tabla-container">
      <h2>Solicitudes Enviadas</h2>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id}>
              <td>{solicitud.id}</td>
              <td>{solicitud.nombre}</td>
              <td>{solicitud.apellido}</td>
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

export default TablaSolicitudes;
