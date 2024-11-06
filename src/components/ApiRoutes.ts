const BASE_URL = 'http://localhost:3000';  // URL base de tu API


const ApiRoutes = {
  // Definimos las rutas de cada recurso
  usuarios:  {
    usuariosbase: `${BASE_URL}/users`,
    
  },
  auth: {
    login: 'http://localhost:3000/auth/login',
  },
  concesiones: `${BASE_URL}/Concesiones`,
  prorrogas: `${BASE_URL}/Prorrogas`,
  precarios: `${BASE_URL}/Precario`,
  planos: `${BASE_URL}/revision-plano`,
  denuncias: `${BASE_URL}/denuncia`,
  citas:{
    crearcita: `${BASE_URL}/appointments`,
    miscitas: `${BASE_URL}/appointments/my-appointments`
  },
  roles: `${BASE_URL}/roles`,
  expedientes: `${BASE_URL}/expedientes`,
  urlBase: `${BASE_URL}`,
};

export default ApiRoutes;
