import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirección
import {jwtDecode} from 'jwt-decode'; // Asegúrate de que jwt-decode esté instalado
import "../../styles/Administrativos/TablaSolicitudExpediente.css";
import Modal from 'react-modal';

// Interfaz para las copias de expediente
interface CopiaExpediente {
  idExpediente: number;
  nombreSolicitante: string;
  telefonoSolicitante: string;
  medioNotificacion: string;
  numeroExpediente: string;
  copiaCertificada: boolean;
  status?: string; // Agregado un estado opcional para manejar el estado de aceptación
}

// Interfaz para el token decodificado
interface DecodedToken {
  roles: string[];
}

// Función para obtener las copias de expediente desde la API
const fetchCopiasExpedientes = async (): Promise<CopiaExpediente[]> => {
  const urlBase = 'http://localhost:3000/expedientes';  // Nueva ruta para obtener las copias de expediente

  try {
    const response = await fetch(urlBase, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: CopiaExpediente[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching copias de expediente:', error);
    throw error;
  }
};

const TablaSolicitudExpediente: React.FC = () => {
  const [copiasExpedientes, setCopiasExpedientes] = useState<CopiaExpediente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [copiaSeleccionada, setCopiaSeleccionada] = useState<CopiaExpediente | null>(null);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token); // Decodificar el token para obtener roles

        if (!decodedToken.roles.includes("admin")) {
          window.alert("No tienes permiso para acceder a esta página."); // Mostrar alerta al usuario
          navigate("/no-autorizado"); // Redirige a una página de acceso denegado o inicio
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

    const obtenerCopiasExpedientes = async () => {
      try {
        const copiasFromAPI = await fetchCopiasExpedientes();
        setCopiasExpedientes(copiasFromAPI);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las copias de expediente:', error);
        setError('Error al cargar las copias de expediente.');
        setLoading(false);
      }
    };

    obtenerCopiasExpedientes();
  }, [navigate]);

  const manejarVer = (copia: CopiaExpediente) => {
    setCopiaSeleccionada(copia);
    setModalIsOpen(true);
  };

  const manejarEliminar = async (idExpediente: number) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta copia de expediente?");
    if (!confirmacion) return; // Salir si el usuario cancela la acción

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/expedientes/${idExpediente}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar la copia de expediente con ID: ${idExpediente}`);
      }
      setCopiasExpedientes((prevCopias) =>
        prevCopias.filter((copia) => copia.idExpediente !== idExpediente)
      );
      console.log(`Copia de expediente con ID: ${idExpediente} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la copia de expediente:', error);
    }
  };

  const manejarCambioEstado = async (idExpediente: number, nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas cambiar el estado a "${nuevoEstado}"?`);
    if (!confirmacion) return; // Salir si el usuario cancela la acción
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/expedientes/${idExpediente}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar el estado de la cita con ID: ${idExpediente}`);
      }
      setCopiasExpedientes((prevCopias) =>
        prevCopias.map((copia) =>
          copia.idExpediente === idExpediente ? { ...copia, status: nuevoEstado } : copia
        )
      );
      console.log(`Estado de la cita con ID: ${idExpediente} cambiado a ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado de la cita:', error);
    }
  };

  return (
    <div className="tabla-container">
      <h2>Copias de Expediente</h2>
      <table className="tabla-expedientes">
        <thead>
          <tr>
            <th>ID Expediente</th>
            <th>Nombre Solicitante</th>
            <th>Número Expediente</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {copiasExpedientes.map((copia) => (
            <tr key={copia.idExpediente}>
              <td>{copia.idExpediente}</td>
              <td>{copia.nombreSolicitante}</td>
              <td>{copia.numeroExpediente}</td>
              <td>{copia.status}</td> {/* Mostrar estado de la copia */}
              <td>
                <button onClick={() => manejarVer(copia)}>Ver</button>
                <button onClick={() => manejarCambioEstado(copia.idExpediente, 'aprobada')}>Aprobar</button>
                <button onClick={() => manejarCambioEstado(copia.idExpediente, 'denegada')}>Denegar</button>
                <button onClick={() => manejarEliminar(copia.idExpediente)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para mostrar los detalles de la solicitud */}
      {copiaSeleccionada && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Detalles de la Solicitud"
        >
          <h2>Detalles de la Solicitud</h2>
          <p><strong>ID Expediente:</strong> {copiaSeleccionada.idExpediente}</p>
          <p><strong>Nombre Solicitante:</strong> {copiaSeleccionada.nombreSolicitante}</p>
          <p><strong>Teléfono:</strong> {copiaSeleccionada.telefonoSolicitante}</p>
          <p><strong>Medio Notificación:</strong> {copiaSeleccionada.medioNotificacion}</p>
          <p><strong>Número Expediente:</strong> {copiaSeleccionada.numeroExpediente}</p>
          <p><strong>Copia Certificada:</strong> {copiaSeleccionada.copiaCertificada ? 'Sí' : 'No'}</p>
          <p><strong>Estado:</strong> {copiaSeleccionada.status ? copiaSeleccionada.status : 'Pendiente'}</p>
          <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
        </Modal>
      )}
    </div>
  );
};

export default TablaSolicitudExpediente;
