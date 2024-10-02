/*import { createContext, useState, useEffect, useContext } from 'react';

interface User {
    id: number;
    nombre: string;
    email: string;
    roles: string;
  }
  
  // Define el tipo del contexto
  interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
  }
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }) => {
    const { setUser } = useContext(AuthContext);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        // Hacer petición al backend para obtener los datos del usuario
        const fetchUserData = async () => {
          try {
            const response = await fetch('/api/getUser', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Enviar el token en la cabecera
              },
            });
  
            if (response.ok) {
              const data = await response.json();
              // Extraer solo los datos que necesitas (nombre y email)
              const userInfo = {
                nombre: data.nombre,
                email: data.email,
              };
              setUser(userInfo);  // Actualizar el contexto con los datos del usuario
            } else {
              console.log('Error al obtener datos del usuario');
            }
          } catch (error) {
            console.error('Error en la petición', error);
          }
        };
  
        fetchUserData();
      }
    }, [setUser]);
  
    return (
      <AuthContext.Provider value={{ /* valores del contexto  }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export default AuthProvider;*/