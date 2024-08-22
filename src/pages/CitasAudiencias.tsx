import { useState } from "react";
import "../styles/FormAudiencia.css"
function CitasAudiencias () {
  const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (event) => {
        const selected = new Date(event.target.value);
        if (selected.getDay() === 2) {
            setSelectedDate(event.target.value);
        } else {
            alert("Por favor selecciona un miércoles.");
            event.target.value = '';
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!selectedDate) {
            alert("Por favor selecciona una fecha válida.");
            return;
        }
        // Aquí puedes manejar el envío del formulario
        console.log('Formulario enviado');
        console.log(selectedDate);
    };

    const getTimeOptions = () => {
        const options = [];
        const morningStart = new Date();
        morningStart.setHours(8, 0, 0, 0); // 8:00 AM

        const morningEnd = new Date();
        morningEnd.setHours(11, 30, 0, 0); // 11:30 AM

        const afternoonStart = new Date();
        afternoonStart.setHours(13, 0, 0, 0); // 1:00 PM

        const afternoonEnd = new Date();
        afternoonEnd.setHours(15, 30, 0, 0); // 3:30 PM

        // Opciones para la mañana
        let currentTime = morningStart;
        while (currentTime <= morningEnd) {
            const timeString = currentTime.toTimeString().slice(0, 5);
            options.push(
                <option key={timeString} value={timeString}>
                    {timeString}
                </option>
            );
            currentTime.setMinutes(currentTime.getMinutes() + 30); // Incrementar 30 minutos
        }

        // Opciones para la tarde
        currentTime = afternoonStart;
        while (currentTime <= afternoonEnd) {
            const timeString = currentTime.toTimeString().slice(0, 5);
            options.push(
                <option key={timeString} value={timeString}>
                    {timeString}
                </option>
            );
            currentTime.setMinutes(currentTime.getMinutes() + 30); // Incrementar 30 minutos
        }

        return options;
    };

    return (
        <div className="form-container">
            <h2>MUNICIPALIDAD DE NICOYA<br />DEPARTAMENTO DE ZONA MARÍTIMO TERRESTRE</h2>
            <h3>SOLICITUD DE CITA / AUDIENCIA</h3>
            <p>Uso exclusivo del Administrado.</p>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre completo:</label>
                    <input type="text" required />
                </div>
                <div className="form-group">
                    <label>Número de Cédula:</label>
                    <input type="text" required />
                </div>
                <div className="form-group">
                    <label>Número telefónico:</label>
                    <input type="tel" required />
                </div>
                <div className="form-group">
                    <label>Correo electrónico:</label>
                    <input type="email" required />
                </div>
                <div className="form-group">
                    <label>Asunto a tratar:</label>
                    <textarea required></textarea>
                </div>

                
                <div className="form-group">
                    <label>Seleccione la fecha y hora:</label>
                    <input type="date" onChange={handleDateChange} required />
                    {selectedDate && (
                        <select required>
                            {getTimeOptions()}
                        </select>
                    )}
                </div>

               
                <div className="form-group">
                    <button type="submit">Enviar</button>
                </div>
            </form>
        </div>
    );
}


export default CitasAudiencias;
