import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Importación correcta
import { DecodedToken, Prorroga } from '../Types/Types';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';  // Importa el helper de eliminar
import Paginacion from '../components/Paginacion';

interface ProrrogasTableProps {
  onVerProrroga: (prorroga: Prorroga) => void;
}

const baseUrl = 'http://localhost:3000/'; // URL base del servidor

// Función para obtener las prórrogas desde la API
const fetchProrrogas = async (): Promise<Prorroga[]> => {
  const urlBase = `${baseUrl}Prorrogas/`;

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

const TablaProrrogas: React.FC<ProrrogasTableProps> = ({ onVerProrroga }) => {
  const [prorrogas, setProrrogas] = useState<Prorroga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage, setItemsPerPage] = useState(5);
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

    // Cálculo de las prorrogas que se mostrarán en la página actual
    const indexUltimaProrroga = currentPage * itemsPerPage;
    const indexPrimeraProrroga = indexUltimaProrroga - itemsPerPage;
    const prorrogasActuales = prorrogas.slice(indexPrimeraProrroga, indexUltimaProrroga);
  
    const numeroPaginas = Math.ceil(prorrogas.length / itemsPerPage);


  // Función para eliminar una prórroga usando el helper eliminarEntidad
  const manejarEliminarProrroga = async (id: number) => {
    await eliminarEntidad<Prorroga>('Prorrogas', id, setProrrogas); // Usamos el helper para eliminar
  };

  // Mostrar pantalla de carga
  if (loading) {
    return <p>Cargando prórrogas...</p>;
  }

  // Mostrar errores si los hay
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tabla-container">
      <h2>Prórrogas de Concesiones</h2>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Cédula</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prorrogas.map((prorroga) => (
            <tr key={prorroga.id}>
              <td>{prorroga.id}</td>
              <td>{prorroga.user?.nombre || 'Nombre no disponible'}</td>
              <td>{prorroga.user?.apellido1 && prorroga.user?.apellido2 ? `${prorroga.user.apellido1} ${prorroga.user.apellido2}` : 'Apellidos no disponibles'}</td>
              <td>{prorroga.user?.cedula}</td>
              <td>{prorroga.Status || 'Pendiente'}</td>
              <td>
                <button onClick={() => onVerProrroga(prorroga)}>Ver</button>
                <button onClick={() => manejarEliminarProrroga(prorroga.id)}>Eliminar</button> {/* Usamos la función del helper */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <Paginacion
          currentPage={currentPage}
          totalPages={numeroPaginas}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
    </div>
  );
};

export default TablaProrrogas;
