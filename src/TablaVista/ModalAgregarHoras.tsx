// import { useEffect, useState } from 'react';
// import ApiRoutes from '../components/ApiRoutes';

// interface ModalAgregarHorasProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onHorasAgregadas: () => void;
//   fechasDisponibles: { id: number; date: string }[];
//   fechaInicialSeleccionada: number;
// }

// const ModalAgregarHoras: React.FC<ModalAgregarHorasProps> = ({
//   isOpen,
//   onClose,
//   onHorasAgregadas,
//   fechasDisponibles,
//   fechaInicialSeleccionada,
// }) => {
//   const [horasSeleccionadas, setHorasSeleccionadas] = useState<string[]>([]);
//   const [horasCreadas, setHorasCreadas] = useState<string[]>([]);
//   const [loadingHoras, setLoadingHoras] = useState<boolean>(false);

//   const horasPreestablecidas = [
//     '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
//     '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
//     '15:00', '15:30'
//   ];

//   const fechaActual = fechasDisponibles.find(f => f.id === fechaInicialSeleccionada);

//   useEffect(() => {
//     if (isOpen && fechaInicialSeleccionada) {
//       const obtenerHorasCreadas = async () => {
//         setLoadingHoras(true);
//         const token = localStorage.getItem('token');
//         if (!token) return;

//         try {
//           const response = await fetch(ApiRoutes.horasCitas + `/fecha/${fechaInicialSeleccionada}`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`,
//             },
//           });

//           if (!response.ok) {
//             throw new Error(`Error: ${response.status} - ${response.statusText}`);
//           }

//           const data = await response.json();
//           const horasNormalizadas = data.map((item: any) => item.hora.slice(0, 5));

//           setHorasCreadas(horasNormalizadas);
//           setHorasSeleccionadas(horasNormalizadas);
//         } catch (error) {
//           console.error('Error al obtener las horas creadas:', error);
//         } finally {
//           setLoadingHoras(false);
//         }
//       };

//       obtenerHorasCreadas();
//     }
//   }, [isOpen, fechaInicialSeleccionada]);

//   const seleccionarTodasLasHoras = () => {
//     const nuevasHoras = horasPreestablecidas.filter(h => !horasCreadas.includes(h));
//     setHorasSeleccionadas([...horasCreadas, ...nuevasHoras]);
//   };

//   const deseleccionarTodasLasHoras = () => {
//     setHorasSeleccionadas(horasCreadas); // ❗ Dejamos solo las creadas
//   };

//   const handleAgregarHoras = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('No tienes permisos para realizar esta acción.');
//       return;
//     }

//     const nuevasHoras = horasSeleccionadas.filter(h => !horasCreadas.includes(h));

//     if (nuevasHoras.length === 0) {
//       alert('Selecciona al menos una hora nueva.');
//       return;
//     }

//     try {
//       const responseHoras = await fetch(ApiRoutes.horasCitas, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           fechaId: fechaInicialSeleccionada,
//           hora: nuevasHoras,
//         }),
//       });

//       if (!responseHoras.ok) {
//         const errorData = await responseHoras.json();
//         throw new Error(errorData.message || 'Error al crear la hora');
//       }

//       await responseHoras.json();
//       alert('Horas agregadas correctamente');
//       setHorasSeleccionadas([]);
//       onHorasAgregadas();
//       onClose();
//     } catch (error) {
//       console.error('Error al agregar horas:', error);
//       alert('Error al agregar horas: Por favor, inténtalo de nuevo.');
//     }
//   };

//   const handleSeleccionarHora = (hora: string) => {
//     if (horasCreadas.includes(hora)) return; // ⛔ No se puede quitar check si ya está creada

//     if (horasSeleccionadas.includes(hora)) {
//       setHorasSeleccionadas(horasSeleccionadas.filter(h => h !== hora));
//     } else {
//       setHorasSeleccionadas([...horasSeleccionadas, hora]);
//     }
//   };

//   if (!isOpen || !fechaActual) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4">Agregar Horas a Fecha</h2>

//         <div className="space-y-4">
//           <p className="font-medium">
//             Fecha seleccionada: <span className="text-blue-600">{fechaActual.date}</span>
//           </p>

//           {loadingHoras ? (
//             <p>Cargando horas...</p>
//           ) : (
//             <div className="mt-4">
//               <h4 className="text-md font-semibold mb-2">Selecciona las horas:</h4>
//               <div className="flex space-x-2 mb-2">
//                 <button
//                   onClick={seleccionarTodasLasHoras}
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                 >
//                   Seleccionar todas
//                 </button>
//                 <button
//                   onClick={deseleccionarTodasLasHoras}
//                   className="bg-gray-500 text-white px-4 py-2 rounded"
//                 >
//                   Deseleccionar todas
//                 </button>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 {horasPreestablecidas.map((hora, index) => {
//                   const yaCreada = horasCreadas.includes(hora);
//                   return (
//                     <label key={index} className="flex items-center space-x-2">
//                       <input
//                         type="checkbox"
//                         checked={horasSeleccionadas.includes(hora)}
//                         onChange={() => handleSeleccionarHora(hora)}
//                         disabled={yaCreada}
//                         className="form-checkbox h-5 w-5 text-blue-600"
//                       />
//                       <span className={yaCreada ? 'text-gray-500 italic' : ''}>
//                         {hora} {yaCreada}
//                       </span>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           <div className="flex justify-end space-x-2 mt-4">
//             <button
//               onClick={handleAgregarHoras}
//               className="aprobar"
//             >
//               Confirmar
//             </button>
//             <button
//               onClick={onClose}
//               className="denegar"
//             >
//               Cancelar
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModalAgregarHoras;

