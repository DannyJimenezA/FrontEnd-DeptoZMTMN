// import { useState } from 'react';
// import ApiRoutes from '../components/ApiRoutes';
// import '../styles/GestionCitas.css';

// interface ModalCrearFechaProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onFechaCreada: () => void;
// }

// const ModalCrearFecha: React.FC<ModalCrearFechaProps> = ({ isOpen, onClose, onFechaCreada }) => {
//   const [nuevaFecha, setNuevaFecha] = useState<string>('');

//   const handleCrearFecha = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('Token no encontrado');
//       alert('No tienes permisos para realizar esta acción.');
//       return;
//     }

//     try {
//       const responseFecha = await fetch(ApiRoutes.fechaCitas, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ date: nuevaFecha }),
//       });

//       if (!responseFecha.ok) {
//         const errorData = await responseFecha.json();
//         console.error('Error al crear la fecha:', errorData);
//         throw new Error(`Error al crear la fecha: ${responseFecha.statusText}`);
//       }

//       const fechaCreada = await responseFecha.json();
//       console.log('Fecha creada:', fechaCreada);

//       alert('Fecha creada correctamente');
//       setNuevaFecha('');
//       onFechaCreada();
//       onClose();
//     } catch (error) {
//       console.error('Error al crear la fecha:', error);
//       alert(`Error al crear la fecha: Error al crear la fecha. Por favor, inténtalo de nuevo`);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4">Crear Nueva Fecha</h2>
//         <div className="space-y-4">
//           <input
//             type="date"
//             value={nuevaFecha}
//             onChange={(e) => setNuevaFecha(e.target.value)}
//             className="w-full p-2 border rounded"
//             placeholder="Fecha (YYYY-MM-DD)"
//           />
//           <button
//             onClick={handleCrearFecha}
//             className="aprobar"
//           >
//             Crear fecha
//           </button>
//         </div>
//         <button
//           onClick={onClose}
//           className="denegar"
//         >
//           Cerrar
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ModalCrearFecha;
import { useState } from 'react';
import ApiRoutes from '../components/ApiRoutes';
import Swal from 'sweetalert2';
import '../styles/GestionCitas.css';

interface ModalCrearFechaProps {
  isOpen: boolean;
  onClose: () => void;
  onFechaCreada: () => void;
}

const ModalCrearFecha: React.FC<ModalCrearFechaProps> = ({ isOpen, onClose, onFechaCreada }) => {
  const [nuevaFecha, setNuevaFecha] = useState<string>('');

  const handleCrearFecha = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'No tienes permisos para realizar esta acción.', 'warning');
      return;
    }

    if (!nuevaFecha) {
      Swal.fire('Campo vacío', 'Por favor selecciona una fecha antes de continuar.', 'info');
      return;
    }

    try {
      const responseFecha = await fetch(ApiRoutes.fechaCitas, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ date: nuevaFecha }),
      });

      if (!responseFecha.ok) {
        const errorData = await responseFecha.json();
        console.error('Error al crear la fecha:', errorData);
        throw new Error(`Error al crear la fecha: ${responseFecha.statusText}`);
      }

      const fechaCreada = await responseFecha.json();
      console.log('Fecha creada:', fechaCreada);

      Swal.fire('Éxito', 'Fecha creada correctamente.', 'success');
      setNuevaFecha('');
      onFechaCreada();
      onClose();
    } catch (error) {
      console.error('Error al crear la fecha:', error);
      Swal.fire('Error', 'Ocurrió un error al crear la fecha. Por favor, verifica que la fecha no exista e inténtalo de nuevo.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Crear Nueva Fecha</h2>
        <div className="space-y-4">
          <input
            type="date"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Fecha (YYYY-MM-DD)"
          />
          <button
            onClick={handleCrearFecha}
            className="aprobar"
          >
            Crear fecha
          </button>
        </div>
        <button
          onClick={onClose}
          className="denegar mt-4"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalCrearFecha;
