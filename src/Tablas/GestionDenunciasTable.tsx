// import React, { useState, useEffect } from 'react';
// import ApiRoutes from '../components/ApiRoutes';
// import "../styles/GestionDenuncias.css";

// interface DenunciaData {
//   id: number;
//   descripcion: string;
// }

// const fetchDenunciaData = async (tipo: 'tipo-denuncia' | 'lugar-denuncia'): Promise<DenunciaData[]> => {
//   const urlBase = `${ApiRoutes.urlBase}/${tipo}`;

//   try {
//     const response = await fetch(urlBase, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//     });

//     if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
//     return await response.json();
//   } catch (error) {
//     console.error(`Error fetching ${tipo}:`, error);
//     throw error;
//   }
// };

// const GestionDenunciasTable: React.FC = () => {
//   const [tipoDenuncias, setTipoDenuncias] = useState<DenunciaData[]>([]);
//   const [lugarDenuncias, setLugarDenuncias] = useState<DenunciaData[]>([]);
//   const [isAdding, setIsAdding] = useState<boolean>(false);
//   const [descripcion, setDescripcion] = useState<string>('');
//   const [denunciaType, setDenunciaType] = useState<'tipo-denuncia' | 'lugar-denuncia'>('tipo-denuncia');
//   const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
//   const [deleteId, setDeleteId] = useState<number | null>(null);
//   const [deleteType, setDeleteType] = useState<'tipo-denuncia' | 'lugar-denuncia' | null>(null);

//   useEffect(() => {
//     const cargarDatos = async () => {
//       try {
//         const tipos = await fetchDenunciaData('tipo-denuncia');
//         const lugares = await fetchDenunciaData('lugar-denuncia');
//         setTipoDenuncias(tipos);
//         setLugarDenuncias(lugares);
//       } catch (error) {
//         console.error('Error al cargar datos:', error);
//       }
//     };
//     cargarDatos();
//   }, []);

//   // Abrir el modal para agregar
//   const abrirModalAgregar = (tipo: 'tipo-denuncia' | 'lugar-denuncia') => {
//     setIsAdding(true);
//     setDenunciaType(tipo);
//     setDescripcion('');
//   };

//   // Cerrar el modal de agregar
//   const cerrarModalAgregar = () => {
//     setIsAdding(false);
//   };

//   // Manejar el guardado de un nuevo tipo/lugar de denuncia
//   const manejarAgregar = async () => {
//     if (!descripcion.trim()) {
//       alert('Por favor, ingresa una descripción.');
//       return;
//     }

//     try {
//       const response = await fetch(`${ApiRoutes.urlBase}/${denunciaType}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ descripcion }),
//       });

//       if (!response.ok) {
//         throw new Error(`Error al agregar ${denunciaType}.`);
//       }

//       const nuevaDenuncia = await response.json();

//       if (denunciaType === 'tipo-denuncia') {
//         setTipoDenuncias([...tipoDenuncias, nuevaDenuncia]);
//       } else {
//         setLugarDenuncias([...lugarDenuncias, nuevaDenuncia]);
//       }

//       cerrarModalAgregar();
//     } catch (error) {
//       console.error(`Error agregando ${denunciaType}:`, error);
//       alert('Ocurrió un error al agregar el registro.');
//     }
//   };

//   // Abrir modal de confirmación para eliminar
//   const abrirConfirmacionEliminar = (id: number, tipo: 'tipo-denuncia' | 'lugar-denuncia') => {
//     setIsConfirmingDelete(true);
//     setDeleteId(id);
//     setDeleteType(tipo);
//   };

//   // Manejar eliminación de tipo/lugar de denuncia
//   const manejarEliminar = async () => {
//     if (!deleteId || !deleteType) return;

//     try {
//       const response = await fetch(`${ApiRoutes.urlBase}/${deleteType}/${deleteId}`, { method: 'DELETE' });

//       if (!response.ok) {
//         throw new Error(`Error al eliminar ${deleteType}.`);
//       }

//       if (deleteType === 'tipo-denuncia') {
//         setTipoDenuncias(tipoDenuncias.filter((item) => item.id !== deleteId));
//       } else {
//         setLugarDenuncias(lugarDenuncias.filter((item) => item.id !== deleteId));
//       }

