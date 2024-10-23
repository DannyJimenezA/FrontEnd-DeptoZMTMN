import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { Prorroga } from '../Types/Types';

interface DetalleProrrogaProps {
  prorroga: Prorroga;
  onVolver: () => void;   // Función para volver a la lista de prórrogas
}

const DetalleProrroga: React.FC<DetalleProrrogaProps> = ({ prorroga, onVolver }) => {

  const manejarVerArchivo = (archivo: string) => {
    const archivoFinal = archivo.replace(/[\[\]"]/g, '');  // Limpiar si es necesario
    if (archivoFinal) {
      const fileUrl = `http://localhost:3000/${archivoFinal}`;
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Prórroga</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {prorroga.id}</p>
          <p><strong>Nombre:</strong> {prorroga.user?.nombre || 'No disponible'}</p>
          <p><strong>Apellidos:</strong> {prorroga.user?.apellido1 || 'No disponible'} {prorroga.user?.apellido2 || ''}</p>
          <p><strong>Estado:</strong> {prorroga.Status || 'Pendiente'}</p>
        </div>
        <div className="detalle-archivos">
          <p><strong>Archivo Adjunto:</strong></p>
          {prorroga.ArchivoAdjunto ? (
            JSON.parse(prorroga.ArchivoAdjunto).map((archivo: string, index: number) => (
              <FaFilePdf
                key={index}
                style={{ cursor: 'pointer', marginRight: '5px' }}
                onClick={() => manejarVerArchivo(archivo)}
                title={`Ver archivo ${index + 1}`}
              />
            ))
          ) : (
            "No disponible"
          )}
        </div>
      </div>

      {/* Botón para volver a la lista */}
      <button className="volver-btn" onClick={onVolver}>Volver a la lista de prórrogas</button>
    </div>
  );
};

export default DetalleProrroga;
