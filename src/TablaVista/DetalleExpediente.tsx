import React, { useState } from 'react';
import { CopiaExpediente } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import  '../styles/DetalleSolicitud.css'
interface DetalleExpedienteProps {
  expediente: CopiaExpediente;
  onVolver: () => void;  // Función para volver a la lista de expedientes
  onEstadoCambiado: (id: number, nuevoEstado: string) => void; // Función para cambiar el estado
}

const DetalleExpediente: React.FC<DetalleExpedienteProps> = ({ expediente, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>(''); // Estado para almacenar el mensaje personalizado

  // Función para enviar el correo al usuario que solicitó el expediente
  const enviarCorreo = async () => {
    if (!expediente.user?.email || !mensaje) {
      alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: expediente.user.email, message: mensaje }),
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


  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    nuevoEstado: string;
  } | null>(null);

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Solicitud de Expediente</h3>
      <div className="detalle-contenido">
        {/* Información general del expediente */}
        <div className="detalle-info">
          <p><strong>ID Expediente:</strong> {expediente.idExpediente}</p>
          <p><strong>Nombre Solicitante:</strong> {expediente.nombreSolicitante}</p>
          <p><strong>Teléfono Solicitante:</strong> {expediente.telefonoSolicitante}</p>
          <p><strong>Medio de Notificación:</strong> {expediente.medioNotificacion}</p>
          <p><strong>Número de Expediente:</strong> {expediente.numeroExpediente}</p>
          <p><strong>Copia Certificada:</strong> {expediente.copiaCertificada ? 'Sí' : 'No'}</p>
          <p><strong>Estado:</strong> {expediente.status || 'Pendiente'}</p>
        </div>
      </div>

      {/* Sección para enviar el mensaje */}
      <div className="mensaje-container">
        <h3>Enviar mensaje a: {expediente.user?.email}</h3>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje aquí"
          rows={4}
          style={{ width: '100%' }}
        />
        <button onClick={enviarCorreo} className="btn-enviar">Enviar mensaje</button>
      </div>

      {/* Botones de aprobar/denegar con confirmación */}
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

      {/* Volver */}
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
                  onEstadoCambiado(expediente.idExpediente, confirmModal.nuevoEstado);
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

export default DetalleExpediente;
