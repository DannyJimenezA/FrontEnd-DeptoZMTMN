import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el parámetro de la URL
import { Usuario } from '../Types/Types';        // Importar la interfaz User


// Interfaz para las propiedades del componente
interface DetalleUsuarioProps {
  onVolver: () => void;  // Función para volver a la lista de usuarios
}

// El componente DetalleUsuario
const DetalleUsuario: React.FC<DetalleUsuarioProps> = ({ onVolver }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null); // Estado para almacenar el usuario
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useParams<{ userId: string }>(); // Obtener el ID del usuario desde la URL

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUsuario = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data: Usuario = await response.json();
        setUsuario(data); // Actualizar el estado con el usuario obtenido
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        setError('Error al cargar la información del usuario.');
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [userId]);

  if (loading) return <p>Cargando información del usuario...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="detalle-usuario">
      <h2>Detalle del Usuario</h2>
      {usuario && (
        <div className="detalle-contenido">
          <div className="detalle-info">
            <p><strong>ID:</strong> {usuario.id}</p>
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Correo Electrónico:</strong> {usuario.email}</p>
            <p><strong>Teléfono:</strong> {usuario.telefono || 'No disponible'}</p>
            <p><strong>Roles:</strong>
              {usuario.roles && usuario.roles.length > 0 ? (
                <ul>
                  {usuario.roles.map((rol) => (
                    <li key={rol.id}>{rol.name}</li>
                  ))}
                </ul>
              ) : (
                'Sin roles asignados'
              )}
            </p>
            <p><strong>Permisos:</strong>
              {usuario.permissions && usuario.permissions.length > 0 ? (
                <ul>
                  {usuario.permissions.map((permiso) => (
                    <li key={permiso.id}>{permiso.name}</li>
                  ))}
                </ul>
              ) : (
                'Sin permisos asignados'
              )}
            </p>
          </div>
        </div>
      )}
      <button className="volver-btn" onClick={onVolver}>Volver a la lista de usuarios</button>
    </div>
  );
};

export default DetalleUsuario;
