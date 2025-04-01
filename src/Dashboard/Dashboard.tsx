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

  const manejarVerDenuncia = (denuncia: Denuncia) => setDenunciaSeleccionada(denuncia);
  const manejarVerConcesion = (concesion: Concesion) => setConcesionSeleccionada(concesion);
  const manejarVerPrecario = (precario: Precario) => setPrecarioSeleccionado(precario);
  const manejarVerExpediente = (expediente: CopiaExpediente) => setExpedienteSeleccionado(expediente);
  const manejarVerRevisionPlano = (revisionPlano: RevisionPlano) => setRevisionPlanoSeleccionado(revisionPlano);
  const manejarVerProrroga = (prorroga: Prorroga) => setProrrogaSeleccionada(prorroga);
  const manejarVerCita = (cita: Cita) => setCitaSeleccionada(cita);
  const manejarVerUsuario = (usuario: Usuario) => setUsuarioSeleccionado(usuario);
  

  const manejarCambioEstadoCita = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }

      const response = await fetch(`${ApiRoutes.citas.crearcita}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la cita');
      }

      if (citaSeleccionada && citaSeleccionada.id === id) {
        setCitaSeleccionada({ ...citaSeleccionada, status: nuevoEstado });
      }

      alert(`El estado de la cita ha sido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado de la cita:', error);
      alert('Hubo un error al intentar cambiar el estado de la cita.');
    }
  };

  const manejarCambioEstadoConcesion = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }

      const response = await fetch(`${ApiRoutes.concesiones}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la concesión');
      }

      if (concesionSeleccionada && concesionSeleccionada.id === id) {
        setConcesionSeleccionada({ ...concesionSeleccionada, status: nuevoEstado });
      }

      alert(`El estado de la concesión ha sido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado de la concesión:', error);
      alert('Hubo un error al intentar cambiar el estado de la concesión.');
    }
  };

  const manejarCambioEstadoExpediente = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }

      const response = await fetch(`${ApiRoutes.expedientes}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del expediente');
      }

      if (expedienteSeleccionado && expedienteSeleccionado.idExpediente === id) {
        setExpedienteSeleccionado({ ...expedienteSeleccionado, status: nuevoEstado });
      }

      alert(`El estado del expediente ha sido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado del expediente:', error);
      alert('Hubo un error al intentar cambiar el estado del expediente.');
    }
  };

  const manejarCambioEstadoPrecario = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }
  
      const response = await fetch(`${ApiRoutes.precarios}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }), // Asegúrate de que el campo coincide con la API
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el estado del uso precario');
      }
  
      // Si el estado fue actualizado exitosamente, actualiza el estado local si es necesario
      alert(`El estado del uso precario ha sido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado del uso precario:', error);
      alert('Hubo un error al intentar cambiar el estado del uso precario.');
    }
  };
  
  const manejarCambioEstadoDenuncia = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }
  
      const response = await fetch(`${ApiRoutes.denuncias}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la denuncia');
      }
  
      if (denunciaSeleccionada && denunciaSeleccionada.id === id) {
        setDenunciaSeleccionada({ ...denunciaSeleccionada, status: nuevoEstado });
      }
  
      alert(`El estado de la denuncia ha sido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado de la denuncia:', error);
      alert('Hubo un error al intentar cambiar el estado de la denuncia.');
    }
  };

  const manejarCambioEstadoRevisionPlano = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }
  
      const response = await fetch(`${ApiRoutes.planos}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la revisión de plano');
      }
  
      if (revisionPlanoSeleccionado && revisionPlanoSeleccionado.id === id) {
        setRevisionPlanoSeleccionado({ ...revisionPlanoSeleccionado, status: nuevoEstado });
      }
  
      alert(`El estado de la revisión de plano ha sido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado de la revisión de plano:', error);
      alert('Hubo un error al intentar cambiar el estado de la revisión de plano.');
    }
  };
  
  const manejarCambioEstadoProrroga = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }
  
      const response = await fetch(`${ApiRoutes.prorrogas}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la prórroga');
      }
  
      if (prorrogaSeleccionada && prorrogaSeleccionada.id === id) {
        setProrrogaSeleccionada({ ...prorrogaSeleccionada, status: nuevoEstado });
      }
  
      alert(`El estado de la prórroga ha sido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado de la prórroga:', error);
      alert('Hubo un error al intentar cambiar el estado de la prórroga.');
    }
  };

  const manejarCambioEstadoUsuario = async (id: number, nuevoEstado: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }
  
      const response = await fetch(`${ApiRoutes.usuarios}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el estado del usuario');
      }
  
      // Actualizar el estado local del usuario seleccionado
      if (usuarioSeleccionado && usuarioSeleccionado.id === id) {
        setUsuarioSeleccionado({ ...usuarioSeleccionado, isActive: nuevoEstado });
      }
  
      alert(`El estado del usuario ha sido actualizado a: ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
      alert('Hubo un error al intentar cambiar el estado del usuario.');
    }
  };
  
  const manejarAsignarPermisos = (rol: Role) => {
    setRolSeleccionado(rol); // ✅ Guardamos el rol seleccionado
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
