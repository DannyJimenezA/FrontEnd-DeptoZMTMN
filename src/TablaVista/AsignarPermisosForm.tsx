// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Permission, Role } from '../Types/Types';
// import { fetchPermisos } from './PermisoService';
// import ApiRoutes from '../components/ApiRoutes';

// interface AsignarPermisosFormProps {
//   rol: Role;
//   onCancelar: () => void;
// }

// const AsignarPermisosForm: React.FC<AsignarPermisosFormProps> = ({ rol, onCancelar }) => {
//   const [permisos, setPermisos] = useState<Permission[]>([]); // Lista de permisos disponibles
//   const [permisosSeleccionados, setPermisosSeleccionados] = useState<Permission[]>(rol.permissions); // Permisos seleccionados
//   const [recursoActivo, setRecursoActivo] = useState<string>(''); // Recurso actualmente seleccionado
//   const navigate = useNavigate();

//   // Cargar permisos desde el servidor al montar el componente
//   useEffect(() => {
//     const cargarPermisos = async () => {
//       try {
//         const data = await fetchPermisos();
//         setPermisos(data);
//         if (data.length > 0) {
//           setRecursoActivo(data[0].resource); // Seleccionar el primer recurso por defecto
//         }
//       } catch (error) {
//         alert('Error al cargar los permisos');
//       }
//     };

//     cargarPermisos();
//   }, []);

//   // Manejar guardar permisos (envío de la solicitud PATCH)
//   const handleGuardarPermisos = async () => {
//     try {
//       const token = localStorage.getItem('token');

//       // Crear el formato esperado por el backend
//       const newPermissions = permisosSeleccionados.map((permiso) => ({
//         action: permiso.action,
//         resource: permiso.resource,
//       }));

//       // Realizar la solicitud PATCH
//       const response = await fetch(`${ApiRoutes.roles}/${rol.id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ newPermissions }), // Enviar los permisos seleccionados
//       });

//       if (!response.ok) {
//         throw new Error('Error al actualizar los permisos');
//       }

//       alert('Permisos actualizados correctamente');
//       navigate('/roles'); // Redirigir a la tabla de roles
//     } catch (error) {
//       console.error('Error al guardar permisos:', error);
//       alert('Error al actualizar los permisos');
//     }
//   };

//   // Alternar la selección de un permiso
//   const togglePermiso = (permiso: Permission) => {
//     const existe = permisosSeleccionados.some(
//       (p) => p.id === permiso.id
//     );

//     if (existe) {
//       // Quitar el permiso si ya está seleccionado
//       setPermisosSeleccionados((prev) =>
//         prev.filter((p) => p.id !== permiso.id)
//       );
//     } else {
//       // Agregar el permiso si no está seleccionado
//       setPermisosSeleccionados((prev) => [...prev, permiso]);
//     }
//   };

//   // Obtener los recursos únicos de los permisos
//   const recursosUnicos = Array.from(
//     new Set(permisos.map((permiso) => permiso.resource))
//   );

//   return (
//     <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
//       <div className="p-6 bg-gray-50 border-b border-gray-200">
//         <h2 className="text-2xl font-bold text-gray-800">Asignar Permisos al Rol: {rol.name}</h2>
//       </div>
//       <div className="p-6">
//         <div className="mb-6 flex flex-wrap gap-2">
//           {recursosUnicos.map((recurso) => (
//             <button
//               key={recurso}
//               onClick={() => setRecursoActivo(recurso)}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
//                 ${
//                   recursoActivo === recurso
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//             >
//               {recurso}
//             </button>
//           ))}
//         </div>

//         <div className="space-y-4">
//           {permisos
//             .filter((permiso) => permiso.resource === recursoActivo) // Mostrar permisos del recurso seleccionado
//             .map((permiso) => {
//               const isSelected = permisosSeleccionados.some(
//                 (p) => p.id === permiso.id
//               );
//               return (
//                 <div
//                   key={permiso.id}
//                   className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
//                 >
//                   <div>
//                     <span className="font-medium text-gray-700">{permiso.action}</span>
//                     <span className="ml-2 text-sm text-gray-500">{permiso.resource}</span>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={isSelected}
//                       onChange={() => togglePermiso(permiso)}
//                     />
//                     <div
//                       className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
//                       peer-focus:ring-blue-300 rounded-full peer 
//                       ${
//                         isSelected
//                           ? 'after:translate-x-full after:border-white bg-blue-600'
//                           : ''
//                       }
//                       after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
//                       after:bg-white after:border-gray-300 after:border after:rounded-full 
//                       after:h-5 after:w-5 after:transition-all`}
//                     ></div>
//                   </label>
//                 </div>
//               );
//             })}
//         </div>

