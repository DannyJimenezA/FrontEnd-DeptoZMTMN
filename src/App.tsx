import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import CitasAudiencias from './pages/CitasAudiencias';
import SolicitudExpediente from './pages/SolicitudExpediente';
import Denuncias from './pages/Denuncias';
import Concesiones from './pages/Concesiones';
import UsoPrecario from './pages/UsoPrecario';
import Login from './pages/Login';
import Register from './pages/Register';
import TablaSolicitudes from './pages/PanelesAdministrativos/PanelControlUsuario';
import TablaSolicitudes1 from './pages/PanelesAdministrativos/PanelSolicitudConcesion';
import PanelCitas from './pages/PanelesAdministrativos/PanelCitas';
import PanelSolicitudConcesion from "./pages/PanelesAdministrativos/PanelSolicitudConcesion";
import ProrrogaConcesion from './pages/ProrrogaConcesion'; 
import PanelProrrogaConcesiones from './pages/PanelesAdministrativos/PanelProrrogaConcesion';
import TablaSolicitudExpediente from './pages/PanelesAdministrativos/SolicitudExpediente';
import AppointmentsList from './pages/User/AppointmentsList';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ConfirmAccount from './pages/ConfirmAccount';
import VistaSolicitudesExpediente from './pages/VistaSolicitudesExpedientes';
import RevisionPlanos from './pages/RevisionPlanos';

import PanelDenunciasAdmin from './pages/PanelesAdministrativos/PanelDenunciasAdmin'; // Importar el panel de denuncias admin
import PanelRevisionPlano from './pages/PanelesAdministrativos/PanelRevisionPlano';   // Importar el panel de revisión de plano
import AdminDashboard from './Dashboard/Dashboard';
import { AuthProvider } from './context/AuthContext';





function App () {
  return (
    <AuthProvider>

    <Router>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/citas-Listas" element={<AppointmentsList />} />
        <Route path="/citas-audiencias" element={<CitasAudiencias />} />
        <Route path="/solicitud-expediente" element={<SolicitudExpediente />} />
        <Route path="/denuncias" element={<Denuncias />} />
        <Route path="/concesiones" element={<Concesiones />} />
        <Route path="/uso-precario" element={<UsoPrecario />} />
        <Route path="/prorroga-concesion" element={<ProrrogaConcesion />} /> 
        <Route path="/revision-plano" element={<RevisionPlanos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/TablaSolicitudes" element={<TablaSolicitudes />} />
        <Route path="/TablaSolicitudes1" element={<TablaSolicitudes1 />} />
        <Route path="/Panel-Citas" element={<PanelCitas />} />
        <Route path="/Panel-Solicitud-Concesion" element={<PanelSolicitudConcesion />} />
        <Route path="/Panel-Prorroga-Concesiones" element={<PanelProrrogaConcesiones />} />
        <Route path="/Panel-Solicitud-Expediente" element={<TablaSolicitudExpediente />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/users/reset-password" element={<ResetPassword />} />
        <Route path="/users/confirm/:token" element={<ConfirmAccount />} /> 
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/mis-solicitudes-expediente" element={<VistaSolicitudesExpediente />} />
        <Route path="/admin/denuncias" element={<PanelDenunciasAdmin />} /> 
        <Route path="/admin/revision-plano" element={<PanelRevisionPlano />} /> 

      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;






