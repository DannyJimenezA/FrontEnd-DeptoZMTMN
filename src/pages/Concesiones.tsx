import "../styles/SolicitudConcesion.css"
import { useForm } from "react-hook-form";
function  Concesiones () {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
    //lógica para enviar los documentos al servidor.
  };

  return (
    <div className="container">
    <h1 className="form-title">Solicitud de concesion</h1>
    <p className="form-subtitle">*Descripcion de la solicitud*</p>

    {/* Apartado para descargar un PDF */}
    <div className="pdf-download">
      <a href="ruta/a/tu/documento.pdf" download>
        Descargar PDF
      </a>
    </div>

    <div className="form-container">
      <h2>Favor enviar todos los documentos necesarios</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-field">
          <label className="form-label">Solicitud concesion:</label>
          <input type="file" {...register('documentoPrincipal', { required: true })} className="form-input" />
          {errors.documentoPrincipal && <p className="error-message">Este campo es obligatorio</p>}
        </div>

        <div className="form-field">
          <label className="form-label">Documento de Adquisición:</label>
          <input type="file" {...register('documentoAdquisicion', { required: true })} className="form-input" />
          {errors.documentoAdquisicion && <p className="error-message">Este campo es obligatorio</p>}
        </div>

        <div className="form-field">
          <label className="form-label">Plano catastrado o croquis:</label>
          <input type="file" {...register('plano', { required: true })} className="form-input" />
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
        </div>

        <div className="form-field">
          <label className="form-label">Otros(Opcional):</label>
          <input type="text" placeholder="Especificar cuál" {...register('otrosEspecificar')} className="form-input" />
          <input type="file" {...register('otros')} className="form-input" />
        </div>

        <button type="submit" className="submit-button">Enviar</button>
      </form>
    </div>
  </div>
);
};



export default Concesiones;
