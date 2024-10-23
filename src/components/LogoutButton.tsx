import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de que el contexto de autenticación está configurado
import { LogOut } from 'lucide-react';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth(); // Usar autenticación desde el contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Ejecuta la función de cierre de sesión
    localStorage.removeItem('token'); // Limpia el token del almacenamiento local
    navigate('/login'); // Redirige al usuario a la página de inicio
  };

  return (
    <div
      className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
      onClick={handleLogout}
    >
      Cerrar sesión
    </div>
  );
};

export default LogoutButton;
