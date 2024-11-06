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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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

  // const manejarEliminar = async (id: number, tipo: 'tipo-denuncia' | 'lugar-denuncia') => {
  //   if (window.confirm('¿Está seguro de que desea eliminar este registro?')) {
  //     try {
  //       const response = await fetch(`http://localhost:3000/${tipo}/${id}`, { method: 'DELETE' });
  //       if (response.ok) {
  //         if (tipo === 'tipo-denuncia') {
  //           setTipoDenuncias((prev) => prev.filter((item) => item.id !== id));
  //         } else {
  //           setLugarDenuncias((prev) => prev.filter((item) => item.id !== id));
  //         }
  //       }
  //     } catch (error) {
  //       console.error(`Error eliminando ${tipo}:`, error);
  //     }
  //   }
  // };

  // const manejarEditar = (id: number, descripcionActual: string, tipo: 'tipo-denuncia' | 'lugar-denuncia') => {
  //   setIsEditing(true);
  //   setEditingId(id);
  //   setDescripcion(descripcionActual);
  //   setDenunciaType(tipo);
  // };

  const manejarGuardar = async () => {
    const url = `${ApiRoutes.urlBase}/${denunciaType}${isEditing ? `/${editingId}` : ''}`;
    const method = isEditing ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion }),
      });
  
      if (!response.ok) {
        throw new Error(`Error ${method === 'PUT' ? 'actualizando' : 'agregando'} ${denunciaType}: ${response.statusText}`);
      }
  
      const nuevaDenuncia = await response.json();
  
      // Actualiza el estado según el tipo de denuncia y si es edición o nuevo registro
      if (denunciaType === 'tipo-denuncia') {
        setTipoDenuncias((prev) =>
          isEditing ? prev.map((item) => (item.id === nuevaDenuncia.id ? nuevaDenuncia : item)) : [...prev, nuevaDenuncia]
        );
      } else {
        setLugarDenuncias((prev) =>
          isEditing ? prev.map((item) => (item.id === nuevaDenuncia.id ? nuevaDenuncia : item)) : [...prev, nuevaDenuncia]
        );
      }
  
      // Reinicia el formulario y los estados de edición
      cancelarEdicion();
    } catch (error) {
      console.error(`Error ${isEditing ? 'actualizando' : 'agregando'} ${denunciaType}:`, error);
    }
  };
  
  

  const cancelarEdicion = () => {
    setIsEditing(false);
    setEditingId(null);
    setDescripcion('');
  };

  return (
    <div className="tabla-container">
      <h2>Gestión de Denuncias</h2>

      {/* Formulario para agregar o editar tipo/lugar de denuncia */}
      <div className="formulario">
        <select value={denunciaType} onChange={(e) => setDenunciaType(e.target.value as 'tipo-denuncia' | 'lugar-denuncia')}>
          <option value="tipo-denuncia">Tipo de Denuncia</option>
          <option value="lugar-denuncia">Lugar de Denuncia</option>
        </select>

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button onClick={manejarGuardar}>{isEditing ? 'Actualizar' : 'Agregar'}</button>
        {isEditing && <button onClick={cancelarEdicion}>Cancelar</button>}
      </div>

      {/* Tabla de Tipo de Denuncia */}
      <h3>Tipos de Denuncia</h3>
      <table className="tabla-denuncias">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            {/* <th>Acciones</th> */}
          </tr>
        </thead>
        <tbody>
          {tipoDenuncias.map((tipo) => (
            <tr key={tipo.id}>
              <td>{tipo.id}</td>
              <td>{tipo.descripcion}</td>
              {/* <td>
                <button onClick={() => manejarEditar(tipo.id, tipo.descripcion, 'tipo-denuncia')}>Editar</button>
                <button onClick={() => manejarEliminar(tipo.id, 'tipo-denuncia')}>Eliminar</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabla de Lugar de Denuncia */}
      <h3>Lugares de Denuncia</h3>
      <table className="tabla-denuncias">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            {/* <th>Acciones</th> */}
          </tr>
        </thead>
        <tbody>
          {lugarDenuncias.map((lugar) => (
            <tr key={lugar.id}>
              <td>{lugar.id}</td>
              <td>{lugar.descripcion}</td>
              {/* <td>
                <button onClick={() => manejarEditar(lugar.id, lugar.descripcion, 'lugar-denuncia')}>Editar</button>
                <button onClick={() => manejarEliminar(lugar.id, 'lugar-denuncia')}>Eliminar</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionDenunciasTable;
