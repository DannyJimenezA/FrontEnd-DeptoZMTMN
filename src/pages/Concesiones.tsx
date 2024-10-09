import React, { useEffect, useState } from "react";
import "../styles/SolicitudConcesion.css"; // Asegúrate de que la hoja de estilos esté correctamente importada
import { useForm } from "react-hook-form";
import { FaRegFileAlt } from "react-icons/fa";

function Concesiones() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const onSubmit = async (data: any) => {
    // Crear un objeto FormData para manejar archivos y otros datos
    const formData = new FormData();

    // Verificar si existen archivos seleccionados
    if (selectedFiles && selectedFiles.length > 0) {
      Array.from(selectedFiles).forEach((file) => {
        formData.append('files', file); // Agregamos cada archivo de concesión al FormData
      });
    } else {
      console.error('No se ha seleccionado ningún archivo de concesión.');
      return;
    }

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token); // Función para decodificar el JWT
    const userId = decodedToken?.sub;
    if (!userId) {
      console.error("User ID is missing from the token.");
      return;
    }

    // Agregar el userId a los datos del formulario
    formData.append('userId', userId.toString());

    // Mostrar en consola los datos enviados
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Enviar el formulario al backend
    try {
      const response = await fetch('http://localhost:3000/concesiones', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error en el servidor:', errorResponse); // Mostrar el mensaje de error específico del servidor
        throw new Error('Error al enviar los datos al servidor');
      }

      const result = await response.json();
      console.log('Resultado del servidor:', result);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  const parseJwt = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      console.log("Decoded Token:", decoded);
      return decoded;
    } catch (e) {
      return null;
    }
  };

  // Manejar la selección de múltiples archivos
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files); // Actualizamos el estado con los archivos seleccionados
  };

  return (
    <div className="container">
      <h1 className="form-title">Solicitud de Concesión</h1>
      <p className="form-subtitle">*Descripción de la solicitud de concesión*</p>

      {/* Apartado para descargar un PDF relacionado con la concesión */}
      <div className="pdf-download">
        <a href="/assets/Concesion.pdf" download>
          <FaRegFileAlt /> Descargar PDF de Concesión
        </a>
      </div>

      <div className="form-container">
        <h2>Favor enviar todos los documentos necesarios para la concesión</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {/* Documentos de concesión (múltiples archivos) */}
          <div className="form-field">
            <label className="form-label">Documentos de Concesión:</label>
            <input
              type="file"
              multiple // Permitir múltiples archivos
              accept="application/pdf" // Solo permite archivos PDF
              {...register('files', { required: true })} // Registro en react-hook-form
              onChange={handleFileChange} // Manejador de cambio
              className="form-input"
            />
            {errors.files && (
              <p className="error-message">Debe subir al menos un archivo PDF</p>
            )}
          </div>

          {/* Otros campos opcionales */}
          <div className="form-field">
            <label className="form-label">Otros Documentos (Opcional):</label>
            <input
              type="text"
              placeholder="Especificar cuál"
              {...register('otrosEspecificar')}
              className="form-input"
            />
            <input
              type="file"
              {...register('otros')}
              className="form-input"
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

export default Concesiones;
