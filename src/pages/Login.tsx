
import '../styles/Login.css'
import { Link } from 'react-router-dom';

function Login () {
  return (
    <div className='login-container'>
      <h2>Inicio de Sesion</h2>
      <form className='login-form'>
        <div className='form-group'>
            <label htmlFor='email'>Correo</label>
            <input type='text' id='email'/>
        </div>
        <div className='form-group'>
            <label htmlFor='password'>Contrasenia</label>
            <input type='text' id='password'/>
        </div>
        <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
        <button type="button"><Link to="/">Iniciar Sesion</Link></button>
        <button type="button"><Link to="/">Cancelar</Link></button>
      </form>
    </div>
    
  );
};

export default Login;
