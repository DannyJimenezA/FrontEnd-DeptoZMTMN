import React, { useState, useEffect } from 'react';

// Interfaz para el nuevo rol
interface CrearRolFormProps {
  onRolCreado: () => void; // Callback para actualizar la lista de roles después de la creación
  onCancelar: () => void;  // Callback para volver a la tabla de roles sin crear
}

interface Permission {
  id: number;
  action: string;
  resource: string;
}

const CrearRolForm: React.FC<CrearRolFormProps> = ({ onRolCreado, onCancelar }) => {
  const [nombreRol, setNombreRol] = useState('');
  const [descripcionRol, setDescripcionRol] = useState(''); // Estado para la descripción del rol
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

    // Verificar si hay campos vacíos
    if (!nombreRol || !descripcionRol || permisosSeleccionados.length === 0) {
      setError('El nombre del rol, la descripción y al menos un permiso son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    // Debug: Imprimir valores antes de enviarlos al backend
    console.log('Nombre del Rol:', nombreRol);
    console.log('Descripción del Rol:', descripcionRol);
    console.log('Permisos seleccionados:', permisosSeleccionados);

    try {
      const response = await fetch('http://localhost:3000/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nombreRol,
          description: descripcionRol, // Incluyendo la descripción del rol
          permissionIds: permisosSeleccionados // Enviar permisos seleccionados
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // Leer el error desde el backend
        console.error('Error al crear el rol:', errorResponse);
        setError(`Error al crear el rol: ${errorResponse.message || response.statusText}`);
        return;
      }

      // Limpiar campos
      setNombreRol('');
      setDescripcionRol('');
      setPermisosSeleccionados([]);
      onRolCreado(); // Callback para actualizar la lista de roles
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
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Crear nuevo Rol</h3>
      <form onSubmit={handleCrearRol}>
        {/* Campo para el nombre del rol */}
        <div className="mb-4">
          <label htmlFor="nombreRol" className="block text-gray-700">Nombre del Rol:</label>
          <input
            type="text"
            id="nombreRol"
            value={nombreRol}
            onChange={(e) => setNombreRol(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Campo para la descripción del rol */}
        <div className="mb-4">
          <label htmlFor="descripcionRol" className="block text-gray-700">Descripción del Rol:</label>
          <textarea
            id="descripcionRol"
            value={descripcionRol}
            onChange={(e) => setDescripcionRol(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Permisos */}
        <div className="mb-4">
          <h4 className="text-gray-700 font-medium mb-2">Selecciona Permisos:</h4>
          {permisos.length > 0 ? (
            permisos.map((permiso) => (
              <div key={permiso.id} className="flex items-center justify-between mb-2">
                <span>{`${permiso.action} ${permiso.resource}`}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value={permiso.id}
                    checked={permisosSeleccionados.includes(permiso.id)}
                    onChange={() => handlePermisoSeleccionado(permiso.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            ))
          ) : (
            <p>Cargando permisos...</p>
          )}
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Botones para crear rol y cancelar */}
        <div className="flex justify-between">
          <button
            type="submit"
            className={`px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Rol'}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearRolForm;
