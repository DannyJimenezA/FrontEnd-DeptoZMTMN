import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import ApiRoutes from '../components/ApiRoutes';

const ConfirmAccount = () => {
  const { token } = useParams<{ token: string }>(); // Captura el token desde la URL
  const [message, setMessage] = useState<string>(''); // Estado para el mensaje
  const [loading, setLoading] = useState<boolean>(true); // Estado para indicar carga
  // const navigate = useNavigate(); // Para redirigir al usuario

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        // Verificar que el token esté presente
        if (!token) {
          setMessage('El token no fue proporcionado.');
          setLoading(false);
          return;
        }

        // Realizar la solicitud al backend
        const response = await axios.get(`${ApiRoutes.urlBase}/users/confirm/${token}`);
        setMessage(response.data.message || 'Cuenta confirmada con éxito.'); // Mensaje en caso de éxito
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;

        // Manejo de errores
        if (err.response && err.response.data) {
          setMessage(err.response.data.message || 'Error al confirmar la cuenta.');
        } else if (error instanceof Error) {
          setMessage(`Error inesperado: ${error.message}`);
        } else {
          setMessage('Error al conectar con el servidor.');
        }
      } finally {
        setLoading(false); // Finalizar estado de carga
      }
    };

    confirmAccount(); // Llamar a la función
  }, [token]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading ? (
        <p>Activando cuenta, por favor espera...</p> // Indicador de carga
      ) : (
        <>
          <h2>{message}</h2> {/* Mostrar mensaje del backend */}
          {/* <button onClick={() => navigate('/login')}>Ir a Iniciar Sesión</button> */}
          Puede cerrar esta pestaña
        </>
      )}
    </div>
  );
};

export default ConfirmAccount;
