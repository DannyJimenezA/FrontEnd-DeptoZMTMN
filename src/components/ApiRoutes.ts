const BASE_URL = 'https://backend-deptozmtmn.onrender.com';  // URL base de tu API
// https://backend-deptozmtmn.onrender.com

const ApiRoutes = {
  // Definimos las rutas de cada recurso
  usuarios:  {
    usuariosbase: `${BASE_URL}/users`,
    confirmarusuario:`${BASE_URL}/users/confirm`
    
  },
  auth: {
    login: `${BASE_URL}/auth/login`,
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
