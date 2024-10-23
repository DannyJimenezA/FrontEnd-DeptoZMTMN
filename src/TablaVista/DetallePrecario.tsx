import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { Precario } from '../Types/Types'; // Asegúrate de importar correctamente la interfaz Precario

interface DetallePrecarioProps {
  precario: Precario;
  onVolver: () => void;   // Función para volver a la lista de uso precario
}

const DetallePrecario: React.FC<DetallePrecarioProps> = ({ precario, onVolver }) => {

  const manejarVerArchivo = (archivo: string) => {
    const archivoFinal = archivo.replace(/[\[\]"]/g, '');  // Limpiar si es necesario
    if (archivoFinal) {
      const fileUrl = `http://localhost:3000/${archivoFinal}`;
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
          <p><strong>Estado:</strong> {precario.Status || 'Pendiente'}</p>
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

      {/* Botón para volver a la lista */}
      <button className="volver-btn" onClick={onVolver}>Volver a la lista de uso precario</button>

    </div>
  );
};

export default DetallePrecario;
