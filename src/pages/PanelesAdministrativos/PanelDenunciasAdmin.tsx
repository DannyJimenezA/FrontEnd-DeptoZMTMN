// PanelDenunciasAdmin.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  {jwtDecode} from 'jwt-decode';
import "../../styles/Administrativos/PanelDenunciasAdmin.css";  // Añadir la hoja de estilos
import { FaFileDownload } from 'react-icons/fa';

// Interfaz para la denuncia
interface Denuncia {
  id: number;
  titulo: string;
  descripcion: string;
  evidenciaAdjunta: string;
  status: string;
  user?: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
  };
}

// Interfaz para el token decodificado
interface DecodedToken {
  roles: string[];
}

const baseUrl = 'http://localhost:3000/'; // URL base del servidor

// Función para obtener las denuncias desde la API
const fetchDenuncias = async (): Promise<Denuncia[]> => {
  const urlBase = `${baseUrl}Denuncias/`;

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

    const data: Denuncia[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching denuncias:', error);
    throw error;
  }
};

const PanelDenunciasAdmin: React.FC = () => {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);

        if (!decodedToken.roles.includes('admin')) {
          window.alert('No tienes permiso para acceder a esta página.');
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        window.alert('Ha ocurrido un error. Por favor, inicie sesión nuevamente.');
        navigate('/login');
        return;
      }
    } else {
      window.alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
      navigate('/login');
      return;
    }

    const obtenerDenuncias = async () => {
      try {
        const denunciasFromAPI = await fetchDenuncias();
        setDenuncias(denunciasFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las denuncias:', error);
        setError('Error al cargar las denuncias.');
        setLoading(false);
      }
    };

    obtenerDenuncias();
  }, [navigate]);

  // Función para manejar el cambio de estado de una denuncia
  const manejarCambioEstado = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/Denuncias/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar el estado de la denuncia con ID: ${id}`);
      }
      setDenuncias((prevDenuncias) =>
        prevDenuncias.map((denuncia) =>
          denuncia.id === id ? { ...denuncia, status: nuevoEstado } : denuncia
        )
      );
      window.alert(`Estado de la denuncia con ID: ${id} cambiado a "${nuevoEstado}".`);
    } catch (error) {
      console.error('Error al cambiar el estado de la denuncia:', error);
    }
  };

  // Función para descargar la evidencia adjunta
  const manejarDescargaEvidencia = (archivoUrl: string | undefined) => {
    if (archivoUrl && archivoUrl !== 'undefined') {
      window.open(`${baseUrl}${archivoUrl}`, '_blank');
    } else {
      alert('La evidencia no está disponible.');
    }
  };

  // Función para enviar una notificación de seguimiento
  const manejarSeguimiento = (id: number) => {
    const mensaje = window.prompt('Escribe un mensaje de seguimiento para esta denuncia:');
    if (!mensaje) return;

    // Aquí puedes implementar la lógica para enviar la notificación de seguimiento
    window.alert(`Mensaje de seguimiento enviado: ${mensaje}`);
  };

  if (loading) {
    return <p>Cargando denuncias...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <h2>Gestión de Denuncias</h2>
      <table className="tabla-denuncias">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Evidencia Adjunta</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {denuncias.map((denuncia) => (
            <tr key={denuncia.id}>
              <td>{denuncia.titulo}</td>
              <td>{denuncia.descripcion}</td>
              <td>
                {denuncia.evidenciaAdjunta ? (
                  <FaFileDownload
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => manejarDescargaEvidencia(denuncia.evidenciaAdjunta)}
                    title="Descargar evidencia"
                  />
                ) : (
                  'No disponible'
                )}
              </td>
              <td>{denuncia.status || 'pendiente'}</td>
              <td>
                <button onClick={() => manejarCambioEstado(denuncia.id, 'en progreso')}>En progreso</button>
                <button onClick={() => manejarCambioEstado(denuncia.id, 'resuelta')}>Resuelta</button>
                <button onClick={() => manejarSeguimiento(denuncia.id)}>Enviar Seguimiento</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PanelDenunciasAdmin;
