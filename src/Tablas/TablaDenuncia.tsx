import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileDownload } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode'; // Para decodificar el token JWT
import ApiRoutes from '../components/ApiRoutes';

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



// Función para obtener las denuncias desde la API
const fetchDenuncias = async (): Promise<Denuncia[]> => {


  try {
    const response = await fetch(ApiRoutes.denuncias, {
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

const TablaDenunciasDashboard: React.FC = () => {
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

  // Función para descargar la evidencia adjunta
  const manejarDescargaEvidencia = (archivoUrl: string | undefined) => {
    if (archivoUrl && archivoUrl !== 'undefined') {
      window.open(`${ApiRoutes}${archivoUrl}`, '_blank');
    } else {
      alert('La evidencia no está disponible.');
    }
  };

  // Función para cambiar el estado de una denuncia
  const manejarCambioEstado = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes}Denuncias/${id}/status`, {
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

  if (loading) return <p>Cargando denuncias...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-11/12 mx-auto p-5 bg-gray-100 rounded-lg shadow-lg overflow-x-auto">
      <h2 className="text-2xl font-bold mb-5">Gestión de Denuncias</h2>
      <table className="min-w-full table-auto">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Evidencia Adjunta</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {denuncias.map((denuncia) => (
            <tr key={denuncia.id} className="bg-white border-b hover:bg-blue-50">
              <td className="px-4 py-2">{denuncia.titulo}</td>
              <td className="px-4 py-2">{denuncia.descripcion}</td>
              <td className="px-4 py-2">
                {denuncia.evidenciaAdjunta ? (
                  <FaFileDownload
                    className="cursor-pointer text-blue-600"
                    onClick={() => manejarDescargaEvidencia(denuncia.evidenciaAdjunta)}
                    title="Descargar evidencia"
                  />
                ) : (
                  'No disponible'
                )}
              </td>
              <td className="px-4 py-2">{denuncia.status || 'pendiente'}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                  onClick={() => manejarCambioEstado(denuncia.id, 'en progreso')}
                >
                  En progreso
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded ml-2"
                  onClick={() => manejarCambioEstado(denuncia.id, 'resuelta')}
                >
                  Resuelta
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaDenunciasDashboard;
