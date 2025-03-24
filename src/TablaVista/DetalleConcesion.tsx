import React, { useState } from 'react';
import { FaFilePdf, FaTimes } from 'react-icons/fa';
import { Concesion } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import AlertNotification from '../components/AlertNotificationP';
import '../styles/DetalleSolicitud.css';

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
      setCustomAlert({
        type: 'error',
        message: 'Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.',
      });
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
        setCustomAlert({
          type: 'success',
          message: 'Mensaje enviado exitosamente.',
        });
        setMensaje('');
      } else {
        setCustomAlert({
          type: 'error',
          message: 'Error al enviar el mensaje.',
        });
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      setCustomAlert({
        type: 'error',
        message: 'Hubo un error al intentar enviar el mensaje.',
      });
    }
  };

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    nuevoEstado: string;
  } | null>(null);
  

  return (
    <div className="detalle-tabla">
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

      {/* Modal de vista previa */}
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

      {/* Botones Aprobar/Denegar con modal */}
      <div className="estado-botones" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setConfirmModal({ visible: true, nuevoEstado: 'Aprobada' })}
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          Aprobar
        </button>
        <button
          onClick={() => setConfirmModal({ visible: true, nuevoEstado: 'Denegada' })}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          Denegar
        </button>
      </div>

      <button className="volver-btn" onClick={onVolver}>
        Volver
      </button>

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
                  onEstadoCambiado(concesion.id, confirmModal.nuevoEstado);
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

      {/* ✅ Alerta visual personalizada */}
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