//       setIsConfirmingDelete(false);
//       setDeleteId(null);
//       setDeleteType(null);
//     } catch (error) {
//       console.error(`Error eliminando ${deleteType}:`, error);
//       alert('Ocurrió un error al eliminar el registro.');
//     }
//   };

//   return (
//     <div className="tabla-container">
//       <h2>Gestión de Denuncias</h2>

//       {/* Botones para agregar */}
//       <button className="add-button" onClick={() => abrirModalAgregar('tipo-denuncia')}>
//         Agregar Nuevo Tipo de Denuncia
//       </button>

//       <button className="add-button" onClick={() => abrirModalAgregar('lugar-denuncia')}>
//         Agregar Nuevo Lugar de Denuncia
//       </button>

//       {/* Tabla de Tipos de Denuncia */}
// <h3>Tipos de Denuncia</h3>
// <table className="tabla-denuncias">
//   <thead>
//     <tr>
//       <th className="col-tipo">Tipo</th>
//       <th className="col-acciones">Acciones</th>
//     </tr>
//   </thead>
//   <tbody>
//     {tipoDenuncias.map((tipo) => (
//       <tr key={tipo.id}>
//         <td>{tipo.descripcion}</td>
//         <td>
//           <button onClick={() => abrirConfirmacionEliminar(tipo.id, 'tipo-denuncia')} className="button-delete">
//             Eliminar
//           </button>
//         </td>
//       </tr>
//     ))}
//   </tbody>
// </table>

// {/* Tabla de Lugares de Denuncia */}
// <h3>Lugares de Denuncia</h3>
// <table className="tabla-denuncias">
//   <thead>
//     <tr>
//       <th className="col-lugar">Lugar</th>
//       <th className="col-acciones">Acciones</th>
//     </tr>
//   </thead>
//   <tbody>
//     {lugarDenuncias.map((lugar) => (
//       <tr key={lugar.id}>
//         <td>{lugar.descripcion}</td>
//         <td>
//           <button onClick={() => abrirConfirmacionEliminar(lugar.id, 'lugar-denuncia')} className="button-delete">
//             Eliminar
//           </button>
//         </td>
//       </tr>
//     ))}
//   </tbody>
// </table>

//     {/* Modal para agregar */}
// {isAdding && (
//   <div className="modal-overlay">
//     <div className="modal-content">
//       <h3>Agregar Nuevo {denunciaType === 'tipo-denuncia' ? 'Tipo' : 'Lugar'} de Denuncia</h3>
//       <input 
//         type="text" 
//         className="descripcion-input" 
//         placeholder="Descripción" 
//         value={descripcion} 
//         onChange={(e) => setDescripcion(e.target.value)} 
//       />
//       <button onClick={manejarAgregar} className="guardar-button">Guardar</button>
//       <button onClick={cerrarModalAgregar} className="cancel-button">Cancelar</button>
//     </div>
//   </div>
//       )}

//       {/* Modal de confirmación para eliminar */}
//       {isConfirmingDelete && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>¿Seguro que quieres eliminar este registro?</h3>
//             <p>Esta acción no se puede deshacer.</p>
//             <button onClick={manejarEliminar} className="button-delete">Eliminar</button>
//             <button onClick={() => setIsConfirmingDelete(false)} className="cancel-button">Cancelar</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestionDenunciasTable;

import React, { useState, useEffect } from 'react';
import ApiRoutes from '../components/ApiRoutes';
import Swal from 'sweetalert2';
import '../styles/GestionDenuncias.css';

interface DenunciaData {
  id: number;
  descripcion: string;
}

