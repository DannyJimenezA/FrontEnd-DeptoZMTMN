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
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Precario } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import '../styles/DetalleSolicitud.css';

const MySwal = withReactContent(Swal);

interface DetallePrecarioProps {
  precario: Precario;
  onVolver: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
}

const DetallePrecario: React.FC<DetallePrecarioProps> = ({ precario, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>('');
  const [estado, setEstado] = useState<string>(precario.status || 'Pendiente');
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null);

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

  const manejarVerArchivo = (archivo: string) => {
    const archivoFinal = archivo.replace(/[\[\]"]/g, '');
    if (archivoFinal) {
      const fileUrl = `${ApiRoutes.urlBase}/${archivoFinal}`;
      setArchivoVistaPrevia(fileUrl);
    }
  };

  const cerrarVistaPrevia = () => setArchivoVistaPrevia(null);

  const confirmarCambioEstado = async (nuevoEstado: string) => {
    const result = await MySwal.fire({
      title: `¿Estás seguro de ${nuevoEstado === 'Aprobada' ? 'aprobar' : 'denegar'} esta solicitud?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: false,
      customClass: {
        confirmButton: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700',
        cancelButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2',
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      onEstadoCambiado(precario.id, nuevoEstado);
      setEstado(nuevoEstado);
    }
  };

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

      <div className="estado-botones" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => confirmarCambioEstado('Aprobada')}
          style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px' }}
        >
          Aprobar
        </button>
        <button
          onClick={() => confirmarCambioEstado('Denegada')}
          style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px' }}
        >
          Denegar
        </button>
      </div>

      <button className="volver-btn" onClick={onVolver}>Volver</button>
    </div>
  );
};

export default DetallePrecario;
