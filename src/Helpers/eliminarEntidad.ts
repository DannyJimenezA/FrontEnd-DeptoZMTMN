// src/helpers/eliminarEntidad.ts

import ApiRoutes from "../components/ApiRoutes";

export const eliminarEntidad = async <T extends { id: number }>(
    entidad: string,       // Nombre de la entidad (por ejemplo, "denuncia", "concesion")
    id: number,            // ID de la entidad a eliminar
    actualizarLista: (actualizarFn: (prevItems: T[]) => T[]) => void  // Función para actualizar la lista
  ) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar esta ${entidad}?`);
    if (!confirmacion) return;
    const token = localStorage.getItem('token'); 
    try {
      const response = await fetch(`${ApiRoutes.urlBase}/${entidad}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Añadir el token en los encabezados
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar la ${entidad} con ID: ${id}`);
      }
  
      actualizarLista((prevItems) => prevItems.filter((item) => item.id !== id));
      console.log(`${entidad.charAt(0).toUpperCase() + entidad.slice(1)} con ID: ${id} eliminada`);
    } catch (error) {
      console.error(`Error al eliminar la ${entidad}:`, error);
    }
  };
  