import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirección
import {jwtDecode} from 'jwt-decode'; // Asegúrate de que jwt-decode esté instalado
import "../../styles/Administrativos/TablaCitas.css";
import ApiRoutes from '../../components/ApiRoutes';
import AlertNotification  from '../../components/AlertNotificationP';


// Interfaz para las citas
interface Cita {
  id: number;
  description: string;
  date: string; // Nota: Se usa string para las fechas en JSON
  time: string;
  user: {
    id: number;
    nombre: string;
    cedula: string;
  };
  status: string;
}

// Interfaz para el token decodificado
interface DecodedToken {
  roles: string[];
}

// Función para obtener las citas desde la API
const fetchCitas = async (): Promise<Cita[]> => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(ApiRoutes.citas.crearcita, {
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
  const [, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token); // Decodificar el token para obtener roles

        if (!decodedToken.roles.includes('admin')) {
          window.alert('No tienes permiso para acceder a esta página.'); // Mostrar alerta al usuario
          navigate('/'); // Redirige a una página de acceso denegado o inicio
          return;
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        window.alert('Ha ocurrido un error. Por favor, inicie sesión nuevamente.');
        navigate('/login'); // Redirige a login si hay un problema con el token
        return;
      }
    } else {
      window.alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
      navigate('/login'); // Redirige a login si no hay un token
      return;
    }

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
  }, [navigate]);

  const manejarEliminar = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
    const confirmacion = window.confirm('¿Estás seguro de eliminar la cita?');
    if (!confirmacion) return;
    try {
      const response = await fetch(`${ApiRoutes.citas}/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar la cita con ID: ${id}`);
      }
      setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
      console.log(`Cita con ID: ${id} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  const manejarCambioEstado = async (id: number, nuevoEstado: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
    try {
      const response = await fetch(`${ApiRoutes.citas}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar el estado de la cita con ID: ${id}`);
      }
      setCitas((prevCitas) =>
        prevCitas.map((cita) =>
          cita.id === id ? { ...cita, status: nuevoEstado } : cita
        )
      );
  
      // Mostrar alerta
      setAlert({
        type: 'success',
        message: `La cita fue ${nuevoEstado === 'aprobada' ? 'aprobada' : 'denegada'} correctamente.`,
      });
    } catch (error) {
      console.error('Error al cambiar el estado de la cita:', error);
      setAlert({
        type: 'error',
        message: 'Ocurrió un error al cambiar el estado de la cita.',
      });
    }
  };
  

  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  

  return (
    <>
      <div className="tabla-container">
        <h2>Citas Programadas</h2>
        <table className="tabla-citas">
          <thead>
            <tr>
              <th>ID Cita</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td>{cita.id}</td>
                <td>{cita.description}</td>
                <td>{new Date(cita.date).toLocaleDateString()}</td>
                <td>{cita.time}</td>
                <td>{cita.user ? cita.user.cedula : 'ID no disponible'}</td>
                <td>{cita.user ? cita.user.nombre : 'Nombre no disponible'}</td>
                <td>{cita.status}</td>
                <td>
                  <button onClick={() => manejarCambioEstado(cita.id, 'aprobada')}>Aprobar</button>
                  <button onClick={() => manejarCambioEstado(cita.id, 'denegada')}>Denegar</button>
                  <button onClick={() => manejarEliminar(cita.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* ✅ Alerta fuera del div principal para evitar problemas de posicionamiento */}
      {alert && (
        <AlertNotification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );  
};

export default TablaCitas;
