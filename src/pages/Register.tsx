
import '../styles/Login.css'
import { Link } from 'react-router-dom';

function Register () {
  return (
    <div className='login-container'>
      <h2>Registrarse</h2>
      <form className='login-form'>
        <div className='form-group'>
            <label htmlFor='name'>Nombre</label>
            <input type='text' id='name'/>
        </div>
        <div className='form-group'>
            <label htmlFor='email'>Correo</label>
            <input type='text' id='email'/>
        </div>
        <div className='form-group'>
            <label htmlFor='id'>ID</label>
            <input type='text' id='id'/>
        </div>
        <div className='form-group'>
            <label htmlFor='phone'>Numero de telefono</label>
            <input type='text' id='phone'/>
        </div>
        <div className='form-group'>
            <label htmlFor='password'>Contrasenia</label>
            <input type='text' id='password'/>
        </div>
        <button type="button"><Link to="/login">Crear Cuenta</Link></button>
        <button type="button"><Link to="/login">Cancelar</Link></button>
      </form>
    </div>
    
  );
};

export default Register;
