import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../styles/VistaSolicitudesExpedientes.css';
import axios from 'axios';

interface Solicitud {
  idExpediente: string;
  nombreExpediente: string;
  numeroExpediente: string;
  copiaCertificada: boolean;
  status: string;
}

const VistaSolicitudesExpediente: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedSolicitud, setEditedSolicitud] = useState<Solicitud | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null); // ID de la solicitud a editar o eliminar
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch("http://localhost:3000/expedientes");
        if (!response.ok) {
          throw new Error("Error al cargar las solicitudes");
        }
        const data: Solicitud[] = await response.json();
        setSolicitudes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditedSolicitud({ ...solicitudes[index] });
    setIsEditModalOpen(true); // Abrir modal de edición
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditedSolicitud(prev => prev ? {
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    } : null);
  };

  const handleSaveEdit = async () => {
    if (editedSolicitud) {
      const updatedSolicitud = {
        numeroExpediente: editedSolicitud.numeroExpediente,
        copiaCertificada: editedSolicitud.copiaCertificada,
      };

      try {
        const response = await axios.put(`http://localhost:3000/expedientes/${editedSolicitud.idExpediente}`, updatedSolicitud);
        if (response.status >= 200 && response.status < 300) {
          alert("Solicitud actualizada exitosamente");
          setEditIndex(null);
          setEditedSolicitud(null);
          setIsEditModalOpen(false); // Cerrar modal de edición
          setSolicitudes(prev =>
            prev.map(solicitud =>
              solicitud.idExpediente === editedSolicitud.idExpediente ? { ...solicitud, ...updatedSolicitud } : solicitud
            )
          );
        } else {
          alert("Hubo un error al actualizar la solicitud: " + response.data.message);
        }
      } catch (error) {
        console.error("Error al actualizar la solicitud:", error);
        alert("Hubo un error al actualizar la solicitud: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedSolicitud(null);
    setIsEditModalOpen(false); // Cerrar modal de edición
  };

  // Función para abrir el modal de eliminación
  const handleDeleteClick = (idExpediente: string) => {
    setCurrentId(idExpediente);
    setIsDeleteModalOpen(true); // Abrir modal de confirmación de eliminación
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/expedientes/${currentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la solicitud');
      }

      setSolicitudes(prev => prev.filter(solicitud => solicitud.idExpediente !== currentId));
      setIsDeleteModalOpen(false); // Cerrar modal de confirmación
    } catch (error) {
      console.error("Error al eliminar la solicitud:", error);
      alert("Hubo un error al eliminar la solicitud: " + (error.response?.data?.message || error.message));
    }
  };

  // Función para redirigir a la creación de una nueva solicitud
  const handleCrearSolicitud = () => {
    navigate("/solicitud-expediente");
  };

  return (
    <div className="vista-solicitudes-expediente">
      <h1>Mis Solicitudes de Expediente</h1>

      {solicitudes.length === 0 ? (
        <p>No tienes solicitudes de expediente.</p>
      ) : (
        <div className="solicitudes-grid">
          {solicitudes.map((solicitud, index) => (
            <div key={solicitud.idExpediente} className="solicitud-card">
              {editIndex === index ? (
                // Modo de edición
                <div className="card-edit-mode">
                  <input
                    type="text"
                    name="numeroExpediente"
                    value={editedSolicitud?.numeroExpediente || ''}
                    onChange={handleInputChange}
                  />
                  <label>
                    Copia Certificada:
                    <input
                      type="checkbox"
                      name="copiaCertificada"
                      checked={editedSolicitud?.copiaCertificada || false}
                      onChange={handleInputChange}
                    />
                  </label>
                  <button onClick={handleSaveEdit}>Guardar</button>
                  <button onClick={handleCancelEdit}>Cancelar</button>
                </div>
              ) : (
                // Modo de visualización
                <div className="card-view-mode">
                  <h3>{solicitud.nombreExpediente}</h3>
                  <p><strong>Número de Expediente:</strong> {solicitud.numeroExpediente}</p>
                  <p><strong>Copia Certificada:</strong> {solicitud.copiaCertificada ? 'Sí' : 'No'}</p>
                  <p><strong>Estado:</strong> {solicitud.status}</p>
                  <button onClick={() => handleEditClick(index)}>Editar</button>
                  <button onClick={() => handleDeleteClick(solicitud.idExpediente)} className="eliminar">Eliminar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="boton-crear-solicitud">
        <button onClick={handleCrearSolicitud}>Crear Nueva Solicitud</button>
      </div>

      {/* Modal para confirmación de eliminación */}
      <Modal isOpen={isDeleteModalOpen} onRequestClose={() => setIsDeleteModalOpen(false)}>
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar esta solicitud?</p>
        <button onClick={confirmDelete}>Confirmar</button>
        <button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
      </Modal>

      {/* Modal para edición */}
      <Modal isOpen={isEditModalOpen} onRequestClose={handleCancelEdit}>
        <h2>Editar Solicitud</h2>
        <input
          type="text"
          name="numeroExpediente"
          value={editedSolicitud?.numeroExpediente || ''}
          onChange={handleInputChange}
        />
        <label>
          Copia Certificada:
          <input
            type="checkbox"
            name="copiaCertificada"
            checked={editedSolicitud?.copiaCertificada || false}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={handleSaveEdit}>Guardar</button>
        <button onClick={handleCancelEdit}>Cancelar</button>
      </Modal>
    </div>
  );
};

export default VistaSolicitudesExpediente;
