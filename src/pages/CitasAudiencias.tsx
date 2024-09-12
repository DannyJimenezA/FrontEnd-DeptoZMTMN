import { useState } from "react";
import "../styles/FormAudiencia.css";

function CitasAudiencias() {
  const [selectedDate, setSelectedDate] = useState(""); // Estado para la fecha
  const [selectedTime, setSelectedTime] = useState(""); // Estado para la hora
  const [cedula, setCedula] = useState(""); // Estado para el número de cédula
  const [asunto, setAsunto] = useState(""); // Estado para el asunto

  // Manejador de la fecha, solo permite seleccionar miércoles
  const handleDateChange = (event) => {
    
    //const selected = new Date(event.target.value);
    const selectedDate = new Date(event.target.value);
    // Depuramos el valor que recibe la fecha
    console.log("Fecha seleccionada:", selectedDate);
    console.log("Día de la semana:", selectedDate.getDay()); // Verifica qué valor devuelve getDay()

    

  // Verifica el día de la semana de la fecha seleccionada
  /*if (selectedDate.getDay()) { // 3 corresponde al miércoles
    alert("Por favor selecciona un miércoles.");
    event.target.value = ''; // Limpiar la fecha si no es válida
    return;
  }*/

  // Actualizar el estado con la fecha seleccionada
  setSelectedDate(event.target.value);

    //setSelectedDate(event.target.value);
  };

  // Manejador para el envío del formulario
  // Manejador para el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validar que la fecha y hora estén seleccionadas
    if (!selectedDate || !selectedTime) {
      alert("Por favor selecciona una fecha y una hora válidas.");
      return;
    }
  
    // Opciones válidas para la hora
    const validTimes = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
    ];
  
    // Validar que la hora seleccionada esté permitida
    if (!validTimes.includes(selectedTime)) {
      alert("La hora seleccionada no es válida.");
      return;
    }
  
    // Crear la fecha y hora combinadas
    const [year, month, day] = selectedDate.split("-");
    const [hours, minutes] = selectedTime.split(":");
  
    // Crear la fecha en UTC manualmente
    const citaFechaHora = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  
    const cita = {
      descripcion: asunto,
      fecha: citaFechaHora.toISOString(),
      userId: cedula,
    };
  
    try {
      const response = await fetch('http://localhost:3006/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cita),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear la cita.');
      }
  
      const result = await response.json();
      alert('Cita creada exitosamente');
      console.log('Cita creada:', result);
    } catch (error) {
      console.error('Error al crear la cita:', error);
      alert('Hubo un error al crear la cita.');
    }
  };
  
  // Generación de opciones de tiempo (horarios)
  const getTimeOptions = () => {
    const options = [];
    
    // Opciones para la mañana
    const morningTimes = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
    morningTimes.forEach((time) => {
      options.push(
        <option key={time} value={time}>
          {time}
        </option>
      );
    });

    // Opciones para la tarde
    const afternoonTimes = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"];
    afternoonTimes.forEach((time) => {
      options.push(
        <option key={time} value={time}>
          {time}
        </option>
      );
    });

    return options;
  };

  return (
    <div className="form-container">
      <h2>MUNICIPALIDAD DE NICOYA<br />DEPARTAMENTO DE ZONA MARÍTIMO TERRESTRE</h2>
      <h3>SOLICITUD DE CITA / AUDIENCIA</h3>
      <p>Uso exclusivo del Administrado.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Numero de Cedula:</label>
          <input 
            type="text" 
            required 
            value={cedula} 
            onChange={(e) => setCedula(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Asunto a tratar:</label>
          <textarea 
            required 
            value={asunto} 
            onChange={(e) => setAsunto(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Seleccione la fecha:</label>
          <input type="date" onChange={handleDateChange} required />
        </div>
        {selectedDate && (
          <div className="form-group">
            <label>Seleccione la hora:</label>
            <select 
              required 
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">Seleccione una hora</option>
              {getTimeOptions()}
            </select>
          </div>
        )}
        <div className="form-group">
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  );
}

export default CitasAudiencias;
