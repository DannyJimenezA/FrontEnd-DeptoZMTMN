// import React, { useEffect, useState } from 'react';
// import { FaTrash, FaEye, FaPlus } from 'react-icons/fa';
// import AsignarPermisosForm from '../TablaVista/AsignarPermisosForm';
// import { Role } from '../Types/Types';
// import ApiRoutes from '../components/ApiRoutes';
// import "../styles/TableButtons.css";


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

// const RolesTable: React.FC = () => {
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
//           onClick={() => setShowModal(true)} // Mostrar el modal
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

//       {/* Modal para crear un nuevo rol */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h3 className="text-xl font-bold mb-4">Crear Nuevo Rol</h3>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Rol</label>
//               <input
//                 type="text"
//                 value={nuevoRol.name}
//                 onChange={(e) => setNuevoRol({ ...nuevoRol, name: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
//               <textarea
//                 value={nuevoRol.description}
//                 onChange={(e) => setNuevoRol({ ...nuevoRol, description: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg"
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 Cancelar
//               </button>
//               <button
//                 onClick={manejarGuardarNuevoRol}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Guardar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RolesTable;

import React, { useEffect, useState } from 'react';
import { FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import AsignarPermisosForm from '../TablaVista/AsignarPermisosForm';
import { Role } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import "../styles/TableButtons.css";

interface RolesTableProps {
  onCrearRol: () => void; // Define la prop para manejar la creación de roles
}

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

const RolesTable: React.FC<RolesTableProps> = ({ onCrearRol }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rolSeleccionado, setRolSeleccionado] = useState<Role | null>(null); // Estado para almacenar el rol seleccionado
  const [showModal, setShowModal] = useState<boolean>(false); // Estado para mostrar/ocultar el modal
  const [nuevoRol, setNuevoRol] = useState<{ name: string; description: string }>({ name: '', description: '' });

  useEffect(() => {
    const cargarRoles = async () => {
      setLoading(true);
      try {
        const rolesFromAPI = await fetchRoles();
        setRoles(rolesFromAPI);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los roles.');
        setLoading(false);
      }
    };

    cargarRoles();
  }, []);

  const manejarVerDetalles = (rol: Role) => {
    setRolSeleccionado(rol); // Almacena el rol seleccionado
  };

  const manejarEliminar = async (id: number) => {
    const token = localStorage.getItem('token');
    const confirmacion = window.confirm('¿Estás seguro de eliminar este rol?');
    if (!confirmacion) return;

    try {
      const response = await fetch(`${ApiRoutes.roles}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el rol');
      }

      setRoles(roles.filter((rol) => rol.id !== id));
    } catch (error) {
      console.error('Error al eliminar el rol:', error);
    }
  };

  const manejarGuardarNuevoRol = async () => {
    const token = localStorage.getItem('token');
    if (!nuevoRol.name.trim()) {
      alert('El nombre del rol es obligatorio.');
      return;
    }

    try {
      const response = await fetch(ApiRoutes.roles, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoRol),
      });

      if (!response.ok) {
        throw new Error('Error al crear el rol');
      }

      const nuevoRolCreado: Role = await response.json();
      setRoles([...roles, nuevoRolCreado]);
      setShowModal(false); // Ocultar el modal después de guardar
      setNuevoRol({ name: '', description: '' }); // Limpiar el formulario
    } catch (error) {
      console.error('Error al crear el rol:', error);
      alert('Error al crear el rol.');
    }
  };

  const manejarVolverAListaRoles = () => {
    setRolSeleccionado(null); // Restablece el rol seleccionado a null para volver a la tabla
  };

  if (loading) return <p className="text-center">Cargando roles...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // Si se selecciona un rol, renderiza el componente AsignarPermisosForm
  if (rolSeleccionado) {
    return (
      <AsignarPermisosForm rol={rolSeleccionado} onCancelar={manejarVolverAListaRoles} />
    );
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Roles</h2>
      <div className="mb-4 flex justify-between">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onCrearRol} // Llama a la función pasada desde el Dashboard
        >
          <FaPlus className="mr-2" /> Crear Nuevo Rol
        </button>
      </div>

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
                    <FaEye /> Ver
                  </button>
                  <button onClick={() => manejarEliminar(rol.id)} className="button-delete">
                    <FaTrash /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesTable;
