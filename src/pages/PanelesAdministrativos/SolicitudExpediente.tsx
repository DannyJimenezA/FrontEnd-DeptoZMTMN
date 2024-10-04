import { useEffect, useState } from 'react';
import "../../styles/Administrativos/TablaSolicitudExpediente.css";
// Importa el modal o crea uno si no lo tienes ya implementado
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

  useEffect(() => {
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
  }, []);

  const manejarVer = (copia: CopiaExpediente) => {
    setCopiaSeleccionada(copia);
    setModalIsOpen(true);
  };

  

  const manejarEliminar = async (idExpediente: number) => {
    try {
      const response = await fetch(`http://localhost:3000/expedientes/${idExpediente}`, {
        method: 'DELETE',
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
  const manejarCambioEstado = async (idExpediente: number, nuevoEstado: string)=>{
    const token = localStorage.getItem('token');
    if (!token){
     console.error('Token no encontrado');
     return;
    }
    try{
     const response = await fetch(`http://localhost:3000/expedientes/${idExpediente}/status`,{
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,
       },
       body: JSON.stringify({status: nuevoEstado}),
     });
     if (!response.ok){
       throw new Error(`Error al actualizar el estado de la cita con ID: ${idExpediente}`);
     }
     setCopiasExpedientes((prevCopias)=>
       prevCopias.map((copia)=>
         copia.idExpediente === idExpediente ? {...copia, status: nuevoEstado}:copia
   )
 );
 console.log(`Estado de la cita con ID: ${idExpediente} cambiado a ${nuevoEstado}`);
    }catch(error){
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
            {/* <th>Teléfono</th>*/}
           {/* <th>Medio Notificación</th> */}
            <th>Número Expediente</th>
           {/* <th>Copia Certificada</th>*/}
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {copiasExpedientes.map((copia) => (
            <tr key={copia.idExpediente}>
              <td>{copia.idExpediente}</td>
              <td>{copia.nombreSolicitante}</td>
             {/* <td>{copia.telefonoSolicitante}</td>*/}
              {/*<td>{copia.medioNotificacion}</td>*/}
              <td>{copia.numeroExpediente}</td>
             {/* <td>{copia.copiaCertificada ? 'Sí' : 'No'}</td>*/}
              <td>{copia.status}</td> {/* Mostrar estado de la copia */}
              <td>
                <button onClick={() => manejarVer(copia)}>Ver</button>
                <button onClick={()=> manejarCambioEstado(copia.idExpediente, 'aprobada')}>Aprobar</button>
                <button onClick={()=> manejarCambioEstado(copia.idExpediente, 'denegada')}>Denegar</button>
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
          <p><strong>Estado:</strong> {copiaSeleccionada.estado ? copiaSeleccionada.estado : 'Pendiente'}</p>
          <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
        </Modal>
      )}
    </div>
  );
};

export default TablaSolicitudExpediente;
