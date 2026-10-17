import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { REGIONES_CHILE } from '../data/regiones';
import {
  validarRutChileno,
  formatearRutChileno,
  validarEmailInstitucional,
  validarClave,
} from '../utils/validaciones';

function Registro() {
  const navigate = useNavigate();
  const { registro } = useAuth();

  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellidos: '',
    correo: '',
    clave: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: '',
  });

  const [errores, setErrores] = useState({});
  const [comunasDisponibles, setComunasDisponibles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRutChange = (e) => {
    const valorCrudo = e.target.value;
    // Permite al usuario escribir mientras se actualiza el estado
    setFormData((prev) => ({ ...prev, rut: valorCrudo }));

    if (errores.rut) {
      setErrores((prev) => ({ ...prev, rut: '' }));
    }
  };

  const handleRutBlur = () => {
    if (!formData.rut) return;
    if (validarRutChileno(formData.rut)) {
      setFormData((prev) => ({ ...prev, rut: formatearRutChileno(prev.rut) }));
      setErrores((prev) => ({ ...prev, rut: '' }));
    } else {
      setErrores((prev) => ({
        ...prev,
        rut: 'Debe tener entre 7 y 9 dígitos con dígito verificador válido (Módulo 11).',
      }));
    }
  };

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
      nuevosErrores.apellidos = 'Los apellidos son obligatorios (máximo 100 caracteres).';
    }

    if (!validarEmailInstitucional(formData.correo)) {
      nuevosErrores.correo =
        'Solo se autorizan correos con dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }

    if (!validarClave(formData.clave)) {
      nuevosErrores.clave = 'La contraseña debe tener estrictamente entre 4 y 10 caracteres.';
    }

    if (!formData.region) {
      nuevosErrores.region = 'Debes seleccionar una región.';
    }

    if (!formData.comuna) {
      nuevosErrores.comuna = 'Debes seleccionar una comuna.';
    }

    if (!formData.direccion.trim() || formData.direccion.trim().length > 300) {
      nuevosErrores.direccion = 'La dirección es obligatoria (máximo 300 caracteres).';
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

    navigate('/');
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

      <form id="form-registro" onSubmit={handleSubmit} noValidate>
        {/* RUN / RUT */}
        <div className="form-group mb-3">
          <label htmlFor="reg-rut">RUN / RUT (con o sin guión):</label>
          <input
            type="text"
            id="reg-rut"
            name="rut"
            placeholder="Ej: 19011022-K o 19011022K"
            maxLength={12}
            required
            value={formData.rut}
            onChange={handleRutChange}
            onBlur={handleRutBlur}
            className={`form-control ${errores.rut ? 'input-error is-invalid' : ''}`}
            aria-invalid={Boolean(errores.rut)}
            aria-describedby={errores.rut ? 'error-rut' : undefined}
            data-testid="input-registro-rut"
          />
          {errores.rut && (
            <small className="error-msg show text-danger d-block mt-1" id="error-rut" role="alert">
              {errores.rut}
            </small>
          )}
        </div>

        {/* Nombre y Apellidos (Bicolumnar) */}
        <div className="form-row-2 mb-3">
          <div className="form-group">
            <label htmlFor="reg-nombre">Nombre:</label>
            <input
              type="text"
              id="reg-nombre"
              name="nombre"
              placeholder="Tu nombre"
              maxLength={50}
              required
              value={formData.nombre}
              onChange={handleChange}
              className={`form-control ${errores.nombre ? 'input-error is-invalid' : ''}`}
              aria-invalid={Boolean(errores.nombre)}
              data-testid="input-registro-nombre"
            />
            {errores.nombre && (
              <small className="error-msg show text-danger d-block mt-1" role="alert">
                {errores.nombre}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reg-apellidos">Apellidos:</label>
            <input
              type="text"
              id="reg-apellidos"
              name="apellidos"
              placeholder="Tus apellidos"
              maxLength={100}
              required
              value={formData.apellidos}
              onChange={handleChange}
              className={`form-control ${errores.apellidos ? 'input-error is-invalid' : ''}`}
              aria-invalid={Boolean(errores.apellidos)}
              data-testid="input-registro-apellidos"
            />
            {errores.apellidos && (
              <small className="error-msg show text-danger d-block mt-1" role="alert">
                {errores.apellidos}
              </small>
            )}
          </div>
        </div>

        {/* Correo Electrónico Institucional / Gmail */}
        <div className="form-group mb-3">
          <label htmlFor="reg-correo">Correo Electrónico:</label>
          <input
            type="email"
            id="reg-correo"
            name="correo"
            placeholder="usuario@duoc.cl o usuario@gmail.com"
            maxLength={100}
            required
            autoComplete="email"
            value={formData.correo}
            onChange={handleChange}
            className={`form-control ${errores.correo ? 'input-error is-invalid' : ''}`}
            aria-invalid={Boolean(errores.correo)}
            data-testid="input-registro-correo"
          />
          {errores.correo && (
            <small className="error-msg show text-danger d-block mt-1" role="alert">
              {errores.correo}
            </small>
          )}
        </div>

        {/* Contraseña */}
        <div className="form-group mb-3">
          <label htmlFor="reg-clave">Contraseña:</label>
          <input
            type="password"
            id="reg-clave"
            name="clave"
            placeholder="Entre 4 y 10 caracteres"
            maxLength={10}
            required
            autoComplete="new-password"
            value={formData.clave}
            onChange={handleChange}
            className={`form-control ${errores.clave ? 'input-error is-invalid' : ''}`}
            aria-invalid={Boolean(errores.clave)}
            data-testid="input-registro-clave"
          />
          {errores.clave && (
            <small className="error-msg show text-danger d-block mt-1" role="alert">
              {errores.clave}
            </small>
          )}
        </div>

        {/* Fecha de Nacimiento (Opcional) */}
        <div className="form-group mb-3">
          <label htmlFor="reg-fecha">Fecha de Nacimiento (Opcional):</label>
          <input
            type="date"
            id="reg-fecha"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="form-control"
            data-testid="input-registro-fecha"
          />
        </div>

        {/* Cascada dinámica de Región y Comuna */}
        <div className="form-row-2 mb-3">
          <div className="form-group">
            <label htmlFor="select-region">Región:</label>
            <select
              id="select-region"
              name="region"
              value={formData.region}
              onChange={handleRegionChange}
              required
              className={`form-select ${errores.region ? 'input-error is-invalid' : ''}`}
              aria-invalid={Boolean(errores.region)}
              data-testid="select-registro-region"
            >
              <option value="">-- Selecciona Región --</option>
              {REGIONES_CHILE.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.nombre}
                </option>
              ))}
            </select>
            {errores.region && (
              <small className="error-msg show text-danger d-block mt-1" role="alert">
                {errores.region}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="select-comuna">Comuna:</label>
            <select
              id="select-comuna"
              name="comuna"
              value={formData.comuna}
              onChange={handleChange}
              disabled={comunasDisponibles.length === 0}
              required
              className={`form-select ${errores.comuna ? 'input-error is-invalid' : ''}`}
              aria-invalid={Boolean(errores.comuna)}
              data-testid="select-registro-comuna"
            >
              <option value="">
                {comunasDisponibles.length === 0
                  ? '-- Primero elige una región --'
                  : '-- Selecciona Comuna --'}
              </option>
              {comunasDisponibles.map((com) => (
                <option key={com} value={com}>
                  {com}
                </option>
              ))}
            </select>
            {errores.comuna && (
              <small className="error-msg show text-danger d-block mt-1" role="alert">
                {errores.comuna}
              </small>
            )}
          </div>
        </div>

        {/* Dirección de Despacho */}
        <div className="form-group mb-3">
          <label htmlFor="reg-direccion">Dirección de Despacho:</label>
          <input
            type="text"
            id="reg-direccion"
            name="direccion"
            placeholder="Calle, número, depto, villa o sector"
            maxLength={300}
            required
            value={formData.direccion}
            onChange={handleChange}
            className={`form-control ${errores.direccion ? 'input-error is-invalid' : ''}`}
            aria-invalid={Boolean(errores.direccion)}
            data-testid="input-registro-direccion"
          />
          {errores.direccion && (
            <small className="error-msg show text-danger d-block mt-1" role="alert">
              {errores.direccion}
            </small>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2 mt-2"
          disabled={isSubmitting}
          data-testid="btn-registro-submit"
        >
          {isSubmitting ? 'Registrando...' : 'Completar Registro'}
        </button>

        <div className="mt-4 text-center text-muted small">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="fw-bold text-decoration-none">
            Inicia sesión aquí &rarr;
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Registro;
