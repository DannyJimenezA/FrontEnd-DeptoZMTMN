import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { Concesion } from '../Types/Types';

interface DetalleConcesionProps {
  concesion: Concesion;
  onVolver: () => void; // Función para volver a la lista de concesiones
  onEstadoCambiado: (id: number, nuevoEstado: string) => void; // Función para cambiar el estado
}

const DetalleConcesion: React.FC<DetalleConcesionProps> = ({ concesion, onVolver, onEstadoCambiado }) => {

  // Manejar la visualización de los archivos adjuntos
  const manejarVerArchivo = (archivo: string) => {
    const archivoFinal = archivo.replace(/[\[\]"]/g, ''); // Limpiar si es necesario
    if (archivoFinal) {
      const fileUrl = `http://localhost:3000/${archivoFinal}`;
      window.open(fileUrl, '_blank');
    }
  };

  // Manejar el cambio de estado
  const manejarCambioEstado = (nuevoEstado: string) => {
    onEstadoCambiado(concesion.id, nuevoEstado); // Llamar la función del componente padre para cambiar el estado
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
          <p><strong>Estado:</strong> {concesion.Status || 'Pendiente'}</p>
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

      {/* Botones para cambiar el estado de la concesión */}
      <div className="estado-botones">
        <button className="btn-aprobar" onClick={() => manejarCambioEstado('aprobada')}>
          Aprobar Concesión
        </button>
        <button className="btn-denegar" onClick={() => manejarCambioEstado('denegada')}>
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
