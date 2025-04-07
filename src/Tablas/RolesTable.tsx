// import React, { useEffect, useState } from 'react';
// import { FaTrash, FaPlus } from 'react-icons/fa';
// import { Role } from '../Types/Types';
// import ApiRoutes from '../components/ApiRoutes';
// import "../styles/TableButtons.css";

// interface RolesTableProps {
//   onCrearRol: () => void;
//   onAsignarPermisos: (rol: Role) => void;
// }

// const RolesTable: React.FC<RolesTableProps> = ({ onAsignarPermisos }) => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isCreatingRole, setIsCreatingRole] = useState<boolean>(false);
//   const [newRoleName, setNewRoleName] = useState<string>('');
//   const [newRoleDescription, setNewRoleDescription] = useState<string>('');

//   useEffect(() => {
//     const cargarRoles = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(ApiRoutes.roles, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         if (!response.ok) throw new Error('Error al obtener roles.');
//         setRoles(await response.json());
//       } catch (error) {
//         setError('Error al cargar los roles.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     cargarRoles();
//   }, []);

//   // ✅ Abrir modal de creación de rol
//   const abrirModalCrearRol = () => {
//     setIsCreatingRole(true);
//     setNewRoleName('');
//     setNewRoleDescription('');
//   };

//   // ✅ Cerrar modal de creación de rol
//   const cerrarModalCrearRol = () => {
//     setIsCreatingRole(false);
//   };

//   // ✅ Crear un rol sin permisos
//   const manejarCrearRol = async () => {
//     if (!newRoleName.trim() || !newRoleDescription.trim()) {
//       alert('Por favor, ingresa el nombre y la descripción del rol.');
//       return;
//     }

//     try {
//       const response = await fetch(ApiRoutes.roles, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ name: newRoleName, description: newRoleDescription }),
//       });

//       if (!response.ok) {
//         throw new Error(`Error en la solicitud: ${response.status}`);
//       }

//       const nuevoRol = await response.json();
//       setRoles([...roles, nuevoRol]);
//       cerrarModalCrearRol();
//     } catch (error) {
//       console.error('Error creando el rol:', error);
//       alert('Ocurrió un error al crear el rol.');
//     }
//   };

//   // ✅ Eliminar un rol
//   const manejarEliminarRol = async (id: number) => {
//     const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este rol?');
//     if (!confirmar) return;

//     try {
//       const response = await fetch(`${ApiRoutes.roles}/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error eliminando el rol: ${response.status}`);
//       }

//       setRoles(roles.filter((rol) => rol.id !== id));
//       alert('Rol eliminado exitosamente.');
//     } catch (error) {
//       console.error('Error eliminando el rol:', error);
//       alert('Ocurrió un error al eliminar el rol.');
//     }
//   };

//   if (loading) return <p className="text-center">Cargando roles...</p>;
//   if (error) return <p className="text-red-500 text-center">{error}</p>;


//   return (
//     <div className="flex flex-col h-screen p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Lista de Roles</h2>

//       {/* ✅ Solo permite crear roles sin permisos */}
//       <button onClick={abrirModalCrearRol} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center">
//         <FaPlus className="mr-2" /> Crear Nuevo Rol
//       </button>

//       <div className="roles-table overflow-y-auto flex-1">
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
//                 <td className="py-2 px-4 border-b">
//                 <button onClick={() => onAsignarPermisos(rol)} className="button-edit">
//           🛠 Asignar Permisos
//         </button>
//                   <button onClick={() => manejarEliminarRol(rol.id)} className="button-delete">
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ✅ Modal de creación de rol */}
//       {isCreatingRole && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <button className="absolute top-2 right-2 text-gray-500" onClick={cerrarModalCrearRol}>
//               ✖
//             </button>
//             <h3 className="text-xl font-bold mb-4 text-center">Crear Nuevo Rol</h3>
//             <input
//               type="text"
//               className="w-full p-2 border rounded mb-4"
//               placeholder="Nombre del rol"
//               value={newRoleName}
//               onChange={(e) => setNewRoleName(e.target.value)}
//             />
//             <textarea
//               className="w-full p-2 border rounded mb-4"
//               placeholder="Descripción del rol"
//               value={newRoleDescription}
//               onChange={(e) => setNewRoleDescription(e.target.value)}
//               rows={3}
//             />
//             <button onClick={manejarCrearRol} className="w-full bg-blue-600 text-white py-2 rounded">
//               Guardar
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RolesTable;

import React, { useEffect, useState } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { Role } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import Swal from 'sweetalert2';
import "../styles/TableButtons.css";

interface RolesTableProps {
  onCrearRol: () => void;
  onAsignarPermisos: (rol: Role) => void;
}

const RolesTable: React.FC<RolesTableProps> = ({ onAsignarPermisos }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [newRoleDescription, setNewRoleDescription] = useState<string>('');

  useEffect(() => {
    const cargarRoles = async () => {
      setLoading(true);
      try {
        const response = await fetch(ApiRoutes.roles, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Error al obtener roles.');
        setRoles(await response.json());
      } catch (error) {
        setError('Error al cargar los roles.');
      } finally {
        setLoading(false);
      }
    };

    cargarRoles();
  }, []);

  const abrirModalCrearRol = () => {
    setIsCreatingRole(true);
    setNewRoleName('');
    setNewRoleDescription('');
  };

  const cerrarModalCrearRol = () => {
    setIsCreatingRole(false);
  };

  const manejarCrearRol = async () => {
    if (!newRoleName.trim() || !newRoleDescription.trim()) {
      Swal.fire('Campos requeridos', 'Por favor, ingresa el nombre y la descripción del rol.', 'warning');
      return;
    }

    try {
      const response = await fetch(ApiRoutes.roles, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newRoleName, description: newRoleDescription }),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const nuevoRol = await response.json();
      setRoles([...roles, nuevoRol]);
      cerrarModalCrearRol();
      Swal.fire('Éxito', 'Rol creado correctamente.', 'success');
    } catch (error) {
      console.error('Error creando el rol:', error);
      Swal.fire('Error', 'Ocurrió un error al crear el rol.', 'error');
    }
  };

  const manejarEliminarRol = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar rol?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(`${ApiRoutes.roles}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error(`Error eliminando el rol: ${response.status}`);

        Swal.fire('¡Eliminado!', 'El rol fue eliminado correctamente.', 'success');
        setRoles((prev) => prev.filter((rol) => rol.id !== id));
      } catch (error) {
        console.error('Error eliminando el rol:', error);
        Swal.fire('Error', 'Ocurrió un error al eliminar el rol.', 'error');
      }
    }
  };

  if (loading) return <p className="text-center">Cargando roles...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex flex-col h-screen p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Roles</h2>

      <button onClick={abrirModalCrearRol} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center">
        <FaPlus className="mr-2" /> Crear Nuevo Rol
      </button>

      <div className="roles-table overflow-y-auto flex-1">
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
                <td className="py-2 px-4 border-b space-x-2">
                  <button onClick={() => onAsignarPermisos(rol)} className="button-edit">
                    🛠 Asignar Permisos
                  </button>
                  <button onClick={() => manejarEliminarRol(rol.id)} className="button-delete">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreatingRole && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button className="absolute top-2 right-2 text-gray-500" onClick={cerrarModalCrearRol}>
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">Crear Nuevo Rol</h3>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Nombre del rol"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Descripción del rol"
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              rows={3}
            />
            <button onClick={manejarCrearRol} className="w-full bg-blue-600 text-white py-2 rounded">
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesTable;
