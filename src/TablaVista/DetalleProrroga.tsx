import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Prorroga } from '../Types/Types';
import ApiRoutes from '../components/ApiRoutes';
import '../styles/DetalleSolicitud.css';

const MySwal = withReactContent(Swal);

interface DetalleProrrogaProps {
  prorroga: Prorroga;
  onVolver: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
}

const DetalleProrroga: React.FC<DetalleProrrogaProps> = ({ prorroga, onVolver, onEstadoCambiado }) => {
  const [mensaje, setMensaje] = useState<string>('');
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null);

  const enviarCorreo = async () => {
    if (!prorroga.user?.email || !mensaje) {
      alert('Por favor, asegúrate de que el usuario tiene un correo y escribe un mensaje.');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/mailer/send-custom-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: prorroga.user.email, message: mensaje }),
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

  const manejarVerArchivo = (archivo: string) => {
    const archivoFinal = archivo.replace(/[\[\]"]/g, '');
    if (archivoFinal) {
      const fileUrl = `${ApiRoutes.urlBase}/${archivoFinal}`;
      setArchivoVistaPrevia(fileUrl);
    }
  };

  const cerrarVistaPrevia = () => setArchivoVistaPrevia(null);

  const confirmarCambioEstado = async (nuevoEstado: string) => {
    const result = await MySwal.fire({
      title: `¿Estás seguro de ${nuevoEstado === 'Aprobada' ? 'aprobar' : 'denegar'} esta prórroga?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: false, // ✅ Aceptar a la izquierda, Cancelar a la derecha
      customClass: {
        confirmButton: 'btn-aceptar',
        cancelButton: 'btn-cancelar',
        actions: 'botones-horizontales'
      },
      buttonsStyling: false
    });
  
    if (result.isConfirmed) {
      onEstadoCambiado(prorroga.id, nuevoEstado);
    }
  };
  

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Prórroga</h3>
      <style>
{`
  .btn-aceptar {
    background-color: #16a34a !important;
    color: white !important;
    padding: 8px 20px;
    border: none;
    border-radius: 6px;
    font-weight: bold;
  }
  .btn-cancelar {
    background-color: #dc2626 !important;
    color: white !important;
    padding: 8px 20px;
    border: none;
    border-radius: 6px;
    font-weight: bold;
  }
  .botones-horizontales {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
`}
</style>

      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {prorroga.id}</p>
          <p><strong>Nombre:</strong> {prorroga.user?.nombre || 'No disponible'}</p>
          <p><strong>Apellidos:</strong> {prorroga.user?.apellido1 || 'No disponible'} {prorroga.user?.apellido2 || ''}</p>
          <p><strong>Detalle:</strong> {prorroga.Detalle}</p>
          <p><strong>Estado:</strong> {prorroga?.status || 'Pendiente'}</p>
        </div>

        <div className="detalle-archivos">
          <p><strong>Archivo Adjunto:</strong></p>
          {prorroga.ArchivoAdjunto ? (
            (() => {
              try {
                const archivos = JSON.parse(prorroga.ArchivoAdjunto);
                return archivos.map((archivo: string, index: number) => (
                  <FaFilePdf
                    key={index}
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => manejarVerArchivo(archivo)}
                    title={`Ver archivo ${index + 1}`}
                    size={20}
                  />
                ));
              } catch (error) {
                console.error('Error al parsear ArchivoAdjunto:', error);
                return <p>Error al cargar archivos</p>;
              }
            })()
          ) : (
            'No disponible'
          )}
        </div>
      </div>

      {/* {archivoVistaPrevia && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={cerrarVistaPrevia}>
              <FaTimes size={20} />
            </button>
            <iframe src={archivoVistaPrevia} title="Vista Previa" className="pdf-viewer"></iframe>
          </div>
        </div>
      )} */}
{archivoVistaPrevia && (
  <div
    className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
    onClick={cerrarVistaPrevia}
  >
    <div
      className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden"
      onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro del visor
    >
      <iframe
        src={archivoVistaPrevia}
        className="w-full h-full"
        style={{ border: 'none' }}
        title="Vista previa del archivo PDF"
      />
    </div>
  </div>
)}

      <div className="mensaje-container">
        <h3>Enviar mensaje a: {prorroga.user?.email}</h3>
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

export default DetalleProrroga;
