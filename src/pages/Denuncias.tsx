import { useState } from "react";
import "../styles/FormularioDenuncia.css"
function Denuncias () {
  const [adjuntaPruebas, setAdjuntaPruebas] = useState(null); // Estado para controlar la opción de pruebas
  const [file, setFile] = useState(null);

  const handlePruebasChange = (event) => {
      setAdjuntaPruebas(event.target.value);
  };

  const handleFileChange = (event) => {
      setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
      event.preventDefault();
      // Aquí puedes manejar el envío del formulario
      console.log('Formulario enviado');
      console.log(file);
  };
  return (
    <div className="form-container">
            <h2>MUNICIPALIDAD DE NICOYA<br />DEPARTAMENTO DE ZONA MARÍTIMO TERRESTRE</h2>
            <h3>FORMULARIO DE DENUNCIA</h3>
            <p>Uso exclusivo del Administrado.</p>
            
            <form onSubmit={handleSubmit}>
                {/* Campos del formulario como antes... */}
                <div className="form-group">
                    <label>Nombre denunciante (Opcional):</label>
                    <input type="text" />
                </div>
                <div className="form-group">
                    <label>Número de Cédula (Opcional):</label>
                    <input type="text" />
                </div>
                <div className="form-group">
                    <label>Número de Teléfono (Opcional):</label>
                    <input type="text" />
                </div>
                <div className="form-group">
                    <label>Desea ser notificado del resultado de su denuncia:</label>
                    <div>
                        <input type="radio" name="notificacion" value="si" /> Sí
                        <input type="radio" name="notificacion" value="no" /> NO
                    </div>
                </div>
                <div className="form-group">
                    <label>Medio de notificaciones:</label>
                    <input type="text" />
                </div>
                <div className="form-group">
                    <label>Detalle ampliamente los hechos de su denuncia:</label>
                    <textarea></textarea>
                </div>
                <div className="form-group">
                    <label>Ubicación exacta:</label>
                    <textarea></textarea>
                </div>

                {/* Campo de adjunta pruebas con control de visibilidad */}
                <div className="form-group">
                    <label>Adjunta pruebas:</label>
                    <div>
                        <input
                            type="radio"
                            name="pruebas"
                            value="si"
                            onChange={handlePruebasChange}
                        /> Sí
                        <input
                            type="radio"
                            name="pruebas"
                            value="no"
                            onChange={handlePruebasChange}
                        /> NO
                    </div>
                </div>

                {adjuntaPruebas === "si" && (
                    <div className="form-group">
                        <label>Adjuntar archivo:</label>
                        <input type="file" onChange={handleFileChange} />
                    </div>
                )}

                <div className="form-group">
                    <label>Detalles:</label>
                    <textarea></textarea>
                </div>


                {/* Botón de enviar */}
                <div className="form-group">
                    <button type="submit">Enviar</button>
                </div>
            </form>
        </div>
    );
}


export default Denuncias;
