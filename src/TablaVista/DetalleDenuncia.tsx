import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { Denuncia } from '../Types/Types';

interface DetalleDenunciaProps {
  denuncia: Denuncia;
  onVolver: () => void;
}

const DetalleDenuncia: React.FC<DetalleDenunciaProps> = ({ denuncia, onVolver }) => {

  // Manejador para eliminar la denuncia
  // const manejarEliminar = async () => {
  //   await eliminarEntidad<Denuncia>('denuncia', denuncia.id, () => {});
  //   onEliminar(denuncia.id); // Llamamos al callback para actualizar la lista de denuncias
  //   onVolver(); // Volver a la lista después de eliminar
  // };

  // Procesar los archivos de evidencia en caso de ser un string, un JSON o un array
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

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Denuncia</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {denuncia.id}</p>
          <p><strong>Nombre del Denunciante:</strong> {denuncia.nombreDenunciante || 'Anónimo'}</p>
          <p><strong>Cédula del Denunciante:</strong> {denuncia.cedulaDenunciante || 'Anónimo'}</p>
          <p><strong>Tipo de Denuncia:</strong> {denuncia.tipoDenuncia?.descripcion}</p>
          <p><strong>Descripción:</strong> {denuncia.descripcion}</p>
          <p><strong>Lugar de Denuncia:</strong> {denuncia.lugarDenuncia?.descripcion}</p>
          <p><strong>Ubicación:</strong> {denuncia.ubicacion}</p>
          <p><strong>Detalles de Evidencia:</strong> {denuncia.detallesEvidencia || 'No disponible'}</p>
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

      {/* Botón de Volver */}
      <button className="volver-btn" onClick={onVolver}>
        Volver a la lista de denuncias
      </button>

      {/* Botón de Eliminar
      <button className="eliminar-btn" onClick={manejarEliminar}>
        Eliminar Denuncia
      </button> */}
    </div>
  );
};

export default DetalleDenuncia;
