// import React, { useState } from 'react';
// import { FaFilePdf } from 'react-icons/fa';
// import { Precario } from '../Types/Types';
// import ApiRoutes from '../components/ApiRoutes';
// import  '../styles/DetalleSolicitud.css'
// interface DetallePrecarioProps {
//   precario: Precario;
//   onVolver: () => void;
//   onEstadoCambiado: (id: number, nuevoEstado: string) => void;
// }

// const DetallePrecario: React.FC<DetallePrecarioProps> = ({ precario, onVolver, onEstadoCambiado }) => {
//   const [mensaje, setMensaje] = useState<string>('');

//   const [estado, setEstado] = useState<string>(precario.status || 'Pendiente'); // Estado local para el status
//   const enviarCorreo = async () => {
//     if (!precario.user?.email || !mensaje) {
//       alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
//       return;
//     }
//     try {
//       const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: precario.user.email, message: mensaje }),
//       });
//       const result = await response.json();
//       if (result.success) {
//         alert('Mensaje enviado exitosamente.');
//         setMensaje('');
//       } else {
//         alert('Error al enviar el mensaje.');
//       }
//     } catch (error) {
//       console.error('Error al enviar el correo:', error);
//       alert('Hubo un error al intentar enviar el mensaje.');
//     }
//   };

//   const manejarCambioEstado = (nuevoEstado: string) => {
//     onEstadoCambiado(precario.id, nuevoEstado);
//     setEstado(nuevoEstado); // Actualiza el estado localmente para reflejar el cambio
//   };

//   const manejarVerArchivo = (archivo: string) => {
//     const archivoFinal = archivo.replace(/[\[\]"]/g, '');
//     if (archivoFinal) {
//       const fileUrl = `${ApiRoutes.urlBase}/${archivoFinal}`;
//       window.open(fileUrl, '_blank');
//     }
//   };

//   return (
//     <div className="detalle-tabla">
//       <h3>Detalles del Uso Precario</h3>
//       <div className="detalle-contenido">
//         <div className="detalle-info">
//           <p><strong>ID:</strong> {precario.id}</p>
//           <p><strong>Nombre:</strong> {precario.user?.nombre}</p>
//           <p><strong>Apellidos:</strong> {precario.user?.apellido1}</p>
//           <p><strong>Cédula:</strong> {precario.user?.cedula}</p>
//           <p><strong>Estado:</strong> {estado}</p> {/* Muestra el estado actualizado */}
//         </div>

//         <div className="detalle-archivos">
//           <p><strong>Archivos Adjuntos:</strong></p>
//           {precario.ArchivoAdjunto ? (
//             JSON.parse(precario.ArchivoAdjunto).map((archivo: string, index: number) => (
//               <FaFilePdf
//                 key={index}
//                 style={{ cursor: 'pointer', marginRight: '5px' }}
//                 onClick={() => manejarVerArchivo(archivo)}
//                 title="Ver archivo"
//               />
//             ))
//           ) : (
//             "No disponible"
//           )}
//         </div>
//       </div>

//       <div className="mensaje-container">
//         <h3>Enviar mensaje a: {precario.user?.email}</h3>
//         <textarea
//           value={mensaje}
//           onChange={(e) => setMensaje(e.target.value)}
//           placeholder="Escribe tu mensaje aquí"
//           rows={4}
//           style={{ width: '100%' }}
//         />
//         <button onClick={enviarCorreo} className="btn-enviar">Enviar mensaje</button>
//       </div>

//       <div className="estado-botones">
//         <button className="boton-aprobar" onClick={() => manejarCambioEstado('Aprobada')}>
//           Aprobar
//         </button>
//         <button className="boton-denegar" onClick={() => manejarCambioEstado('Denegada')}>
//           Denegar
//         </button>
//       </div>

//       <button className="volver-btn" onClick={onVolver}>Volver</button>
//     </div>
//   );
// };

// export default DetallePrecario;

import React, { useState } from 'react';
import { FaFilePdf, FaTimes } from 'react-icons/fa';
import { Precario } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import '../styles/DetalleSolicitud.css';

interface DetallePrecarioProps {
  precario: Precario;
  onVolver: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
}

