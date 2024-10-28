import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para la redirección
import { Home, BarChart2, Users, Settings, LogOut } from 'lucide-react';
import './Dashboard.css';
import AppointmentsTable from '../Tablas/AppointmentTable';
import TablaProrrogas from '../Tablas/ProrrogasTable';
import TablaRevisionPlanos from '../Tablas/RevisionPlanosTable';
import TablaUsuarios from '../Tablas/UsersTable';
import TablaSolicitudExpediente from '../Tablas/ExpedientesTable';
import TablaUsoPrecario from '../Tablas/UsoPrecarioTable'; 
import TablaConcesiones from '../Tablas/ConcesionesTable'; // Nueva tabla de concesiones
import TablaDenunciasDashboard from '../Tablas/TablaDenuncia'; // Importar la tabla de denuncias
import { jwtDecode } from 'jwt-decode'; // Asegúrate de tener jwt-decode instalado

// Interfaz para el token decodificado
interface DecodedToken {
  roles: string[];
}

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home'); // Controla la sección activa
  const navigate = useNavigate(); // Hook para redirigir al usuario

  useEffect(() => {
    // Obtén el token del almacenamiento local
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decodifica el token
        const decodedToken = jwtDecode<DecodedToken>(token);

        // Verifica si el usuario tiene el rol de 'admin'
        if (!decodedToken.roles.includes('admin')) {
          // Si no es admin, muestra un mensaje de acceso limitado
          window.alert('Acceso limitado para administradores.');
          navigate('/'); // Redirigir al usuario a la página principal
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        window.alert('Ha ocurrido un error. Por favor, inicie sesión nuevamente.');
        navigate('/login'); // Si hay un error, redirigir a la página de inicio de sesión
      }
    } else {
      // Si no hay token, redirigir al inicio de sesión
      window.alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
      navigate('/login');
    }
  }, [navigate]);

  // Renderiza la sección dependiendo de la selección en el sidebar
  const renderSection = () => {
    switch (activeSection) {
      case 'appointments':
        return <AppointmentsTable />; // Renderiza la tabla de citas
      case 'prorrogas':
        return <TablaProrrogas />; // Renderiza la tabla de prórrogas
      case 'revision-planos':
        return <TablaRevisionPlanos />; // Renderiza la tabla de revisión de planos
      case 'users':
        return <TablaUsuarios />; // Renderiza la tabla de usuarios
      case 'solicitudes-expedientes':
        return <TablaSolicitudExpediente />; // Renderiza la tabla de solicitudes de expedientes
      case 'uso-precario':
        return <TablaUsoPrecario />; // Renderiza la tabla de uso precario
      case 'concesiones':
        return <TablaConcesiones />; // Renderiza la tabla de concesiones
      case 'denuncias': // Añadido: Renderiza la tabla de denuncias
        return <TablaDenunciasDashboard />;
      default:
        return <p>Bienvenido al dashboard</p>;
    }
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'appointments', icon: BarChart2, label: 'Citas' },
    { id: 'prorrogas', icon: BarChart2, label: 'Prórrogas' },
    { id: 'solicitudes-expedientes', icon: BarChart2, label: 'Expedientes' },
    { id: 'uso-precario', icon: BarChart2, label: 'Uso Precario' }, 
    { id: 'concesiones', icon: BarChart2, label: 'Concesiones' }, // Nueva opción para concesiones
    { id: 'denuncias', icon: BarChart2, label: 'Denuncias' }, // Nueva opción para denuncias
    { id: 'users', icon: Users, label: 'Usuarios' },
    { id: 'settings', icon: Settings, label: 'Configuración' },
    { id: 'revision-planos', icon: BarChart2, label: 'Revisión de Planos' },
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">AdminPanel</div>
        <nav className="nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`} // Cambia la clase si es activo
              onClick={() => setActiveSection(item.id)} // Cambia la sección activa
            >
              <item.icon size={20} /> {/* Muestra el icono correspondiente */}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="logout-button">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </aside>
      <main className="main">
        {renderSection()} {/* Renderiza la sección seleccionada */}
      </main>
    </div>
  );
};

export default AdminDashboard;


