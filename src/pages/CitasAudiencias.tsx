import { useState } from "react";
import "../styles/FormAudiencia.css";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { addDays, startOfWeek, endOfWeek, isWednesday } from "date-fns";

function CitasAudiencias() {
  const [selectedDate, setSelectedDate] = useState(null); // Estado para la fecha
  const [selectedTime, setSelectedTime] = useState(""); // Estado para la hora
  const [descripcion, setDescripcion] = useState(""); // Estado para la descripción

  // Manejador de la fecha
  const filterWeekdays = (date: unknown) => {
    // Devuelve verdadero solo si la fecha es un miércoles
    return date && isWednesday(date);
  };

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
    const citaFechaHora = new Date(`${selectedDate}T${selectedTime}`);
  
    const token = localStorage.getItem('token');
    console.log("Token:", token);
  const decodedToken = parseJwt(token);  // Necesitarás una función para decodificar el JWT
  console.log("Decoded Token:", decodedToken);
  const userId = decodedToken.userId;  // Este es el ID del usuario autenticado

  const cita = {
    description: descripcion, 
    date: selectedDate,
    time: selectedTime,
    user_id: userId,
  };

  try {
    const response = await fetch('http://localhost:3000/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Agrega el token a la cabecera
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

// Función para decodificar el JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
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
          <label>Descripción de la cita:</label>
          <textarea 
            required 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Seleccione la fecha:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            filterDate={filterWeekdays} // Filtra las fechas para mostrar solo miércoles
            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona una fecha"
            minDate={new Date()} // Opcional: No permitir fechas pasadas
          />
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
          <button type="submit" >Enviar</button>
        </div>
      </form>
    </div>
  );
}

export default CitasAudiencias;
