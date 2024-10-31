import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { isWednesday } from 'date-fns';
import '../../styles/user/AppoinList.css';

interface Appointment {
  id: number;
  description: string;
  date: string;
  time: string;
  status?: string;
}

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]); // Definir el tipo explicitamente
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/appointments/my-appointments', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAppointments(response.data); // Establece las citas con el tipo correcto
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [token]);

  const handleCreateAppointment = () => {
    navigate('/citas-audiencias');
  };

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointmentId(appointment.id);
    setSelectedDate(new Date(appointment.date));
    setSelectedTime(appointment.time);
    setDescripcion(appointment.description);
  };

  const handleSaveClick = async (appointmentId: number) => {
    const validTimes = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
    ];
    if (!validTimes.includes(selectedTime)) {
      alert("La hora seleccionada no es válida.");
      return;
    }

    const updatedAppointment: Partial<Appointment> = {
      description: descripcion,
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : "", // Convertir la fecha a formato ISO sin la hora
      time: selectedTime
    };

    try {
      const response = await axios.put(`http://localhost:3000/appointments/${appointmentId}`, updatedAppointment, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status >= 200 && response.status < 300) {
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === appointmentId ? { ...appointment, ...updatedAppointment } : appointment
          )
        );
        alert("Cita actualizada exitosamente");
        setEditingAppointmentId(null);
      } else {
        alert("Hubo un error al actualizar la cita: " + response.data.message);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Ahora `error` es de tipo `AxiosError`
        console.error("Hubo un error al actualizar la cita:", error.response?.data?.message || error.message);
        alert("Hubo un error al actualizar la cita. " + (error.response?.data?.message || error.message));
      } else {
        // Para errores no relacionados con Axios
        console.error("Error desconocido:", error);
        alert("Hubo un error desconocido al actualizar la cita.");
      }
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleCancelClick = () => {
    setEditingAppointmentId(null);
    setSelectedDate(null);
    setSelectedTime("");
    setDescripcion("");
  };

  const filterWeekdays = (date: Date) => {
    return date && isWednesday(date);
  };

  const getTimeOptions = () => {
    const times = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
    ];
    return times.map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Mis citas</h2>
        <button className="botton" onClick={handleCreateAppointment}>Crear Cita</button>
      </div>

      <div className="appointment-list">
        {appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="card">
              {editingAppointmentId === appointment.id ? (
                <div className="edit-appointment">
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
                      filterDate={filterWeekdays}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Selecciona una fecha"
                      minDate={new Date()}
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
                  <div className="form-actions">
                    <button onClick={() => handleSaveClick(appointment.id)}>Guardar</button>
                    <button onClick={handleCancelClick}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="appointment-details">
                  <h3>{appointment.description}</h3>
                  <p>Fecha: {new Date(appointment.date).toLocaleDateString()}</p>
                  <p>Hora: {appointment.time}</p>
                  <p>Estado: {appointment.status}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => handleEditClick(appointment)}>Edit</button>
                    <button onClick={() => handleDeleteAppointment(appointment.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;