import { useEffect, useState } from 'react';
import ApiRoutes from '../components/ApiRoutes';
import Swal from 'sweetalert2';

interface ModalAgregarHorasProps {
  isOpen: boolean;
  onClose: () => void;
  onHorasAgregadas: () => void;
  fechasDisponibles: { id: number; date: string }[];
  fechaInicialSeleccionada: number;
}

const ModalAgregarHoras: React.FC<ModalAgregarHorasProps> = ({
  isOpen,
  onClose,
  onHorasAgregadas,
  fechasDisponibles,
  fechaInicialSeleccionada,
}) => {
  const [horasSeleccionadas, setHorasSeleccionadas] = useState<string[]>([]);
  const [horasCreadas, setHorasCreadas] = useState<string[]>([]);
  const [loadingHoras, setLoadingHoras] = useState<boolean>(false);

  const horasPreestablecidas = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30'
  ];

  const fechaActual = fechasDisponibles.find(f => f.id === fechaInicialSeleccionada);

  useEffect(() => {
    if (isOpen && fechaInicialSeleccionada) {
      const obtenerHorasCreadas = async () => {
        setLoadingHoras(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await fetch(ApiRoutes.horasCitas + `/fecha/${fechaInicialSeleccionada}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();
          const horasNormalizadas = data.map((item: any) => item.hora.slice(0, 5));

          setHorasCreadas(horasNormalizadas);
          setHorasSeleccionadas(horasNormalizadas);
        } catch (error) {
          console.error('Error al obtener las horas creadas:', error);
        } finally {
          setLoadingHoras(false);
        }
      };

      obtenerHorasCreadas();
    }
  }, [isOpen, fechaInicialSeleccionada]);

  const seleccionarTodasLasHoras = () => {
    const nuevasHoras = horasPreestablecidas.filter(h => !horasCreadas.includes(h));
    setHorasSeleccionadas([...horasCreadas, ...nuevasHoras]);
  };

  const deseleccionarTodasLasHoras = () => {
    setHorasSeleccionadas(horasCreadas);
  };

  const handleAgregarHoras = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'No tienes permisos para realizar esta acción.', 'warning');
      return;
    }

    const nuevasHoras = horasSeleccionadas.filter(h => !horasCreadas.includes(h));

    if (nuevasHoras.length === 0) {
      Swal.fire('Sin selección', 'Selecciona al menos una hora nueva para agregar.', 'info');
      return;
    }

    try {
      const responseHoras = await fetch(ApiRoutes.horasCitas, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fechaId: fechaInicialSeleccionada,
          hora: nuevasHoras,
        }),
      });

      if (!responseHoras.ok) {
        const errorData = await responseHoras.json();
        throw new Error(errorData.message || 'Error al crear la hora');
      }

      await responseHoras.json();
      Swal.fire('¡Éxito!', 'Horas agregadas correctamente.', 'success');
      setHorasSeleccionadas([]);
      onHorasAgregadas();
      onClose();
    } catch (error) {
      console.error('Error al agregar horas:', error);
      Swal.fire('Error', 'Error al agregar horas. Por favor, inténtalo de nuevo.', 'error');
    }
  };

  const handleSeleccionarHora = (hora: string) => {
    if (horasCreadas.includes(hora)) return;

    if (horasSeleccionadas.includes(hora)) {
      setHorasSeleccionadas(horasSeleccionadas.filter(h => h !== hora));
    } else {
      setHorasSeleccionadas([...horasSeleccionadas, hora]);
    }
  };

  if (!isOpen || !fechaActual) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Agregar Horas a Fecha</h2>

        <div className="space-y-4">
          <p className="font-medium">
            Fecha seleccionada: <span className="text-blue-600">{fechaActual.date}</span>
          </p>

          {loadingHoras ? (
            <p>Cargando horas...</p>
          ) : (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Selecciona las horas:</h4>
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={seleccionarTodasLasHoras}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Seleccionar todas
                </button>
                <button
                  onClick={deseleccionarTodasLasHoras}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Deseleccionar todas
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {horasPreestablecidas.map((hora, index) => {
                  const yaCreada = horasCreadas.includes(hora);
                  return (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={horasSeleccionadas.includes(hora)}
                        onChange={() => handleSeleccionarHora(hora)}
                        disabled={yaCreada}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className={yaCreada ? 'text-gray-500 italic' : ''}>
                        {hora} {yaCreada && '(ya creada)'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={handleAgregarHoras}
              className="aprobar"
            >
              Confirmar
            </button>
            <button
              onClick={onClose}
              className="denegar"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarHoras;
