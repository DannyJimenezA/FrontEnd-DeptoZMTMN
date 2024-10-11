import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirección
import {jwtDecode} from "jwt-decode"; // Asegúrate de que jwt-decode esté instalado
import "../../styles/Administrativos/TablaProrrogaConcesion.css";
import { FaFilePdf } from "react-icons/fa";

// Interfaz para las prórrogas
interface Prorroga {
  id: number;
  ArchivoAdjunto: string;
  Status?: string;
}

// Interfaz para las concesiones
interface Concesion {
  id: number;
  ArchivoAdjunto: string;
  Status?: string;
}

// Interfaz para el token decodificado
interface DecodedToken {
  roles: string[];
}

// Interfaz para la respuesta de solicitudes
interface SolicitudesResponse {
  concesiones: Concesion[];
  prorrogas: Prorroga[];
}

const baseUrl = "http://localhost:3000/";

const fetchSolicitudes = async (): Promise<SolicitudesResponse> => {
  const urlBase = "http://localhost:3000/solicitudes";

  try {
    const response = await fetch(urlBase, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: SolicitudesResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching solicitudes:", error);
    throw error;
  }
};

const TablaSolicitudes: React.FC = () => {
  const [prorrogas, setProrrogas] = useState<Prorroga[]>([]);
  const [concesiones, setConcesiones] = useState<Concesion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token); // Decodificar el token para obtener roles

        if (!decodedToken.roles.includes("admin")) {
          window.alert("No tienes permiso para acceder a esta página."); // Mostrar alerta al usuario
          navigate("/"); // Redirige a una página de acceso denegado o inicio
          return;
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        window.alert("Ha ocurrido un error. Por favor, inicie sesión nuevamente.");
        navigate("/login"); // Redirige a login si hay un problema con el token
        return;
      }
    } else {
      window.alert("No se ha encontrado un token de acceso. Por favor, inicie sesión.");
      navigate("/login"); // Redirige a login si no hay un token
      return;
    }

    const obtenerSolicitudes = async () => {
      try {
        const solicitudesFromAPI = await fetchSolicitudes();
        setProrrogas(solicitudesFromAPI.prorrogas);
        setConcesiones(solicitudesFromAPI.concesiones);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las solicitudes:", error);
        setError("Error al cargar las solicitudes.");
        setLoading(false);
      }
    };

    obtenerSolicitudes();
  }, [navigate]);

  const manejarVer = (archivo: string | string[]) => {
    let archivoFinal = Array.isArray(archivo) ? archivo[0] : archivo;
    archivoFinal = archivoFinal.replace(/[\[\]"]/g, "");

    if (archivoFinal) {
      const fileUrl = `${baseUrl}${archivoFinal}`;
      window.open(fileUrl, "_blank");
    } else {
      console.error("No hay archivo adjunto para ver.");
    }
  };

  const manejarCambioEstado = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return; // Salir si el usuario cancela la acción

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/Prorrogas/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ Status: nuevoEstado }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error al actualizar el estado de la prórroga con ID: ${id}`);
      }
      setProrrogas((prevProrrogas) =>
        prevProrrogas.map((prorroga) =>
          prorroga.id === id ? { ...prorroga, Status: nuevoEstado } : prorroga
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado de la prórroga:", error);
    }
  };

  const manejarCambioEstadoConcesion = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return; // Salir si el usuario cancela la acción

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/Concesiones/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ Status: nuevoEstado }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error al actualizar el estado de la concesión con ID: ${id}`);
      }
      setConcesiones((prevConcesiones) =>
        prevConcesiones.map((concesion) =>
          concesion.id === id ? { ...concesion, Status: nuevoEstado } : concesion
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado de la concesión:", error);
    }
  };

  if (loading) {
    return <p>Cargando solicitudes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const manejarEliminar = async (id: number) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta prórroga?");
    if (!confirmacion) return;

    try {
      const response = await fetch(`${baseUrl}Prorrogas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar la prórroga con ID: ${id}`);
      }

      setProrrogas((prevProrrogas) =>
        prevProrrogas.filter((prorroga) => prorroga.id !== id)
      );
      console.log(`Prórroga con ID: ${id} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la prórroga:', error);
    }
  };

  const manejarEliminarConcesion = async (id: number) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta concesión?");
    if (!confirmacion) return;
    try {
      const response = await fetch(`${baseUrl}Concesiones/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar la concesión con ID: ${id}`);
      }

      setConcesiones((prevConcesiones) =>
        prevConcesiones.filter((concesion) => concesion.id !== id)
      );
      console.log(`Concesión con ID: ${id} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la concesión:', error);
    }
  };

  return (
    <div className="tabla-container">
      <h2>Solicitudes de Concesiones y Prórrogas</h2>

      {/* Tabla para Concesiones */}
      <h3>Concesiones</h3>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {concesiones.map((concesion) => (
            <tr key={concesion.id}>
              <td>{concesion.id}</td>
              <td>
                {concesion.ArchivoAdjunto ? (
                  JSON.parse(concesion.ArchivoAdjunto).map((archivo: string, index: number) => (
                    <FaFilePdf
                      key={index}
                      style={{ cursor: "pointer", marginRight: "5px" }}
                      onClick={() => manejarVer(archivo)}
                      title="Ver archivo"
                    />
                  ))
                ) : (
                  "No disponible"
                )}
              </td>
              <td>{concesion.Status}</td>
              <td>
                <button onClick={() => manejarCambioEstadoConcesion(concesion.id, "aprobada")}>Aprobar</button>
                <button onClick={() => manejarCambioEstadoConcesion(concesion.id, "denegada")}>Denegar</button>
                <button onClick={() => manejarEliminarConcesion(concesion.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabla para Prórrogas */}
      <h3>Prórrogas</h3>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prorrogas.map((prorroga) => (
            <tr key={prorroga.id}>
              <td>{prorroga.id}</td>
              <td>
                {prorroga.ArchivoAdjunto ? (
                  JSON.parse(prorroga.ArchivoAdjunto).map((archivo: string, index: number) => (
                    <FaFilePdf
                      key={index}
                      style={{ cursor: "pointer", marginRight: "5px" }}
                      onClick={() => manejarVer(archivo)}
                      title="Ver archivo"
                    />
                  ))
                ) : (
                  "No disponible"
                )}
              </td>
              <td>{prorroga.Status}</td>
              <td>
                <button onClick={() => manejarCambioEstado(prorroga.id, "aprobada")}>Aprobar</button>
                <button onClick={() => manejarCambioEstado(prorroga.id, "denegada")}>Denegar</button>
                <button onClick={() => manejarEliminar(prorroga.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSolicitudes;
