import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir a la vista de creación de solicitud
import "../styles/VistaSolicitudesExpedientes.css";


interface Solicitud {
  id: number;
  nombreExpediente: string;
  fechaSolicitud: string;
  estado: string;
}

const VistaSolicitudesExpediente: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para manejar redirecciones

  useEffect(() => {
    // Simulación de una llamada a la API para obtener las solicitudes del usuario
    const fetchSolicitudes = async () => {
      try {
        // Reemplaza con la URL de tu API
        const response = await fetch("http://localhost:3000/expedientes");


        if (!response.ok) {
          throw new Error("Error al cargar las solicitudes");
        }

        const data: Solicitud[] = await response.json();
        setSolicitudes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  // Función para redirigir a la creación de una nueva solicitud
  const handleCrearSolicitud = () => {
    navigate("/crear-solicitud-expediente");
  };

  if (loading) {
    return <p>Cargando solicitudes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="vista-solicitudes-expediente">
      <h1>Mis Solicitudes de Expediente</h1>

      {solicitudes.length === 0 ? (
        <p>No tienes solicitudes de expediente.</p>
      ) : (
        <ul>
          {solicitudes.map(solicitud => (
            <li key={solicitud.id}>
              <strong>{solicitud.nombreExpediente}</strong> - Fecha: {solicitud.fechaSolicitud} - Estado: {solicitud.estado}
            </li>
          ))}
        </ul>
      )}

      <div className="boton-crear-solicitud">
        <button onClick={handleCrearSolicitud}>Crear Nueva Solicitud</button>
      </div>
    </div>
  );
};

export default VistaSolicitudesExpediente;