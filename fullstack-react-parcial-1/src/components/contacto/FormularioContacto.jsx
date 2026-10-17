import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import {
  LIMITE_COMENTARIO_CONTACTO,
  LIMITE_NOMBRE_CONTACTO,
  validarFormularioContacto,
} from '../../utils/validaciones';

const VALORES_INICIALES = { nombre: '', correo: '', comentario: '' };

export const MENSAJE_EXITO_CONTACTO =
  '¡Mensaje enviado con éxito a Sonido Vivo Viña del Mar! Te responderemos a la brevedad.';

function FormularioContacto({ onEnviar }) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const handleChange = (evento) => {
    const { name, value } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: value }));
    setEnviado(false);
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();
    const nuevosErrores = validarFormularioContacto(valores);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setEnviado(false);
      return;
    }

    if (onEnviar) onEnviar(valores);
    setValores(VALORES_INICIALES);
    setEnviado(true);
  };

  const claseCampo = (campo) => (errores[campo] ? 'input-error' : undefined);

  return (
    <div className="form-card contacto-form-card">
      <h2 className="contacto-form-title">Envianos un Mensaje Directo</h2>

      <form id="form-contacto" noValidate onSubmit={handleSubmit}>
        {/* Nombre Completo */}
        <div className={`form-group${errores.nombre ? ' has-error' : ''}`}>
          <label htmlFor="contacto-nombre">Nombre Completo:</label>
          <input
            type="text"
            id="contacto-nombre"
            name="nombre"
            placeholder="Tu nombre"
            maxLength={LIMITE_NOMBRE_CONTACTO}
            value={valores.nombre}
            onChange={handleChange}
            className={claseCampo('nombre')}
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={errores.nombre ? 'error-contacto-nombre' : undefined}
            required
          />
          {errores.nombre && (
            <small className="error-msg show" id="error-contacto-nombre">
              {errores.nombre}
            </small>
          )}
        </div>

        {/* Correo Electrónico Institucional/Gmail */}
        <div className={`form-group${errores.correo ? ' has-error' : ''}`}>
          <label htmlFor="contacto-correo">Correo Electrónico:</label>
          <input
            type="email"
            id="contacto-correo"
            name="correo"
            placeholder="ejemplo@duoc.cl o ejemplo@gmail.com"
            maxLength={100}
            value={valores.correo}
            onChange={handleChange}
            className={claseCampo('correo')}
            aria-invalid={Boolean(errores.correo)}
            aria-describedby={errores.correo ? 'error-contacto-correo' : undefined}
            required
          />
          {errores.correo && (
            <small className="error-msg show" id="error-contacto-correo">
              {errores.correo}
            </small>
          )}
        </div>

        {/* Comentario con Contador de Caracteres */}
        <div className={`form-group${errores.comentario ? ' has-error' : ''}`}>
          <div className="contacto-label-row">
            <label htmlFor="contacto-mensaje">Consulta o Comentario:</label>
            <span id="char-count" className="contacto-contador" aria-live="polite">
              {valores.comentario.length}/{LIMITE_COMENTARIO_CONTACTO}
            </span>
          </div>
          <textarea
            id="contacto-mensaje"
            name="comentario"
            rows={5}
            placeholder="Escribí aquí tu duda sobre instrumentos, stock o cotizaciones para bandas..."
            maxLength={LIMITE_COMENTARIO_CONTACTO}
            value={valores.comentario}
            onChange={handleChange}
            className={claseCampo('comentario')}
            aria-invalid={Boolean(errores.comentario)}
            aria-describedby={errores.comentario ? 'error-contacto-mensaje' : undefined}
            required
          />
          {errores.comentario && (
            <small className="error-msg show" id="error-contacto-mensaje">
              {errores.comentario}
            </small>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          📨 Enviar Mensaje a Tienda
        </button>
      </form>

      {enviado && (
        <Alert variant="success" className="contacto-exito mt-3 mb-0" role="status">
          {MENSAJE_EXITO_CONTACTO}
        </Alert>
      )}
    </div>
  );
}

export default FormularioContacto;
