import ApiRoutes from '../components/ApiRoutes';

// Definición del tipo Permission
export type Permission = {
  id: number;
  action: string;
  resource: string;
};

// Función para obtener todos los permisos desde el backend
export const fetchPermisos = async (): Promise<Permission[]> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Token no disponible. Por favor, inicia sesión.');
  }

  try {
    const response = await fetch(`${ApiRoutes.urlBase}/permissions`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener permisos: ${response.status} - ${response.statusText}`
      );
    }

    const permisos: Permission[] = await response.json();
    return permisos;
  } catch (error) {
    console.error('Error en fetchPermisos:', error);
    throw error;
  }
};

// Función para actualizar los permisos de un rol en el backend
export const actualizarPermisos = async (
  roleId: number,
  newPermissions: { action: string; resource: string }[]
): Promise<void> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Token no disponible. Por favor, inicia sesión.');
  }

  try {
    const response = await fetch(`${ApiRoutes.urlBase}/roles/${roleId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPermissions }), // Formato esperado por el backend
    });

    if (!response.ok) {
      throw new Error(
        `Error al actualizar permisos: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error('Error en actualizarPermisos:', error);
    throw error;
  }
};
