import React, { useState } from 'react';
import { CopiaExpediente } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';

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

  // Función para manejar el cambio de estado
  const manejarCambioEstado = (nuevoEstado: string) => {
    onEstadoCambiado(expediente.idExpediente, nuevoEstado); // Llamar a la función del componente padre para cambiar el estado
  };

  return (
    <div className="detalle-expediente">
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

      {/* Botones para cambiar el estado del expediente */}
      <div className="estado-botones">
        <button className="btn-aprobar" onClick={() => manejarCambioEstado('Aprobada')}>
          Aprobar Expediente
        </button>
        <button className="btn-denegar" onClick={() => manejarCambioEstado('Denegada')}>
          Denegar Expediente
        </button>
      </div>

      {/* Botón para volver a la lista de expedientes */}
      <button className="volver-btn" onClick={onVolver}>
        Volver a la lista de expedientes
      </button>
    </div>
  );
};

export default DetalleExpediente;
