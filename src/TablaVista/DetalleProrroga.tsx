// import React, { useState } from 'react';
// import { FaFilePdf } from 'react-icons/fa';
// import { Prorroga } from '../Types/Types';
// import ApiRoutes from '../components/ApiRoutes';
// import  '../styles/DetalleSolicitud.css'
// interface DetalleProrrogaProps {
//   prorroga: Prorroga;
//   onVolver: () => void;   // Función para volver a la lista de prórrogas
//   onEstadoCambiado: (id: number, nuevoEstado: string) => void;  // Función para cambiar el estado
// }

// const DetalleProrroga: React.FC<DetalleProrrogaProps> = ({ prorroga, onVolver, onEstadoCambiado }) => {
//   const [mensaje, setMensaje] = useState<string>(''); // Estado para almacenar el mensaje personalizado

//   // Función para enviar el correo al usuario de la prórroga
//   const enviarCorreo = async () => {
//     if (!prorroga.user?.email || !mensaje) {
//       alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
//       return;
//     }

//     try {
//       const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: prorroga.user.email, message: mensaje }),
//       });

//       const result = await response.json();
//       if (result.success) {
//         alert('Mensaje enviado exitosamente.');
//         setMensaje(''); // Limpiar el mensaje después de enviarlo
//       } else {
//         alert('Error al enviar el mensaje.');
//       }
//     } catch (error) {
//       console.error('Error al enviar el correo:', error);
//       alert('Hubo un error al intentar enviar el mensaje.');
//     }
//   };

//   const manejarVerArchivo = (archivo: string) => {
//     const archivoFinal = archivo.replace(/[\[\]"]/g, '');  // Limpiar si es necesario
//     if (archivoFinal) {
//       const fileUrl = `${ApiRoutes.urlBase}/${archivoFinal}`;
//       window.open(fileUrl, '_blank');
//     }
//   };

//   const cambiarEstado = (nuevoEstado: string) => {
//     onEstadoCambiado(prorroga.id, nuevoEstado);
//   };

//   return (
//     <div className="detalle-tabla">
//       <h3>Detalles de la Prórroga</h3>
//       <div className="detalle-contenido">
//         <div className="detalle-info">
//           <p><strong>ID:</strong> {prorroga.id}</p>
//           <p><strong>Nombre:</strong> {prorroga.user?.nombre || 'No disponible'}</p>
//           <p><strong>Apellidos:</strong> {prorroga.user?.apellido1 || 'No disponible'} {prorroga.user?.apellido2 || ''}</p>
//           <p><strong>Estado:</strong> {prorroga?.status || 'Pendiente'}</p>

//         </div>
//         <div className="detalle-archivos">
//           <p><strong>Archivo Adjunto:</strong></p>
//           {prorroga.ArchivoAdjunto ? (
//             JSON.parse(prorroga.ArchivoAdjunto).map((archivo: string, index: number) => (
//               <FaFilePdf
//                 key={index}
//                 style={{ cursor: 'pointer', marginRight: '5px' }}
//                 onClick={() => manejarVerArchivo(archivo)}
//                 title={`Ver archivo ${index + 1}`}
//               />
//             ))
//           ) : (
//             "No disponible"
//           )}
//         </div>
//       </div>

//       {/* Sección para enviar el mensaje */}
//       <div className="mensaje-container">
//         <h3>Enviar mensaje a: {prorroga.user?.email}</h3>
//         <textarea
//           value={mensaje}
//           onChange={(e) => setMensaje(e.target.value)}
//           placeholder="Escribe tu mensaje aquí"
//           rows={4}
//           style={{ width: '100%' }}
//         />
//         <button onClick={enviarCorreo} className="btn-enviar">Enviar mensaje</button>
//       </div>

//       {/* Botones para cambiar el estado */}
//       <div className="estado-botones">
//         <button onClick={() => cambiarEstado('Aprobada')} className="boton-aprobar">Aprobar</button>
//         <button onClick={() => cambiarEstado('Denegada')} className="boton-denegar">Denegar</button>
//       </div>

//       {/* Botón para volver a la lista */}
//       <button className="volver-btn" onClick={onVolver}>Volver</button>
//     </div>
//   );
// };

// export default DetalleProrroga;


import React, { useState } from 'react';
import { FaFilePdf, FaTimes } from 'react-icons/fa';
import { Prorroga } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import '../styles/DetalleSolicitud.css';

interface DetalleProrrogaProps {
  prorroga: Prorroga;
  onVolver: () => void; // Función para volver a la lista de prórrogas
  onEstadoCambiado: (id: number, nuevoEstado: string) => void; // Función para cambiar el estado
}

const DetalleProrroga: React.FC<DetalleProrrogaProps> = ({ prorroga, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>(''); // Estado para almacenar el mensaje personalizado
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null); // Estado para previsualización

  // Función para enviar el correo al usuario de la prórroga
  const enviarCorreo = async () => {
    if (!prorroga.user?.email || !mensaje) {
      alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: prorroga.user.email, message: mensaje }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Mensaje enviado exitosamente.');
        setMensaje(''); // Limpiar el mensaje después de enviarlo
      } else {
        alert('Error al enviar el mensaje.');
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      alert('Hubo un error al intentar enviar el mensaje.');
    }
  };

  // Función para previsualizar un archivo PDF en un modal
  const manejarVerArchivo = (archivo: string) => {
    const archivoFinal = archivo.replace(/[\[\]"]/g, ''); // Limpiar si es necesario
    if (archivoFinal) {
      const fileUrl = `${ApiRoutes.urlBase}/${archivoFinal}`;
      setArchivoVistaPrevia(fileUrl); // Almacena la URL del archivo para mostrarlo en el modal
    }
  };

  // Función para cerrar la vista previa
  const cerrarVistaPrevia = () => setArchivoVistaPrevia(null);

  // Función para cambiar el estado de la prórroga
  const cambiarEstado = (nuevoEstado: string) => {
    onEstadoCambiado(prorroga.id, nuevoEstado);
  };

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Prórroga</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {prorroga.id}</p>
          <p><strong>Nombre:</strong> {prorroga.user?.nombre || 'No disponible'}</p>
          <p><strong>Apellidos:</strong> {prorroga.user?.apellido1 || 'No disponible'} {prorroga.user?.apellido2 || ''}</p>
          <p><strong>Detalle:</strong> {prorroga.Detalle}</p>
          <p><strong>Estado:</strong> {prorroga?.status || 'Pendiente'}</p>
        </div>

        {/* Sección de Archivos Adjuntos */}
        <div className="detalle-archivos">
          <p><strong>Archivo Adjunto:</strong></p>
          {prorroga.ArchivoAdjunto ? (
            (() => {
              try {
                const archivos = JSON.parse(prorroga.ArchivoAdjunto);
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
        <h3>Enviar mensaje a: {prorroga.user?.email}</h3>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje aquí"
          rows={4}
          style={{ width: '100%' }}
        />
        <button onClick={enviarCorreo} className="btn-enviar">Enviar mensaje</button>
      </div>

      {/* Botones para cambiar el estado */}
      <div className="estado-botones">
        <button onClick={() => cambiarEstado('Aprobada')} className="boton-aprobar">Aprobar</button>
        <button onClick={() => cambiarEstado('Denegada')} className="boton-denegar">Denegar</button>
      </div>

      {/* Botón para volver a la lista */}
      <button className="volver-btn" onClick={onVolver}>Volver</button>
    </div>
  );
};

export default DetalleProrroga;
