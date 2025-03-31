// import React from 'react';
// import { FaFilePdf } from 'react-icons/fa';
// import { Denuncia } from '../Types/Types';
// import  '../styles/DetalleSolicitud.css'
// interface DetalleDenunciaProps {
//   denuncia: Denuncia;
//   onVolver: () => void;
//   onEstadoCambiado: (id: number, nuevoEstado: string) => void;
// }

// const DetalleDenuncia: React.FC<DetalleDenunciaProps> = ({ denuncia, onVolver, onEstadoCambiado }) => {

//   const cambiarEstado = (nuevoEstado: string) => {
//     onEstadoCambiado(denuncia.id, nuevoEstado);
//   };
//   const procesarArchivos = (archivosEvidencia: string | string[] | undefined) => {
//     let archivos: string[] = [];

//     if (archivosEvidencia) {
//       if (Array.isArray(archivosEvidencia)) {
//         archivos = archivosEvidencia;
//       } else {
//         try {
//           archivos = JSON.parse(archivosEvidencia);
//         } catch (error) {
//           archivos = archivosEvidencia.includes(',')
//             ? archivosEvidencia.split(',')
//             : [archivosEvidencia];
//         }
//       }
//     }

//     return archivos;
//   };

//   const archivosProcesados = procesarArchivos(denuncia.archivosEvidencia);

//   // const manejarCambioEstado = (nuevoEstado: string) => {
//   //   onEstadoCambiado(denuncia.id, nuevoEstado); // Llamar la función del componente padre para cambiar el estado
//   // };

//   return (
//     <div className="detalle-tabla">
//       <h3>Detalles de la Denuncia</h3>
//       <div className="detalle-contenido">
//         <div className="detalle-info">
//           <p><strong>ID:</strong> {denuncia.id}</p>
//           <p><strong>Fecha de Creacion:</strong> {denuncia.Date}</p>
//           <p><strong>Nombre del Denunciante:</strong> {denuncia.nombreDenunciante || 'Anónimo'}</p>
//           <p><strong>Cédula del Denunciante:</strong> {denuncia.cedulaDenunciante || 'Anónimo'}</p>
//           <p><strong>Metodo de Notificacion:</strong> {denuncia.metodoNotificacion || 'No especificado'}</p>
//           <p><strong>Medio de Notificacion:</strong> {denuncia.medioNotificacion || 'No especificado'}</p>
//           <p><strong>Tipo de Denuncia:</strong> {denuncia.tipoDenuncia?.descripcion}</p>
//           <p><strong>Descripción:</strong> {denuncia.descripcion}</p>
//           <p><strong>Lugar de Denuncia:</strong> {denuncia.lugarDenuncia?.descripcion}</p>
//           <p><strong>Ubicación Exacta:</strong> {denuncia.ubicacion}</p>
//           <p><strong>Detalles de Evidencia:</strong> {denuncia.detallesEvidencia || 'No disponible'}</p>
//           <p><strong>Estado</strong> {denuncia.status}</p>
//         </div>
//         <div className="detalle-archivos">
//           <p><strong>Archivos de Evidencia:</strong></p>
//           {archivosProcesados.length > 0 ? (
//             archivosProcesados.map((archivo, index) => (
//               <FaFilePdf
//                 key={index}
//                 style={{ cursor: 'pointer', marginRight: '5px' }}
//                 onClick={() => window.open(archivo, '_blank')}
//                 title={`Ver archivo ${index + 1}`}
//               />
//             ))
//           ) : (
//             'No disponible'
//           )}
//         </div>
//       </div>

//       <div className="estado-botones">
//         <button className="boton-aprobar" onClick={() => cambiarEstado('Aprobada')}>
//           Aprobar
//         </button>
//         <button className="boton-denegar" onClick={() => cambiarEstado('Denegada')}>
//           Denegar
//         </button>
//       </div>

//       {/* Botón de Volver */}
//       <button className="volver-btn" onClick={onVolver}>
//         Volver
//       </button>


//     </div>
//   );
// };

// export default DetalleDenuncia;

