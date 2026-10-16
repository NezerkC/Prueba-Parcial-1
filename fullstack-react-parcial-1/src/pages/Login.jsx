import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validarEmailInstitucional, validarClave } from '../utils/validaciones';

function Login() {
  const navigate = useNavigate();
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
      if (resultado.usuario.rol === 'admin') {
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

      {errorServidor && (
        <div
          className="alert alert-danger py-2 mb-3"
          role="alert"
          aria-live="polite"
          data-testid="login-server-error"
        >
          {errorServidor}
        </div>
      )}

      <form id="form-login" onSubmit={handleSubmit} noValidate>
        {/* Correo Electrónico */}
        <div className="form-group mb-3">
          <label htmlFor="login-correo">Correo Electrónico:</label>
          <input
            type="email"
            id="login-correo"
            name="correo"
            placeholder="ejemplo@duoc.cl"
            maxLength={100}
            required
            autoComplete="username"
            value={formData.correo}
            onChange={handleChange}
            className={`form-control ${errores.correo ? 'input-error is-invalid' : ''}`}
            aria-invalid={Boolean(errores.correo)}
            aria-describedby={errores.correo ? 'error-login-correo' : undefined}
            data-testid="input-correo"
          />
          {errores.correo && (
            <small
              className="error-msg show text-danger d-block mt-1"
              id="error-login-correo"
              role="alert"
            >
              {errores.correo}
            </small>
          )}
        </div>

        {/* Contraseña */}
        <div className="form-group mb-3">
          <label htmlFor="login-pass">Contraseña:</label>
          <input
            type="password"
            id="login-pass"
            name="password"
            placeholder="Entre 4 y 10 caracteres"
            maxLength={10}
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className={`form-control ${errores.password ? 'input-error is-invalid' : ''}`}
            aria-invalid={Boolean(errores.password)}
            aria-describedby={errores.password ? 'error-login-pass' : undefined}
            data-testid="input-password"
          />
          {errores.password && (
            <small
              className="error-msg show text-danger d-block mt-1"
              id="error-login-pass"
              role="alert"
            >
              {errores.password}
            </small>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2 mt-2"
          disabled={isSubmitting}
          data-testid="btn-login-submit"
        >
          {isSubmitting ? 'Verificando...' : 'Ingresar al Sistema'}
        </button>

        <div className="mt-4 text-center text-muted small">
          ¿No tienes una cuenta registrada?{' '}
          <Link to="/registro" className="fw-bold text-decoration-none">
            Crear cuenta nueva &rarr;
          </Link>
        </div>

        {/* Indicador de credenciales de prueba para el evaluador de Duoc UC */}
        <div
          className="mt-4 p-3 bg-light rounded border text-muted small"
          data-testid="credenciales-demo"
        >
          <strong className="text-dark d-block mb-1">
            Credenciales de prueba (Evaluación DSY1104):
          </strong>
          <div className="mb-1">
            • <strong>Admin:</strong> <code>admin@profesor.duoc.cl</code> (Clave:{' '}
            <code>123456</code>) &rarr; Redirige a Panel Admin.
          </div>
          <div>
            • <strong>Cliente:</strong> <code>cliente@duoc.cl</code> o{' '}
            <code>usuario@gmail.com</code> (Clave: <code>pass12</code>).
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
