import { useState } from "react";
import "../styles/Administrativos/TablaSolicitudExpediente.css"; // Asegúrate de crear el archivo CSS con los estilos apropiados

function SolicitudExpediente() {
  
  const [telefonoSolicitante, setTelefonoSolicitante] = useState("");
  const [medioNotificacion, setMedioNotificacion] = useState("");
  const [numeroExpediente, setNumeroExpediente] = useState("");
  const [copiaCertificada, setCopiaCertificada] = useState<string | null>(null);
  const [errorMessage, setErrorMessage]= useState<string | null>(null);
  const [succesMessage, setSuccesMessage] = useState<string | null>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Obtener el token desde localStorage
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token no disponible");
        return;
    }

    // Decodificar el token para extraer el userId
    const decodedToken: any = parseJwt(token); // Usa parseJwt para decodificar
    console.log("Decoded Token:", decodedToken);
  

    const userId = decodedToken.sub; // Ajustar según cómo esté estructurado el token

    if (!userId) {
        console.error("No se pudo extraer el userId del token");
        return;
    }

    const solicitud = {
        userId,  // Incluye el userId en la solicitud
        telefonoSolicitante,
        medioNotificacion,
        numeroExpediente,
        copiaCertificada,
    };

    try {
        const response = await fetch("http://localhost:3000/expedientes/solicitud", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(solicitud),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la solicitud:", errorData);
            return;
        }

        const responseData = await response.json();
        console.log("Solicitud exitosa", responseData);
    } catch (error) {
        console.error("Error en el envío del formulario:", error);
    }
};
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
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
