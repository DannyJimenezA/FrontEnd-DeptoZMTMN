import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import '../styles/Global.css';
import { Cita, DecodedToken } from '../Types/Types';
import { FaEye, FaTrash } from 'react-icons/fa';
import Paginacion from '../components/Paginacion';

interface CitasTableProps {
  onVerCita: (cita: Cita) => void;
}

const fetchCitas = async (): Promise<Cita[]> => {
  const urlBase = 'http://localhost:3000/appointments';
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(urlBase, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

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

const TablaCitas: React.FC<CitasTableProps> = ({ onVerCita }) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        console.log(decodedToken.permissions);
        console.log(decodedToken); // Imprime el token decodificado
  
        // Validar que 'permissions' exista y sea un array
        const hasPermission = decodedToken.permissions.some(
          (permission: { action: string; resource: string }) =>
            permission.action === 'GET' && permission.resource === 'appointments'
        );
  
        if (!hasPermission) {
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
  
    // Función para obtener las citas desde la API
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
    const confirmacion = window.confirm('¿Estás seguro de eliminar la cita?');
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

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

      setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
      console.log(`Cita con ID: ${id} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  if (loading) return <p>Cargando citas...</p>;
  if (error) return <p>{error}</p>;

  const indexUltimaCita = currentPage * itemsPerPage;
  const indexPrimeraCita = indexUltimaCita - itemsPerPage;
  const citasActuales = citas.slice(indexPrimeraCita, indexUltimaCita);

  const totalPages = Math.ceil(citas.length / itemsPerPage);

  return (
    <div className="tabla-container">
      <h2>Citas Programadas</h2>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha Y Hora</th>
            <th>Cédula Solicitante</th>
            <th>Nombre Solicitante</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citasActuales.map((cita) => (
            <tr key={cita.id}>
              <td>{cita.id}</td>
              <td>{new Date(cita.date).toLocaleDateString()}  {cita.time}</td>
              <td>{cita.user?.cedula || 'No disponible'}</td>
              <td>{cita.user?.nombre || 'No disponible'}</td>
              <td>{cita.status}</td>
              <td>
                <button
                  className="boton-ver"
                  onClick={() => onVerCita(cita)}
                >
                  <FaEye /> Ver
                </button>
                <button onClick={() => manejarEliminar(cita.id)}>
                  <FaTrash /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Paginacion
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default TablaCitas;
