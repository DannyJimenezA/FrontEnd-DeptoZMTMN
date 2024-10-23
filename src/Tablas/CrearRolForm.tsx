import React, { useState } from 'react';

// Interfaz para el nuevo rol
interface CrearRolFormProps {
  onRolCreado: () => void; // Callback para actualizar la lista de roles después de la creación
}

const CrearRolForm: React.FC<CrearRolFormProps> = ({ onRolCreado }) => {
  const [nombreRol, setNombreRol] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCrearRol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreRol) {
      setError('El nombre del rol es obligatorio');
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
        body: JSON.stringify({ name: nombreRol }), // Enviar solo el nombre del rol
      });

      if (!response.ok) {
        throw new Error(`Error al crear el rol: ${response.statusText}`);
      }

      setNombreRol(''); // Limpiar el campo de texto
      onRolCreado();    // Llamar al callback para actualizar la tabla de roles
    } catch (error) {
      setError('Hubo un problema al crear el rol.');
      console.error('Error al crear el rol:', error);
    } finally {
      setLoading(false);
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Rol'}
        </button>
      </form>
    </div>
  );
};

export default CrearRolForm;
