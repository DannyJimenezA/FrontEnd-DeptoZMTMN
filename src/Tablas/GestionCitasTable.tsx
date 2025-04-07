// import React, { useEffect, useState } from 'react';
// import ApiRoutes from '../components/ApiRoutes';
// import Paginacion from '../components/Paginacion';
// import '../styles/GestionCitas.css';
// import ModalCrearFecha from '../TablaVista/ModalCrearFecha';
// import ModalAgregarHoras from '../TablaVista/ModalAgregarHoras';

// interface Fecha {
//   id: number;
//   date: string;
// }

// const GestionCitasTable: React.FC = () => {
//   const [fechas, setFechas] = useState<Fecha[]>([]);
//   const [modalFechaAbierto, setModalFechaAbierto] = useState(false);
//   const [modalHorasAbierto, setModalHorasAbierto] = useState(false);
//   const [fechaSeleccionada, setFechaSeleccionada] = useState<Fecha | null>(null); // ✅ nueva

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [filtro, setFiltro] = useState<'futuras' | 'pasadas'>('futuras');

//   useEffect(() => {
//     cargarFechas();
//   }, []);

//   const cargarFechas = () => {
//     fetch(`${ApiRoutes.urlBase}/available-dates`)
//       .then(res => res.json())
//       .then(setFechas)
//       .catch(err => console.error('Error al cargar fechas:', err));
//   };

//   const eliminarFecha = async (id: number) => {
//     try {
//       const res = await fetch(`${ApiRoutes.urlBase}/available-dates/${id}`, { method: 'DELETE' });
//       if (res.ok) {
//         setFechas(prev => prev.filter(f => f.id !== id));
//       }
//     } catch (err) {
//       console.error('Error al eliminar fecha:', err);
//     }
//   };

//   const hoy = new Date();
//   const fechasFiltradas = fechas
//     .filter(f => {
//       const fecha = new Date(f.date);
//       return filtro === 'futuras'
//         ? fecha >= new Date(hoy.toDateString())
//         : fecha < new Date(hoy.toDateString());
//     })
//     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//   const totalPages = Math.ceil(fechasFiltradas.length / itemsPerPage);
//   const indexInicio = (currentPage - 1) * itemsPerPage;
//   const fechasPaginadas = fechasFiltradas.slice(indexInicio, indexInicio + itemsPerPage);

//   const abrirModalHoras = (fecha: Fecha) => {
//     setFechaSeleccionada(fecha);
//     setModalHorasAbierto(true);
//   };

//   return (
//     <div className="tabla-container">
//       <h2 className="text-2xl font-semibold mb-4">Gestión de Fechas</h2>

//       <div className="flex justify-between items-center mb-4">
//         <button
//           onClick={() => setModalFechaAbierto(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Agregar Nueva Fecha
//         </button>

//         <div className="flex space-x-2">
//           <button
//             onClick={() => {
//               setFiltro('futuras');
//               setCurrentPage(1);
//             }}
//             className={`px-4 py-2 rounded border ${
//               filtro === 'futuras' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border-gray-300'
//             }`}
//           >
//             Próximas Fechas
//           </button>
//           <button
//             onClick={() => {
//               setFiltro('pasadas');
//               setCurrentPage(1);
//             }}
//             className={`px-4 py-2 rounded border ${
//               filtro === 'pasadas' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border-gray-300'
//             }`}
//           >
//             Fechas Antiguas
//           </button>
//         </div>
//       </div>

//       <table className="tabla-denuncias">
//         <thead>
//           <tr>
//             <th>Fecha</th>
//             <th>Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {fechasPaginadas.length === 0 ? (
//             <tr>
//               <td colSpan={2} className="text-center">No hay fechas para mostrar.</td>
//             </tr>
//           ) : (
//             fechasPaginadas.map(fecha => (
//               <tr key={fecha.id}>
//                 <td>{fecha.date}</td>
//                 <td>
//                   <button
//                     onClick={() => abrirModalHoras(fecha)}
//                     className="bg-green-500 text-white px-2 py-1 rounded mr-2"
//                   >
//                     Ver Horas
//                   </button>
//                   <button
//                     onClick={() => eliminarFecha(fecha.id)}
//                     className="button-delete ml-2"
//                   >
//                     Eliminar
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       <Paginacion
//         currentPage={currentPage}
//         totalPages={totalPages}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//         onItemsPerPageChange={(items) => {
//           setItemsPerPage(items);
//           setCurrentPage(1);
//         }}
//       />

//       {/* Modal para crear nueva fecha */}
//       {modalFechaAbierto && (
//         <div className="modal-overlay">
//           <ModalCrearFecha
//             isOpen={modalFechaAbierto}
//             onClose={() => setModalFechaAbierto(false)}
//             onFechaCreada={cargarFechas}
//           />
//         </div>
//       )}

