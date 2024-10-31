import React, { useState } from "react";
import "../styles/ProrrogaConcesion.css"; // Asegúrate de que la hoja de estilos esté correctamente importada
import { useForm } from "react-hook-form";
import { FaRegFileAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección

function Prorrogas() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const navigate = useNavigate(); // Usar para redirigir al usuario

  const onSubmit = async () => {
    // Crear un objeto FormData para manejar archivos y otros datos
    const formData = new FormData();

    // Verificar si existen archivos seleccionados
    if (selectedFiles && selectedFiles.length > 0) {
      Array.from(selectedFiles).forEach((file) => {
        formData.append('files', file); // Agregamos cada archivo de prórroga al FormData
      });
    } else {
      console.error('No se ha seleccionado ningún archivo de prórroga.');
      return;
    }

    const token = localStorage.getItem('token');
    console.log("Token", token);
    const decodedToken = parseJwt(token);  // Función para decodificar el JWT
    const userId = decodedToken?.sub;  
    if (!userId) {
      console.error("User ID is missing from the token.");
      return;
    }

    // Agregar el userId a los datos del formulario
    formData.append('userId', userId.toString());

    // Enviar el formulario al backend
    try {
      const response = await fetch('http://localhost:3000/prorrogas', {
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

      // Mostrar alerta al usuario y redirigir al inicio
      window.alert('La prórroga ha sido creada exitosamente.');
      navigate('/'); // Redirigir a la página de inicio

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      window.alert('Hubo un error al crear la prórroga. Inténtalo nuevamente.');
    }
  };

  const parseJwt = (token: string | null) => {
    if (!token) {
      return null;
    }
  
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
      <h1 className="form-title">Solicitud de Prórroga</h1>
      <p className="form-subtitle">*Descripción de la solicitud de prórroga*</p>

      {/* Apartado para descargar un PDF relacionado con la prórroga */}
      <div className="pdf-download">
        <a href="/assets/Prorroga.pdf" download>
          <FaRegFileAlt /> Descargar PDF de Prórroga
        </a>
      </div>

      <div className="form-container">
        <h2>Favor enviar todos los documentos necesarios para la prórroga</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {/* Documentos de prórroga (múltiples archivos) */}
          <div className="form-field">
            <label className="form-label">Documentos de Prórroga:</label>
            <input
              type="file"
              multiple // Permitir múltiples archivos
              accept="application/pdf" // Solo permite archivos PDF
              {...register('files', { required: true })} // Registro en react-hook-form
              onChange={handleFileChange} // Manejador de cambio
              className="form-input"
            />
            {errors.prorrogaFiles && (
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

export default Prorrogas;
