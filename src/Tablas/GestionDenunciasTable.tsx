// import React, { useState, useEffect } from 'react';
// import ApiRoutes from '../components/ApiRoutes';

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
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [descripcion, setDescripcion] = useState<string>('');
//   const [denunciaType, setDenunciaType] = useState<'tipo-denuncia' | 'lugar-denuncia'>('tipo-denuncia');
//   const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
//   const [deleteId, setDeleteId] = useState<number | null>(null);
//   const [deleteType, setDeleteType] = useState<'tipo-denuncia' | 'lugar-denuncia' | null>(null);
//   const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

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

//   const abrirConfirmacionEliminar = (id: number, tipo: 'tipo-denuncia' | 'lugar-denuncia') => {
//     setIsConfirmingDelete(true);
//     setDeleteId(id);
//     setDeleteType(tipo);
//     document.body.style.overflow = 'hidden'; // Bloquea el desplazamiento
//   };

//   const manejarEliminar = async () => {
//     if (!deleteId || !deleteType) return;

//     try {
//       const response = await fetch(`${ApiRoutes.urlBase}/${deleteType}/${deleteId}`, { method: 'DELETE' });
//       if (response.ok) {
//         if (deleteType === 'tipo-denuncia') {
//           setTipoDenuncias((prev) => prev.filter((item) => item.id !== deleteId));
//         } else {
//           setLugarDenuncias((prev) => prev.filter((item) => item.id !== deleteId));
//         }
//         setDeleteMessage('Registro eliminado exitosamente.');
//         setTimeout(cancelarEliminar, 2000); // Cierra el modal después de 2s
//       }
//     } catch (error) {
//       console.error(`Error eliminando ${deleteType}:`, error);
//       setDeleteMessage('Ocurrió un error al eliminar el registro.');
//     }
//   };

//   const cancelarEliminar = () => {
//     setIsConfirmingDelete(false);
//     setDeleteId(null);
//     setDeleteType(null);
//     setDeleteMessage(null);
//     document.body.style.overflow = 'auto'; // Restaura el desplazamiento
//   };

//   const abrirModal = (id: number | null, descripcionActual: string, tipo: 'tipo-denuncia' | 'lugar-denuncia') => {
//     setIsEditing(true);
//     setEditingId(id);
//     setDescripcion(descripcionActual);
//     setDenunciaType(tipo);
//     document.body.style.overflow = 'hidden';
//   };

//   const manejarGuardar = async () => {
//     if (descripcion.trim() === '') {
//       alert('La descripción no puede estar vacía.');
//       return;
//     }

//     const url = editingId
//       ? `${ApiRoutes.urlBase}/${denunciaType}/${editingId}`
//       : `${ApiRoutes.urlBase}/${denunciaType}`;
//     const method = editingId ? 'PUT' : 'POST';

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ descripcion }),
//       });

//       if (!response.ok) {
//         throw new Error(`Error ${editingId ? 'actualizando' : 'agregando'} ${denunciaType}: ${response.statusText}`);
//       }

//       const nuevaDenuncia = await response.json();
//       if (denunciaType === 'tipo-denuncia') {
//         setTipoDenuncias((prev) =>
//           editingId ? prev.map((item) => (item.id === nuevaDenuncia.id ? nuevaDenuncia : item)) : [...prev, nuevaDenuncia]
//         );
//       }

//       cancelarEdicion();
//     } catch (error) {
//       console.error(`Error ${editingId ? 'actualizando' : 'agregando'} ${denunciaType}:`, error);
//       alert('Ocurrió un error al guardar el registro.');
//     }
//   };

//   const cancelarEdicion = () => {
//     setIsEditing(false);
//     setEditingId(null);
//     setDescripcion('');
//     document.body.style.overflow = 'auto';
//   };

//   return (
//     <div className="tabla-container">
//       <h2>Gestión de Denuncias</h2>

//       {/* Botón para agregar nuevo tipo de denuncia */}
//       <button className="add-button" onClick={() => abrirModal(null, '', 'tipo-denuncia')}>
//         Agregar Nuevo Tipo de Denuncia
//       </button>