//       {/* Modal para agregar/ver horas */}
//       {modalHorasAbierto && fechaSeleccionada && (
//         <ModalAgregarHoras
//           isOpen={modalHorasAbierto}
//           onClose={() => {
//             setModalHorasAbierto(false);
//             setFechaSeleccionada(null);
//           }}
//           onHorasAgregadas={cargarFechas}
//           fechasDisponibles={fechasFiltradas}
//           fechaInicialSeleccionada={fechaSeleccionada.id}
//         />
//       )}
//     </div>
//   );
// };

// export default GestionCitasTable;


import React, { useEffect, useState } from 'react';
import ApiRoutes from '../components/ApiRoutes';
import Paginacion from '../components/Paginacion';
import '../styles/GestionCitas.css';
import ModalCrearFecha from '../TablaVista/ModalCrearFecha';
import ModalAgregarHoras from '../TablaVista/ModalAgregarHoras';
import Swal from 'sweetalert2';

interface Fecha {
  id: number;
  date: string;
}

const GestionCitasTable: React.FC = () => {
  const [fechas, setFechas] = useState<Fecha[]>([]);
  const [modalFechaAbierto, setModalFechaAbierto] = useState(false);
  const [modalHorasAbierto, setModalHorasAbierto] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Fecha | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filtro, setFiltro] = useState<'futuras' | 'pasadas'>('futuras');

  useEffect(() => {
    cargarFechas();
  }, []);

  const cargarFechas = () => {
    fetch(`${ApiRoutes.urlBase}/available-dates`)
      .then(res => res.json())
      .then(setFechas)
      .catch(err => console.error('Error al cargar fechas:', err));
  };

  const eliminarFecha = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar esta fecha?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (confirmacion.isConfirmed) {
      try {
        const res = await fetch(`${ApiRoutes.urlBase}/available-dates/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setFechas(prev => prev.filter(f => f.id !== id));
          Swal.fire('¡Eliminada!', 'La fecha ha sido eliminada correctamente.', 'success');
        } else {
          throw new Error('No se pudo eliminar la fecha');
        }
      } catch (err) {
        console.error('Error al eliminar fecha:', err);
        Swal.fire('Error', 'Ocurrió un error al eliminar la fecha.', 'error');
      }
    }
  };

  const hoy = new Date();
  const fechasFiltradas = fechas
    .filter(f => {
      const fecha = new Date(f.date);
      return filtro === 'futuras'
        ? fecha >= new Date(hoy.toDateString())
        : fecha < new Date(hoy.toDateString());
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalPages = Math.ceil(fechasFiltradas.length / itemsPerPage);
  const indexInicio = (currentPage - 1) * itemsPerPage;
  const fechasPaginadas = fechasFiltradas.slice(indexInicio, indexInicio + itemsPerPage);

  const abrirModalHoras = (fecha: Fecha) => {
    setFechaSeleccionada(fecha);
    setModalHorasAbierto(true);
  };

  return (
    <div className="tabla-container">
      <h2 className="text-2xl font-semibold mb-4">Gestión de Fechas</h2>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setModalFechaAbierto(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Agregar Nueva Fecha
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setFiltro('futuras');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded border ${
              filtro === 'futuras' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border-gray-300'
            }`}
          >
            Próximas Fechas
          </button>
          <button
            onClick={() => {
              setFiltro('pasadas');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded border ${
              filtro === 'pasadas' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border-gray-300'
            }`}
          >
            Fechas Antiguas
          </button>
        </div>
      </div>

      <table className="tabla-denuncias">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fechasPaginadas.length === 0 ? (
            <tr>
              <td colSpan={2} className="text-center">No hay fechas para mostrar.</td>
            </tr>
          ) : (
            fechasPaginadas.map(fecha => (
              <tr key={fecha.id}>
                <td>{fecha.date}</td>
                <td>
                  <button
                    onClick={() => abrirModalHoras(fecha)}
                    className="aceptar"
                  >
                    Ver Horas
                  </button>
                  <button
                    onClick={() => eliminarFecha(fecha.id)}
                    className="button-delete ml-2"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Paginacion
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items);
          setCurrentPage(1);
        }}
      />

      {/* Modal para crear nueva fecha */}
      {modalFechaAbierto && (
        <div className="modal-overlay">
          <ModalCrearFecha
            isOpen={modalFechaAbierto}
            onClose={() => setModalFechaAbierto(false)}
            onFechaCreada={cargarFechas}
          />
        </div>
      )}

      {/* Modal para agregar/ver horas */}
      {modalHorasAbierto && fechaSeleccionada && (
        <ModalAgregarHoras
          isOpen={modalHorasAbierto}
          onClose={() => {
            setModalHorasAbierto(false);
            setFechaSeleccionada(null);
          }}
          onHorasAgregadas={cargarFechas}
          fechasDisponibles={fechasFiltradas}
          fechaInicialSeleccionada={fechaSeleccionada.id}
        />
      )}
    </div>
  );
};

export default GestionCitasTable;
