import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { Precario } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';

interface DetallePrecarioProps {
  precario: Precario;
  onVolver: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
}

const DetallePrecario: React.FC<DetallePrecarioProps> = ({ precario, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>('');
  const [estado, setEstado] = useState<string>(precario.Status || 'Pendiente'); // Estado local para el status

  const enviarCorreo = async () => {
    if (!precario.user?.email || !mensaje) {
      alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
      return;
    }
    try {
      const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const manejarCambioEstado = (nuevoEstado: string) => {
    onEstadoCambiado(precario.id, nuevoEstado);
    setEstado(nuevoEstado); // Actualiza el estado localmente para reflejar el cambio
  };

  const manejarVerArchivo = (archivo: string) => {
    const archivoFinal = archivo.replace(/[\[\]"]/g, '');
    if (archivoFinal) {
      const fileUrl = `${ApiRoutes.urlBase}/${archivoFinal}`;
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="detalle-tabla">
      <h3>Detalles del Uso Precario</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {precario.id}</p>
          <p><strong>Nombre:</strong> {precario.user?.nombre}</p>
          <p><strong>Apellidos:</strong> {precario.user?.apellido1}</p>
          <p><strong>Cédula:</strong> {precario.user?.cedula}</p>
          <p><strong>Estado:</strong> {estado}</p> {/* Muestra el estado actualizado */}
        </div>

        <div className="detalle-archivos">
          <p><strong>Archivos Adjuntos:</strong></p>
          {precario.ArchivoAdjunto ? (
            JSON.parse(precario.ArchivoAdjunto).map((archivo: string, index: number) => (
              <FaFilePdf
                key={index}
                style={{ cursor: 'pointer', marginRight: '5px' }}
                onClick={() => manejarVerArchivo(archivo)}
                title="Ver archivo"
              />
            ))
          ) : (
            "No disponible"
          )}
        </div>
      </div>

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

      <div className="estado-botones">
        <button className="btn-aprobar" onClick={() => manejarCambioEstado('Aprobada')}>
          Aprobar Uso Precario
        </button>
        <button className="btn-denegar" onClick={() => manejarCambioEstado('Denegada')}>
          Denegar Uso Precario
        </button>
      </div>

      <button className="volver-btn" onClick={onVolver}>Volver a la lista de uso precario</button>
    </div>
  );
};

export default DetallePrecario;
