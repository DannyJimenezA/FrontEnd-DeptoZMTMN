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
import { DecodedToken, Denuncia, Concesion, Precario, CopiaExpediente, RevisionPlano, Prorroga, Role, Usuario } from '../Types/Types'; // Importar las interfaces
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
import CrearRolForm from '../Tablas/CrearRolForm';
import AsignarPermisosForm from '../TablaVista/AsignarPermisosForm';
import DetalleUsuario from '../TablaVista/DetalleUsuario';
import GestionDenunciasTable from '../Tablas/GestionDenunciasTable';
import TablaDenunciasDashboard from '../Tablas/TablaDenuncia';
import ApiRoutes from '../components/ApiRoutes';
import DashboardHome from './DashboardHome';
import Swal from 'sweetalert2';
import GestionCitasTable from '../Tablas/GestionCitasTable';


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
  const [rolSeleccionado, setRolSeleccionado] = useState<Role | null>(null); // Estado para el rol seleccionado
  const [mostrarFormularioRol, setMostrarFormularioRol] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        
        // Verifica que tenga al menos un permiso
        if (!decodedToken.permissions || decodedToken.permissions.length === 0) {
          window.alert('Acceso limitado. No tiene permisos para acceder a este componente.');


  

  
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

  // Función para mostrar el formulario de crear rol
  const manejarMostrarFormularioCrearRol = () => {
    setMostrarFormularioRol(true);
    setRolSeleccionado(null);  // Asegurarse de que no se esté editando un rol
  };

  // // Función para ocultar el formulario de crear rol
  // const manejarOcultarFormularioCrearRol = () => {
  //   setMostrarFormularioRol(false);
  // };

  // // Función para editar los permisos del rol seleccionado
  // const manejarEditarRol = (rol: Role) => {
  //   setRolSeleccionado(rol);
  //   setMostrarFormularioRol(false);  // Asegurarse de que no esté en modo de creación
  // };

  // Función para volver a la tabla de roles
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
      if (!token) throw new Error('Token de autenticación no encontrado.');
  
      const response = await fetch(`${ApiRoutes.citas.crearcita}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
  
      if (!response.ok) throw new Error('Error al actualizar el estado de la cita');
  
      if (citaSeleccionada && citaSeleccionada.id === id) {
        setCitaSeleccionada({ ...citaSeleccionada, status: nuevoEstado });
      }
  
      await Swal.fire({
        title: 'Estado actualizado',
        text: `La cita ha sido ${nuevoEstado.toLowerCase()} correctamente.`,
        icon: 'success',
        confirmButtonColor: '#16a34a',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error al cambiar el estado de la cita:', error);
      Swal.fire('Error', 'Hubo un error al intentar cambiar el estado de la cita.', 'error');
    }
  };

  const manejarCambioEstadoConcesion = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token de autenticación no encontrado.');
  
      const response = await fetch(`${ApiRoutes.concesiones}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
  
      if (!response.ok) throw new Error('Error al actualizar el estado de la concesión');
  
      if (concesionSeleccionada && concesionSeleccionada.id === id) {
        setConcesionSeleccionada({ ...concesionSeleccionada, status: nuevoEstado });
      }
  
      Swal.fire('Estado actualizado', `La concesión ha sido ${nuevoEstado.toLowerCase()} correctamente.`, 'success');
    } catch (error) {
      console.error('Error al cambiar el estado de la concesión:', error);
      Swal.fire('Error', 'Hubo un error al intentar cambiar el estado de la concesión.', 'error');
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
  
      Swal.fire('Estado actualizado', `El expediente ha sido ${nuevoEstado.toLowerCase()} correctamente.`, 'success');
    } catch (error) {
      console.error('Error al cambiar el estado del expediente:', error);
      Swal.fire('Error', 'Hubo un error al intentar cambiar el estado del expediente.', 'error');
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
        body: JSON.stringify({ status: nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el estado del uso precario');
      }
  
      if (precarioSeleccionado && precarioSeleccionado.id === id) {
        setPrecarioSeleccionado({ ...precarioSeleccionado, status: nuevoEstado });
      }
  
      await Swal.fire({
        icon: 'success',
        title: 'Estado actualizado',
        text: `El uso precario ha sido ${nuevoEstado.toLowerCase()} correctamente.`,
      });
    } catch (error) {
      console.error('Error al cambiar el estado del uso precario:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al intentar cambiar el estado del uso precario.',
      });
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
  
      await Swal.fire({
        icon: 'success',
        title: 'Estado actualizado',
        text: `La denuncia ha sido ${nuevoEstado.toLowerCase()} correctamente.`,
      });
    } catch (error) {
      console.error('Error al cambiar el estado de la denuncia:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al intentar cambiar el estado de la denuncia.',
      });
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
  
      await Swal.fire({
        icon: 'success',
        title: 'Estado actualizado',
        text: `La revisión del plano ha sido ${nuevoEstado.toLowerCase()} correctamente.`,
      });
    } catch (error) {
      console.error('Error al cambiar el estado de la revisión de plano:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al intentar cambiar el estado de la revisión del plano.',
      });
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

    await Swal.fire({
      icon: 'success',
      title: 'Estado actualizado',
      text: `La prórroga ha sido ${nuevoEstado.toLowerCase()} correctamente.`,
    });
  } catch (error) {
    console.error('Error al cambiar el estado de la prórroga:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al intentar cambiar el estado de la prórroga.',
    });
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
    if (denunciaSeleccionada)
      return (
        <DetalleDenuncia
          denuncia={denunciaSeleccionada}
          onVolver={() => setDenunciaSeleccionada(null)}
          onEstadoCambiado={manejarCambioEstadoDenuncia} // ✅ Añadido
        />
      );
    

    if (concesionSeleccionada)
      return (
        <DetalleConcesion
          concesion={concesionSeleccionada}
          onVolver={() => setConcesionSeleccionada(null)}
          onEstadoCambiado={manejarCambioEstadoConcesion} // ✅ Añadido
        />
      );
    

    if (precarioSeleccionado)
      return (
        <DetalleUsoPrecario
          precario={precarioSeleccionado}
          onVolver={() => setPrecarioSeleccionado(null)}
          onEstadoCambiado={manejarCambioEstadoPrecario} // ✅ Añadido
        />
      );
    

    if (expedienteSeleccionado)
      return (
        <DetalleExpediente
          expediente={expedienteSeleccionado}
          onVolver={() => setExpedienteSeleccionado(null)}
          onEstadoCambiado={manejarCambioEstadoExpediente} // ✅ Añadido
        />
      );
    

    if (revisionPlanoSeleccionado)
      return (
        <DetalleRevisionPlano
          revisionPlano={revisionPlanoSeleccionado}
          onVolver={() => setRevisionPlanoSeleccionado(null)}
          onEstadoCambiado={manejarCambioEstadoRevisionPlano} // ✅ Añadido
        />
      );
    

    if (prorrogaSeleccionada)
      return (
        <DetalleProrroga
          prorroga={prorrogaSeleccionada}
          onVolver={() => setProrrogaSeleccionada(null)}
          onEstadoCambiado={manejarCambioEstadoProrroga} // ✅ Agregado
        />
      );
    

    if (citaSeleccionada)
      return (
        <DetalleCita
          cita={citaSeleccionada}
          onVolver={() => setCitaSeleccionada(null)}
          onEstadoCambiado={manejarCambioEstadoCita} // ✅ Agregado
        />
      );
    

    if (mostrarFormularioRol) {
      return <CrearRolForm onRolCreado={manejarVolverRoles} onCancelar={manejarVolverRoles} />;
    }

  if (usuarioSeleccionado)
  return (
    <DetalleUsuario
      usuario={usuarioSeleccionado}
      onVolver={() => setUsuarioSeleccionado(null)}
      onEstadoCambiado={manejarCambioEstadoUsuario} // ✅ aquí está el fix
    />
  );


    if (rolSeleccionado) {
      return <AsignarPermisosForm rol={rolSeleccionado} onCancelar={manejarVolverRoles}/>;
    }

    if (mostrarFormularioRol) {
      return <CrearRolForm onRolCreado={manejarVolverRoles} onCancelar={manejarVolverRoles} />;
    }

    if (activeSection === 'roles') {
      return <RolesTable onCrearRol={manejarMostrarFormularioCrearRol} onAsignarPermisos={manejarAsignarPermisos} />;
    }
    

    switch (activeSection) {
      case 'citas':
        return <TablaCitas onVerCita={manejarVerCita} />;
      case 'prorrogas':
        return <TablaProrrogas onVerProrroga={manejarVerProrroga} />;
      case 'revision-planos':
        return <TablaRevisionPlanos onVerRevisionPlano={manejarVerRevisionPlano} />;
      case 'users':
        return <TablaUsuarios onVerUsuario={manejarVerUsuario}/>;
      case 'solicitudes-expedientes':
        return <TablaSolicitudExpediente onVerExpediente={manejarVerExpediente} />;
      case 'uso-precario':
        return <TablaUsoPrecario onVerPrecario={manejarVerPrecario} />;
      case 'concesiones':
        return <TablaConcesiones onVerConcesion={manejarVerConcesion} />;
      case 'denuncias':
        return <DenunciasTable onVerDenuncia={manejarVerDenuncia} />;
      case 'gestion-denuncias':
        return <GestionDenunciasTable/>;
      case 'denuncias': // Añadido: Renderiza la tabla de denuncias
        return <TablaDenunciasDashboard />;
        case 'gestion-citas':
          return <GestionCitasTable/>;
      default:
        return <DashboardHome setActiveSection={setActiveSection} />;
    }
  };


  const menuItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'citas', icon: BarChart2, label: 'Citas', endpoint: ApiRoutes.citas.crearcita },
    { id: 'concesiones', icon: BarChart2, label: 'Concesiones', endpoint: ApiRoutes.concesiones },
    { id: 'prorrogas', icon: BarChart2, label: 'Prórrogas', endpoint: ApiRoutes.prorrogas },
    { id: 'denuncias', icon: BarChart2, label: 'Denuncias', endpoint: ApiRoutes.denuncias },
    { id: 'solicitudes-expedientes', icon: BarChart2, label: 'Expedientes', endpoint: ApiRoutes.expedientes },
    { id: 'uso-precario', icon: BarChart2, label: 'Uso Precario', endpoint: ApiRoutes.precarios },
    { id: 'revision-planos', icon: BarChart2, label: 'Revisión de Planos', endpoint: ApiRoutes.planos },
    { id: 'users', icon: Users, label: 'Usuarios'},
    { id: 'roles', icon: Settings, label: 'Gestión de Roles' },
    { id: 'gestion-denuncias', icon: Settings, label: 'Gestión de Denuncias' },
    { id: 'gestion-citas', icon: Settings, label: 'Gestión de Disponibilidad' },
  ];
  

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">Dashboard</div>
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
                setRolSeleccionado(null); // ✅ FIX
                setMostrarFormularioRol(false); // ✅ por si acaso
              }}
              
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {/* {item.endpoint && (
        <PendingCountBadge endpoint={item.endpoint} status="Pendiente" />
      )} */}
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