const fetchDenunciaData = async (tipo: 'tipo-denuncia' | 'lugar-denuncia'): Promise<DenunciaData[]> => {
  const urlBase = `${ApiRoutes.urlBase}/${tipo}`;

  try {
    const response = await fetch(urlBase, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${tipo}:`, error);
    throw error;
  }
};

const GestionDenunciasTable: React.FC = () => {
  const [tipoDenuncias, setTipoDenuncias] = useState<DenunciaData[]>([]);
  const [lugarDenuncias, setLugarDenuncias] = useState<DenunciaData[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [descripcion, setDescripcion] = useState<string>('');
  const [denunciaType, setDenunciaType] = useState<'tipo-denuncia' | 'lugar-denuncia'>('tipo-denuncia');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const tipos = await fetchDenunciaData('tipo-denuncia');
        const lugares = await fetchDenunciaData('lugar-denuncia');
        setTipoDenuncias(tipos);
        setLugarDenuncias(lugares);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    cargarDatos();
  }, []);

  const abrirModalAgregar = (tipo: 'tipo-denuncia' | 'lugar-denuncia') => {
    setIsAdding(true);
    setDenunciaType(tipo);
    setDescripcion('');
  };

  const cerrarModalAgregar = () => {
    setIsAdding(false);
  };

  const manejarAgregar = async () => {
    if (!descripcion.trim()) {
      Swal.fire('Campo requerido', 'Por favor, ingresa una descripción.', 'info');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/${denunciaType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion }),
      });

      if (!response.ok) throw new Error(`Error al agregar ${denunciaType}.`);

      const nuevaDenuncia = await response.json();

      if (denunciaType === 'tipo-denuncia') {
        setTipoDenuncias([...tipoDenuncias, nuevaDenuncia]);
      } else {
        setLugarDenuncias([...lugarDenuncias, nuevaDenuncia]);
      }

      cerrarModalAgregar();
      Swal.fire('¡Guardado!', 'Registro agregado correctamente.', 'success');
    } catch (error) {
      console.error(`Error agregando ${denunciaType}:`, error);
      Swal.fire('Error', 'Ocurrió un error al agregar el registro.', 'error');
    }
  };

  const manejarEliminar = async (id: number, tipo: 'tipo-denuncia' | 'lugar-denuncia') => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/${tipo}/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error(`Error al eliminar ${tipo}.`);

      if (tipo === 'tipo-denuncia') {
        setTipoDenuncias(tipoDenuncias.filter((item) => item.id !== id));
      } else {
        setLugarDenuncias(lugarDenuncias.filter((item) => item.id !== id));
      }

      Swal.fire('¡Eliminado!', 'El registro fue eliminado correctamente.', 'success');
    } catch (error) {
      console.error(`Error eliminando ${tipo}:`, error);
      Swal.fire('Error', 'Ocurrió un error al eliminar el registro.', 'error');
    }
  };

  return (
    <div className="tabla-container">
      <h2>Gestión de Denuncias</h2>

      <button className="add-button" onClick={() => abrirModalAgregar('tipo-denuncia')}>
        Agregar Nuevo Tipo de Denuncia
      </button>

      <button className="add-button" onClick={() => abrirModalAgregar('lugar-denuncia')}>
        Agregar Nuevo Lugar de Denuncia
      </button>

      {/* Tabla de Tipos de Denuncia */}
      <h3>Tipos de Denuncia</h3>
      <table className="tabla-denuncias">
        <thead>
          <tr>
            <th className="col-tipo">Tipo</th>
            <th className="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipoDenuncias.map((tipo) => (
            <tr key={tipo.id}>
              <td>{tipo.descripcion}</td>
              <td>
                <button onClick={() => manejarEliminar(tipo.id, 'tipo-denuncia')} className="button-delete">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabla de Lugares de Denuncia */}
      <h3>Lugares de Denuncia</h3>
      <table className="tabla-denuncias">
        <thead>
          <tr>
            <th className="col-lugar">Lugar</th>
            <th className="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lugarDenuncias.map((lugar) => (
            <tr key={lugar.id}>
              <td>{lugar.descripcion}</td>
              <td>
                <button onClick={() => manejarEliminar(lugar.id, 'lugar-denuncia')} className="button-delete">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para agregar */}
      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Nuevo {denunciaType === 'tipo-denuncia' ? 'Tipo' : 'Lugar'} de Denuncia</h3>
            <input
              type="text"
              className="descripcion-input"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <button onClick={manejarAgregar} className="guardar-button">Guardar</button>
            <button onClick={cerrarModalAgregar} className="cancel-button">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDenunciasTable;
