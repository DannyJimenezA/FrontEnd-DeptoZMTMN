import React, { useState } from 'react';
import { Cita } from '../Types/Types';
import CambiarEstadoCita from '../components/CambioEstado'; // Importar el nuevo componente
import ApiRoutes from '../components/ApiRoutes';
import  '../styles/DetalleSolicitud.css'
interface DetalleCitaProps {
  cita: Cita;
  onVolver: () => void;  // Función para volver a la lista de citas
  onEstadoCambiado: (id: number, nuevoEstado: string) => void; // Función para manejar el cambio de estado en el padre
}

const DetalleCita: React.FC<DetalleCitaProps> = ({ cita, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>(''); // Estado para almacenar el mensaje personalizado

  // Función para enviar el correo al usuario de la cita
  const enviarCorreo = async () => {
    if (!cita.user?.email || !mensaje) {
      alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cita.user.email, message: mensaje }),
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

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Cita</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID Cita:</strong> {cita.id}</p>
          <p><strong>Nombre:</strong> {cita.user?.nombre}</p>
          <p><strong>Cédula:</strong> {cita.user?.cedula}</p>
          <p><strong>Fecha:</strong> {new Date(cita.date).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {cita.time}</p>
          <p><strong>Estado:</strong> {cita.status || 'Pendiente'}</p>
        </div>
      </div>

      {/* Sección para enviar mensaje */}
      <div className="mensaje-container">
        <h3>Enviar mensaje a: {cita.user?.email}</h3>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje aquí"
          rows={4}
        />
        <button onClick={enviarCorreo} className="btn-enviar">Enviar mensaje</button>
      </div>

      {/* Botones de acción */}
      <div className="estado-botones">
        <CambiarEstadoCita
          id={cita.id}
          nuevoEstado="Aprobada"
          onEstadoCambiado={onEstadoCambiado}
          label="Aprobar"
          className="boton-aprobar"
        />
        <CambiarEstadoCita
          id={cita.id}
          nuevoEstado="Denegada"
          onEstadoCambiado={onEstadoCambiado}
          label="Denegar"
          className="boton-denegar"
        />
      </div>

      {/* Botón de volver */}
      <button className="volver-btn" onClick={onVolver}>
        Volver
      </button>
    </div>
  );
};

export default DetalleCita;