import React, { useState } from 'react';
import { FaFilePdf, FaTimes, FaImage } from 'react-icons/fa';
import { Denuncia } from '../Types/Types';
import '../styles/DetalleSolicitud.css';

interface DetalleDenunciaProps {
  denuncia: Denuncia;
  onVolver: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
}

const DetalleDenuncia: React.FC<DetalleDenunciaProps> = ({ denuncia, onVolver, onEstadoCambiado }) => {
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<string | null>(null);

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

  // Función para manejar la previsualización de archivos
  const manejarVerArchivo = (archivo: string) => {
    if (archivo.match(/\.(jpeg|jpg|png|gif)$/i)) {
      setArchivoVistaPrevia(archivo); // Muestra la imagen en el modal
    } else {
      window.open(archivo, '_blank'); // Abre PDFs en otra pestaña
    }
  };

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    nuevoEstado: string;
  } | null>(null);


  return (
    <div className="detalle-tabla">
      <h3>Detalles de la Denuncia</h3>
      <div className="detalle-contenido">
        <div className="detalle-info">
          <p><strong>ID:</strong> {denuncia.id}</p>
          <p><strong>Fecha de Creación:</strong> {denuncia.Date}</p>
          <p><strong>Nombre del Denunciante:</strong> {denuncia.nombreDenunciante || 'Anónimo'}</p>
          <p><strong>Cédula del Denunciante:</strong> {denuncia.cedulaDenunciante || 'Anónimo'}</p>
          <p><strong>Método de Notificación:</strong> {denuncia.metodoNotificacion || 'No especificado'}</p>
          <p><strong>Medio de Notificación:</strong> {denuncia.medioNotificacion || 'No especificado'}</p>
          <p><strong>Tipo de Denuncia:</strong> {denuncia.tipoDenuncia?.descripcion}</p>
          <p><strong>Descripción:</strong> {denuncia.descripcion}</p>
          <p><strong>Lugar de Denuncia:</strong> {denuncia.lugarDenuncia?.descripcion}</p>
          <p><strong>Ubicación Exacta:</strong> {denuncia.ubicacion}</p>
          <p><strong>Detalles de Evidencia:</strong> {denuncia.detallesEvidencia || 'No disponible'}</p>
          <p><strong>Estado:</strong> {denuncia.status}</p>
        </div>

        <div className="detalle-archivos">
          <p><strong>Archivos de Evidencia:</strong></p>
          {archivosProcesados.length > 0 ? (
            archivosProcesados.map((archivo, index) => (
              <span key={index} onClick={() => manejarVerArchivo(archivo)} style={{ cursor: 'pointer', marginRight: '10px' }}>
                {archivo.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  <FaImage size={20} title={`Ver imagen ${index + 1}`} />
                ) : (
                  <FaFilePdf size={20} title={`Ver archivo ${index + 1}`} />
                )}
              </span>
            ))
          ) : (
            'No disponible'
          )}
        </div>
      </div>

      {/* Modal de imagen */}
      {archivoVistaPrevia && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setArchivoVistaPrevia(null)}>
              <FaTimes size={20} />
            </button>
            <img src={archivoVistaPrevia} alt="Evidencia" className="imagen-preview" />
          </div>
        </div>
      )}

      {/* Botones con confirmación */}
      <div className="estado-botones" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setConfirmModal({ visible: true, nuevoEstado: 'Aprobada' })}
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          Aprobar
        </button>
        <button
          onClick={() => setConfirmModal({ visible: true, nuevoEstado: 'Denegada' })}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          Denegar
        </button>
      </div>

      <button className="volver-btn" onClick={onVolver}>
        Volver
      </button>

      {/* Modal de confirmación */}
      {confirmModal?.visible && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', padding: '20px' }}>
            <h3>Confirmación</h3>
            <p>¿Estás seguro de cambiar el estado a <strong>{confirmModal.nuevoEstado}</strong>?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
              <button
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                }}
                onClick={() => {
                  onEstadoCambiado(denuncia.id, confirmModal.nuevoEstado);
                  setConfirmModal(null);
                }}
              >
                Aceptar
              </button>
              <button
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                }}
                onClick={() => setConfirmModal(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleDenuncia;