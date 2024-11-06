import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import ApiRoutes from '../components/ApiRoutes';

const ConfirmAccount = () => {
  const { token } = useParams(); // Obtener el token de la URL
  const [message, setMessage] = useState(''); // Estado para el mensaje de confirmación
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga
  const navigate = useNavigate(); // Navegador para redirigir

  useEffect(() => {
    // Función para confirmar la cuenta
    const confirmAccount = async () => {
      try {
        const response = await axios.get(`${ApiRoutes.usuarios}/confirm/${token}`);
        setMessage(response.data.message); // Mensaje de éxito
      } catch (error) {
        // Verificación de tipo para AxiosError
        const err = error as AxiosError<{ message: string }>;
        if (err.response && err.response.data) {
          setMessage(err.response.data.message || 'Error al activar la cuenta');
        } else {
          setMessage('Error al activar la cuenta');
        }
      } finally {
        setLoading(false); // Desactivar el indicador de carga
      }
    };

    confirmAccount(); // Llamar a la función de confirmación
  }, [token]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading ? (
        <p>Activando cuenta, por favor espera...</p> // Mostrar un mensaje de carga
      ) : (
        <>
          <h2>{message}</h2> {/* Mostrar el mensaje de confirmación */}
          <button onClick={() => navigate('/login')}>Iniciar Sesión</button> {/* Botón para regresar */}
        </>
      )}
    </div>
  );
};

export default ConfirmAccount;
