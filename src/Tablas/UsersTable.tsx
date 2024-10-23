import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
// import "../../styles/Administrativos/TablaUsuarios.css";

// Interfaz para los usuarios
interface Usuario {
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

// Función para obtener los usuarios desde la API
const fetchUsuarios = async (): Promise<Usuario[]> => {
  const urlBase = 'http://localhost:3000/users';

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

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      nombre: item.nombre,
      apellido1: item.apellido1,
      apellido2: item.apellido2,
      email: item.email,
      telefono: item.telefono,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Función para obtener los roles de un usuario
const fetchUserRoles = async (userId: number): Promise<Role[]> => {
  const urlBase = `http://localhost:3000/users/${userId}/roles`;

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
    return roles;
  } catch (error) {
    console.error('Error al obtener los roles del usuario:', error);
    throw error;
  }
};

// Función para asignar roles a un usuario utilizando PATCH
const assignRolesToUser = async (userId: number, roles: number[]) => {
  const urlBase = `http://localhost:3000/users/${userId}/roles`;

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

    console.log('Roles asignados correctamente.');
  } catch (error) {
    console.error('Error al asignar roles:', error);
  }
};

const TablaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

    const obtenerUsuarios = async () => {
      try {
        const usuariosFromAPI = await fetchUsuarios();
        setUsuarios(usuariosFromAPI);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    obtenerUsuarios();
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

  const handleAssignRoles = async (roleIds: number[]) => {
    if (selectedUserId !== null) {
      try {
        await assignRolesToUser(selectedUserId, roleIds);
        const updatedRoles = await fetchUserRoles(selectedUserId);
        setUserRoles(updatedRoles);
        console.log('Roles asignados correctamente.');
      } catch (error) {
        console.error('Error al asignar roles:', error);
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
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{`${usuario.apellido1} ${usuario.apellido2}`}</td>
              <td>{usuario.email}</td>
              <td>
                <button onClick={() => handleViewUser(usuario.id, usuario.nombre)}>
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
            <button onClick={() => handleAssignRoles([1, 2])}>Asignar Rol de Admin</button>
            <button onClick={() => handleAssignRoles([1])}>Quitar Rol de Admin</button>
            <button onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaUsuarios;
