import React, { useEffect, useState } from "react";
import "../styles/ProrrogaConcesion.css"; // Asegúrate de que la hoja de estilos esté correctamente importada
import { useForm } from "react-hook-form";

function Prorrogas() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar los usuarios
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Función para obtener los usuarios del backend
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/users'); // Ajusta la URL según tu API
      const data = await response.json();
      setUsuarios(data); // Guardar los usuarios en el estado
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  };

  // Obtener los usuarios cuando el componente se monta
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const onSubmit = async (data: any) => {
    // Crear un objeto FormData para manejar archivos y otros datos
    const formData = new FormData();
  
    // Agregar el ID del usuario seleccionado
    formData.append('userId', data.userId);
  
    // Verificar si existen archivos seleccionados
    if (selectedFiles && selectedFiles.length > 0) {
      Array.from(selectedFiles).forEach((file) => {
        formData.append('prorrogaFiles', file); // Agregamos cada archivo de prórroga al FormData
      });
    } else {
      console.error('No se ha seleccionado ningún archivo de prórroga.');
      return;
    }
  
    // Mostrar en consola los datos enviados
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    // Enviar el formulario al backend
    try {
      const response = await fetch('http://localhost:3000/prorrogas', {
        method: 'POST',
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
          Descargar PDF de Prórroga
        </a>
      </div>

      <div className="form-container">
        <h2>Favor enviar todos los documentos necesarios para la prórroga</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {/* Combo box para seleccionar el usuario */}
          <div className="form-field">
            <label className="form-label">Seleccionar Usuario:</label>
            <select {...register('userId', { required: true })} className="form-input">
              <option value="">Seleccione un usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre} {usuario.apellido1}
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="error-message">Debe seleccionar un usuario</p>
            )}
          </div>
          
          {/* Documentos de prórroga (múltiples archivos) */}
          <div className="form-field">
            <label className="form-label">Documentos de Prórroga:</label>
            <input
              type="file"
              multiple // Permitir múltiples archivos
              accept="application/pdf" // Solo permite archivos PDF
              {...register('prorrogaFiles', { required: true })} // Registro en react-hook-form
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
