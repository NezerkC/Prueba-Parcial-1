import { useState } from 'react';
import PropTypes from 'prop-types';

const CATEGORIAS_SERVICIOS = [
  'Servicios de Luthier',
  'Servicios de Taller',
  'Personalización',
  'Clases / Asesoría',
  'Módulo Propio',
];

const ICONOS_DISPONIBLES = ['🛠️', '⚡', '🎸', '🎹', '🎛️', '🎧', '📦'];

function ModalCrearObjeto({ onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    nombre: '',
    categoria: CATEGORIAS_SERVICIOS[0],
    precio: '',
    icono: '🛠️',
    descripcion: '',
  });

  const [errores, setErrores] = useState({});

  const validar = () => {
    const err = {};
    const nombre = form.nombre.trim();
    const precio = Number(form.precio);
    const descripcion = form.descripcion.trim();

    if (!nombre) {
      err.nombre = 'El nombre del servicio/objeto es obligatorio.';
    } else if (nombre.length < 3) {
      err.nombre = 'Debe tener al menos 3 caracteres.';
    }

    if (!form.precio || isNaN(precio) || precio <= 0) {
      err.precio = 'Ingresa un precio válido mayor a $0.';
    }

    if (!descripcion) {
      err.descripcion = 'La descripción es obligatoria.';
    } else if (descripcion.length < 10) {
      err.descripcion = 'Debe detallar al menos 10 caracteres.';
    }

    return err;
  };

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validar();
    if (Object.keys(err).length > 0) {
      setErrores(err);
      return;
    }

    onGuardar({
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      precio: Number(form.precio),
      icono: form.icono,
      descripcion: form.descripcion.trim(),
      estado: 'Disponible',
    });
  };

  return (
    <div
      className="modal-backdrop-custom"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-crear-objeto-titulo"
    >
      <div className="modal-contenido-custom">
        <header className="modal-header-custom">
          <h3 id="modal-crear-objeto-titulo" style={{ margin: 0, fontSize: '1.25rem' }}>
            🛠️ Registrar Nuevo Objeto / Servicio (Modo Admin)
          </h3>
          <button
            type="button"
            className="btn-cerrar-custom"
            onClick={onCerrar}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body-custom">
            <div className="form-group mb-3">
              <label htmlFor="input-custom-nombre" className="form-label fw-bold">
                Nombre del Objeto / Servicio:
              </label>
              <input
                id="input-custom-nombre"
                type="text"
                className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                placeholder="Ej: Calibración y Ajuste de Trastes"
                value={form.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
              />
              {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md-7">
                <label htmlFor="select-custom-categoria" className="form-label fw-bold">
                  Categoría:
                </label>
                <select
                  id="select-custom-categoria"
                  className="form-select"
                  value={form.categoria}
                  onChange={(e) => handleChange('categoria', e.target.value)}
                >
                  {CATEGORIAS_SERVICIOS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-5">
                <label htmlFor="select-custom-icono" className="form-label fw-bold">
                  Ícono:
                </label>
                <select
                  id="select-custom-icono"
                  className="form-select"
                  value={form.icono}
                  onChange={(e) => handleChange('icono', e.target.value)}
                >
                  {ICONOS_DISPONIBLES.map((ico) => (
                    <option key={ico} value={ico}>
                      {ico}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="input-custom-precio" className="form-label fw-bold">
                Precio (CLP):
              </label>
              <input
                id="input-custom-precio"
                type="number"
                min="1000"
                step="500"
                className={`form-control ${errores.precio ? 'is-invalid' : ''}`}
                placeholder="Ej: 25000"
                value={form.precio}
                onChange={(e) => handleChange('precio', e.target.value)}
              />
              {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="textarea-custom-descripcion" className="form-label fw-bold">
                Descripción del Servicio / Especificación:
              </label>
              <textarea
                id="textarea-custom-descripcion"
                rows={3}
                className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                placeholder="Describe qué incluye el servicio o qué características tiene el objeto..."
                value={form.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
              />
              {errores.descripcion && (
                <div className="invalid-feedback">{errores.descripcion}</div>
              )}
            </div>
          </div>

          <footer className="modal-footer-custom">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCerrar}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" data-testid="btn-guardar-nuevo-objeto">
              💾 Guardar y Publicar
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

ModalCrearObjeto.propTypes = {
  onGuardar: PropTypes.func.isRequired,
  onCerrar: PropTypes.func.isRequired,
};

export default ModalCrearObjeto;
