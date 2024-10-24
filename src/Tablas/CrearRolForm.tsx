import React, { useState, useEffect } from 'react';

// Interfaz para el nuevo rol
interface CrearRolFormProps {
  onRolCreado: () => void; // Callback para actualizar la lista de roles después de la creación
}

interface Permission {
  id: number;
  action: string;
  resource: string;
}

const CrearRolForm: React.FC<CrearRolFormProps> = ({ onRolCreado }) => {
  const [nombreRol, setNombreRol] = useState('');
  const [permisos, setPermisos] = useState<Permission[]>([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Obtener los permisos disponibles desde el backend
  useEffect(() => {
    const fetchPermisos = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/permissions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPermisos(data);
      } catch (error) {
        console.error('Error al cargar permisos:', error);
      }
    };
    fetchPermisos();
  }, []);

  const handleCrearRol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreRol || permisosSeleccionados.length === 0) {
      setError('El nombre del rol y al menos un permiso son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: nombreRol, 
          permissions: permisosSeleccionados 
        }), // Enviar el nombre del rol y los permisos seleccionados
      });

      if (!response.ok) {
        throw new Error(`Error al crear el rol: ${response.statusText}`);
      }

      setNombreRol(''); // Limpiar el campo de texto
      setPermisosSeleccionados([]); // Limpiar los permisos seleccionados
      onRolCreado();    // Llamar al callback para actualizar la tabla de roles
    } catch (error) {
      setError('Hubo un problema al crear el rol.');
      console.error('Error al crear el rol:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermisoSeleccionado = (id: number) => {
    if (permisosSeleccionados.includes(id)) {
      setPermisosSeleccionados(permisosSeleccionados.filter((permisoId) => permisoId !== id));
    } else {
      setPermisosSeleccionados([...permisosSeleccionados, id]);
    }
  };

  return (
    <div className="crear-rol-form">
      <h3>Crear nuevo Rol</h3>
      <form onSubmit={handleCrearRol}>
        <div>
          <label htmlFor="nombreRol">Nombre del Rol:</label>
          <input
            type="text"
            id="nombreRol"
            value={nombreRol}
            onChange={(e) => setNombreRol(e.target.value)}
            required
          />
        </div>

        <div>
          <h4>Selecciona Permisos:</h4>
          {permisos.length > 0 ? (
            permisos.map((permiso) => (
              <div key={permiso.id}>
                <label>
                  <input
                    type="checkbox"
                    value={permiso.id}
                    checked={permisosSeleccionados.includes(permiso.id)}
                    onChange={() => handlePermisoSeleccionado(permiso.id)}
                  />
                  {`${permiso.action} ${permiso.resource}`}
                </label>
              </div>
            ))
          ) : (
            <p>Cargando permisos...</p>
          )}
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Rol'}
        </button>
      </form>
    </div>
  );
};

export default CrearRolForm;
