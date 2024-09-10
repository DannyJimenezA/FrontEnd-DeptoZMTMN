
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Banner from './components/Banner'
import CitasAudiencias from './pages/CitasAudiencias';
import SolicitudExpediente from './pages/SolicitudExpediente';
import Denuncias from './pages/Denuncias';
import Concesiones from './pages/Concesiones';
import UsoPrecario from './pages/UsoPrecario';
import Login from './pages/Login';
import Register from './pages/Register';
import PanelCitas from './pages/PanelesAdministrativos/PanelCitas';
import PanelDenuncia from './pages/PanelesAdministrativos/PanelDenuncia';
import PanelSolicitudConcesion from "./pages/PanelesAdministrativos/PanelSolicitudConcesion";
import ProrrogaConcesion from './pages/ProrrogaConcesion'; // Importa el componente de Prórroga de Concesión


function App () {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Banner />} />
        <Route path="/citas-audiencias" element={<CitasAudiencias />} />
        <Route path="/solicitud-expediente" element={<SolicitudExpediente />} />
        <Route path="/denuncias" element={<Denuncias />} />
        <Route path="/concesiones" element={<Concesiones />} />
        <Route path="/uso-precario" element={<UsoPrecario />} />
        <Route path="/prorroga-concesion" element={<ProrrogaConcesion />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Panel-Citas" element={<PanelCitas />} />
        <Route path="/Panel-Denuncias" element={<PanelDenuncia />} />
        <Route path="/Panel-Solicitud-Concesion" element={<PanelSolicitudConcesion />} />
      </Routes>
    </Router>
  );
}

export default App;
