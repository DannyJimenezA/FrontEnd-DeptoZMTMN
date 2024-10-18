import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirección
import {jwtDecode} from 'jwt-decode'; // Asegúrate de que jwt-decode esté instalado
// import "../../styles/Administrativos/TablaUsoPrecario.css";
import { FaFilePdf } from 'react-icons/fa';

// Interfaz para el uso precario
interface Precario {
  id: number;
  ArchivoAdjunto: string;
  Status?: string;
  user?: {
    cedula: number;
    nombre: string;
    apellido1: string;
  };
}

// Interfaz para el token decodificado
interface DecodedToken {
  roles: string[];
}

// Función para obtener las solicitudes de uso precario desde la API
const fetchPrecarios = async (): Promise<Precario[]> => {
  const urlBase = 'http://localhost:3000/Precario'; // Ruta para obtener las solicitudes de uso precario

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

    const data: Precario[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching solicitudes de uso precario:', error);
    throw error;
  }
};

const TablaUsoPrecario: React.FC = () => {
  const [precarios, setPrecario] = useState<Precario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

    const obtenerPrecarios = async () => {
      try {
        const precariosFromAPI = await fetchPrecarios();
        setPrecario(precariosFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las solicitudes de uso precario:', error);
        setError('Error al cargar las solicitudes de uso precario.');
        setLoading(false);
      }
    };

    obtenerPrecarios();
  }, [navigate]);

  // Manejador para ver el archivo adjunto
  const manejarVer = (archivo: string | string[]) => {
    let archivoFinal = Array.isArray(archivo) ? archivo[0] : archivo;
    archivoFinal = archivoFinal.replace(/[\[\]"]/g, '');

    if (archivoFinal) {
      const fileUrl = `http://localhost:3000/${archivoFinal}`;
      window.open(fileUrl, '_blank');
    } else {
      console.error('No hay archivo adjunto para ver.');
    }
  };

  // Manejador para cambiar el estado de una solicitud de uso precario
  const manejarCambioEstadoPrecario = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/Precario/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Status: nuevoEstado }),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar el estado de la solicitud con ID: ${id}`);
      }
      setPrecario((prevPrecarios) =>
        prevPrecarios.map((precario) =>
          precario.id === id ? { ...precario, Status: nuevoEstado } : precario
        )
      );
    } catch (error) {
      console.error('Error al cambiar el estado de la solicitud:', error);
    }
  };

  // Manejador para eliminar una solicitud de uso precario
  const manejarEliminarPrecario = async (id: number) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta solicitud?');
    if (!confirmacion) return;

    try {
      const response = await fetch(`http://localhost:3000/Precario/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar la solicitud con ID: ${id}`);
      }

      setPrecario((prevPrecarios) =>
        prevPrecarios.filter((precario) => precario.id !== id)
      );
      console.log(`Solicitud con ID: ${id} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error);
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
      <h2>Solicitudes de Uso Precario</h2>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {precarios.map((precario) => (
            <tr key={precario.id}>
              <td>{precario.id}</td>
              <td>{precario.user?.cedula}</td>
              <td>{precario.user?.nombre}</td>
              <td>{precario.user?.apellido1}</td>
              <td>
                {precario.ArchivoAdjunto ? (
                  JSON.parse(precario.ArchivoAdjunto).map((archivo: string, index: number) => (
                    <FaFilePdf
                      key={index}
                      style={{ cursor: 'pointer', marginRight: '5px' }}
                      onClick={() => manejarVer(archivo)}
                      title="Ver archivo"
                    />
                  ))
                ) : (
                  'No disponible'
                )}
              </td>
              <td>{precario.Status || 'Pendiente'}</td>
              <td>
                <button onClick={() => manejarCambioEstadoPrecario(precario.id, 'aprobada')}>Aprobar</button>
                <button onClick={() => manejarCambioEstadoPrecario(precario.id, 'denegada')}>Denegar</button>
                <button onClick={() => manejarEliminarPrecario(precario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsoPrecario;
