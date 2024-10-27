import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { RevisionPlano } from '../Types/Types';

interface DetalleRevisionPlanoProps {
  revisionPlano: RevisionPlano;
  onVolver: () => void;                   // Función para volver a la lista de revisiones
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;  // Función para cambiar el estado
}

const DetalleRevisionPlano: React.FC<DetalleRevisionPlanoProps> = ({ revisionPlano, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>(''); // Estado para almacenar el mensaje personalizado

  // Función para enviar el correo al usuario que solicitó la revisión del plano
  const enviarCorreo = async () => {
    if (!revisionPlano.user?.email || !mensaje) {
      alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/mailer/send-custom-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: revisionPlano.user.email, message: mensaje }),
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

  const manejarVerArchivo = (archivo: { nombre: string; ruta: string }) => {
    if (archivo && archivo.ruta) {
      const fileUrl = `http://localhost:3000/${archivo.ruta.replace(/\\/g, '/')}`;
      window.open(fileUrl, '_blank');
    } else {
      console.error('El archivo no tiene una ruta válida:', archivo);
    }
  };

  const cambiarEstado = (nuevoEstado: string) => {
    onEstadoCambiado(revisionPlano.id, nuevoEstado);
  };

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Revisión de Plano</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID Revisión:</strong> {revisionPlano.id}</p>
          <p><strong>Número de Expediente:</strong> {revisionPlano.NumeroExpediente}</p>
          <p><strong>Número de Plano:</strong> {revisionPlano.NumeroPlano}</p>
          <p><strong>Nombre del Solicitante:</strong> {revisionPlano.user?.nombre}</p>
          <p><strong>Apellidos del Solicitante:</strong> {revisionPlano.user?.apellido1} {revisionPlano.user?.apellido2}</p>
          <p><strong>Estado:</strong> {revisionPlano.status || 'Pendiente'}</p>
        </div>
        <div className="detalle-archivos">
          <p><strong>Archivos Adjuntos:</strong></p>
          {revisionPlano.ArchivosAdjuntos && Array.isArray(revisionPlano.ArchivosAdjuntos) ? (
            revisionPlano.ArchivosAdjuntos.map((archivo, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <FaFilePdf
                  style={{ cursor: 'pointer', marginRight: '5px' }}
                  onClick={() => manejarVerArchivo(archivo)}
                  title={`Ver archivo ${archivo.nombre}`}
                />
                <span>{archivo.nombre}</span>
              </div>
            ))
          ) : (
            "No disponible"
          )}
        </div>
      </div>

      {/* Sección para enviar el mensaje */}
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

      {/* Botones para cambiar el estado */}
      <div className="estado-botones">
        <button onClick={() => cambiarEstado('Aprobado')} className="estado-aprobado-btn">Aprobar</button>
        <button onClick={() => cambiarEstado('Denegado')} className="estado-denegado-btn">Denegar</button>
      </div>

      {/* Botón para volver a la lista */}
      <button className="volver-btn" onClick={onVolver}>Volver a la lista de revisiones</button>
    </div>
  );
};

export default DetalleRevisionPlano;
