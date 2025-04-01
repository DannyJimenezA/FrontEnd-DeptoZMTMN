import React, { useState } from 'react';
import { Cita } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../styles/DetalleSolicitud.css';

interface DetalleCitaProps {
  cita: Cita;
  onVolver: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
}

const MySwal = withReactContent(Swal);

const DetalleCita: React.FC<DetalleCitaProps> = ({ cita, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>('');

  const enviarCorreo = async () => {
    if (!cita.user?.email || !mensaje) {
      alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cita.user.email, message: mensaje }),
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

  const confirmarCambioEstado = async (nuevoEstado: string) => {
    const result = await MySwal.fire({
      title: `¿Estás seguro de ${nuevoEstado === 'Aprobada' ? 'aprobar' : 'denegar'} esta cita?`,
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
      onEstadoCambiado(cita.id, nuevoEstado);
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

      <h3>Detalles de la Cita</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID Cita:</strong> {cita.id}</p>
          <p><strong>Nombre:</strong> {cita.user?.nombre}</p>
          <p><strong>Cédula:</strong> {cita.user?.cedula}</p>
          <p><strong>Fecha:</strong> {new Date(cita.availableDate.date).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {cita.horaCita.hora}</p>
          <p><strong>Descripcion:</strong> {cita.description}</p>
          <p><strong>Estado:</strong> {cita.status || 'Pendiente'}</p>
        </div>
      </div>

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

      <div className="estado-botones">
        <button
          onClick={() => confirmarCambioEstado('Aprobada')}
          className="boton-aprobar"
        >
          Aprobar
        </button>
        <button
          onClick={() => confirmarCambioEstado('Denegada')}
          className="boton-denegar"
        >
          Denegar
        </button>
      </div>

      <button className="volver-btn" onClick={onVolver}>
        Volver
      </button>
    </div>
  );
};

export default DetalleCita;
