import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "../../styles/Administrativos/TablaProrrogaConcesion.css";
import { FaFilePdf } from 'react-icons/fa';
import ApiRoutes from '../../components/ApiRoutes';
import AlertNotification from '../../components/AlertNotificationP';

// Interfaz para las prórrogas
interface Prorroga {
  id: number;
  ArchivoAdjunto: string;
  Status?: string;
  user?: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
  };
}

interface DecodedToken {
  roles: string[];
}

const fetchProrrogas = async (): Promise<Prorroga[]> => {
  const response = await fetch(ApiRoutes.prorrogas, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return await response.json();
};

const TablaProrrogas: React.FC = () => {
  const [prorrogas, setProrrogas] = useState<Prorroga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
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
  }, [navigate]);

  const manejarCambioEstado = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${ApiRoutes.prorrogas}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ Status: nuevoEstado }),
      });

      if (!response.ok) throw new Error();

      setProrrogas(prev =>
        prev.map(p => (p.id === id ? { ...p, Status: nuevoEstado } : p))
      );

      setAlert({
        type: 'success',
        message: `La prórroga fue ${nuevoEstado === 'aprobada' ? 'aprobada' : 'denegada'} correctamente.`,
      });
    } catch (error) {
      console.error('Error al cambiar el estado de la prórroga:', error);
      setAlert({ type: 'error', message: 'Ocurrió un error al cambiar el estado.' });
    }
  };

  const manejarEliminar = async (id: number) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta prórroga?');
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${ApiRoutes.prorrogas}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error();

      setProrrogas(prev => prev.filter(p => p.id !== id));

      setAlert({
        type: 'success',
        message: `La prórroga con ID ${id} fue eliminada correctamente.`,
      });
    } catch (error) {
      console.error('Error al eliminar la prórroga:', error);
      setAlert({ type: 'error', message: 'Ocurrió un error al eliminar la prórroga.' });
    }
  };

  const manejarVerArchivo = (archivoUrl: string | undefined) => {
    if (archivoUrl && archivoUrl !== 'undefined') {
      window.open(`${ApiRoutes}${archivoUrl}`, '_blank');
    } else {
      window.alert('El Archivo no esta disponible');
    }
  };

  if (loading) return <p>Cargando prórrogas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="tabla-container">
      <h2>Prórrogas de Concesiones</h2>
      <table className="tabla-prorrogas">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prorrogas.map((prorroga) => (
            <tr key={prorroga.id}>
              <td>{prorroga.user?.nombre || 'Nombre no disponible'}</td>
              <td>
                {prorroga.user?.apellido1 && prorroga.user?.apellido2
                  ? `${prorroga.user.apellido1} ${prorroga.user.apellido2}`
                  : 'Apellidos no disponibles'}
              </td>
              <td>
                {prorroga.ArchivoAdjunto ? (
                  JSON.parse(prorroga.ArchivoAdjunto).map((archivo: string, index: number) => (
                    <FaFilePdf
                      key={index}
                      style={{ cursor: 'pointer', marginRight: '5px' }}
                      onClick={() => manejarVerArchivo(archivo)}
                      title="Ver archivo"
                    />
                  ))
                ) : (
                  'No disponible'
                )}
              </td>
              <td>{prorroga.Status || 'pendiente'}</td>
              <td>
                <button onClick={() => manejarCambioEstado(prorroga.id, 'aprobada')}>Aprobar</button>
                <button onClick={() => manejarCambioEstado(prorroga.id, 'denegada')}>Denegar</button>
                <button onClick={() => manejarEliminar(prorroga.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Componente de alerta */}
      {alert && (
        <AlertNotification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default TablaProrrogas;
