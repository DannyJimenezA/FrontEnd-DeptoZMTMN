import { useState, useEffect } from 'react';

interface Solicitud {
  id: number;
  ArchivoAdjunto: string;
  IdUser: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
  };
  IdEstado: {
    id: number;
    descripcion: string;
  };
}

const baseUrl = 'http://localhost:3000/concesiones/';

const fetchSolicitudes = async (): Promise<Solicitud[]> => {
  try {
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching solicitudes:', error);
    throw error;
  }
};

const useSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const data = await fetchSolicitudes();
        setSolicitudes(data);
      } catch {
        setError('Error al cargar las solicitudes.');
      } finally {
        setLoading(false);
      }
    };

    obtenerSolicitudes();
  }, []);

  return { solicitudes, loading, error, setSolicitudes };
};

export default useSolicitudes;
