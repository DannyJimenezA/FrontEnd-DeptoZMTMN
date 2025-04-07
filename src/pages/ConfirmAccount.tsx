import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import ApiRoutes from '../components/ApiRoutes';

const ConfirmAccount = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenValid, setTokenValid] = useState<boolean>(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setMessage('Token no proporcionado.');
        setLoading(false);
        return;
      }

      try {
        await axios.get(`${ApiRoutes.urlBase}/users/confirm/validate?token=${token}`);
        setTokenValid(true);
        setMessage('Token válido. Puedes confirmar tu cuenta.');
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        setMessage(err.response?.data?.message || 'Error al validar el token.');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleConfirmAccount = async () => {
    try {
      const res = await axios.post(`${ApiRoutes.urlBase}/users/confirm`, { token });
      setMessage(res.data.message || 'Cuenta activada con éxito.');
      setTokenValid(false); // Oculta el botón luego de confirmar
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setMessage(err.response?.data?.message || 'Error al confirmar la cuenta.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading ? (
        <p>Validando token, por favor espera...</p>
      ) : (
        <>
          <h2>{message}</h2>
          {tokenValid && <button onClick={handleConfirmAccount}>Confirmar cuenta</button>}
        </>
      )}
    </div>
  );
};

export default ConfirmAccount;
