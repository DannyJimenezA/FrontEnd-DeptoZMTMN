import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { Precario } from '../Types/Types'; // Asegúrate de importar correctamente la interfaz Precario

interface DetallePrecarioProps {
  precario: Precario;
  onVolver: () => void;   // Función para volver a la lista de uso precario
  onEstadoCambiado: (id: number, nuevoEstado: string) => void; // Función para manejar el cambio de estado
}

const DetallePrecario: React.FC<DetallePrecarioProps> = ({ precario, onVolver, onEstadoCambiado }) => {

  // Función para manejar el cambio de estado
  const manejarCambioEstado = (nuevoEstado: string) => {
    onEstadoCambiado(precario.id, nuevoEstado); // Llamar a la función del componente padre para cambiar el estado
  };


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

      {/* Botones para cambiar el estado del uso precario */}
      <div className="estado-botones">
        <button className="btn-aprobar" onClick={() => manejarCambioEstado('aprobada')}>
          Aprobar Uso Precario
        </button>
        <button className="btn-denegar" onClick={() => manejarCambioEstado('denegada')}>
          Denegar Uso Precario
        </button>
      </div>

      {/* Botón para volver a la lista */}
      <button className="volver-btn" onClick={onVolver}>Volver a la lista de uso precario</button>
    </div>
  );
};

export default DetallePrecario;
