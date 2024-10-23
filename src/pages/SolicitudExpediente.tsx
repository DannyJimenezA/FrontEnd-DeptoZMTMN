import { useState } from "react";
import "../styles/Administrativos/TablaSolicitudExpediente.css"; // Asegúrate de crear el archivo CSS con los estilos apropiados
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección

function SolicitudExpediente() {
  const [telefonoSolicitante, setTelefonoSolicitante] = useState("");
  const [emailSolicitante, setEmailSolicitante] = useState("");
  const [numeroExpediente, setNumeroExpediente] = useState("");
  const [copiaCertificada, setCopiaCertificada] = useState<string | null>(null);
  const navigate = useNavigate(); // Usar para redirigir al usuario

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
      emailSolicitante,
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

      // Mostrar alerta al usuario y redirigir al inicio
      window.alert('La solicitud de expediente ha sido enviada exitosamente.');
      navigate('/'); // Redirigir a la página de inicio

    } catch (error) {
      console.error("Error en el envío del formulario:", error);
      window.alert('Hubo un error al enviar la solicitud. Inténtalo nuevamente.');
    }
  };

  const parseJwt = (token: string) => {
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
          <label>Correo Electronico:</label>
          <input
            type="text"
            value={emailSolicitante}
            onChange={(e) => setEmailSolicitante(e.target.value)}
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
