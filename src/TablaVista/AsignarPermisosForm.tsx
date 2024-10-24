import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Permission, Role } from '../Types/Types';



interface AsignarPermisosFormProps {
  rol: Role;
  onCancelar: () => void;  // Función para manejar cancelación
}

const AsignarPermisosForm: React.FC<AsignarPermisosFormProps> = ({ rol, onCancelar }) => {
  const [permisos, setPermisos] = useState<Permission[]>([]);  // Todos los permisos disponibles
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<number[]>(rol.permissions.map(p => p.id));  // Inicializamos con los permisos del rol
  const navigate = useNavigate();

  // Obtener todos los permisos disponibles
  useEffect(() => {
    const fetchPermisos = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/permissions', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setPermisos(data);
    };

    fetchPermisos();
  }, []);

  const manejarGuardarPermisos = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/roles/${rol.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ permissions: permisosSeleccionados }),
    });

    if (response.ok) {
      alert('Permisos actualizados correctamente');
      navigate('/roles');  // Volver a la lista de roles
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

  return (
    <div className="asignar-permisos-form">
      <h3>Asignar Permisos al Rol: {rol.name}</h3>
      <div>
        {permisos.length > 0 ? (
          permisos.map((permiso) => (
            <div key={permiso.id}>
              <label>
                <input
                  type="checkbox"
                  value={permiso.id}
                  checked={permisosSeleccionados.includes(permiso.id)}
                  onChange={() => manejarSeleccionPermiso(permiso.id)}
                />
                {permiso.action} {permiso.resource}
              </label>
            </div>
          ))
        ) : (
          <p>Cargando permisos...</p>
        )}
      </div>
      <button onClick={manejarGuardarPermisos}>Guardar Permisos</button>
      <button onClick={onCancelar}>Volver a la Tabla de Roles</button>
    </div>
  );
};

export default AsignarPermisosForm;
