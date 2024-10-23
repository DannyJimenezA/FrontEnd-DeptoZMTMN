import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart2, Users, Settings, LogOut } from 'lucide-react';
import './Dashboard.css';
import DenunciasTable from '../Tablas/DenunciasTable';
import DetalleDenuncia from '../TablaVista/DetalleDenuncia';
import DetalleConcesion from '../TablaVista/DetalleConcesion';
import AppointmentsTable from '../Tablas/AppointmentTable';
import TablaProrrogas from '../Tablas/ProrrogasTable';
import TablaRevisionPlanos from '../Tablas/RevisionPlanosTable';
import TablaUsuarios from '../Tablas/UsersTable';
import TablaSolicitudExpediente from '../Tablas/ExpedientesTable';
import TablaUsoPrecario from '../Tablas/UsoPrecarioTable';
import TablaConcesiones from '../Tablas/ConcesionesTable';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, Denuncia, Concesion, Precario, CopiaExpediente, RevisionPlano, Prorroga } from '../Types/Types'; // Importar las interfaces
import DetalleUsoPrecario from '../TablaVista/DetallePrecario';
import DetalleExpediente from '../TablaVista/DetalleExpediente';
import DetalleRevisionPlano from '../TablaVista/DetalleRevisionPlano';
import DetalleProrroga from '../TablaVista/DetalleProrroga';
import '../styles/Botones.css';
import LogoutButton from '../components/LogoutButton';  // Importar el componente LogoutButton

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [denunciaSeleccionada, setDenunciaSeleccionada] = useState<Denuncia | null>(null);
  const [concesionSeleccionada, setConcesionSeleccionada] = useState<Concesion | null>(null);
  const [precarioSeleccionado, setPrecarioSeleccionado] = useState<Precario | null>(null);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState<CopiaExpediente | null>(null);
  const [revisionPlanoSeleccionado, setRevisionPlanoSeleccionado] = useState<RevisionPlano | null>(null);
  const [prorrogaSeleccionada, setProrrogaSeleccionada] = useState<Prorroga | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (!decodedToken.roles.includes('admin')) {
          window.alert('Acceso limitado para administradores.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        window.alert('Ha ocurrido un error. Por favor, inicie sesión nuevamente.');
        navigate('/login');
      }
    } else {
      window.alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
      navigate('/login');
    }
  }, [navigate]);

  const manejarVerDenuncia = (denuncia: Denuncia) => setDenunciaSeleccionada(denuncia);
  const manejarVerConcesion = (concesion: Concesion) => setConcesionSeleccionada(concesion);
  const manejarVerPrecario = (precario: Precario) => setPrecarioSeleccionado(precario);
  const manejarVerExpediente = (expediente: CopiaExpediente) => setExpedienteSeleccionado(expediente);
  const manejarVerRevisionPlano = (revisionPlano: RevisionPlano) => setRevisionPlanoSeleccionado(revisionPlano);
  const manejarVerProrroga = (prorroga: Prorroga) => setProrrogaSeleccionada(prorroga);
  
  const renderSection = () => {
    if (denunciaSeleccionada) {
      return <DetalleDenuncia denuncia={denunciaSeleccionada} onVolver={() => setDenunciaSeleccionada(null)} />;
    }
  
    if (concesionSeleccionada) {
      return <DetalleConcesion concesion={concesionSeleccionada} onVolver={() => setConcesionSeleccionada(null)} />;
    }
  
    if (precarioSeleccionado) {
      return <DetalleUsoPrecario precario={precarioSeleccionado} onVolver={() => setPrecarioSeleccionado(null)} />;
    }
  
    if (expedienteSeleccionado) {
      return <DetalleExpediente expediente={expedienteSeleccionado} onVolver={() => setExpedienteSeleccionado(null)} />;
    }
  
    if (revisionPlanoSeleccionado) {
      return <DetalleRevisionPlano revisionPlano={revisionPlanoSeleccionado} onVolver={() => setRevisionPlanoSeleccionado(null)} />; 
    }

    if (prorrogaSeleccionada) {
      return <DetalleProrroga prorroga={prorrogaSeleccionada} onVolver={() => setProrrogaSeleccionada(null)} />; 
    }
  
    switch (activeSection) {
      case 'appointments':
        return <AppointmentsTable />;
      case 'prorrogas':
        return <TablaProrrogas onVerProrroga={manejarVerProrroga}/>;
      case 'revision-planos':
        return <TablaRevisionPlanos onVerRevisionPlano={manejarVerRevisionPlano} />;
      case 'users':
        return <TablaUsuarios />;
      case 'solicitudes-expedientes':
        return <TablaSolicitudExpediente onVerExpediente={manejarVerExpediente} />;
      case 'uso-precario':
        return <TablaUsoPrecario onVerPrecario={manejarVerPrecario} />;
      case 'concesiones':
        return <TablaConcesiones onVerConcesion={manejarVerConcesion} />;
      case 'denuncias':
        return <DenunciasTable onVerDenuncia={manejarVerDenuncia} />;
      default:
        return <p>Bienvenido al dashboard</p>;
    }
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'appointments', icon: BarChart2, label: 'Citas' },
    { id: 'concesiones', icon: BarChart2, label: 'Concesiones' },
    { id: 'prorrogas', icon: BarChart2, label: 'Prórrogas' },
    { id: 'solicitudes-expedientes', icon: BarChart2, label: 'Expedientes' },
    { id: 'uso-precario', icon: BarChart2, label: 'Uso Precario' },
    { id: 'denuncias', icon: BarChart2, label: 'Denuncias' },
    { id: 'revision-planos', icon: BarChart2, label: 'Revisión de Planos' },
    { id: 'users', icon: Users, label: 'Usuarios' },
    { id: 'roles', icon: Settings, label: 'Roles' },
    { id: 'permisos', icon: Settings, label: 'Permisos' },
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">AdminPanel</div>
        <nav className="nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(item.id);
                setDenunciaSeleccionada(null);
                setConcesionSeleccionada(null);
                setPrecarioSeleccionado(null);
                setExpedienteSeleccionado(null);
                setRevisionPlanoSeleccionado(null);
                setProrrogaSeleccionada(null);
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <LogoutButton /> {/* Componente de cierre de sesión */}
      </aside>
      <main className="main">
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;
