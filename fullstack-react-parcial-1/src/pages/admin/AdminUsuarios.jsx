import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  validarRutChileno,
  formatearRutChileno,
  validarEmailInstitucional,
  validarClave,
} from '../../utils/validaciones';

const STORAGE_KEY_USUARIOS = 'sonido_vivo_usuarios_v1';

const USUARIOS_DEMO = [
  {
    rut: '12345678-5',
    nombre: 'Martín',
    apellidos: 'Gómez',
    correo: 'admin@profesor.duoc.cl',
    clave: '123456',
    rol: 'admin',
    region: 'V',
    comuna: 'Viña del Mar',
    direccion: 'Av. Libertad 1234, Oficina 502',
  },
  {
    rut: '19011022-K',
    nombre: 'Sebastián',
    apellidos: 'Valenzuela',
    correo: 'cliente@duoc.cl',
    clave: 'pass12',
    rol: 'cliente',
    region: 'V',
    comuna: 'Valparaíso',
    direccion: 'Cerro Alegre, Pasaje Bavestrello 14',
  },
  {
    rut: '18765432-7',
    nombre: 'Camila',
    apellidos: 'Reyes',
    correo: 'usuario@gmail.com',
    clave: 'pass12',
    rol: 'vendedor',
    region: 'RM',
    comuna: 'Santiago',
    direccion: 'Santa Isabel 450, Depto 803',
  },
];

const USUARIO_FORM_VACIO = {
  rut: '',
  nombre: '',
  apellidos: '',
  correo: '',
  clave: '',
  rol: 'cliente',
  region: '',
  comuna: '',
  direccion: '',
};

