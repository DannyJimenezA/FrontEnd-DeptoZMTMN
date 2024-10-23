import React, { useState, useEffect } from 'react';
import DetalleUsuario from '../TablaVista/DetalleUsuario'; // Importar DetalleUsuario
import { Usuario } from '../Types/Types';  // Importar la interfaz User

const TablaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los usuarios');
        }

        const data = await response.json();
        setUsuarios(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error al cargar los usuarios');
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {usuarioSeleccionado ? (
        <DetalleUsuario usuario={usuarioSeleccionado} onVolver={() => setUsuarioSeleccionado(null)} />
      ) : (
        <div className="tabla-container">
          <h2>Lista de Usuarios</h2>
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <button onClick={() => setUsuarioSeleccionado(usuario)}>Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TablaUsuarios;
