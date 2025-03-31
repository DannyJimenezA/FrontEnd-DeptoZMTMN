import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart2, Users, Settings } from 'lucide-react';
import './Dashboard.css';
import DenunciasTable from '../Tablas/DenunciasTable';
import DetalleDenuncia from '../TablaVista/DetalleDenuncia';
import DetalleConcesion from '../TablaVista/DetalleConcesion';
import TablaProrrogas from '../Tablas/ProrrogasTable';
import TablaRevisionPlanos from '../Tablas/RevisionPlanosTable';
import TablaUsuarios from '../Tablas/UsersTable';
import TablaSolicitudExpediente from '../Tablas/ExpedientesTable';
import TablaUsoPrecario from '../Tablas/UsoPrecarioTable';
import TablaConcesiones from '../Tablas/ConcesionesTable';
import { jwtDecode } from 'jwt-decode';
import {
  DecodedToken, Denuncia, Concesion, Precario, CopiaExpediente,
  RevisionPlano, Prorroga, Role, Usuario, Cita
} from '../Types/Types';
import DetalleUsoPrecario from '../TablaVista/DetallePrecario';
import DetalleExpediente from '../TablaVista/DetalleExpediente';
import DetalleRevisionPlano from '../TablaVista/DetalleRevisionPlano';
import DetalleProrroga from '../TablaVista/DetalleProrroga';
import DetalleCita from '../TablaVista/DetalleCita';
import '../styles/Botones.css';
import LogoutButton from '../components/LogoutButton';
import TablaCitas from '../Tablas/AppointmentTable';
import RolesTable from '../Tablas/RolesTable';
import CrearRolForm from '../Tablas/CrearRolForm';
import AsignarPermisosForm from '../TablaVista/AsignarPermisosForm';
import DetalleUsuario from '../TablaVista/DetalleUsuario';
import GestionDenunciasTable from '../Tablas/GestionDenunciasTable';
import TablaDenunciasDashboard from '../Tablas/TablaDenuncia';
import ApiRoutes from '../components/ApiRoutes';
import DashboardHome from './DashboardHome';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [denunciaSeleccionada, setDenunciaSeleccionada] = useState<Denuncia | null>(null);
  const [concesionSeleccionada, setConcesionSeleccionada] = useState<Concesion | null>(null);
  const [precarioSeleccionado, setPrecarioSeleccionado] = useState<Precario | null>(null);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState<CopiaExpediente | null>(null);
  const [revisionPlanoSeleccionado, setRevisionPlanoSeleccionado] = useState<RevisionPlano | null>(null);
  const [prorrogaSeleccionada, setProrrogaSeleccionada] = useState<Prorroga | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [rolSeleccionado, setRolSeleccionado] = useState<Role | null>(null);
  const [mostrarFormularioRol, setMostrarFormularioRol] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (!decoded.permissions || decoded.permissions.length === 0) {
          alert('Acceso denegado.');
          navigate('/');
        }
      } catch {
        alert('Token inválido. Inicie sesión nuevamente.');
        navigate('/login');
      }
    } else {
      alert('Debe iniciar sesión.');
      navigate('/login');
    }
  }, [navigate]);

  const manejarVerDenuncia = (d: Denuncia) => setDenunciaSeleccionada(d);
  const manejarVerConcesion = (c: Concesion) => setConcesionSeleccionada(c);
  const manejarVerPrecario = (p: Precario) => setPrecarioSeleccionado(p);
  const manejarVerExpediente = (e: CopiaExpediente) => setExpedienteSeleccionado(e);
  const manejarVerRevisionPlano = (r: RevisionPlano) => setRevisionPlanoSeleccionado(r);
  const manejarVerProrroga = (p: Prorroga) => setProrrogaSeleccionada(p);
  const manejarVerCita = (c: Cita) => setCitaSeleccionada(c);
  const manejarVerUsuario = (u: Usuario) => setUsuarioSeleccionado(u);
  const manejarAsignarPermisos = (rol: Role) => setRolSeleccionado(rol);
  const manejarVolverRoles = () => {
    setMostrarFormularioRol(false);
    setRolSeleccionado(null);
  };

  const renderSection = () => {
    if (denunciaSeleccionada) return <DetalleDenuncia denuncia={denunciaSeleccionada} onVolver={() => setDenunciaSeleccionada(null)} />;
    if (concesionSeleccionada) return <DetalleConcesion concesion={concesionSeleccionada} onVolver={() => setConcesionSeleccionada(null)} />;
    if (precarioSeleccionado) return <DetalleUsoPrecario precario={precarioSeleccionado} onVolver={() => setPrecarioSeleccionado(null)} />;
    if (expedienteSeleccionado) return <DetalleExpediente expediente={expedienteSeleccionado} onVolver={() => setExpedienteSeleccionado(null)} />;
    if (revisionPlanoSeleccionado) return <DetalleRevisionPlano revisionPlano={revisionPlanoSeleccionado} onVolver={() => setRevisionPlanoSeleccionado(null)} />;
    if (prorrogaSeleccionada) return <DetalleProrroga prorroga={prorrogaSeleccionada} onVolver={() => setProrrogaSeleccionada(null)} />;
    if (citaSeleccionada) return <DetalleCita cita={citaSeleccionada} onVolver={() => setCitaSeleccionada(null)} />;
    if (usuarioSeleccionado) return <DetalleUsuario usuario={usuarioSeleccionado} onVolver={() => setUsuarioSeleccionado(null)} />;
    if (mostrarFormularioRol) return <CrearRolForm onRolCreado={manejarVolverRoles} onCancelar={manejarVolverRoles} />;
    if (rolSeleccionado) return <AsignarPermisosForm rol={rolSeleccionado} onCancelar={manejarVolverRoles} />;

    switch (activeSection) {
      case 'citas': return <TablaCitas onVerCita={manejarVerCita} />;
      case 'prorrogas': return <TablaProrrogas onVerProrroga={manejarVerProrroga} />;
      case 'revision-planos': return <TablaRevisionPlanos onVerRevisionPlano={manejarVerRevisionPlano} />;
      case 'users': return <TablaUsuarios onVerUsuario={manejarVerUsuario} />;
      case 'solicitudes-expedientes': return <TablaSolicitudExpediente onVerExpediente={manejarVerExpediente} />;
      case 'uso-precario': return <TablaUsoPrecario onVerPrecario={manejarVerPrecario} />;
      case 'concesiones': return <TablaConcesiones onVerConcesion={manejarVerConcesion} />;
      case 'denuncias': return <DenunciasTable onVerDenuncia={manejarVerDenuncia} />;
      case 'gestion-denuncias': return <GestionDenunciasTable />;
      case 'roles': return <RolesTable onCrearRol={() => setMostrarFormularioRol(true)} onAsignarPermisos={manejarAsignarPermisos} />;
      case 'denuncias-dashboard': return <TablaDenunciasDashboard />;
      default: return <DashboardHome />;
    }
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'citas', icon: BarChart2, label: 'Citas' },
    { id: 'concesiones', icon: BarChart2, label: 'Concesiones' },
    { id: 'prorrogas', icon: BarChart2, label: 'Prórrogas' },
    { id: 'denuncias', icon: BarChart2, label: 'Denuncias' },
    { id: 'solicitudes-expedientes', icon: BarChart2, label: 'Expedientes' },
    { id: 'uso-precario', icon: BarChart2, label: 'Uso Precario' },
    { id: 'revision-planos', icon: BarChart2, label: 'Revisión de Planos' },
    { id: 'users', icon: Users, label: 'Usuarios' },
    { id: 'roles', icon: Settings, label: 'Gestión de Roles' },
    { id: 'gestion-denuncias', icon: Settings, label: 'Gestión de Denuncias' },
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
                setCitaSeleccionada(null);
                setUsuarioSeleccionado(null);
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <main className="main">
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;
