// import React, { useEffect, useState } from 'react';
// import { FaTrash, FaEye, FaPlus } from 'react-icons/fa';
// import AsignarPermisosForm from '../TablaVista/AsignarPermisosForm';
// import { Role } from '../Types/Types';
// import ApiRoutes from '../components/ApiRoutes';
// import "../styles/TableButtons.css";

// interface RolesTableProps {
//   onCrearRol: () => void; // Define la prop para manejar la creación de roles
// }

// const fetchRoles = async (): Promise<Role[]> => {
//   const token = localStorage.getItem('token');

//   try {
//     const response = await fetch(ApiRoutes.roles, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status} - ${response.statusText}`);
//     }

//     const data: Role[] = await response.json();
//     return data.map((role) => ({
//       ...role,
//       users: role.users || [],
//       permissions: role.permissions || [],
//     }));
//   } catch (error) {
//     console.error('Error fetching roles:', error);
//     throw error;
//   }
// };

// const RolesTable: React.FC<RolesTableProps> = ({ onCrearRol }) => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [rolSeleccionado, setRolSeleccionado] = useState<Role | null>(null); // Estado para almacenar el rol seleccionado
//   const [showModal, setShowModal] = useState<boolean>(false); // Estado para mostrar/ocultar el modal
//   const [nuevoRol, setNuevoRol] = useState<{ name: string; description: string }>({ name: '', description: '' });

//   useEffect(() => {
//     const cargarRoles = async () => {
//       setLoading(true);
//       try {
//         const rolesFromAPI = await fetchRoles();
//         setRoles(rolesFromAPI);
//         setLoading(false);
//       } catch (error) {
//         setError('Error al cargar los roles.');
//         setLoading(false);
//       }
//     };

//     cargarRoles();
//   }, []);

//   const manejarVerDetalles = (rol: Role) => {
//     setRolSeleccionado(rol); // Almacena el rol seleccionado
//   };

//   const manejarEliminar = async (id: number) => {
//     const token = localStorage.getItem('token');
//     const confirmacion = window.confirm('¿Estás seguro de eliminar este rol?');
//     if (!confirmacion) return;

//     try {
//       const response = await fetch(`${ApiRoutes.roles}/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Error al eliminar el rol');
//       }

//       setRoles(roles.filter((rol) => rol.id !== id));
//     } catch (error) {
//       console.error('Error al eliminar el rol:', error);
//     }
//   };

//   const manejarGuardarNuevoRol = async () => {
//     const token = localStorage.getItem('token');
//     if (!nuevoRol.name.trim()) {
//       alert('El nombre del rol es obligatorio.');
//       return;
//     }

//     try {
//       const response = await fetch(ApiRoutes.roles, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(nuevoRol),
//       });

//       if (!response.ok) {
//         throw new Error('Error al crear el rol');
//       }

//       const nuevoRolCreado: Role = await response.json();
//       setRoles([...roles, nuevoRolCreado]);
//       setShowModal(false); // Ocultar el modal después de guardar
//       setNuevoRol({ name: '', description: '' }); // Limpiar el formulario
//     } catch (error) {
//       console.error('Error al crear el rol:', error);
//       alert('Error al crear el rol.');
//     }
//   };

//   const manejarVolverAListaRoles = () => {
//     setRolSeleccionado(null); // Restablece el rol seleccionado a null para volver a la tabla
//   };

//   if (loading) return <p className="text-center">Cargando roles...</p>;
//   if (error) return <p className="text-red-500 text-center">{error}</p>;

//   // Si se selecciona un rol, renderiza el componente AsignarPermisosForm
//   if (rolSeleccionado) {
//     return (
//       <AsignarPermisosForm rol={rolSeleccionado} onCancelar={manejarVolverAListaRoles} />
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Lista de Roles</h2>
//       <div className="mb-4 flex justify-between">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           onClick={onCrearRol} // Llama a la función pasada desde el Dashboard
//         >
//           <FaPlus className="mr-2" /> Crear Nuevo Rol
//         </button>
//       </div>