function ModalUsuario({ usuario, onGuardar, onCerrar, correosExistentes = [] }) {
  const esNuevo = !usuario?.rut || usuario._esNuevo;
  const [form, setForm] = useState(usuario || USUARIO_FORM_VACIO);
  const [errores, setErrores] = useState({});

  const validar = () => {
    const err = {};
    const rutLimpio = (form.rut || '').trim();
    const nombre = (form.nombre || '').trim();
    const apellidos = (form.apellidos || '').trim();
    const correo = (form.correo || '').trim().toLowerCase();
    const clave = (form.clave || '').trim();

    if (!rutLimpio) {
      err.rut = 'El RUN es requerido.';
    } else if (esNuevo && !validarRutChileno(rutLimpio)) {
      err.rut = 'RUN inválido (formato chileno con dígito verificador).';
    }

    if (!nombre) {
      err.nombre = 'El nombre es requerido.';
    } else if (nombre.length > 50) {
      err.nombre = 'Máximo 50 caracteres.';
    }

    if (!apellidos) {
      err.apellidos = 'Los apellidos son requeridos.';
    } else if (apellidos.length > 50) {
      err.apellidos = 'Máximo 50 caracteres.';
    }

    if (!correo) {
      err.correo = 'El correo electrónico es requerido.';
    } else if (!validarEmailInstitucional(correo)) {
      err.correo = 'Solo correos autorizados (@duoc.cl, @profesor.duoc.cl o @gmail.com).';
    } else if (esNuevo && correosExistentes.includes(correo)) {
      err.correo = 'Este correo ya está registrado en el sistema.';
    }

    if (!clave) {
      err.clave = 'La contraseña es requerida.';
    } else if (!validarClave(clave)) {
      err.clave = 'Debe tener entre 4 y 10 caracteres.';
    }

    return err;
  };

  const handleChange = (campo, valor) => {
    let valorFinal = valor;
    if (campo === 'rut') {
      valorFinal = formatearRutChileno(valor);
    }
    setForm((prev) => ({ ...prev, [campo]: valorFinal }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresVal = validar();
    if (Object.keys(erroresVal).length > 0) {
      setErrores(erroresVal);
      return;
    }
    onGuardar(form);
  };

  const inputStyle = (campo) => ({
    width: '100%',
    background: '#ffffff',
    border: `1px solid ${errores[campo] ? 'var(--color-danger, #A33A3A)' : 'var(--color-border, #E2DDD0)'}`,
    borderRadius: 'var(--radius-sm, 4px)',
    padding: '0.65rem 0.9rem',
    color: 'var(--color-text-main, #1A2413)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  });

  const labelStyle = {
    color: 'var(--color-text-main, #1A2413)',
    fontSize: '0.82rem',
    fontWeight: 700,
    marginBottom: '0.35rem',
    display: 'block',
  };

  return (
    <div
      id="modal-usuario-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={(e) => e.target.id === 'modal-usuario-overlay' && onCerrar()}
    >
      <div
        style={{
          background: 'var(--color-surface, #ffffff)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '2rem',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-elevated, 0 20px 40px rgba(18, 25, 13, 0.25))',
          border: '1px solid var(--color-border, #E2DDD0)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--color-border, #E2DDD0)',
            paddingBottom: '0.75rem',
          }}
        >
          <h2
            style={{
              margin: 0,
              color: 'var(--color-text-main, #1A2413)',
              fontSize: '1.25rem',
              fontWeight: 800,
            }}
          >
            {esNuevo ? '👤 Registrar Nuevo Usuario' : '✏️ Editar Usuario'}
          </h2>
          <button
            id="btn-cerrar-modal-usuario"
            onClick={onCerrar}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted, #615E54)',
              cursor: 'pointer',
              fontSize: '1.4rem',
              lineHeight: 1,
            }}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* RUN */}
            <div>
              <label htmlFor="user-rut" style={labelStyle}>
                RUN Chileno *
              </label>
              <input
                id="user-rut"
                type="text"
                placeholder="12.345.678-5"
                value={form.rut}
                disabled={!esNuevo}
                onChange={(e) => handleChange('rut', e.target.value)}
                style={{
                  ...inputStyle('rut'),
                  background: esNuevo ? '#ffffff' : 'var(--color-bg, #FAF8F2)',
                  cursor: esNuevo ? 'text' : 'not-allowed',
                }}
                data-testid="modal-input-rut"
              />
              {errores.rut && (
                <span
                  style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '0.75rem', marginTop: '3px', display: 'block' }}
                  data-testid="error-rut"
                >
                  {errores.rut}
                </span>
              )}
            </div>

            {/* Rol */}
            <div>
              <label htmlFor="user-rol" style={labelStyle}>
                Rol en el Sistema *
              </label>
              <select
                id="user-rol"
                value={form.rol}
                onChange={(e) => handleChange('rol', e.target.value)}
                style={inputStyle('rol')}
                data-testid="modal-select-rol"
              >
                <option value="cliente">Cliente</option>
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="user-nombre" style={labelStyle}>
                Nombre *
              </label>
              <input
                id="user-nombre"
                type="text"
                placeholder="Martín"
                value={form.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                style={inputStyle('nombre')}
                data-testid="modal-input-nombre"
              />
              {errores.nombre && (
                <span
                  style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '0.75rem', marginTop: '3px', display: 'block' }}
                  data-testid="error-nombre"
                >
                  {errores.nombre}
                </span>
              )}
            </div>

            {/* Apellidos */}
            <div>
              <label htmlFor="user-apellidos" style={labelStyle}>
                Apellidos *
              </label>
              <input
                id="user-apellidos"
                type="text"
                placeholder="Gómez"
                value={form.apellidos}
                onChange={(e) => handleChange('apellidos', e.target.value)}
                style={inputStyle('apellidos')}
                data-testid="modal-input-apellidos"
              />
              {errores.apellidos && (
                <span
                  style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '0.75rem', marginTop: '3px', display: 'block' }}
                  data-testid="error-apellidos"
                >
                  {errores.apellidos}
                </span>
              )}
            </div>

            {/* Correo Electrónico */}
            <div style={{ gridColumn: 'span 2' }}>
              <label htmlFor="user-correo" style={labelStyle}>
                Correo Electrónico *
              </label>
              <input
                id="user-correo"
                type="email"
                placeholder="usuario@duoc.cl"
                value={form.correo}
                onChange={(e) => handleChange('correo', e.target.value)}
                style={inputStyle('correo')}
                data-testid="modal-input-correo"
              />
              {errores.correo && (
                <span
                  style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '0.75rem', marginTop: '3px', display: 'block' }}
                  data-testid="error-correo"
                >
                  {errores.correo}
                </span>
              )}
            </div>

            {/* Contraseña */}
            <div style={{ gridColumn: 'span 2' }}>
              <label htmlFor="user-clave" style={labelStyle}>
                Contraseña (4 a 10 caracteres) *
              </label>
              <input
                id="user-clave"
                type="text"
                placeholder="Clave de acceso"
                value={form.clave}
                onChange={(e) => handleChange('clave', e.target.value)}
                style={inputStyle('clave')}
                data-testid="modal-input-clave"
              />
              {errores.clave && (
                <span
                  style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '0.75rem', marginTop: '3px', display: 'block' }}
                  data-testid="error-clave"
                >
                  {errores.clave}
                </span>
              )}
            </div>

            {/* Región */}
            <div>
              <label htmlFor="user-region" style={labelStyle}>
                Región
              </label>
              <input
                id="user-region"
                type="text"
                placeholder="V o Valparaíso"
                value={form.region || ''}
                onChange={(e) => handleChange('region', e.target.value)}
                style={inputStyle('region')}
                data-testid="modal-input-region"
              />
            </div>

            {/* Comuna */}
            <div>
              <label htmlFor="user-comuna" style={labelStyle}>
                Comuna
              </label>
              <input
                id="user-comuna"
                type="text"
                placeholder="Viña del Mar"
                value={form.comuna || ''}
                onChange={(e) => handleChange('comuna', e.target.value)}
                style={inputStyle('comuna')}
                data-testid="modal-input-comuna"
              />
            </div>

            {/* Dirección */}
            <div style={{ gridColumn: 'span 2' }}>
              <label htmlFor="user-direccion" style={labelStyle}>
                Dirección
              </label>
              <input
                id="user-direccion"
                type="text"
                placeholder="Calle 1234, Depto 50"
                value={form.direccion || ''}
                onChange={(e) => handleChange('direccion', e.target.value)}
                style={inputStyle('direccion')}
                data-testid="modal-input-direccion"
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem',
              borderTop: '1px solid var(--color-border, #E2DDD0)',
              paddingTop: '1rem',
            }}
          >
            <button
              type="button"
              onClick={onCerrar}
              style={{
                background: 'var(--color-surface, #ffffff)',
                border: '1px solid var(--color-border, #E2DDD0)',
                color: 'var(--color-text-main, #1A2413)',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-sm, 4px)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.88rem',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-guardar-usuario"
              data-testid="btn-guardar-usuario"
              style={{
                background: 'var(--color-primary, #1A2413)',
                border: 'none',
                color: 'var(--color-bg, #FAF8F2)',
                padding: '0.65rem 1.4rem',
                borderRadius: 'var(--radius-sm, 4px)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.88rem',
              }}
            >
              {esNuevo ? 'Guardar Usuario' : 'Actualizar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminUsuarios() {
  const { usuario: adminActivo } = useAuth();

  const [usuarios, setUsuarios] = useState(() => {
    try {
      const guardados = localStorage.getItem(STORAGE_KEY_USUARIOS);
      return guardados ? JSON.parse(guardados) : USUARIOS_DEMO;
    } catch {
      return USUARIOS_DEMO;
    }
  });

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [modalUsuario, setModalUsuario] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  // Sincronizar persistencia en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));
    } catch (error) {
      console.error('Error al guardar usuarios en localStorage:', error);
    }
  }, [usuarios]);

  const mostrarNotificacion = useCallback((mensaje, tipo = 'success') => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta(null), 3500);
  }, []);

  const handleGuardarUsuario = (datosUsuario) => {
    const rutLimpio = datosUsuario.rut.trim();
    const indiceExistente = usuarios.findIndex(
      (u) => u.rut.trim().toUpperCase() === rutLimpio.toUpperCase()
    );

    if (indiceExistente >= 0) {
      // Actualización
      const listaActualizada = [...usuarios];
      listaActualizada[indiceExistente] = {
        ...listaActualizada[indiceExistente],
        ...datosUsuario,
      };
      setUsuarios(listaActualizada);
      mostrarNotificacion(`Usuario ${datosUsuario.nombre} ${datosUsuario.apellidos} actualizado correctamente.`);
    } else {
      // Creación
      setUsuarios((prev) => [datosUsuario, ...prev]);
      mostrarNotificacion(`Usuario ${datosUsuario.nombre} ${datosUsuario.apellidos} registrado exitosamente.`);
    }
    setModalUsuario(null);
  };

  const handleEliminar = (usuarioTarget) => {
    if (adminActivo?.correo && usuarioTarget.correo.toLowerCase() === adminActivo.correo.toLowerCase()) {
      mostrarNotificacion('No puedes eliminar al administrador con sesión activa en este momento.', 'danger');
      setUsuarioAEliminar(null);
      return;
    }

    setUsuarios((prev) => prev.filter((u) => u.rut !== usuarioTarget.rut));
    mostrarNotificacion(`Usuario ${usuarioTarget.nombre} eliminado del sistema.`, 'warning');
    setUsuarioAEliminar(null);
  };

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const q = filtroTexto.trim().toLowerCase();
      const coincideTexto =
        !q ||
        (u.nombre || '').toLowerCase().includes(q) ||
        (u.apellidos || '').toLowerCase().includes(q) ||
        (u.correo || '').toLowerCase().includes(q) ||
        (u.rut || '').toLowerCase().includes(q);

      const coincideRol = filtroRol === 'todos' || u.rol === filtroRol;
      return coincideTexto && coincideRol;
    });
  }, [usuarios, filtroTexto, filtroRol]);

  const correosExistentes = useMemo(() => {
    return usuarios.map((u) => (u.correo || '').toLowerCase());
  }, [usuarios]);

  const badgeRol = (rol) => {
    switch (rol) {
      case 'admin':
        return {
          texto: 'Administrador',
          bg: 'var(--color-primary, #1A2413)',
          color: '#FAF8F2',
        };
      case 'vendedor':
        return {
          texto: 'Vendedor',
          bg: 'var(--color-warning-bg, #FEF3C7)',
          color: 'var(--color-warning, #92400E)',
        };
      default:
        return {
          texto: 'Cliente',
          bg: 'var(--color-success-bg, #EEF4E6)',
          color: 'var(--color-success, #4E632E)',
        };
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-family)', padding: '1rem 0' }}>
      {/* Navegación y encabezado */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Link
            to="/admin"
            style={{ color: 'var(--color-text-muted, #615E54)', textDecoration: 'none', fontSize: '0.85rem' }}
          >
            Panel Admin
          </Link>
          <span style={{ color: 'var(--color-text-muted, #615E54)' }}>&gt;</span>
          <span style={{ color: 'var(--color-accent, #D49B28)', fontSize: '0.85rem', fontWeight: 600 }}>
            Mantenedor de Usuarios
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '1.85rem',
                fontWeight: 800,
                color: 'var(--color-text-main, #1A2413)',
              }}
              data-testid="admin-usuarios-titulo"
            >
              👥 Mantenedor de Usuarios
            </h1>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted, #615E54)', fontSize: '0.9rem' }}>
              Gestión de cuentas y asignación de roles (Administrador, Vendedor, Cliente).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              to="/admin/productos"
              style={{
                background: 'var(--color-surface, #ffffff)',
                border: '1px solid var(--color-border, #E2DDD0)',
                color: 'var(--color-text-main, #1A2413)',
                padding: '0.65rem 1.2rem',
                borderRadius: 'var(--radius-sm, 4px)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              📦 Ir a Productos
            </Link>

            <button
              id="btn-nuevo-usuario"
              data-testid="btn-nuevo-usuario"
              onClick={() => setModalUsuario({ ...USUARIO_FORM_VACIO, _esNuevo: true })}
              style={{
                background: 'var(--color-primary, #1A2413)',
                border: 'none',
                color: 'var(--color-bg, #FAF8F2)',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-sm, 4px)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              ➕ Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Alerta de notificación */}
      {alerta && (
        <div
          data-testid="alerta-notificacion"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm, 4px)',
            marginBottom: '1.25rem',
            background:
              alerta.tipo === 'danger'
                ? 'var(--color-danger-bg, #FDF0F0)'
                : alerta.tipo === 'warning'
                  ? 'var(--color-warning-bg, #FEF3C7)'
                  : 'var(--color-success-bg, #EEF4E6)',
            color:
              alerta.tipo === 'danger'
                ? 'var(--color-danger, #A33A3A)'
                : alerta.tipo === 'warning'
                  ? 'var(--color-warning, #92400E)'
                  : 'var(--color-success, #4E632E)',
            border: `1px solid ${
              alerta.tipo === 'danger'
                ? 'rgba(163, 58, 58, 0.3)'
                : alerta.tipo === 'warning'
                  ? 'rgba(217, 119, 6, 0.3)'
                  : 'rgba(78, 99, 46, 0.3)'
            }`,
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          {alerta.mensaje}
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div
        style={{
          background: 'var(--color-surface, #ffffff)',
          border: '1px solid var(--color-border, #E2DDD0)',
          borderRadius: 'var(--radius-md, 8px)',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 240px' }}>
          <input
            id="filtro-usuarios-busqueda"
            type="search"
            placeholder="Buscar por nombre, apellido, correo o RUN..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.9rem',
              border: '1px solid var(--color-border, #E2DDD0)',
              borderRadius: 'var(--radius-sm, 4px)',
              fontSize: '0.88rem',
              outline: 'none',
            }}
            data-testid="filtro-usuarios-busqueda"
          />
        </div>

        <div style={{ minWidth: '180px' }}>
          <select
            id="filtro-usuarios-rol"
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.9rem',
              border: '1px solid var(--color-border, #E2DDD0)',
              borderRadius: 'var(--radius-sm, 4px)',
              fontSize: '0.88rem',
              outline: 'none',
              background: '#ffffff',
            }}
            data-testid="filtro-usuarios-rol"
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>

        <div style={{ color: 'var(--color-text-muted, #615E54)', fontSize: '0.85rem', fontWeight: 600 }}>
          {usuariosFiltrados.length} {usuariosFiltrados.length === 1 ? 'usuario registrado' : 'usuarios registrados'}
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div
        style={{
          background: 'var(--color-surface, #ffffff)',
          border: '1px solid var(--color-border, #E2DDD0)',
          borderRadius: 'var(--radius-md, 8px)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}
            aria-label="Tabla de usuarios del sistema"
            data-testid="tabla-usuarios"
          >
            <thead>
              <tr style={{ background: 'var(--color-bg, #FAF8F2)', borderBottom: '1px solid var(--color-border, #E2DDD0)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-text-main, #1A2413)' }}>
                  Nombre y Apellidos
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-text-main, #1A2413)' }}>
                  RUN
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-text-main, #1A2413)' }}>
                  Correo Electrónico
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-text-main, #1A2413)' }}>
                  Rol
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-text-main, #1A2413)' }}>
                  Ubicación
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-text-main, #1A2413)', textAlign: 'center' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((u) => {
                  const b = badgeRol(u.rol);
                  return (
                    <tr
                      key={u.rut}
                      style={{ borderBottom: '1px solid var(--color-border-subtle, #EDE8DC)' }}
                      data-testid={`fila-usuario-${u.rut}`}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--color-text-main, #1A2413)' }}>
                        {u.nombre} {u.apellidos}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: 'var(--color-text-muted, #615E54)' }}>
                        {u.rut}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-main, #1A2413)' }}>
                        {u.correo}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            background: b.bg,
                            color: b.color,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-block',
                          }}
                          data-testid={`badge-rol-${u.rut}`}
                        >
                          {b.texto}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted, #615E54)', fontSize: '0.82rem' }}>
                        {u.comuna ? `${u.comuna}, ${u.region || ''}` : 'Sin registrar'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => setModalUsuario(u)}
                            data-testid={`btn-editar-usuario-${u.rut}`}
                            style={{
                              background: 'var(--color-surface, #ffffff)',
                              border: '1px solid var(--color-border, #E2DDD0)',
                              borderRadius: 'var(--radius-sm, 4px)',
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              color: 'var(--color-text-main, #1A2413)',
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => setUsuarioAEliminar(u)}
                            data-testid={`btn-eliminar-usuario-${u.rut}`}
                            style={{
                              background: 'var(--color-danger-bg, #FDF0F0)',
                              border: '1px solid rgba(163, 58, 58, 0.3)',
                              borderRadius: 'var(--radius-sm, 4px)',
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              color: 'var(--color-danger, #A33A3A)',
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted, #615E54)' }}>
                    No se encontraron usuarios coincidentes con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar */}
      {modalUsuario && (
        <ModalUsuario
          usuario={modalUsuario}
          onGuardar={handleGuardarUsuario}
          onCerrar={() => setModalUsuario(null)}
          correosExistentes={correosExistentes}
        />
      )}

      {/* Modal Confirmación de Eliminación */}
      {usuarioAEliminar && (
        <div
          id="modal-confirmar-eliminar"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={(e) => e.target.id === 'modal-confirmar-eliminar' && setUsuarioAEliminar(null)}
        >
          <div
            style={{
              background: 'var(--color-surface, #ffffff)',
              borderRadius: 'var(--radius-lg, 12px)',
              padding: '1.75rem',
              maxWidth: '440px',
              width: '100%',
              boxShadow: 'var(--shadow-elevated)',
              border: '1px solid var(--color-border, #E2DDD0)',
            }}
          >
            <h3
              style={{
                margin: '0 0 0.75rem',
                fontSize: '1.2rem',
                color: 'var(--color-danger, #A33A3A)',
                fontWeight: 800,
              }}
            >
              ⚠️ Confirmar Eliminación
            </h3>
            <p style={{ margin: '0 0 1.25rem', color: 'var(--color-text-main, #1A2413)', fontSize: '0.9rem' }}>
              ¿Estás seguro de que deseas eliminar la cuenta de{' '}
              <strong>
                {usuarioAEliminar.nombre} {usuarioAEliminar.apellidos}
              </strong>{' '}
              (RUN: {usuarioAEliminar.rut})? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setUsuarioAEliminar(null)}
                style={{
                  background: 'var(--color-surface, #ffffff)',
                  border: '1px solid var(--color-border, #E2DDD0)',
                  borderRadius: 'var(--radius-sm, 4px)',
                  padding: '0.55rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-confirmar-eliminar-usuario"
                data-testid="btn-confirmar-eliminar-usuario"
                onClick={() => handleEliminar(usuarioAEliminar)}
                style={{
                  background: 'var(--color-danger, #A33A3A)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm, 4px)',
                  padding: '0.55rem 1.15rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#FAF8F2',
                  cursor: 'pointer',
                }}
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;
