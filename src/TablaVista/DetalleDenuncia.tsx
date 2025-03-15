import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { Denuncia } from '../Types/Types';
import  '../styles/DetalleSolicitud.css'
interface DetalleDenunciaProps {
  denuncia: Denuncia;
  onVolver: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
}

const DetalleDenuncia: React.FC<DetalleDenunciaProps> = ({ denuncia, onVolver, onEstadoCambiado }) => {

  const cambiarEstado = (nuevoEstado: string) => {
    onEstadoCambiado(denuncia.id, nuevoEstado);
  };
  const procesarArchivos = (archivosEvidencia: string | string[] | undefined) => {
    let archivos: string[] = [];

    if (archivosEvidencia) {
      if (Array.isArray(archivosEvidencia)) {
        archivos = archivosEvidencia;
      } else {
        try {
          archivos = JSON.parse(archivosEvidencia);
        } catch (error) {
          archivos = archivosEvidencia.includes(',')
            ? archivosEvidencia.split(',')
            : [archivosEvidencia];
        }
      }
    }

    return archivos;
  };

  const archivosProcesados = procesarArchivos(denuncia.archivosEvidencia);

  // const manejarCambioEstado = (nuevoEstado: string) => {
  //   onEstadoCambiado(denuncia.id, nuevoEstado); // Llamar la función del componente padre para cambiar el estado
  // };

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Denuncia</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {denuncia.id}</p>
          <p><strong>Fecha de Creacion:</strong> {denuncia.Date}</p>
          <p><strong>Nombre del Denunciante:</strong> {denuncia.nombreDenunciante || 'Anónimo'}</p>
          <p><strong>Cédula del Denunciante:</strong> {denuncia.cedulaDenunciante || 'Anónimo'}</p>
          <p><strong>Metodo de Notificacion:</strong> {denuncia.metodoNotificacion || 'No especificado'}</p>
          <p><strong>Medio de Notificacion:</strong> {denuncia.medioNotificacion || 'No especificado'}</p>
          <p><strong>Tipo de Denuncia:</strong> {denuncia.tipoDenuncia?.descripcion}</p>
          <p><strong>Descripción:</strong> {denuncia.descripcion}</p>
          <p><strong>Lugar de Denuncia:</strong> {denuncia.lugarDenuncia?.descripcion}</p>
          <p><strong>Ubicación Exacta:</strong> {denuncia.ubicacion}</p>
          <p><strong>Detalles de Evidencia:</strong> {denuncia.detallesEvidencia || 'No disponible'}</p>
          <p><strong>Estado</strong> {denuncia.status}</p>
        </div>
        <div className="detalle-archivos">
          <p><strong>Archivos de Evidencia:</strong></p>
          {archivosProcesados.length > 0 ? (
            archivosProcesados.map((archivo, index) => (
              <FaFilePdf
                key={index}
                style={{ cursor: 'pointer', marginRight: '5px' }}
                onClick={() => window.open(archivo, '_blank')}
                title={`Ver archivo ${index + 1}`}
              />
            ))
          ) : (
            'No disponible'
          )}
        </div>
      </div>

      <div className="estado-botones">
        <button className="boton-aprobar" onClick={() => cambiarEstado('Aprobada')}>
          Aprobar
        </button>
        <button className="boton-denegar" onClick={() => cambiarEstado('Denegada')}>
          Denegar
        </button>
      </div>

      {/* Botón de Volver */}
      <button className="volver-btn" onClick={onVolver}>
        Volver
      </button>


    </div>
  );
};

export default DetalleDenuncia;
