import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { Concesion } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';

interface DetalleConcesionProps {
  concesion: Concesion;
  onVolver: () => void; // Función para volver a la lista de concesiones
  onEstadoCambiado: (id: number, nuevoEstado: string) => void; // Función para cambiar el estado
}

const DetalleConcesion: React.FC<DetalleConcesionProps> = ({ concesion, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>(''); // Estado para almacenar el mensaje personalizado

  // Función para ver el archivo adjunto
  const manejarVerArchivo = (archivo: string) => {
    const archivoFinal = archivo.replace(/[\[\]"]/g, '');
    if (archivoFinal) {
      const fileUrl = `${ApiRoutes.urlBase}/${archivoFinal}`;
      window.open(fileUrl, '_blank');
    }
  };

  // Función para enviar el correo al usuario de la concesión
  const enviarCorreo = async () => {
    if (!concesion.user?.email || !mensaje) {
      alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: concesion.user.email, message: mensaje }),
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

  // Manejar el cambio de estado
  const manejarCambioEstado = (nuevoEstado: string) => {
    onEstadoCambiado(concesion.id, nuevoEstado);
  };

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Concesión</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {concesion.id}</p>
          <p><strong>Nombre:</strong> {concesion.user?.nombre}</p>
          <p><strong>Apellidos:</strong> {concesion.user?.apellido1}</p>
          <p><strong>Cédula:</strong> {concesion.user?.cedula}</p>
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
              />
            ))
          ) : (
            'No disponible'
          )}
        </div>
      </div>

      {/* Sección para enviar el mensaje */}
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

      {/* Botones para cambiar el estado de la concesión */}
      <div className="estado-botones">
        <button className="btn-aprobar" onClick={() => manejarCambioEstado('Aprobada')}>
          Aprobar Concesión
        </button>
        <button className="btn-denegar" onClick={() => manejarCambioEstado('Denegada')}>
          Denegar Concesión
        </button>
      </div>

      {/* Botón para volver a la lista */}
      <button className="volver-btn" onClick={onVolver}>
        Volver a la lista de concesiones
      </button>
    </div>
  );
};

export default DetalleConcesion;
