import { useEffect, useState } from "react";
import "../styles/SolicitudConcesion.css"
import { useForm } from "react-hook-form";
//import {}from "../assets/PROYECTOS_2024_CE.pdf"
function Concesiones() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar los usuarios

  // Función para obtener los usuarios del backend
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3006/users'); // Ajusta la URL según tu API
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
    console.log(data);
  
    // Crear un objeto FormData para manejar archivos y otros datos
    const formData = new FormData();
  
    // Agregar el ID del usuario seleccionado
    formData.append('userId', data.userId);
  
    // Verificar si existe un archivo en 'documentoPrincipal' antes de agregarlo
    if (data.documentoPrincipal && data.documentoPrincipal.length > 0) {
      formData.append('documentoPrincipal', data.documentoPrincipal[0]); // archivo principal
    } else {
      console.error('No se ha seleccionado un archivo de solicitud de concesión.');
    }
  
    // Verificar si existe el archivo 'otros'
    if (data.otros && data.otros.length > 0) {
      formData.append('otros', data.otros[0]);
    }
  
    try {
      const response = await fetch('http://localhost:3006/concesiones', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar los datos al servidor');
      }
  
      const result = await response.json();
      console.log('Resultado del servidor:', result);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };
  
  return (
    <div className="container">
    <h1 className="form-title">Solicitud de concesion</h1>
    <p className="form-subtitle">*Descripcion de la solicitud*</p>

    {/* Apartado para descargar un PDF */}
    <div className="pdf-download">
      <a href="/assets/SolicitudConcesion.pdf" download>
        Descargar PDF
      </a>
    </div>

    <div className="form-container">
      <h2>Favor enviar todos los documentos necesarios</h2>
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
         {/* Documento de solicitud de concesión */}
          <div className="form-field">
            <label className="form-label">Solicitud de concesión:</label>
            <input type="file" {...register('documentoPrincipal', { required: true })} className="form-input" />
            {errors.documentoPrincipal && <p className="error-message">Este campo es obligatorio</p>}
          </div>

          {/* Otros campos */}
          <div className="form-field">
            <label className="form-label">Otros (Opcional):</label>
            <input type="text" placeholder="Especificar cuál" {...register('otrosEspecificar')} className="form-input" />
            <input type="file" {...register('otros')} className="form-input" />
          </div>


        {/* <div className="form-field">
          <label className="form-label">Documento de Adquisición:</label>
          <input type="file" {...register('documentoAdquisicion', { required: false })} className="form-input" />
          {errors.documentoAdquisicion && <p className="error-message">Este campo es obligatorio</p>}
        </div>

        <div className="form-field">
          <label className="form-label">Plano catastrado o croquis:</label>
          <input type="file" {...register('plano', { required: false })} className="form-input" />
          {errors.plano && <p className="error-message">Este campo es obligatorio</p>}
        </div>

        <div className="form-field">
          <label className="form-label">Certificación migracion (Solo extranjeros):</label>
          <input type="file" {...register('certificacion')} className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label">Copia certificada de la constitucion (Personas juridicas):</label>
          <input type="file" {...register('copia')} className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label">Certificacion notarial, distribucion de capital y personeria (Personas juridicas):</label>
          <input type="file" {...register('certiNota')} className="form-input" />
        </div> */}

        {/* <div className="form-field">
          <label className="form-label">Otros(Opcional):</label>
          <input type="text" placeholder="Especificar cuál" {...register('otrosEspecificar')} className="form-input" />
          <input type="file" {...register('otros')} className="form-input" />
        </div> */}

        <button type="submit" className="submit-button">Enviar</button>
      </form>
    </div>
  </div>
);
};



export default Concesiones;
