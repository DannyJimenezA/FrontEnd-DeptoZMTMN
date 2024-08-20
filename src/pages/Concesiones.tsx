import { useState } from "react";
import "../styles/Concesiones.css";
function  Concesiones () {
  const [formData, setFormData] = useState({
    nombre: "",
    identificacion: "",
    estadoCivil: "",
    profesion: "",
    domicilio: "",
    telefono: "",
    representanteLegal: "",
    identificacionLegal: "",
    calidad: "",
    telefonoLegal: "",
    conyuge: "",
    identificacionFisica: "",
    numeroFinca: "",
    area: "",
    frente: "",
    fondo: "",
    fechaVencimiento: "",
    usoDado: "",
    numeroPlano: "",
    tieneConstrucciones: "",
    mantieneCondiciones: "",
    plazoSolicitado: "",
    detalleCambios: "",
    documentos: {
      planoCatastro: false,
      certificacionPersoneria: false,
      certificacionCapital: false,
      pagoTimbres: false,
      otros: "",
    },
    medioPrincipal: "",
    medioSecundario: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        documentos: {
          ...formData.documentos,
          [name]: checked,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <div className="section">
        <h2>1. DATOS DEL SOLICITANTE</h2>
        <div className="row">
          <label>
            1.1. Nombre o Razón Social:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="row">
          <label>
            1.2. Número de Identificación:
            <input
              type="text"
              name="identificacion"
              value={formData.identificacion}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            1.3. Estado Civil:
            <input
              type="text"
              name="estadoCivil"
              value={formData.estadoCivil}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            1.4. Profesión u Oficio:
            <input
              type="text"
              name="profesion"
              value={formData.profesion}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="row">
          <label>
            1.5. Domicilio Exacto:
            <input
              type="text"
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            1.5. Número de Teléfono:
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </label>
        </div>
      </div>

      <div className="section">
        <h4>Solamente para Personas Jurídicas</h4>
        <div className="row">
          <label>
            1.6. Nombre de Representante Legal:
            <input
              type="text"
              name="representanteLegal"
              value={formData.representanteLegal}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            1.7. Número de Identificación:
            <input
              type="text"
              name="identificacionLegal"
              value={formData.identificacionLegal}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            1.8. Calidad:
            <input
              type="text"
              name="calidad"
              value={formData.calidad}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            1.9. Número de Teléfono:
            <input
              type="text"
              name="telefonoLegal"
              value={formData.telefonoLegal}
              onChange={handleChange}
              required
            />
          </label>
        </div>
      </div>

      <div className="section">
        <h4>Solamente para Personas Físicas</h4>
        <div className="row">
          <label>
            1.10. Nombre del Cónyuge:
            <input
              type="text"
              name="conyuge"
              value={formData.conyuge}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            1.11. Número de Identificación:
            <input
              type="text"
              name="identificacionFisica"
              value={formData.identificacionFisica}
              onChange={handleChange}
              required
            />
          </label>
        </div>
      </div>

      <div className="section">
        <h2>2. DATOS DE LA CONCESIÓN</h2>
        <div className="row">
          <label>
            2.1. Número de Finca:
            <input
              type="text"
              name="numeroFinca"
              value={formData.numeroFinca}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            2.2. Área (M²):
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="row">
          <label>
            2.3. Frente:
            <input
              type="text"
              name="frente"
              value={formData.frente}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            2.4. Fondo:
            <input
              type="text"
              name="fondo"
              value={formData.fondo}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="row">
          <label>
            2.5. Fecha de Vencimiento:
            <input
              type="date"
              name="fechaVencimiento"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            2.6. Uso Dado:
            <input
              type="text"
              name="usoDado"
              value={formData.usoDado}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            2.7. Número de Plano:
            <input
              type="text"
              name="numeroPlano"
              value={formData.numeroPlano}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="row">
          <label>
            2.8. ¿Tiene Construcciones?:
            <div className="radio-group">
              <input
                type="radio"
                name="tieneConstrucciones"
                value="si"
                onChange={handleChange}
                required
              /> Sí
              <input
                type="radio"
                name="tieneConstrucciones"
                value="no"
                onChange={handleChange}
                required
              /> No
            </div>
          </label>
          <label>
            2.9. ¿Mantiene Condiciones?:
            <div className="radio-group">
              <input
                type="radio"
                name="mantieneCondiciones"
                value="si"
                onChange={handleChange}
                required
              /> Sí
              <input
                type="radio"
                name="mantieneCondiciones"
                value="no"
                onChange={handleChange}
                required
              /> No
            </div>
          </label>
          <label>
            2.10. Plazo Solicitado:
            <input
              type="text"
              name="plazoSolicitado"
              value={formData.plazoSolicitado}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="row">
          <label>
            2.11. Detalle de los Cambios:
            <textarea
              name="detalleCambios"
              value={formData.detalleCambios}
              onChange={handleChange}
              required
            />
          </label>
        </div>
      </div>
      <div className="section">
        <h2>3. DOCUMENTOS QUE ADJUNTA</h2>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="planoCatastro"
              checked={formData.documentos.planoCatastro}
              onChange={handleChange}
            />
            PLANO CATASTRO (solo en casos de modificarse)
          </label>
          <label>
            <input
              type="checkbox"
              name="certificacionPersoneria"
              checked={formData.documentos.certificacionPersoneria}
              onChange={handleChange}
            />
            CERTIFICACIÓN DE PERSONERÍA JURÍDICA
          </label>
          <label>
            <input
              type="checkbox"
              name="certificacionCapital"
              checked={formData.documentos.certificacionCapital}
              onChange={handleChange}
            />
            CERTIFICACIÓN DE CAPITAL ACCIONARIO
          </label>
          <label>
            <input
              type="checkbox"
              name="pagoTimbres"
              checked={formData.documentos.pagoTimbres}
              onChange={handleChange}
            />
            PAGO DE TIMBRES DE AUTENTICACIÓN
          </label>
          <label className="otros-label">
            <input
              type="checkbox"
              name="otros"
              checked={formData.documentos.otros}
              onChange={handleChange}
            />
            OTROS. Especifique:
            <input
              type="text"
              name="otros"
              value={formData.documentos.otros}
              onChange={handleChange}
              className="otros-input"
            />
          </label>
        </div>
      </div>

     
      <div className="section">
        <h2>4. MEDIO DE NOTIFICACIONES</h2>
        <div className="row">
          <label>
            SEÑALO COMO MEDIOS DE NOTIFICACIONES LOS SIGUIENTES:
          </label>
        </div>
        <div className="row">
          <label>
            MEDIO PRINCIPAL:
            <input
              type="text"
              name="medioPrincipal"
              value={formData.medioPrincipal}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="row">
          <label>
            MEDIO SECUNDARIO:
            <input
              type="text"
              name="medioSecundario"
              value={formData.medioSecundario}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <p>
          A LA PARTE QUE NO INDIQUE UN MEDIO DE NOTIFICACIONES, O EL MISMO SEA
          INADECUADO, SE LE APLICARÁ LA NOTIFICACIÓN AUTOMÁTICA PREVISTA POR EL
          NUMERAL 11 DE LA LEY N°867
        </p>
        <p>
          El suscrito(a) manifiesta conocer y acepta en todos sus extremos las
          limitaciones, condiciones y obligaciones establecidas en la Ley N°6043
          del 2 de marzo de 1977 y su Reglamento aprobado por Decreto Ejecutivo
          N°7841-P del 16 de diciembre de 1977.
        </p>
        <div className="row firmas">
          <div>
            ___________________________________<br />
            Firma del solicitante o Representante
          </div>
          <div>
            ___________________________________<br />
            Firma del Abogado(a) Autenticante
          </div>
        </div>
      </div>


      <button type="submit" className="submit-btn">Enviar</button>
    </form>
  );
};

export default Concesiones;
