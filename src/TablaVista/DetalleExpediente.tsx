import React from 'react';
import { CopiaExpediente } from '../Types/Types';  // Importa la interfaz si está en un archivo separado

interface DetalleExpedienteProps {
  expediente: CopiaExpediente;
  onVolver: () => void;  // Función para volver a la lista de expedientes
}

const DetalleExpediente: React.FC<DetalleExpedienteProps> = ({ expediente, onVolver }) => {
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

      {/* Botón para volver a la lista de expedientes */}
      <button className="volver-btn" onClick={onVolver}>Volver a la lista de expedientes</button>
    </div>
  );
};

export default DetalleExpediente;
