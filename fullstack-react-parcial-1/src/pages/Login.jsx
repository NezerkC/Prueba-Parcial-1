import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validarEmailInstitucional, validarClave } from '../utils/validaciones';

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });

  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpieza de error en tiempo real
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
    if (errorServidor) {
      setErrorServidor('');
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!validarEmailInstitucional(formData.correo)) {
      nuevosErrores.correo =
        'Ingresa un correo válido con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }

    if (!validarClave(formData.password)) {
      nuevosErrores.password =
        'La contraseña debe tener estrictamente entre 4 y 10 caracteres.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorServidor('');

    if (!validarFormulario()) {
      return;
    }

    setIsSubmitting(true);
    const resultado = login(formData.correo, formData.password);
    setIsSubmitting(false);

    if (resultado.exito) {
      if (redirect) {
        navigate(redirect);
      } else if (resultado.usuario.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setErrorServidor(resultado.mensaje || 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="form-card my-4" data-testid="login-page">
      <header className="section-header text-center mb-4">
        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>
          🔐
        </span>
        <h1 className="h2 fw-bold">Iniciar Sesión</h1>
        <p className="text-muted">
          Ingresa tus credenciales para gestionar tus compras o acceder al panel administrativo.
        </p>
      </header>

      {redirect === '/checkout' && (
        <div className="alert alert-warning py-2 px-3 mb-3 small" data-testid="alerta-redirect-checkout">
          🛒 Inicia sesión para continuar con el pago de los artículos en tu carrito.
        </div>
      )}

      {errorServidor && (
        <div
          className="alert alert-danger"
          role="alert"
          data-testid="login-server-error"
        >
          {errorServidor}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Campo Correo Electrónico */}
        <div className="form-group mb-3">
          <label htmlFor="correo">Correo Electrónico:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
            placeholder="ejemplo@duoc.cl"
            value={formData.correo}
            onChange={handleChange}
            data-testid="input-correo"
            required
          />
          {errores.correo && (
            <div className="invalid-feedback" data-testid="error-correo">
              {errores.correo}
            </div>
          )}
        </div>

        {/* Campo Contraseña */}
        <div className="form-group mb-3">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-control ${errores.password ? 'is-invalid' : ''}`}
            placeholder="Entre 4 y 10 caracteres"
            value={formData.password}
            onChange={handleChange}
            data-testid="input-password"
            required
          />
          {errores.password && (
            <div className="invalid-feedback" data-testid="error-password">
              {errores.password}
            </div>
          )}
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          className="btn btn-primary w-100 py-2 mt-2"
          disabled={isSubmitting}
          data-testid="btn-login-submit"
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Ingresar'}
        </button>
      </form>

      <hr className="my-4" />

      {/* Enlace a Registro */}
      <div className="text-center">
        <p className="text-muted mb-2">¿Aún no tienes una cuenta de cliente?</p>
        <Link
          to={redirect ? `/registro?redirect=${encodeURIComponent(redirect)}` : '/registro'}
          className="btn btn-outline-primary"
          data-testid="link-ir-registro"
        >
          Crear una Cuenta
        </Link>
      </div>

      {/* Cuentas de Demostración para evaluación docente */}
      <div className="mt-4 p-3 bg-light rounded border" data-testid="credenciales-demo">
        <strong className="d-block mb-1 text-secondary">
          Credenciales de Prueba (Evaluación Duoc UC):
        </strong>
        <small className="d-block text-muted">
          <strong>Administrador:</strong> admin@profesor.duoc.cl / 123456
        </small>
        <small className="d-block text-muted">
          <strong>Cliente:</strong> cliente@duoc.cl / pass12
        </small>
      </div>
    </div>
  );
}

export default Login;
