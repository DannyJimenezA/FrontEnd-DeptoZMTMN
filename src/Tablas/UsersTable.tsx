import React, { useState, useEffect } from 'react';
import { DecodedToken, Usuario } from '../Types/Types';
import Paginacion from '../components/Paginacion';
import SearchFilterBar from '../components/SearchFilterBar';
import { eliminarEntidad } from '../Helpers/eliminarEntidad';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../components/ApiRoutes';
import "../styles/TableButtons.css";

interface UsuariosTableProps {
  onVerUsuario: (usuario: Usuario) => void;
}

const fetchUsuarios = async (): Promise<Usuario[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(ApiRoutes.usuarios.usuariosbase, {
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
};

const UsuariosTable: React.FC<UsuariosTableProps> = ({ onVerUsuario }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState('nombre');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const hasPermission = decoded.permissions.some(
          (perm) => perm.action === 'GET' && perm.resource === 'users'
        );
        if (!hasPermission) {
          alert('No tienes permiso para acceder a esta página.');
          return navigate('/');
        }
      } catch (err) {
        alert('Error con el token. Por favor, inicia sesión nuevamente.');
        return navigate('/login');
      }
    } else {
      alert('Token no encontrado. Inicia sesión.');
      return navigate('/login');
    }

    const obtenerUsuarios = async () => {
      try {
        const data = await fetchUsuarios();
        setUsuarios(data);
      } catch (err) {
        console.error('Error al obtener los usuarios:', err);
        setError('Error al cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuarios();
  }, [navigate]);

  const obtenerUsuariosFiltrados = () => {
    return usuarios.filter((usuario) =>
      searchBy === 'nombre'
        ? usuario.nombre.toLowerCase().includes(searchText.toLowerCase())
        : searchBy === 'cedula'
        ? usuario.cedula.toLowerCase().includes(searchText.toLowerCase())
        : usuario.email.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const usuariosFiltrados = obtenerUsuariosFiltrados();
  const indexFinal = currentPage * itemsPerPage;
  const indexInicio = indexFinal - itemsPerPage;
  const usuariosActuales = usuariosFiltrados.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPerPage);

  const { abrirModalEliminar, ModalEliminar } = eliminarEntidad<Usuario>('users', setUsuarios);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Lista de Usuarios</h2>

      <SearchFilterBar
        searchPlaceholder="Buscar por nombre, cédula o correo..."
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchByOptions={[
          { value: 'nombre', label: 'Nombre' },
          { value: 'cedula', label: 'Cédula' },
          { value: 'email', label: 'Correo' },
        ]}
        selectedSearchBy={searchBy}
        onSearchByChange={setSearchBy}
      />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg max-h-[70vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Apellido</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Correo</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Rol</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuariosActuales.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-4 py-2">{usuario.id}</td>
                <td className="px-4 py-2">{usuario.nombre}</td>
                <td className="px-4 py-2">{usuario.apellido1} {usuario.apellido2}</td>
                <td className="px-4 py-2">{usuario.cedula}</td>
                <td className="px-4 py-2">{usuario.email}</td>
                <td className="px-4 py-2">
                  {usuario.roles && usuario.roles.length > 0
                    ? usuario.roles.map((rol) => rol.name).join(', ')
                    : 'Sin rol'}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button className="button-view" onClick={() => onVerUsuario(usuario)}>
                    <FaEye />
                  </button>
                  <button className="button-delete" onClick={() => abrirModalEliminar(usuario.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginacion
        currentPage={currentPage}
        totalPages={totalPaginas}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <ModalEliminar />
    </div>
  );
};

export default UsuariosTable;
