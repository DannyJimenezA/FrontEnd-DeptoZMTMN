import React, { useState, useEffect } from 'react';
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
import { DecodedToken, Denuncia, Concesion, Precario, CopiaExpediente, RevisionPlano, Prorroga } from '../Types/Types'; // Importar las interfaces
import DetalleUsoPrecario from '../TablaVista/DetallePrecario';
import DetalleExpediente from '../TablaVista/DetalleExpediente';
import DetalleRevisionPlano from '../TablaVista/DetalleRevisionPlano';
import DetalleProrroga from '../TablaVista/DetalleProrroga';
import DetalleCita from '../TablaVista/DetalleCita';
import '../styles/Botones.css';
import LogoutButton from '../components/LogoutButton';  // Importar el componente LogoutButton
import { Cita } from '../Types/Types';
import TablaCitas from '../Tablas/AppointmentTable';
import RolesTable from '../Tablas/RolesTable';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [denunciaSeleccionada, setDenunciaSeleccionada] = useState<Denuncia | null>(null);
  const [concesionSeleccionada, setConcesionSeleccionada] = useState<Concesion | null>(null);
  const [precarioSeleccionado, setPrecarioSeleccionado] = useState<Precario | null>(null);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState<CopiaExpediente | null>(null);
  const [revisionPlanoSeleccionado, setRevisionPlanoSeleccionado] = useState<RevisionPlano | null>(null);
  const [prorrogaSeleccionada, setProrrogaSeleccionada] = useState<Prorroga | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
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
  const manejarVerCita = (cita: Cita) => setCitaSeleccionada(cita);

  // Función para manejar el cambio de estado de una cita
  const manejarCambioEstadoCita = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }

      const response = await fetch(`http://localhost:3000/appointments/${id}/status`, {
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

      // Actualizar el estado de la cita seleccionada en el dashboard
      if (citaSeleccionada && citaSeleccionada.id === id) {
        setCitaSeleccionada({ ...citaSeleccionada, status: nuevoEstado });
      }

      alert(`El estado de la cita ha sido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado de la cita:', error);
      alert('Hubo un error al intentar cambiar el estado de la cita.');
    }
  };
  // Función para manejar el cambio de estado de una concesion
  const manejarCambioEstadoConcesion = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }
  
      const response = await fetch(`http://localhost:3000/Concesiones/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ Status: nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la concesión');
      }
  
      // Actualiza el estado localmente si la concesión está seleccionada
      if (concesionSeleccionada && concesionSeleccionada.id === id) {
        setConcesionSeleccionada({ ...concesionSeleccionada, Status: nuevoEstado });
      }
  
      alert(`El estado de la concesión ha sido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado de la concesión:', error);
      alert('Hubo un error al intentar cambiar el estado de la concesión.');
    }
  };
  // Función para manejar el cambio de estado de una expediente
  const manejarCambioEstadoExpediente = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }
  
      const response = await fetch(`http://localhost:3000/expedientes/${id}/status`, {
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
  
      // Actualiza el estado localmente si el expediente está seleccionado
      if (expedienteSeleccionado && expedienteSeleccionado.idExpediente === id) {
        setExpedienteSeleccionado({ ...expedienteSeleccionado, status: nuevoEstado });
      }
  
      alert(`El estado del expediente ha sido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado del expediente:', error);
      alert('Hubo un error al intentar cambiar el estado del expediente.');
    }
  };
  // Función para manejar el cambio de estado de una uso precario
  const manejarCambioEstadoPrecario = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado.');
      }
  
      const response = await fetch(`http://localhost:3000/precario/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el estado del uso precario');
      }
  
      // Actualiza el estado localmente si el uso precario está seleccionado
      if (precarioSeleccionado && precarioSeleccionado.id === id) {
        setPrecarioSeleccionado({ ...precarioSeleccionado, Status: nuevoEstado });
      }
  
      alert(`El estado del uso precario ha sido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado del uso precario:', error);
      alert('Hubo un error al intentar cambiar el estado del uso precario.');
    }
  };
  
  

  const renderSection = () => {
    if (denunciaSeleccionada) {
      return <DetalleDenuncia denuncia={denunciaSeleccionada} onVolver={() => setDenunciaSeleccionada(null)} />;
    }

    if (concesionSeleccionada) {
      return <DetalleConcesion concesion={concesionSeleccionada} onVolver={() => setConcesionSeleccionada(null)}  onEstadoCambiado={manejarCambioEstadoConcesion} />;
    }

    if (precarioSeleccionado) {
      return <DetalleUsoPrecario precario={precarioSeleccionado} onVolver={() => setPrecarioSeleccionado(null)} onEstadoCambiado={manejarCambioEstadoPrecario}/>;
    }

    if (expedienteSeleccionado) {
      return <DetalleExpediente expediente={expedienteSeleccionado} onVolver={() => setExpedienteSeleccionado(null)} onEstadoCambiado={manejarCambioEstadoExpediente}/>;
    }

    if (revisionPlanoSeleccionado) {
      return <DetalleRevisionPlano revisionPlano={revisionPlanoSeleccionado} onVolver={() => setRevisionPlanoSeleccionado(null)} />;
    }

    if (prorrogaSeleccionada) {
      return <DetalleProrroga prorroga={prorrogaSeleccionada} onVolver={() => setProrrogaSeleccionada(null)} />;
    }

    if (citaSeleccionada) {
      return <DetalleCita cita={citaSeleccionada} onVolver={() => setCitaSeleccionada(null)} onEstadoCambiado={manejarCambioEstadoCita} />;
    }

    switch (activeSection) {
      case 'citas':
        return <TablaCitas onVerCita={manejarVerCita} />;
      case 'prorrogas':
        return <TablaProrrogas onVerProrroga={manejarVerProrroga} />;
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
      case 'roles':
        return <RolesTable />;
      default:
        return <p>Bienvenido al dashboard</p>;
    }
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'citas', icon: BarChart2, label: 'Citas' },
    { id: 'concesiones', icon: BarChart2, label: 'Concesiones' },
    { id: 'prorrogas', icon: BarChart2, label: 'Prórrogas' },
    { id: 'denuncias', icon: BarChart2, label: 'Denuncias' },
    { id: 'revision-planos', icon: BarChart2, label: 'Revisión de Planos' },
    { id: 'users', icon: Users, label: 'Usuarios' },
    { id: 'roles', icon: Settings, label: 'Roles' },
    { id: 'solicitudes-expedientes', icon: BarChart2, label: 'Expedientes' },
    { id: 'uso-precario', icon: BarChart2, label: 'Uso Precario' },
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
