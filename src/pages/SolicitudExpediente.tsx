import { useState } from "react";
import "../styles/Administrativos/TablaSolicitudExpediente.css"; // Asegúrate de crear el archivo CSS con los estilos apropiados

function SolicitudExpediente() {
  const [nombreSolicitante, setNombreSolicitante] = useState("");
  const [numeroCedula, setNumeroCedula] = useState("");
  const [telefonoSolicitante, setTelefonoSolicitante] = useState("");
  const [medioNotificacion, setMedioNotificacion] = useState("");
  const [numeroExpediente, setNumeroExpediente] = useState("");
  const [copiaCertificada, setCopiaCertificada] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aquí puedes manejar el envío del formulario
    const solicitud = {
      nombreSolicitante,
      numeroCedula,
      telefonoSolicitante,
      medioNotificacion,
      numeroExpediente,
      copiaCertificada,
    };
    console.log("Formulario enviado:", solicitud);
    // Puedes agregar la lógica para enviar esta información al backend o procesarla según sea necesario
  };

  return (
    <div className="form-container">
      <h2>MUNICIPALIDAD DE NICOYA</h2>
      <h3>DEPARTAMENTO DE ZONA MARÍTIMO TERRESTRE</h3>
      <h3>SOLICITUD DE COPIA EXPEDIENTE</h3>
      <p>Uso exclusivo del Administrado.</p>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Número telefónico:</label>
          <input
            type="tel"
            value={telefonoSolicitante}
            onChange={(e) => setTelefonoSolicitante(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Medio de notificaciones:</label>
          <input
            type="text"
            value={medioNotificacion}
            onChange={(e) => setMedioNotificacion(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Nombre de expediente ó Número:</label>
          <input
            type="text"
            value={numeroExpediente}
            onChange={(e) => setNumeroExpediente(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Copia certificada:</label>
          <div>
            <input
              type="radio"
              name="copiaCertificada"
              value="sí"
              onChange={() => setCopiaCertificada("sí")}
              required
            />{" "}
            Sí
            <input
              type="radio"
              name="copiaCertificada"
              value="no"
              onChange={() => setCopiaCertificada("no")}
              required
            />{" "}
            No
          </div>
        </div>

        <div className="form-group">
          <button type="submit">Enviar Solicitud</button>
        </div>
      </form>
    </div>
  );
}

export default SolicitudExpediente;