const DetallePrecario: React.FC<DetallePrecarioProps> = ({ precario, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>('');
  const [estado, setEstado] = useState<string>(precario.status || 'Pendiente');
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null); // Estado para previsualización

  // Función para enviar correo
  const enviarCorreo = async () => {
    if (!precario.user?.email || !mensaje) {
      alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
      return;
    }
    try {
      const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: precario.user.email, message: mensaje }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Mensaje enviado exitosamente.');
        setMensaje('');
      } else {
        alert('Error al enviar el mensaje.');
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      alert('Hubo un error al intentar enviar el mensaje.');
    }
  };

  // Función para previsualizar un archivo PDF en el modal
  const manejarVerArchivo = (archivo: string) => {
    const archivoFinal = archivo.replace(/[\[\]"]/g, '');
    if (archivoFinal) {
      const fileUrl = `${ApiRoutes.urlBase}/${archivoFinal}`;
      setArchivoVistaPrevia(fileUrl);
    }
  };

  // Función para cerrar la vista previa
  const cerrarVistaPrevia = () => setArchivoVistaPrevia(null);

  // Función para cambiar el estado del precario
  const manejarCambioEstado = (nuevoEstado: string) => {
    onEstadoCambiado(precario.id, nuevoEstado);
    setEstado(nuevoEstado);
  };

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    nuevoEstado: string;
  } | null>(null);
  

  return (
    <div className="detalle-tabla">
      <h3>Detalles del Uso Precario</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {precario.id}</p>
          <p><strong>Nombre:</strong> {precario.user?.nombre || 'No disponible'}</p>
          <p><strong>Apellidos:</strong> {precario.user?.apellido1 || 'No disponible'}</p>
          <p><strong>Cédula:</strong> {precario.user?.cedula || 'No disponible'}</p>
          <p><strong>Detalle:</strong> {precario.Detalle}</p>
          <p><strong>Estado:</strong> {estado}</p>
        </div>

        {/* Sección de Archivos Adjuntos */}
        <div className="detalle-archivos">
          <p><strong>Archivos Adjuntos:</strong></p>
          {precario.ArchivoAdjunto ? (
            (() => {
              try {
                const archivos = JSON.parse(precario.ArchivoAdjunto);
                return archivos.map((archivo: string, index: number) => (
                  <FaFilePdf
                    key={index}
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => manejarVerArchivo(archivo)}
                    title={`Ver archivo ${index + 1}`}
                    size={20}
                  />
                ));
              } catch (error) {
                console.error('Error al parsear ArchivoAdjunto:', error);
                return <p>Error al cargar archivos</p>;
              }
            })()
          ) : (
            'No disponible'
          )}
        </div>
      </div>

      {/* Modal para previsualizar el PDF */}
      {archivoVistaPrevia && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={cerrarVistaPrevia}>
              <FaTimes size={20} />
            </button>
            <iframe src={archivoVistaPrevia} title="Vista Previa" className="pdf-viewer"></iframe>
          </div>
        </div>
      )}

      {/* Sección para enviar el mensaje */}
      <div className="mensaje-container">
        <h3>Enviar mensaje a: {precario.user?.email}</h3>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje aquí"
          rows={4}
          style={{ width: '100%' }}
        />
        <button onClick={enviarCorreo} className="btn-enviar">Enviar mensaje</button>
      </div>

      {/* Botones para cambiar estado */}
      <div className="estado-botones" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px'
          }}
          onClick={() => setConfirmModal({ visible: true, nuevoEstado: 'Aprobada' })}
        >
          Aprobar
        </button>
        <button
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px'
          }}
          onClick={() => setConfirmModal({ visible: true, nuevoEstado: 'Denegada' })}
        >
          Denegar
        </button>
      </div>

      <button className="volver-btn" onClick={onVolver}>Volver</button>

      {/* Modal de confirmación */}
      {confirmModal?.visible && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', padding: '20px' }}>
            <h3>Confirmación</h3>
            <p>¿Estás seguro de cambiar el estado a <strong>{confirmModal.nuevoEstado}</strong>?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
              <button
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                }}
                onClick={() => {
                  manejarCambioEstado(confirmModal.nuevoEstado);
                  setConfirmModal(null);
                }}
              >
                Aceptar
              </button>
              <button
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                }}
                onClick={() => setConfirmModal(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetallePrecario;
