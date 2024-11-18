// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';
// import ApiRoutes from '../components/ApiRoutes';

// const ConfirmAccount = () => {
//   const { token } = useParams<{ token: string }>(); // Captura el token desde la URL
//   const [message, setMessage] = useState<string>(''); // Estado para el mensaje
//   const [loading, setLoading] = useState<boolean>(true); // Estado para indicar carga
//   const navigate = useNavigate(); // Para redirigir al usuario

//   useEffect(() => {
//     const confirmAccount = async () => {
//       try {
//         if (!token) {
//           setMessage('El token no fue proporcionado.');
//           setLoading(false);
//           return;
//         }

//         // Realizar la solicitud al backend para confirmar la cuenta
//         const response = await axios.get(`${ApiRoutes.usuarios}/confirm/${token}`);
//         setMessage(response.data.message || 'Cuenta confirmada con éxito.'); // Establece el mensaje de éxito
//       } catch (error) {
//         const err = error as AxiosError<{ message: string }>;
//         if (err.response && err.response.data) {
//           setMessage(err.response.data.message || 'Error al confirmar la cuenta.');
//         } else {
//           setMessage('Error al conectar con el servidor.');
//         }
//       } finally {
//         setLoading(false); // Finaliza el estado de carga
//       }
//     };

//     confirmAccount();
//   }, [token]);

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       {loading ? (
//         <p>Activando cuenta, por favor espera...</p> // Indicador de carga
//       ) : (
//         <>
//           <h2>{message}</h2> {/* Muestra el mensaje */}
//           <button onClick={() => navigate('/login')}>Ir a Iniciar Sesión</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default ConfirmAccount;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import ApiRoutes from '../components/ApiRoutes';

const ConfirmAccount = () => {
  const { token } = useParams<{ token: string }>(); // Captura el token desde la URL
  const [message, setMessage] = useState<string>(''); // Estado para el mensaje
  const [loading, setLoading] = useState<boolean>(true); // Estado para indicar carga
  const navigate = useNavigate(); // Para redirigir al usuario

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        if (!token) {
          setMessage('El token no fue proporcionado.');
          setLoading(false);
          return;
        }

        // Realizar la solicitud al backend para confirmar la cuenta
        const response = await axios.get(`${ApiRoutes.usuarios}/confirm/${token}`);
        setMessage(response.data.message || 'Cuenta confirmada con éxito.'); // Establece el mensaje de éxito
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        if (err.response && err.response.data) {
          setMessage(err.response.data.message || 'Error al confirmar la cuenta.');
        } else {
          setMessage('Error al conectar con el servidor.');
        }
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    confirmAccount();
  }, [token]);

  // Manejo de errores de recursos faltantes
  useEffect(() => {
    window.addEventListener('error', (event) => {
      if (event.message.includes('favicon.ico')) {
        console.warn('Error ignorado: recurso favicon.ico no encontrado.');
      }
    });
    return () => {
      window.removeEventListener('error', () => {});
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading ? (
        <p>Activando cuenta, por favor espera...</p> // Indicador de carga
      ) : (
        <>
          <h2>{message || 'Ocurrió un problema inesperado, intenta de nuevo.'}</h2> {/* Muestra el mensaje */}
          <button onClick={() => navigate('/login')}>Ir a Iniciar Sesión</button>
        </>
      )}
    </div>
  );
};

export default ConfirmAccount;