//         <div className="flex justify-end gap-4 mt-6">
//           <button
//             onClick={onCancelar}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//           >
//             Volver a la Tabla de Roles
//           </button>
//           <button
//             onClick={handleGuardarPermisos}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Guardar Permisos
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AsignarPermisosForm;

import React, { useState, useEffect } from 'react';
import { Permission, Role } from '../Types/Types';
import { fetchPermisos } from './PermisoService';
import ApiRoutes from '../components/ApiRoutes';

interface AsignarPermisosFormProps {
  rol: Role;
  onCancelar: () => void; // Redirige a la tabla de roles
}

const AsignarPermisosForm: React.FC<AsignarPermisosFormProps> = ({ rol, onCancelar }) => {
  const [permisos, setPermisos] = useState<Permission[]>([]); // Lista de permisos disponibles
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<Permission[]>(rol.permissions); // Permisos seleccionados
  const [recursoActivo, setRecursoActivo] = useState<string>(''); // Recurso actualmente seleccionado

  // Cargar permisos desde el servidor al montar el componente
  useEffect(() => {
    const cargarPermisos = async () => {
      try {
        const data = await fetchPermisos();
        setPermisos(data);
        if (data.length > 0) {
          setRecursoActivo(data[0].resource); // Seleccionar el primer recurso por defecto
        }
      } catch (error) {
        alert('Error al cargar los permisos');
      }
    };

    cargarPermisos();
  }, []);

  // Manejar guardar permisos (envío de la solicitud PATCH)
  const handleGuardarPermisos = async () => {
    try {
      const token = localStorage.getItem('token');

      // Crear el formato esperado por el backend
      const newPermissions = permisosSeleccionados.map((permiso) => ({
        action: permiso.action,
        resource: permiso.resource,
      }));

      // Realizar la solicitud PATCH
      const response = await fetch(`${ApiRoutes.roles}/${rol.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPermissions }), // Enviar los permisos seleccionados
      });

      if (!response.ok) {
        throw new Error('Error al actualizar los permisos');
      }

      alert('Permisos actualizados correctamente');
      onCancelar(); // Volver a la tabla de roles
    } catch (error) {
      console.error('Error al guardar permisos:', error);
      alert('Error al actualizar los permisos');
    }
  };

  // Alternar la selección de un permiso
  const togglePermiso = (permiso: Permission) => {
    const existe = permisosSeleccionados.some((p) => p.id === permiso.id);

    if (existe) {
      // Quitar el permiso si ya está seleccionado
      setPermisosSeleccionados((prev) => prev.filter((p) => p.id !== permiso.id));
    } else {
      // Agregar el permiso si no está seleccionado
      setPermisosSeleccionados((prev) => [...prev, permiso]);
    }
  };

  // Obtener los recursos únicos de los permisos
  const recursosUnicos = Array.from(new Set(permisos.map((permiso) => permiso.resource)));

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Asignar Permisos al Rol: {rol.name}</h2>
      </div>
      <div className="p-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {recursosUnicos.map((recurso) => (
            <button
              key={recurso}
              onClick={() => setRecursoActivo(recurso)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  recursoActivo === recurso
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {recurso}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {permisos
            .filter((permiso) => permiso.resource === recursoActivo) // Mostrar permisos del recurso seleccionado
            .map((permiso) => {
              const isSelected = permisosSeleccionados.some((p) => p.id === permiso.id);
              return (
                <div
                  key={permiso.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                >
                  <div>
                    <span className="font-medium text-gray-700">{permiso.action}</span>
                    <span className="ml-2 text-sm text-gray-500">{permiso.resource}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isSelected}
                      onChange={() => togglePermiso(permiso)}
                    />
                    <div
                      className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                      peer-focus:ring-blue-300 rounded-full peer 
                      ${
                        isSelected
                          ? 'after:translate-x-full after:border-white bg-blue-600'
                          : ''
                      }
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-5 after:w-5 after:transition-all`}
                    ></div>
                  </label>
                </div>
              );
            })}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Volver a la Tabla de Roles
          </button>
          <button
            onClick={handleGuardarPermisos}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Guardar Permisos
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarPermisosForm;