//       <div className="overflow-y-auto flex-1">
//         <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="py-2 px-4 border-b">ID</th>
//               <th className="py-2 px-4 border-b">Nombre del Rol</th>
//               <th className="py-2 px-4 border-b">Descripción</th>
//               <th className="py-2 px-4 border-b">Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.map((rol) => (
//               <tr key={rol.id} className="hover:bg-gray-100">
//                 <td className="py-2 px-4 border-b">{rol.id}</td>
//                 <td className="py-2 px-4 border-b">{rol.name}</td>
//                 <td className="py-2 px-4 border-b">{rol.description || 'Sin descripción'}</td>
//                 <td className="py-2 px-4 border-b flex space-x-2">
//                   <button onClick={() => manejarVerDetalles(rol)} className="button-view">
//                     <FaEye /> Ver
//                   </button>
//                   <button onClick={() => manejarEliminar(rol.id)} className="button-delete">
//                     <FaTrash /> Eliminar
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RolesTable;

import React, { useEffect, useState } from 'react';
import { FaTrash, FaEye } from 'react-icons/fa';
import AsignarPermisosForm from '../TablaVista/AsignarPermisosForm';
import { Role } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import "../styles/TableButtons.css";

const fetchRoles = async (): Promise<Role[]> => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(ApiRoutes.roles, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: Role[] = await response.json();
    return data.map((role) => ({
      ...role,
      users: role.users || [],
      permissions: role.permissions || [],
    }));
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

const RolesTable: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rolSeleccionado, setRolSeleccionado] = useState<Role | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  useEffect(() => {
    const cargarRoles = async () => {
      setLoading(true);
      try {
        const rolesFromAPI = await fetchRoles();
        setRoles(rolesFromAPI);
      } catch (error) {
        setError('Error al cargar los roles.');
      } finally {
        setLoading(false);
      }
    };

    cargarRoles();
  }, []);

  const manejarVerDetalles = (rol: Role) => {
    setRolSeleccionado(rol);
  };

  const abrirConfirmacionEliminar = (id: number) => {
    setIsConfirmingDelete(true);
    setDeleteId(id);
    document.body.style.overflow = 'hidden';
  };

  const manejarEliminar = async () => {
    if (!deleteId) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${ApiRoutes.roles}/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRoles(roles.filter((rol) => rol.id !== deleteId));
        setDeleteMessage('Rol eliminado exitosamente.');
        setTimeout(cancelarEliminar, 2000);
      } else {
        throw new Error('Error al eliminar el rol');
      }
    } catch (error) {
      console.error('Error eliminando el rol:', error);
      setDeleteMessage('Ocurrió un error al eliminar el rol.');
    }
  };

  const cancelarEliminar = () => {
    setIsConfirmingDelete(false);
    setDeleteId(null);
    setDeleteMessage(null);
    document.body.style.overflow = 'auto';
  };

  const manejarVolverAListaRoles = () => {
    setRolSeleccionado(null);
  };

  if (loading) return <p className="text-center">Cargando roles...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  if (rolSeleccionado) {
    return (
      <AsignarPermisosForm rol={rolSeleccionado} onCancelar={manejarVolverAListaRoles} />
    );
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Roles</h2>

      <div className="overflow-y-auto flex-1">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nombre del Rol</th>
              <th className="py-2 px-4 border-b">Descripción</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((rol) => (
              <tr key={rol.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{rol.id}</td>
                <td className="py-2 px-4 border-b">{rol.name}</td>
                <td className="py-2 px-4 border-b">{rol.description || 'Sin descripción'}</td>
                <td className="py-2 px-4 border-b flex space-x-2">
                  <button onClick={() => manejarVerDetalles(rol)} className="button-view">
                    <FaEye />
                  </button>
                  <button onClick={() => abrirConfirmacionEliminar(rol.id)} className="button-delete">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {deleteMessage ? (
              <p className="text-center text-green-600 font-bold">{deleteMessage}</p>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4 text-center">¿Estás seguro?</h3>
                <p className="text-center mb-4">Esta acción no se puede deshacer.</p>
                <div className="flex justify-center space-x-4">
                  <button onClick={manejarEliminar} className="px-4 py-2 bg-red-600 text-white rounded">
                    Eliminar
                  </button>
                  <button onClick={cancelarEliminar} className="px-4 py-2 bg-gray-400 text-white rounded">
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesTable;
