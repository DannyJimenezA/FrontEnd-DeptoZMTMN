import  { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string;
  userRoles: string[];
  login: (token: string) => void;
  logout: () => void;
}

interface DecodedToken {
  email?: string;
  roles?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      handleToken(token);
    }
  }, []);

  const handleToken = (token: string) => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      if (decodedToken.email) {
        setUserEmail(decodedToken.email);
      }
      if (decodedToken.roles) {
        setUserRoles(decodedToken.roles);
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      logout();
    }
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    handleToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserEmail('');
    setUserRoles([]);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, userRoles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
