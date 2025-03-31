import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirección
import {jwtDecode} from "jwt-decode"; // Asegúrate de que jwt-decode esté instalado
import "../../styles/Administrativos/TablaProrrogaConcesion.css";
import { FaFilePdf } from "react-icons/fa";
import ApiRoutes from "../../components/ApiRoutes";
import AlertNotification from "../../components/AlertNotificationP";

// Interfaz para las prórrogas
interface Prorroga {
  id: number;
  ArchivoAdjunto: string;
  Status?: string;
  user?:{
    cedula: number;
    nombre: string;
    apellido1: string;

  }
}

// Interfaz para las concesiones
interface Concesion {
  id: number;
  ArchivoAdjunto: string;
  Status?: string;
  user?:{
    cedula: number;
    nombre: string;
    apellido1: string;

  }
}
interface Precario{
  id: number;
  ArchivoAdjunto: string;
  Status?: string;
  user?:{
    cedula: number;
    nombre: string;
    apellido1: string;

  }
}

// Interfaz para el token decodificado
interface DecodedToken {
  roles: string[];
}

// Interfaz para la respuesta de solicitudes
interface SolicitudesResponse {
  concesiones: Concesion[];
  prorrogas: Prorroga[];
  precario: Precario[];
}


const fetchSolicitudes = async (): Promise<SolicitudesResponse> => {

  try {
    const response = await fetch(ApiRoutes.concesiones, {
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
  const [precarios, setPrecario] = useState<Precario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (!decodedToken.roles.includes("admin")) {
          window.alert("No tienes permiso para acceder a esta página.");
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        window.alert("Ha ocurrido un error. Por favor, inicie sesión nuevamente.");
        navigate("/login");
        return;
      }
    } else {
      window.alert("No se ha encontrado un token de acceso. Por favor, inicie sesión.");
      navigate("/login");
      return;
    }

    const obtenerSolicitudes = async () => {
      try {
        const solicitudesFromAPI = await fetchSolicitudes();
        setProrrogas(solicitudesFromAPI.prorrogas);
        setConcesiones(solicitudesFromAPI.concesiones);
        setPrecario(solicitudesFromAPI.precario);
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
      const fileUrl = `${ApiRoutes}${archivoFinal}`;
      window.open(fileUrl, "_blank");
    } else {
      console.error("No hay archivo adjunto para ver.");
    }
  };

  const manejarCambioEstado = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${ApiRoutes.concesiones}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Status: nuevoEstado }),
      });

      if (!response.ok) throw new Error();

      setProrrogas(prev =>
        prev.map(prorroga =>
          prorroga.id === id ? { ...prorroga, Status: nuevoEstado } : prorroga
        )
      );

      setAlert({
        type: 'success',
        message: `La prórroga fue ${nuevoEstado === 'aprobada' ? 'aprobada' : 'denegada'} correctamente.`,
      });
    } catch {
      setAlert({ type: 'error', message: 'Ocurrió un error al cambiar el estado de la prórroga.' });
    }
  };

  const manejarCambioEstadoPrecario = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${ApiRoutes.concesiones}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Status: nuevoEstado }),
      });

      if (!response.ok) throw new Error();

      setPrecario(prev =>
        prev.map(p => (p.id === id ? { ...p, Status: nuevoEstado } : p))
      );

      setAlert({
        type: 'success',
        message: `La solicitud fue ${nuevoEstado === 'aprobada' ? 'aprobada' : 'denegada'} correctamente.`,
      });
    } catch {
      setAlert({ type: 'error', message: 'Ocurrió un error al cambiar el estado de la solicitud.' });
    }
  };

  const manejarCambioEstadoConcesion = async (id: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${ApiRoutes.concesiones}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Status: nuevoEstado }),
      });

      if (!response.ok) throw new Error();

      setConcesiones(prev =>
        prev.map(c => (c.id === id ? { ...c, Status: nuevoEstado } : c))
      );

      setAlert({
        type: 'success',
        message: `La concesión fue ${nuevoEstado === 'aprobada' ? 'aprobada' : 'denegada'} correctamente.`,
      });
    } catch {
      setAlert({ type: 'error', message: 'Ocurrió un error al cambiar el estado de la concesión.' });
    }
  };

  if (loading) return <p>Cargando solicitudes...</p>;
  if (error) return <p>Error: {error}</p>;

  function manejarEliminarPrecario(id: number): void {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta solicitud?");
    if (!confirmacion) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
  
    fetch(`${ApiRoutes.expedientes}/${id}/status`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al eliminar la solicitud con ID: ${id}`);
        }
        setPrecario((prev) => prev.filter((p) => p.id !== id));
        setAlert({
          type: 'success',
          message: `La solicitud con ID ${id} fue eliminada correctamente.`,
        });
      })
      .catch((error) => {
        console.error("Error al eliminar la solicitud:", error);
        setAlert({
          type: 'error',
          message: "Ocurrió un error al eliminar la solicitud.",
        });
      });
  }
  

  function manejarEliminar(id: number): void {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta prórroga?");
    if (!confirmacion) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
  
    fetch(`${ApiRoutes.concesiones}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al eliminar la prórroga con ID: ${id}`);
        }
        setProrrogas((prev) => prev.filter((p) => p.id !== id));
        setAlert({
          type: 'success',
          message: `La prórroga con ID ${id} fue eliminada correctamente.`,
        });
      })
      .catch((error) => {
        console.error("Error al eliminar la prórroga:", error);
        setAlert({
          type: 'error',
          message: "Ocurrió un error al eliminar la prórroga.",
        });
      });
  }
  

  function manejarEliminarConcesion(id: number): void {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta concesión?");
    if (!confirmacion) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
  
    fetch(`${ApiRoutes.expedientes}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al eliminar la concesión con ID: ${id}`);
        }
        setConcesiones((prev) => prev.filter((c) => c.id !== id));
        setAlert({
          type: 'success',
          message: `La concesión con ID ${id} fue eliminada correctamente.`,
        });
      })
      .catch((error) => {
        console.error("Error al eliminar la concesión:", error);
        setAlert({
          type: 'error',
          message: "Ocurrió un error al eliminar la concesión.",
        });
      });
  }
  

  return (
    <div className="tabla-container">
      <h2>Solicitudes</h2>

      {/* Tabla para Concesiones */}
      <h3>Concesiones</h3>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cedula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {concesiones.map((concesion) => (
            <tr key={concesion.id}>
              <td>{concesion.id}</td>
              <td>{concesion.user?.cedula}</td>
              <td>{concesion.user?.nombre}</td>
              <td>{concesion.user?.apellido1}</td>
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
            <th>Cedula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prorrogas.map((prorroga) => (
            <tr key={prorroga.id}>
              <td>{prorroga.id}</td>
              <td>{prorroga.user?.cedula}</td>
              <td>{prorroga.user?.nombre}</td>
              <td>{prorroga.user?.apellido1}</td>
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
      {/* Tabla para Concesiones */}
      <h3> Uso precario</h3>
      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cedula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Archivos Adjuntos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {precarios.map((precario) => (
            <tr key={precario.id}>
              <td>{precario.id}</td>
              <td>{precario.user?.cedula}</td>
              <td>{precario.user?.nombre}</td>
              <td>{precario.user?.apellido1}</td>
              <td>
                {precario.ArchivoAdjunto ? (
                  JSON.parse(precario.ArchivoAdjunto).map((archivo: string, index: number) => (
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
              <td>{precario.Status}</td>
              <td>
                <button onClick={() => manejarCambioEstadoPrecario(precario.id, "aprobada")}>Aprobar</button>
                <button onClick={() => manejarCambioEstadoPrecario(precario.id, "denegada")}>Denegar</button>
                <button onClick={() => manejarEliminarPrecario(precario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Alerta visual */}
      {alert && (
        <AlertNotification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
    
  );
};

export default TablaSolicitudes;
