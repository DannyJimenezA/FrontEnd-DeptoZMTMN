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
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Denuncia } from '../Types/Types';
import '../styles/DetalleSolicitud.css';

const MySwal = withReactContent(Swal);

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

  const manejarVerArchivo = (archivo: string) => {
    if (archivo.match(/\.(jpeg|jpg|png|gif)$/i)) {
      setArchivoVistaPrevia(archivo);
    } else {
      window.open(archivo, '_blank');
    }
  };

  const confirmarCambioEstado = async (nuevoEstado: string) => {
    const result = await MySwal.fire({
      title: `¿Estás seguro de ${nuevoEstado === 'Aprobada' ? 'aprobar' : 'denegar'} esta denuncia?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: false,
      customClass: {
        confirmButton: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700',
        cancelButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      onEstadoCambiado(denuncia.id, nuevoEstado);
    }
  };

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

      <button className="volver-btn" onClick={onVolver}>
        Volver
      </button>
    </div>
  );
};

