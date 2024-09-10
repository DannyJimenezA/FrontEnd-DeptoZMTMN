import "../styles/ProrrogaConcesion.css";
import { useForm } from "react-hook-form";

function ProrrogaConcesion() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data: unknown) => {
    console.log(data);
    // Lógica para enviar los documentos al servidor.
  };

  return (
    <div className="container">
      <h1 className="form-title">Solicitud de Prórroga de Concesión</h1>
      <p className="form-subtitle">*Descripción de la solicitud de prórroga*</p>

      {/* Apartado para descargar un PDF relacionado con la prórroga */}
      <div className="pdf-download">
        <a href="/assets/ProrrogaConcesion.pdf" download>
          Descargar PDF de Prórroga
        </a>
      </div>

      <div className="form-container">
        <h2>Por favor, envíe todos los documentos necesarios para la prórroga</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-field">
            <label className="form-label">Solicitud de Prórroga de Concesión:</label>
            <input type="file" {...register('documentoProrroga', { required: true })} className="form-input" />
            {errors.documentoProrroga && <p className="error-message">Este campo es obligatorio</p>}
          </div>

          <div className="form-field">
            <label className="form-label">Carta de solicitud:</label>
            <input type="file" {...register('cartaSolicitud', { required: true })} className="form-input" />
            {errors.cartaSolicitud && <p className="error-message">Este campo es obligatorio</p>}
          </div>

          <div className="form-field">
            <label className="form-label">Informe técnico:</label>
            <input type="file" {...register('informeTecnico', { required: true })} className="form-input" />
            {errors.informeTecnico && <p className="error-message">Este campo es obligatorio</p>}
          </div>

          <div className="form-field">
            <label className="form-label">Plano actualizado:</label>
            <input type="file" {...register('planoActualizado', { required: true })} className="form-input" />
            {errors.planoActualizado && <p className="error-message">Este campo es obligatorio</p>}
          </div>

          <div className="form-field">
            <label className="form-label">Certificación de pagos al día:</label>
            <input type="file" {...register('certificacionPagos', { required: true })} className="form-input" />
            {errors.certificacionPagos && <p className="error-message">Este campo es obligatorio</p>}
          </div>

          <div className="form-field">
            <label className="form-label">Otros documentos (Opcional):</label>
            <input type="text" placeholder="Especificar cuál" {...register('otrosEspecificar')} className="form-input" />
            <input type="file" {...register('otros')} className="form-input" />
          </div>

          <button type="submit" className="submit-button">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default ProrrogaConcesion;