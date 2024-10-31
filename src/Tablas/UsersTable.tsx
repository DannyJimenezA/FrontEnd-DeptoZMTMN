import React, { useState, useEffect } from 'react';
import { DecodedToken, Usuario } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import '../styles/Botones.css';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface UsuariosTableProps {
  onVerUsuario: (usuario: Usuario) => void; // Función para ver los detalles de un usuario
}

const fetchUsuarios = async (): Promise<Usuario[]> => {
  const urlBase = 'http://localhost:3000/users';
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

    return await response.json();
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    throw error;
  }
};

const UsuariosTable: React.FC<UsuariosTableProps> = ({ onVerUsuario }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
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
        console.log(decodedToken.permissions);
        console.log(decodedToken); // Imprime el token decodificado
  
        // Validar que 'permissions' exista y sea un array
        const hasPermission = decodedToken.permissions.some(
          (permission: { action: string; resource: string }) =>
            permission.action === 'GET' && permission.resource === 'users'
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
    const obtenerUsuarios = async () => {
      try {
        const usuariosFromAPI = await fetchUsuarios();
        setUsuarios(usuariosFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        setError('Error al cargar los usuarios.');
        setLoading(false);
      }
    };

    obtenerUsuarios();
  }, []);

  const indexUltimoUsuario = currentPage * itemsPerPage;
  const indexPrimerUsuario = indexUltimoUsuario - itemsPerPage;
  const usuariosActuales = usuarios.slice(indexPrimerUsuario, indexUltimoUsuario);

  const numeroPaginas = Math.ceil(usuarios.length / itemsPerPage);

  // Función para eliminar un usuario usando el helper
  const manejarEliminarUsuario = async (id: number) => {
    await eliminarEntidad<Usuario>('users', id, setUsuarios);
  };

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <div className="tabla-container">
        <h2>Lista de Usuarios</h2>
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cédula</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosActuales.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido1} {usuario.apellido2}</td>
                <td>{usuario.cedula}</td>
                <td>{usuario.email}</td>
                <td>{usuario.roles?.name}</td>
                <td>
                  <button className="boton-ver" onClick={() => onVerUsuario(usuario)}>
                    <FaEye /> Ver
                  </button>
                  <button onClick={() => manejarEliminarUsuario(usuario.id)}>
                    <FaTrash /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Componente de Paginación */}
        <Paginacion
          currentPage={currentPage}
          totalPages={numeroPaginas}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default UsuariosTable;
