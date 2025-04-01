// import React, { useState } from 'react';
// import { FaFilePdf } from 'react-icons/fa';
// import { RevisionPlano } from '../Types/Types';
// import ApiRoutes from '../components/ApiRoutes';

// interface DetalleRevisionPlanoProps {
//   revisionPlano: RevisionPlano;
//   onVolver: () => void;                   // Función para volver a la lista de revisiones
//   onEstadoCambiado: (id: number, nuevoEstado: string) => void;  // Función para cambiar el estado
// }

// const DetalleRevisionPlano: React.FC<DetalleRevisionPlanoProps> = ({ revisionPlano, onVolver, onEstadoCambiado }) => {
//   const [mensaje, setMensaje] = useState<string>(''); // Estado para almacenar el mensaje personalizado

//   // Función para enviar el correo al usuario que solicitó la revisión del plano
//   const enviarCorreo = async () => {
//     if (!revisionPlano.user?.email || !mensaje) {
//       alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
//       return;
//     }

//     try {
//       const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: revisionPlano.user.email, message: mensaje }),
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

//   const manejarVerArchivo = (archivo: { nombre: string; ruta: string }) => {
//     if (archivo && archivo.ruta) {
//       const fileUrl = `${ApiRoutes.urlBase}/${archivo.ruta.replace(/\\/g, '/')}`;
//       window.open(fileUrl, '_blank');
//     } else {
//       console.error('El archivo no tiene una ruta válida:', archivo);
//     }
//   };

//   const cambiarEstado = (nuevoEstado: string) => {
//     onEstadoCambiado(revisionPlano.id, nuevoEstado);
//   };

//   return (
//     <div className="detalle-tabla">
//       <h3>Detalles de la Revisión de Plano</h3>
//       <div className="detalle-contenido">
//         <div className="detalle-info">
//           <p><strong>ID Revisión:</strong> {revisionPlano.id}</p>
//           <p><strong>Número de Expediente:</strong> {revisionPlano.NumeroExpediente}</p>
//           <p><strong>Número de Plano:</strong> {revisionPlano.NumeroPlano}</p>
//           <p><strong>Nombre del Solicitante:</strong> {revisionPlano.user?.nombre}</p>
//           <p><strong>Apellidos del Solicitante:</strong> {revisionPlano.user?.apellido1} {revisionPlano.user?.apellido2}</p>
//           <p><strong>Estado:</strong> {revisionPlano.status || 'Pendiente'}</p>
//         </div>
//         <div className="detalle-archivos">
//           <p><strong>Archivos Adjuntos:</strong></p>
//           {revisionPlano.ArchivosAdjuntos && Array.isArray(revisionPlano.ArchivosAdjuntos) ? (
//             revisionPlano.ArchivosAdjuntos.map((archivo, index) => (
//               <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
//                 <FaFilePdf
//                   style={{ cursor: 'pointer', marginRight: '5px' }}
//                   onClick={() => manejarVerArchivo(archivo)}
//                   title={`Ver archivo ${archivo.nombre}`}
//                 />
//                 <span>{archivo.nombre}</span>
//               </div>
//             ))
//           ) : (
//             "No disponible"
//           )}
//         </div>
//       </div>

//       {/* Sección para enviar el mensaje */}
//       <div className="mensaje-container">
//         <h3>Enviar mensaje a: {revisionPlano.user?.email}</h3>
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

// export default DetalleRevisionPlano;
import React, { useState } from 'react';
import { FaFilePdf, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { RevisionPlano } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import '../styles/DetalleSolicitud.css';

const MySwal = withReactContent(Swal);

interface DetalleRevisionPlanoProps {
  revisionPlano: RevisionPlano;
  onVolver: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
}

const DetalleRevisionPlano: React.FC<DetalleRevisionPlanoProps> = ({ revisionPlano, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>('');
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null);

  const enviarCorreo = async () => {
    if (!revisionPlano.user?.email || !mensaje) {
      alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: revisionPlano.user.email, message: mensaje }),
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

  const manejarVerArchivo = (archivo: { nombre: string; ruta: string }) => {
    if (archivo && archivo.ruta) {
      const fileUrl = `${ApiRoutes.urlBase}/${archivo.ruta.replace(/\\/g, '/')}`;
      setArchivoVistaPrevia(fileUrl);
    } else {
      console.error('El archivo no tiene una ruta válida:', archivo);
    }
  };

  const cerrarVistaPrevia = () => setArchivoVistaPrevia(null);

  const confirmarCambioEstado = async (nuevoEstado: string) => {
    const result = await MySwal.fire({
      title: `¿Estás seguro de ${nuevoEstado === 'Aprobada' ? 'aprobar' : 'denegar'} esta revisión?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: false,
      customClass: {
        confirmButton: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700',
        cancelButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2',
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      onEstadoCambiado(revisionPlano.id, nuevoEstado);
    }
  };

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Revisión de Plano</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID Revisión:</strong> {revisionPlano.id}</p>
          <p><strong>Número de Expediente:</strong> {revisionPlano.NumeroExpediente}</p>
          <p><strong>Número de Plano:</strong> {revisionPlano.NumeroPlano}</p>
          <p><strong>Nombre:</strong> {revisionPlano.user?.nombre || 'No disponible'}</p>
          <p><strong>Apellidos:</strong> {revisionPlano.user?.apellido1 || 'No disponible'} {revisionPlano.user?.apellido2 || ''}</p>
          <p><strong>Comentario:</strong> {revisionPlano.Comentario}</p>
          <p><strong>Estado:</strong> {revisionPlano.status || 'Pendiente'}</p>
        </div>

        <div className="detalle-archivos">
          <p><strong>Archivos Adjuntos:</strong></p>
          {revisionPlano.ArchivosAdjuntos && Array.isArray(revisionPlano.ArchivosAdjuntos) ? (
            revisionPlano.ArchivosAdjuntos.map((archivo, index) => (
              <FaFilePdf
                key={index}
                style={{ cursor: 'pointer', marginRight: '5px' }}
                onClick={() => manejarVerArchivo(archivo)}
                title="Ver archivo"
                size={20}
              />
            ))
          ) : (
            'No disponible'
          )}
        </div>
      </div>

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

      <div className="mensaje-container">
        <h3>Enviar mensaje a: {revisionPlano.user?.email}</h3>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje aquí"
          rows={4}
          style={{ width: '100%' }}
        />
        <button onClick={enviarCorreo} className="btn-enviar">Enviar mensaje</button>
      </div>

      <div className="estado-botones" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => confirmarCambioEstado('Aprobada')}
          style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px' }}
        >
          Aprobar
        </button>
        <button
          onClick={() => confirmarCambioEstado('Denegada')}
          style={{ backgroundColor: '#f44336', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px' }}
        >
          Denegar
        </button>
      </div>

      <button className="volver-btn" onClick={onVolver}>Volver</button>
    </div>
  );
};

export default DetalleRevisionPlano;
