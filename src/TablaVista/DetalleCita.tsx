import React from 'react';
import { Cita } from '../Types/Types';
import CambiarEstadoCita from '../components/CambioEstado'; // Importar el nuevo componente

interface DetalleCitaProps {
  cita: Cita;
  onVolver: () => void;  // Función para volver a la lista de citas
  onEstadoCambiado: (id: number, nuevoEstado: string) => void; // Función para manejar el cambio de estado en el padre
}

const DetalleCita: React.FC<DetalleCitaProps> = ({ cita, onVolver, onEstadoCambiado }) => {
  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Cita</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID Cita:</strong> {cita.id}</p>
          <p><strong>Nombre:</strong> {cita.user?.nombre}</p>
          <p><strong>Cédula:</strong> {cita.user?.cedula}</p>
          <p><strong>Fecha:</strong> {new Date(cita.date).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {cita.time}</p>
          <p><strong>Estado:</strong> {cita.status || 'Pendiente'}</p>
        </div>
      </div>

      {/* Botones para cambiar el estado de la cita */}
      <div className="estado-botones">
        <CambiarEstadoCita
          id={cita.id}
          nuevoEstado="aprobada"
          onEstadoCambiado={onEstadoCambiado}
          label="Aprobar Cita"
        />
        <CambiarEstadoCita
          id={cita.id}
          nuevoEstado="denegada"
          onEstadoCambiado={onEstadoCambiado}
          label="Denegar Cita"
        />
      </div>

      {/* Botón para volver a la lista */}
      <button className="volver-btn" onClick={onVolver}>
        Volver a la lista de citas
      </button>
    </div>
  );
};

export default DetalleCita;
