import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { CopiaExpediente } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import '../styles/DetalleSolicitud.css';

const MySwal = withReactContent(Swal);

interface DetalleExpedienteProps {
  expediente: CopiaExpediente;
  onVolver: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
}

const DetalleExpediente: React.FC<DetalleExpedienteProps> = ({ expediente, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>('');

  const enviarCorreo = async () => {
    if (!expediente.user?.email || !mensaje) {
      alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: expediente.user.email, message: mensaje }),
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
      title: `¿Estás seguro de ${nuevoEstado === 'Aprobada' ? 'aprobar' : 'denegar'} esta solicitud?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: false,
      customClass: {
        confirmButton: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700',
        cancelButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      onEstadoCambiado(expediente.idExpediente, nuevoEstado);
    }
  };

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Solicitud de Expediente</h3>
      <div className="detalle-contenido">
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

      <div className="estado-botones" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => confirmarCambioEstado('Aprobada')}
          style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px' }}
        >
          Aprobar
        </button>
        <button
          onClick={() => confirmarCambioEstado('Denegada')}
          style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px' }}
        >
          Denegar
        </button>
      </div>

      <button className="volver-btn" onClick={onVolver}>Volver</button>
    </div>
  );
};

export default DetalleExpediente;
