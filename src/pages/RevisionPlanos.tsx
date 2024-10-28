import React, { useState } from "react";
import "../styles/RevisionPlanos.css";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

function RevisionPlanos() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: unknown) => {
    const formData = new FormData();

    if (selectedFiles && selectedFiles.length > 0) {
      Array.from(selectedFiles).forEach((file) => {
        formData.append('files', file);
      });
    } else {
      window.alert('Debe seleccionar al menos un archivo.');
      return;
    }

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    const userId = decodedToken?.sub;

    if (!userId) {
      console.error("User ID is missing from the token.");
      return;
    }

    // Estructura para la solicitud que se envía al backend
    const revisionData = {
      userId,
      NumeroExpediente: data.expediente,    // Se obtiene del formulario
      NumeroPlano: data.numeroPlano,        // Se obtiene del formulario
      Comentario: data.comentarios || "",   // Comentarios opcionales
      ArchivosAdjuntos: Array.from(selectedFiles).map(file => ({
        nombre: file.name,
        ruta: `/uploads/${file.name}` // Aquí puedes manejar la ruta dependiendo de tu servidor de almacenamiento
      })),
    };

    formData.append('userId', revisionData.userId.toString());
    formData.append('NumeroExpediente', revisionData.NumeroExpediente);
    formData.append('NumeroPlano', revisionData.NumeroPlano);
    formData.append('Comentario', revisionData.Comentario);
    formData.append('ArchivosAdjuntos', JSON.stringify(revisionData.ArchivosAdjuntos));
     // Convertimos a JSON
    try {
      const response = await fetch('http://localhost:3000/revision-plano', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        window.alert(errorResponse.message || 'Error al enviar los datos al servidor');
        throw new Error('Error al enviar los datos al servidor');
      }

      window.alert('La revisión de planos ha sido enviada exitosamente.');
      navigate('/');
    } catch (error) {
      window.alert('Hubo un error al enviar la revisión de planos. Inténtalo nuevamente.');
    }
  };

  const parseJwt = (token: string | null) => {
    if (!token) {
      console.error('Token no disponible');
      return null;
    }
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const validFiles = Array.from(files).every((file) => file.type === 'application/pdf');
    if (!validFiles) {
      window.alert('Solo se permiten archivos PDF.');
      setSelectedFiles(null);
      return;
    }
    setValue('files', files);
    setSelectedFiles(files);
  };

  return (
    <div className="container">
      <h1 className="form-title">Revisión de Planos</h1>
      <p className="form-subtitle">*Complete los detalles para la revisión de planos*</p>

      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-field">
            <label className="form-label">Número de Expediente:</label>
            <input
              type="text"
              {...register('expediente', { required: true, pattern: /^[A-Za-z0-9]+$/ })}
              className="form-input"
              placeholder="Ingrese el número de expediente"
            />
            {errors.expediente && (
              <p className="error-message">El número de expediente es obligatorio y debe ser alfanumérico</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Número de Plano:</label>
            <input
              type="text"
              {...register('numeroPlano', { required: true })}
              className="form-input"
              placeholder="Ingrese el número de plano"
            />
            {errors.numeroPlano && (
              <p className="error-message">El número de plano es obligatorio</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Archivos de Planos:</label>
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={handleFileChange}
              className="form-input"
            />
            {errors.files && (
              <p className="error-message">Debe subir al menos un archivo PDF</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Comentarios:</label>
            <textarea
              {...register('comentarios')}
              className="form-input"
              placeholder="Escriba comentarios adicionales"
            />
          </div>

          <button type="submit" className="submit-button">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default RevisionPlanos;
