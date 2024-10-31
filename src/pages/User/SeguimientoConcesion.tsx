import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../../styles/SeguimientoConcesiones.css';
import { FaEye, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { Concesion } from "../../Types/Types";

function SeguimientoConcesiones() {
  const [concesiones, setConcesiones] = useState<Concesion[]>([]);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [editedConcesiones, setEditedConcesiones] = useState<{ [key: number]: Partial<Concesion> }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConcesiones = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró un token de autenticación.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/concesiones/my-concessions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: Concesion[] = await response.json();
          setConcesiones(data);
        } else if (response.status === 401) {
          console.error('No autorizado.');
          navigate('/login');
        } else {
          console.error('Error al obtener las concesiones');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchConcesiones();
  }, [navigate]);

  const handleCrearConcesion = () => {
    navigate('/concesiones');
  };

  const handleVerPDF = async (archivoAdjunto: string) => {
    const token = localStorage.getItem('token');
    const pdfUrl = `http://localhost:3000/${archivoAdjunto}`;

    try {
      const response = await fetch(pdfUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const fileUrl = window.URL.createObjectURL(blob);
        window.open(fileUrl, '_blank');
      } else {
        console.error('Error al obtener el archivo PDF');
        window.alert('No se pudo abrir el archivo PDF');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      window.alert('Error al abrir el archivo PDF');
    }
  };

  const handleEditarConcesion = (id: number) => {
    setEditMode({ ...editMode, [id]: true });
    // Guardamos una copia de la concesión actual para editar
    const concesion = concesiones.find(c => c.id === id);
    if (concesion) {
      setEditedConcesiones({ ...editedConcesiones, [id]: { ...concesion } });
    }
  };

  const handleCancelarEdicion = (id: number) => {
    setEditMode({ ...editMode, [id]: false });
    setEditedConcesiones({ ...editedConcesiones, [id]: {} });
  };

  const handleGuardarConcesion = async (id: number) => {
    const token = localStorage.getItem('token');
    const editedData = editedConcesiones[id];

    try {
      const response = await fetch(`http://localhost:3000/concesiones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        // Actualizar la concesión en el estado local
        setConcesiones(concesiones.map(c => (c.id === id ? { ...c, ...editedData } : c)));
        setEditMode({ ...editMode, [id]: false });
        setEditedConcesiones({ ...editedConcesiones, [id]: {} });
        window.alert('Concesión actualizada exitosamente.');
      } else {
        console.error('Error al actualizar la concesión');
        window.alert('No se pudo actualizar la concesión.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      window.alert('Error al actualizar la concesión.');
    }
  };

  const handleEliminarConcesion = async (id: number) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta concesión?');
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/concesiones/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Actualizar la lista de concesiones después de eliminar
        setConcesiones(concesiones.filter(concesion => concesion.id !== id));
        window.alert('La concesión ha sido eliminada exitosamente.');
      } else {
        console.error('Error al eliminar la concesión');
        window.alert('No se pudo eliminar la concesión.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      window.alert('Error al eliminar la concesión.');
    }
  };

  // Manejar cambios en los campos editables
  const handleChange = (id: number, field: keyof Concesion, value: any) => {
    setEditedConcesiones({
      ...editedConcesiones,
      [id]: { ...editedConcesiones[id], [field]: value },
    });
  };

  return (
    <div className="vista-solicitudes-concesion">
      <h1>Mis Concesiones</h1>
      <button onClick={handleCrearConcesion}>Crear Nueva Concesión</button>
      <div className="solicitudes-grid">
        {concesiones.length > 0 ? (
          concesiones.map((concesion) => (
            <div key={concesion.id} className="solicitud-card">
              {editMode[concesion.id] ? (
                // Modo edición
                <div>
                  <h3>Editando Concesión #{concesion.id}</h3>
                  <div className="form-field">
                    <label>Estado:</label>
                    <select
                      value={editedConcesiones[concesion.id]?.Status || ''}
                      onChange={(e) => handleChange(concesion.id, 'Status', e.target.value)}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Aprobada">Aprobada</option>
                      <option value="Denegada">Denegada</option>
                    </select>
                  </div>
                  {/* Agrega otros campos editables si es necesario */}
                  <div className="card-buttons">
                    <button className="guardar" onClick={() => handleGuardarConcesion(concesion.id)}>
                      <FaSave /> Guardar
                    </button>
                    <button className="cancelar" onClick={() => handleCancelarEdicion(concesion.id)}>
                      <FaTimes /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo vista
                <div>
                  <h3>Concesión #{concesion.id}</h3>
                  <p>Fecha: {new Date(concesion.Date).toLocaleDateString()}</p>
                  <p>Estado: {concesion.Status || 'Pendiente'}</p>
                  <div className="card-buttons">
                    <button className="ver-pdf" onClick={() => handleVerPDF(concesion.ArchivoAdjunto)}>
                      <FaEye /> Ver Archivo
                    </button>
                    <button className="editar" onClick={() => handleEditarConcesion(concesion.id)}>
                      <FaEdit /> Editar
                    </button>
                    <button className="eliminar" onClick={() => handleEliminarConcesion(concesion.id)}>
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No tienes concesiones registradas.</p>
        )}
      </div>
    </div>
  );
}

export default SeguimientoConcesiones;
