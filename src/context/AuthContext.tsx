import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// Definimos el tipo de usuario
interface User {
  email: string;
  roles: string[];
}

// Definimos el tipo de nuestro contexto
interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

// Definimos el tipo del token decodificado
interface DecodedToken {
  email?: string;
  roles?: string[];
}

// Creamos el contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      handleToken(token);
    }
  }, []);

  // Función para procesar el token
  const handleToken = (token: string) => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);

      if (decodedToken.email && decodedToken.roles) {
        setUser({
          email: decodedToken.email,
          roles: decodedToken.roles,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      logout();
    }
  };

  // Función de login
  const login = (token: string) => {
    localStorage.setItem('token', token);
    handleToken(token);
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