//       {/* Tabla de Tipo de Denuncia */}
//       <h3>Tipos de Denuncia</h3>
//       <table className="tabla-denuncias">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Descripción</th>
//             <th>Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//   {tipoDenuncias.map((tipo) => (
//     <tr key={tipo.id}>
//       <td>{tipo.id}</td>
//       <td>{tipo.descripcion}</td>
//       <td>
//         <button onClick={() => abrirModal(tipo.id, tipo.descripcion, 'tipo-denuncia')}>Editar</button>
//         <button onClick={() => abrirConfirmacionEliminar(tipo.id, 'tipo-denuncia')} className="button-delete">
//           Eliminar
//         </button>
//       </td>
//     </tr> 
//   ))}
// </tbody>
//       </table>
//       {/* Tabla de Lugar de Denuncia */}
//       <h3>Lugares de Denuncia</h3>
//       <table className="tabla-denuncias">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Descripción</th>
//             <th>Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {lugarDenuncias.map((lugar) => (
//             <tr key={lugar.id}>
//               <td>{lugar.id}</td>
//               <td>{lugar.descripcion}</td>
//               <td>
//                 <button onClick={() => abrirModal(lugar.id, lugar.descripcion, 'lugar-denuncia')} className="button-view">
//                   Editar
//                 </button>
//                 <button onClick={() => abrirConfirmacionEliminar(lugar.id, 'lugar-denuncia')} className="button-delete">
//                   Eliminar
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal */}
//       {isEditing && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>{editingId ? 'Editar' : 'Agregar'} {denunciaType === 'tipo-denuncia' ? 'Tipo' : 'Lugar'} de Denuncia</h3>
//             <input
//               type="text"
//               placeholder="Descripción"
//               value={descripcion}
//               onChange={(e) => setDescripcion(e.target.value)}
//             />
//             <button onClick={manejarGuardar}>Guardar</button>
//             <button onClick={cancelarEdicion} className="cancel-button">Cancelar</button>
//           </div>
//         </div>
//       )}
//       {/* MODAL DE CONFIRMACIÓN */}
//       {isConfirmingDelete && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             {deleteMessage ? (
//               <p>{deleteMessage}</p>
//             ) : (
//               <>
//                 <h3>¿Seguro que quieres eliminar este registro?</h3>
//                 <p>Esta acción no se puede deshacer.</p>
//                 <button onClick={manejarEliminar} className="button-delete">Eliminar</button>
//                 <button onClick={cancelarEliminar} className="cancel-button">Cancelar</button>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Estilos */}
//       <style>{`
//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(0, 0, 0, 0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//         }
//         .modal-content {
//           background: white;
//           padding: 20px;
//           border-radius: 8px;
//           width: 300px;
//           text-align: center;
//           box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
//         }
//         .cancel-button {
//           background: red;
//           color: white;
//           margin-left: 10px;
//         }
//         .add-button {
//           margin-bottom: 10px;
//           padding: 10px;
//           background: #007bff;
//           color: white;
//           border: none;
//           cursor: pointer;
//           border-radius: 5px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default GestionDenunciasTable;

import React, { useState, useEffect } from 'react';
import ApiRoutes from '../components/ApiRoutes';

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
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteType, setDeleteType] = useState<'tipo-denuncia' | 'lugar-denuncia' | null>(null);

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

  // Abrir el modal para agregar
  const abrirModalAgregar = (tipo: 'tipo-denuncia' | 'lugar-denuncia') => {
    setIsAdding(true);
    setDenunciaType(tipo);
    setDescripcion('');
  };

  // Cerrar el modal de agregar
  const cerrarModalAgregar = () => {
    setIsAdding(false);
  };

  // Manejar el guardado de un nuevo tipo/lugar de denuncia
  const manejarAgregar = async () => {
    if (!descripcion.trim()) {
      alert('Por favor, ingresa una descripción.');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/${denunciaType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion }),
      });

      if (!response.ok) {
        throw new Error(`Error al agregar ${denunciaType}.`);
      }

      const nuevaDenuncia = await response.json();

      if (denunciaType === 'tipo-denuncia') {
        setTipoDenuncias([...tipoDenuncias, nuevaDenuncia]);
      } else {
        setLugarDenuncias([...lugarDenuncias, nuevaDenuncia]);
      }

      cerrarModalAgregar();
    } catch (error) {
      console.error(`Error agregando ${denunciaType}:`, error);
      alert('Ocurrió un error al agregar el registro.');
    }
  };

  // Abrir modal de confirmación para eliminar
  const abrirConfirmacionEliminar = (id: number, tipo: 'tipo-denuncia' | 'lugar-denuncia') => {
    setIsConfirmingDelete(true);
    setDeleteId(id);
    setDeleteType(tipo);
  };

  // Manejar eliminación de tipo/lugar de denuncia
  const manejarEliminar = async () => {
    if (!deleteId || !deleteType) return;

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/${deleteType}/${deleteId}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(`Error al eliminar ${deleteType}.`);
      }

      if (deleteType === 'tipo-denuncia') {
        setTipoDenuncias(tipoDenuncias.filter((item) => item.id !== deleteId));
      } else {
        setLugarDenuncias(lugarDenuncias.filter((item) => item.id !== deleteId));
      }

      setIsConfirmingDelete(false);
      setDeleteId(null);
      setDeleteType(null);
    } catch (error) {
      console.error(`Error eliminando ${deleteType}:`, error);
      alert('Ocurrió un error al eliminar el registro.');
    }
  };

  return (
    <div className="tabla-container">
      <h2>Gestión de Denuncias</h2>

      {/* Botones para agregar */}
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
            {/* <th>ID</th> */}
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipoDenuncias.map((tipo) => (
            <tr key={tipo.id}>
              {/* <td>{tipo.id}</td> */}
              <td>{tipo.descripcion}</td>
              <td>
                <button onClick={() => abrirConfirmacionEliminar(tipo.id, 'tipo-denuncia')} className="button-delete">
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
            {/* <th>ID</th> */}
            <th>Lugar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lugarDenuncias.map((lugar) => (
            <tr key={lugar.id}>
              {/* <td>{lugar.id}</td> */}
              <td>{lugar.descripcion}</td>
              <td>
                <button onClick={() => abrirConfirmacionEliminar(lugar.id, 'lugar-denuncia')} className="button-delete">
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
            <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <button onClick={manejarAgregar}>Guardar</button>
            <button onClick={cerrarModalAgregar} className="cancel-button">Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {isConfirmingDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Seguro que quieres eliminar este registro?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <button onClick={manejarEliminar} className="button-delete">Eliminar</button>
            <button onClick={() => setIsConfirmingDelete(false)} className="cancel-button">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDenunciasTable;
