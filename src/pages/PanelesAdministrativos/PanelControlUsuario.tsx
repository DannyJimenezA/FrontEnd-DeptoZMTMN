import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirección
import {jwtDecode} from 'jwt-decode'; // Asegúrate de que jwt-decode esté instalado
import "../../styles/Administrativos/TablaSolicitudConcesio.css";
import ApiRoutes from '../../components/ApiRoutes';

// Interfaz para las solicitudes
interface Solicitud {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: number;
}

// Interfaz para el token decodificado
interface DecodedToken {
  roles: string[];
}

// Interfaz para los roles
interface Role {
  id: number;
  name: string;
}

// Función para obtener las solicitudes desde la API
const fetchSolicitudes = async (): Promise<Solicitud[]> => {


  try {
    const response = await fetch(ApiRoutes.usuarios.usuariosbase, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Datos recibidos del servidor:', data);

    const solicitudes = data.map((item: any) => ({
      id: item.id,
      nombre: item.nombre,
      apellido1: item.apellido1,
      apellido2: item.apellido2,
      email: item.email,
      telefono: item.telefono,
    }));

    return solicitudes;
  } catch (error) {
    console.error('Error fetching solicitudes:', error);
    throw error;
  }
};

// Función para obtener los roles de un usuario
const fetchUserRoles = async (userId: number): Promise<Role[]> => {
  const urlBase = ` ${ApiRoutes.usuarios}/${userId}/roles`;

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

    const roles = await response.json();
    console.log(`Roles asignados al usuario ${userId}:`, roles);
    return roles;
  } catch (error) {
    console.error('Error al obtener los roles del usuario:', error);
    throw error;
  }
};

// Función para asignar roles a un usuario utilizando PATCH
const assignRolesToUser = async (userId: number, roles: number[]) => {
  const urlBase = `${ApiRoutes.usuarios}/${userId}/roles`;

  try {
    const response = await fetch(urlBase, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roles }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Roles asignados correctamente:', result);
  } catch (error) {
    console.error('Error al asignar roles:', error);
  }
};

const TablaSolicitudes: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

    const obtenerSolicitudes = async () => {
      try {
        const solicitudesFromAPI = await fetchSolicitudes();
        setSolicitudes(solicitudesFromAPI);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
      }
    };

    obtenerSolicitudes();
  }, [navigate]);

  const handleViewUser = async (userId: number, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    try {
      const rolesDelUsuario = await fetchUserRoles(userId);
      setUserRoles(rolesDelUsuario);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error al obtener los roles del usuario:', error);
    }
  };

  const handleAssignRoles1And2 = async () => {
    if (selectedUserId !== null) {
      try {
        await assignRolesToUser(selectedUserId, [1, 2]);
        const updatedRoles = await fetchUserRoles(selectedUserId);
        setUserRoles(updatedRoles);
        console.log('Roles 1 y 2 asignados al usuario correctamente.');
      } catch (error) {
        console.error('Error al asignar roles 1 y 2:', error);
      }
    }
  };

  const handleAssignOnlyUserRole = async () => {
    if (selectedUserId !== null) {
      try {
        await assignRolesToUser(selectedUserId, [1]); // Asigna únicamente el rol de "Usuario" con ID 1
        const updatedRoles = await fetchUserRoles(selectedUserId);
        setUserRoles(updatedRoles);
        console.log('Solo el rol de usuario ha sido asignado al usuario.');
      } catch (error) {
        console.error('Error al asignar solo el rol de usuario:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
    setSelectedUserName(null);
    setUserRoles([]);
  };

  return (
    <div className="tabla-container">
      <h2>Usuarios Registrados</h2>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id}>
              <td>{solicitud.nombre}</td>
              <td>{`${solicitud.apellido1} ${solicitud.apellido2}`} </td>
              <td>{solicitud.email}</td>
              <td>
                <button onClick={() => handleViewUser(solicitud.id, solicitud.nombre)}>
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Roles del Usuario: {selectedUserName}</h3>
            <h4>Roles Actuales:</h4>
            <ul>
              {userRoles.map((role) => (
                <li key={role.id}>{role.name}</li>
              ))}
            </ul>
            <button onClick={handleAssignRoles1And2}>Asignar Rol de Admin</button>
            <button onClick={handleAssignOnlyUserRole}>Quitar Rol de Admin</button>
            <button onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaSolicitudes;
