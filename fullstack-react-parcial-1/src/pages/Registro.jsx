import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { REGIONES_CHILE } from '../data/regiones';
import {
  validarRutChileno,
  validarEmailInstitucional,
  validarClave,
} from '../utils/validaciones';

function Registro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { registro } = useAuth();

  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellidos: '',
    correo: '',
    clave: '',
    confirmarClave: '',
    region: '',
    comuna: '',
    direccion: '',
  });

  const [comunasDisponibles, setComunasDisponibles] = useState([]);
  const [errores, setErrores] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejador del cambio de región en cascada
  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    const regionEncontrada = REGIONES_CHILE.find((r) => r.id === regionId);

    setFormData((prev) => ({
      ...prev,
      region: regionId,
      comuna: '', // Resetea comuna al cambiar región
    }));

    if (regionEncontrada) {
      setComunasDisponibles(regionEncontrada.comunas);
    } else {
      setComunasDisponibles([]);
    }

    if (errores.region) {
      setErrores((prev) => ({ ...prev, region: '', comuna: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!validarRutChileno(formData.rut)) {
      nuevosErrores.rut =
        'Debe tener entre 7 y 9 dígitos con dígito verificador válido (Módulo 11).';
    }

    if (!formData.nombre.trim() || formData.nombre.trim().length > 50) {
      nuevosErrores.nombre = 'El nombre es obligatorio (máximo 50 caracteres).';
    }

    if (!formData.apellidos.trim() || formData.apellidos.trim().length > 100) {
      nuevosErrores.apellidos =
        'Los apellidos son obligatorios (máximo 100 caracteres).';
    }

    if (!validarEmailInstitucional(formData.correo)) {
      nuevosErrores.correo =
        'Ingresa un correo válido con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }

    if (!validarClave(formData.clave)) {
      nuevosErrores.clave =
        'La contraseña debe tener estrictamente entre 4 y 10 caracteres.';
    }

    if (formData.clave !== formData.confirmarClave) {
      nuevosErrores.confirmarClave = 'Las contraseñas no coinciden.';
    }

    if (!formData.region) {
      nuevosErrores.region = 'Debes seleccionar una región.';
    }

    if (!formData.comuna) {
      nuevosErrores.comuna = 'Debes seleccionar una comuna.';
    }

    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección de despacho es obligatoria.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setIsSubmitting(true);
    registro(formData);
    setIsSubmitting(false);

    if (redirect) {
      navigate(redirect);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="form-card my-4" data-testid="registro-page">
      <header className="section-header text-center mb-4">
        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>
          📝
        </span>
        <h1 className="h2 fw-bold">Crear Cuenta de Cliente</h1>
        <p className="text-muted">
          Regístrate para recibir despachos rápidos en Viña del Mar y todo Chile.
        </p>
      </header>

      {redirect === '/checkout' && (
        <div className="alert alert-warning py-2 px-3 mb-3 small" data-testid="alerta-registro-redirect-checkout">
          🛒 Regístrate para completar tu orden en el Checkout. Tus productos seguirán guardados.
        </div>
      )}

      <form id="form-registro" onSubmit={handleSubmit} noValidate>
        {/* RUN / RUT */}
        <div className="form-group mb-3">
          <label htmlFor="reg-rut">RUN / RUT (con o sin guión):</label>
          <input
            type="text"
            id="reg-rut"
            name="rut"
            placeholder="Ej: 19011022-K o 19011022K"
            className={`form-control ${errores.rut ? 'is-invalid' : ''}`}
            value={formData.rut}
            onChange={handleChange}
            onBlur={() => {
              if (formData.rut && !validarRutChileno(formData.rut)) {
                setErrores((prev) => ({
                  ...prev,
                  rut: 'Debe tener entre 7 y 9 dígitos con dígito verificador válido (Módulo 11).',
                }));
              }
            }}
            data-testid="input-registro-rut"
            required
          />
          {errores.rut && (
            <div className="invalid-feedback" data-testid="error-rut">
              {errores.rut}
            </div>
          )}
        </div>

        {/* Nombres y Apellidos */}
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label htmlFor="reg-nombre">Nombre:</label>
            <input
              type="text"
              id="reg-nombre"
              name="nombre"
              placeholder="Ej: Juan"
              className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
              value={formData.nombre}
              onChange={handleChange}
              data-testid="input-registro-nombre"
              required
            />
            {errores.nombre && (
              <div className="invalid-feedback" data-testid="error-nombre">
                {errores.nombre}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="reg-apellidos">Apellidos:</label>
            <input
              type="text"
              id="reg-apellidos"
              name="apellidos"
              placeholder="Ej: Pérez González"
              className={`form-control ${errores.apellidos ? 'is-invalid' : ''}`}
              value={formData.apellidos}
              onChange={handleChange}
              data-testid="input-registro-apellidos"
              required
            />
            {errores.apellidos && (
              <div className="invalid-feedback" data-testid="error-apellidos">
                {errores.apellidos}
              </div>
            )}
          </div>
        </div>

        {/* Correo Electrónico */}
        <div className="form-group mb-3">
          <label htmlFor="reg-correo">Correo Electrónico:</label>
          <input
            type="email"
            id="reg-correo"
            name="correo"
            placeholder="nombre@duoc.cl"
            className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
            value={formData.correo}
            onChange={handleChange}
            data-testid="input-registro-correo"
            required
          />
          {errores.correo && (
            <div className="invalid-feedback" data-testid="error-correo">
              {errores.correo}
            </div>
          )}
        </div>

        {/* Contraseña y Confirmación */}
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label htmlFor="reg-clave">Contraseña (4-10 caracteres):</label>
            <input
              type="password"
              id="reg-clave"
              name="clave"
              placeholder="Contraseña"
              className={`form-control ${errores.clave ? 'is-invalid' : ''}`}
              value={formData.clave}
              onChange={handleChange}
              data-testid="input-registro-clave"
              required
            />
            {errores.clave && (
              <div className="invalid-feedback" data-testid="error-clave">
                {errores.clave}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="reg-confirmar-clave">Confirmar Contraseña:</label>
            <input
              type="password"
              id="reg-confirmar-clave"
              name="confirmarClave"
              placeholder="Repetir contraseña"
              className={`form-control ${errores.confirmarClave ? 'is-invalid' : ''}`}
              value={formData.confirmarClave}
              onChange={handleChange}
              data-testid="input-registro-confirmar-clave"
              required
            />
            {errores.confirmarClave && (
              <div className="invalid-feedback" data-testid="error-confirmar-clave">
                {errores.confirmarClave}
              </div>
            )}
          </div>
        </div>

        {/* Región y Comuna (Cascada Dinámica) */}
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label htmlFor="reg-region">Región:</label>
            <select
              id="reg-region"
              name="region"
              className={`form-select ${errores.region ? 'is-invalid' : ''}`}
              value={formData.region}
              onChange={handleRegionChange}
              data-testid="select-registro-region"
              required
            >
              <option value="">Selecciona tu región</option>
              {REGIONES_CHILE.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.nombre}
                </option>
              ))}
            </select>
            {errores.region && (
              <div className="invalid-feedback" data-testid="error-region">
                {errores.region}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="reg-comuna">Comuna:</label>
            <select
              id="reg-comuna"
              name="comuna"
              className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
              value={formData.comuna}
              onChange={handleChange}
              disabled={comunasDisponibles.length === 0}
              data-testid="select-registro-comuna"
              required
            >
              <option value="">
                {comunasDisponibles.length === 0
                  ? 'Elige una región primero'
                  : 'Selecciona tu comuna'}
              </option>
              {comunasDisponibles.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
            {errores.comuna && (
              <div className="invalid-feedback" data-testid="error-comuna">
                {errores.comuna}
              </div>
            )}
          </div>
        </div>

        {/* Dirección de despacho */}
        <div className="form-group mb-3">
          <label htmlFor="reg-direccion">Dirección de Despacho (Calle, Número):</label>
          <input
            type="text"
            id="reg-direccion"
            name="direccion"
            placeholder="Ej: Av. Libertad 1234, Dpto 502"
            className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
            value={formData.direccion}
            onChange={handleChange}
            data-testid="input-registro-direccion"
            required
          />
          {errores.direccion && (
            <div className="invalid-feedback" data-testid="error-direccion">
              {errores.direccion}
            </div>
          )}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          className="btn btn-primary w-100 py-2 mt-2"
          disabled={isSubmitting}
          data-testid="btn-registro-submit"
        >
          {isSubmitting ? 'Registrando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>

      <hr className="my-4" />

      {/* Enlace a Login */}
      <div className="text-center">
        <p className="text-muted mb-2">¿Ya tienes una cuenta registrada?</p>
        <Link
          to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
          className="btn btn-outline-primary"
          data-testid="link-ir-login"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}

export default Registro;
