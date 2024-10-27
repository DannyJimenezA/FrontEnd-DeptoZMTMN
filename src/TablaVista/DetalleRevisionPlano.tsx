import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { RevisionPlano } from '../Types/Types';

interface DetalleRevisionPlanoProps {
  revisionPlano: RevisionPlano;
  onVolver: () => void;                   // Función para volver a la lista de revisiones
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;  // Función para cambiar el estado
}

const DetalleRevisionPlano: React.FC<DetalleRevisionPlanoProps> = ({ revisionPlano, onVolver, onEstadoCambiado }) => {

  const manejarVerArchivo = (archivo: { nombre: string; ruta: string }) => {
    if (archivo && archivo.ruta) {
      const fileUrl = `http://localhost:3000/${archivo.ruta.replace(/\\/g, '/')}`;  // Asegúrate de reemplazar las barras invertidas
      window.open(fileUrl, '_blank');
    } else {
      console.error('El archivo no tiene una ruta válida:', archivo);
    }
  };

  const cambiarEstado = (nuevoEstado: string) => {
    onEstadoCambiado(revisionPlano.id, nuevoEstado);
  };

  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Revisión de Plano</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID Revisión:</strong> {revisionPlano.id}</p>
          <p><strong>Número de Expediente:</strong> {revisionPlano.NumeroExpediente}</p>
          <p><strong>Número de Plano:</strong> {revisionPlano.NumeroPlano}</p>
          <p><strong>Nombre del Solicitante:</strong> {revisionPlano.user?.nombre}</p>
          <p><strong>Apellidos del Solicitante:</strong> {revisionPlano.user?.apellido1} {revisionPlano.user?.apellido2}</p>
          <p><strong>Estado:</strong> {revisionPlano.status || 'Pendiente'}</p>
        </div>
        <div className="detalle-archivos">
          <p><strong>Archivos Adjuntos:</strong></p>
          {revisionPlano.ArchivosAdjuntos && Array.isArray(revisionPlano.ArchivosAdjuntos) ? (
            revisionPlano.ArchivosAdjuntos.map((archivo, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <FaFilePdf
                  style={{ cursor: 'pointer', marginRight: '5px' }}
                  onClick={() => manejarVerArchivo(archivo)}
                  title={`Ver archivo ${archivo.nombre}`}
                />
                <span>{archivo.nombre}</span>
              </div>
            ))
          ) : (
            "No disponible"
          )}
        </div>
      </div>

      {/* Botones para cambiar el estado */}
      <div className="estado-botones">
        <button onClick={() => cambiarEstado('Aprobado')} className="estado-aprobado-btn">Aprobar</button>
        <button onClick={() => cambiarEstado('Denegado')} className="estado-denegado-btn">Denegar</button>
      </div>

      {/* Botón para volver a la lista */}
      <button className="volver-btn" onClick={onVolver}>Volver a la lista de revisiones</button>
    </div>
  );
};

export default DetalleRevisionPlano;
