import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Permission, Role } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';

interface AsignarPermisosFormProps {
  rol: Role;
  onCancelar: () => void;
}

const AsignarPermisosForm: React.FC<AsignarPermisosFormProps> = ({ rol, onCancelar }) => {
  const [permisos, setPermisos] = useState<Permission[]>([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<number[]>(rol.permissions.map(p => p.id));
  const [recursoSeleccionado, setRecursoSeleccionado] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermisos = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ApiRoutes.urlBase}/permissions`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setPermisos(data);
    };

    fetchPermisos();
  }, []);

  const manejarGuardarPermisos = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${ApiRoutes.roles}/${rol.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ permissions: permisosSeleccionados }),
    });

    if (response.ok) {
      alert('Permisos actualizados correctamente');
      navigate('/roles');
    } else {
      alert('Error al actualizar los permisos');
    }
  };

  const manejarSeleccionPermiso = (idPermiso: number) => {
    if (permisosSeleccionados.includes(idPermiso)) {
      setPermisosSeleccionados(permisosSeleccionados.filter((p) => p !== idPermiso));
    } else {
      setPermisosSeleccionados([...permisosSeleccionados, idPermiso]);
    }
  };

  const manejarSeleccionRecurso = (recurso: string) => {
    setRecursoSeleccionado(recurso);
  };

  const recursosUnicos = Array.from(new Set(permisos.map(permiso => permiso.resource)));
  const permisosFiltrados = recursoSeleccionado
    ? permisos.filter(permiso => permiso.resource === recursoSeleccionado)
    : [];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700">Asignar Permisos al Rol: {rol.name}</h3>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2 text-gray-600">Selecciona un recurso:</h4>
        <div className="flex flex-wrap gap-4">
          {recursosUnicos.map((recurso) => (
            <button
              key={recurso}
              onClick={() => manejarSeleccionRecurso(recurso)}
              className={`px-4 py-2 rounded-md font-semibold ${
                recursoSeleccionado === recurso ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
              } transition-all duration-200`}
            >
              {recurso}
            </button>
          ))}
        </div>
      </div>

      {recursoSeleccionado && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-4 text-gray-600">Permisos para "{recursoSeleccionado}":</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {permisosFiltrados.map((permiso) => (
              <div key={permiso.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm">
                <span className="text-gray-700 font-medium">{permiso.action}</span>
                <button
                  onClick={() => manejarSeleccionPermiso(permiso.id)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    permisosSeleccionados.includes(permiso.id) ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      permisosSeleccionados.includes(permiso.id) ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex mt-8 gap-4">
        <button
          onClick={manejarGuardarPermisos}
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          Guardar Permisos
        </button>
        <button
          onClick={onCancelar}
          className="bg-gray-400 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-500 transition-colors"
        >
          Volver a la Tabla de Roles
        </button>
      </div>
    </div>
  );
};

export default AsignarPermisosForm;
