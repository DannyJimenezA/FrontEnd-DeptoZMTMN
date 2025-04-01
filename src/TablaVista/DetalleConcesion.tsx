import React, { useState } from 'react';
import { FaFilePdf, FaTimes } from 'react-icons/fa';
import { Concesion } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import AlertNotification from '../components/AlertNotificationP';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../styles/DetalleSolicitud.css';

const MySwal = withReactContent(Swal);

interface DetalleConcesionProps {
  concesion: Concesion;
  onVolver: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
}

const DetalleConcesion: React.FC<DetalleConcesionProps> = ({ concesion, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>('');
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null);
  const [customAlert, setCustomAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const manejarVerArchivo = (archivo: string) => {
    const archivoFinal = archivo.replace(/[\[\]"]/g, '');
    if (archivoFinal) {
      const fileUrl = `${ApiRoutes.urlBase}/${archivoFinal}`;
      setArchivoVistaPrevia(fileUrl);
    }
  };

  const cerrarVistaPrevia = () => setArchivoVistaPrevia(null);

  const enviarCorreo = async () => {
    if (!concesion.user?.email || !mensaje) {
      setCustomAlert({ type: 'error', message: 'Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.' });
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: concesion.user.email, message: mensaje }),
      });

      const result = await response.json();
      if (result.success) {
        setCustomAlert({ type: 'success', message: 'Mensaje enviado exitosamente.' });
        setMensaje('');
      } else {
        setCustomAlert({ type: 'error', message: 'Error al enviar el mensaje.' });
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      setCustomAlert({ type: 'error', message: 'Hubo un error al intentar enviar el mensaje.' });
    }
  };

  const confirmarCambioEstado = async (nuevoEstado: string) => {
    const result = await MySwal.fire({
      title: `¿Estás seguro de ${nuevoEstado === 'Aprobada' ? 'aprobar' : 'denegar'} esta solicitud?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn-verde',
        cancelButton: 'btn-rojo',
        actions: 'botones-horizontales',
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      onEstadoCambiado(concesion.id, nuevoEstado);
    }
  };

  return (
    <div className="detalle-tabla">
      <style>{`
        .btn-verde {
          background-color: #16a34a !important;
          color: white !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 8px 20px !important;
          font-weight: bold !important;
        }
        .btn-rojo {
          background-color: #dc2626 !important;
          color: white !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 8px 20px !important;
          font-weight: bold !important;
        }
        .botones-horizontales {
          display: flex !important;
          justify-content: center;
          gap: 10px;
        }
      `}</style>

      <h3>Detalles de la Concesión</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {concesion.id}</p>
          <p><strong>Nombre:</strong> {concesion.user?.nombre}</p>
          <p><strong>Apellidos:</strong> {concesion.user?.apellido1 || 'No disponible'} {concesion.user?.apellido2 || ''}</p>
          <p><strong>Cédula:</strong> {concesion.user?.cedula}</p>
          <p><strong>Detalle:</strong> {concesion.Detalle}</p>
          <p><strong>Estado:</strong> {concesion.status || 'Pendiente'}</p>
        </div>

        <div className="detalle-archivos">
          <p><strong>Archivo Adjunto:</strong></p>
          {concesion.ArchivoAdjunto ? (
            JSON.parse(concesion.ArchivoAdjunto).map((archivo: string, index: number) => (
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
        <h3>Enviar mensaje a: {concesion.user?.email}</h3>
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
          style={{ backgroundColor: '#16a34a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px' }}
        >
          Aprobar
        </button>
        <button
          onClick={() => confirmarCambioEstado('Denegada')}
          style={{ backgroundColor: '#dc2626', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px' }}
        >
          Denegar
        </button>
      </div>

      <button className="volver-btn" onClick={onVolver}>Volver</button>

      {customAlert && (
        <AlertNotification
          type={customAlert.type}
          message={customAlert.message}
          onClose={() => setCustomAlert(null)}
        />
      )}
    </div>
  );
};

export default DetalleConcesion;
