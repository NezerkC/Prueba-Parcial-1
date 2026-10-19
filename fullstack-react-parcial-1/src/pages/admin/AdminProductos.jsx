import { useState, useMemo, useCallback } from 'react';
import {
  PRODUCTOS_SONIDO_VIVO,
  CATEGORIAS_SONIDO_VIVO,
  CLAVE_INVENTARIO_STORAGE,
  formatearPrecioCLP,
  obtenerRutaImagen,
} from '../../data/productos';

const PRODUCTO_VACIO = {
  codigo: '',
  nombre: '',
  marca: '',
  modelo: '',
  categoria: '',
  precio: '',
  stock: '',
  stockCritico: 3,
  descripcion: '',
  icono: '🎸',
};

function ModalProducto({ producto, onGuardar, onCerrar }) {
  const esNuevo = !producto?.codigo || producto._esNuevo;
  const [form, setForm] = useState(producto || PRODUCTO_VACIO);
  const [errores, setErrores] = useState({});

  const validar = () => {
    const e = {};
    const codigo = form.codigo.trim();
    const nombre = form.nombre.trim();
    const precio = form.precio.toString().trim();
    if (!codigo) e.codigo = 'Requerido';
    else if (codigo.length < 3) e.codigo = 'Mínimo 3 caracteres';
    if (!nombre) e.nombre = 'Requerido';
    else if (nombre.length > 100) e.nombre = 'Máximo 100 caracteres';
    if (!form.categoria) e.categoria = 'Requerido';
    if (!precio || isNaN(Number(precio)) || Number(precio) < 0)
      e.precio = 'Precio inválido';
    if (!form.stock.toString().trim() || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = 'Stock inválido';
    return e;
  };

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validar();
    if (Object.keys(e2).length > 0) { setErrores(e2); return; }
    onGuardar({
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      stockCritico: Number(form.stockCritico) || 3,
      imagen: form.imagen || `${form.codigo}.jpg`,
    });
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
      id="modal-producto-overlay"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '1rem',
      }}
      onClick={(e) => e.target.id === 'modal-producto-overlay' && onCerrar()}
    >
      <div
        style={{
          background: 'var(--color-surface, #ffffff)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '2rem',
          width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
          boxShadow: 'var(--shadow-elevated, 0 20px 40px rgba(18, 25, 13, 0.25))',
          border: '1px solid var(--color-border, #E2DDD0)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border, #E2DDD0)', paddingBottom: '0.75rem' }}>
          <h2 style={{ margin: 0, color: 'var(--color-text-main, #1A2413)', fontSize: '1.25rem', fontWeight: 800 }}>
            {esNuevo ? '➕ Registrar Nuevo Producto' : '✏️ Editar Producto'}
          </h2>
          <button
            id="btn-cerrar-modal"
            onClick={onCerrar}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted, #615E54)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}
            aria-label="Cerrar modal"
          >×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Código */}
            <div>
              <label style={labelStyle}>Código *</label>
              <input
                id="input-codigo"
                value={form.codigo}
                onChange={(e) => handleChange('codigo', e.target.value.toUpperCase())}
                disabled={!esNuevo}
                placeholder="GA001"
                style={{ ...inputStyle('codigo'), opacity: !esNuevo ? 0.6 : 1, background: !esNuevo ? 'var(--color-surface-hover, #F3EFE3)' : '#ffffff' }}
              />
              {errores.codigo && <span style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '0.75rem', fontWeight: 600 }}>{errores.codigo}</span>}
            </div>
            {/* Icono */}
            <div>
              <label style={labelStyle}>Icono</label>
              <input
                id="input-icono"
                value={form.icono}
                onChange={(e) => handleChange('icono', e.target.value)}
                placeholder="🎸"
                style={inputStyle('icono')}
              />
            </div>
            {/* Nombre */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Nombre *</label>
              <input
                id="input-nombre"
                value={form.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Guitarra Acústica Folk"
                style={inputStyle('nombre')}
              />
              {errores.nombre && <span style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '0.75rem', fontWeight: 600 }}>{errores.nombre}</span>}
            </div>
            {/* Marca */}
            <div>
              <label style={labelStyle}>Marca</label>
              <input id="input-marca" value={form.marca} onChange={(e) => handleChange('marca', e.target.value)} placeholder="Yamaha" style={inputStyle('marca')} />
            </div>
            {/* Modelo */}
            <div>
              <label style={labelStyle}>Modelo</label>
              <input id="input-modelo" value={form.modelo} onChange={(e) => handleChange('modelo', e.target.value)} placeholder="F310" style={inputStyle('modelo')} />
            </div>
            {/* Categoría */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Categoría *</label>
              <select
                id="select-categoria"
                value={form.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
                style={inputStyle('categoria')}
              >
                <option value="">Selecciona una categoría...</option>
                {CATEGORIAS_SONIDO_VIVO.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errores.categoria && <span style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '0.75rem', fontWeight: 600 }}>{errores.categoria}</span>}
            </div>
            {/* Precio */}
            <div>
              <label style={labelStyle}>Precio (CLP) *</label>
              <input
                id="input-precio"
                type="number"
                min="0"
                step="500"
                value={form.precio}
                onChange={(e) => handleChange('precio', e.target.value)}
                placeholder="129990"
                style={inputStyle('precio')}
              />
              {errores.precio && <span style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '0.75rem', fontWeight: 600 }}>{errores.precio}</span>}
            </div>
            {/* Stock */}
            <div>
              <label style={labelStyle}>Stock Unidades *</label>
              <input
                id="input-stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                placeholder="10"
                style={inputStyle('stock')}
              />
              {errores.stock && <span style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '0.75rem', fontWeight: 600 }}>{errores.stock}</span>}
            </div>
            {/* Stock Crítico */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Umbral de Stock Crítico (Alerta)</label>
              <input
                id="input-stock-critico"
                type="number"
                min="0"
                value={form.stockCritico}
                onChange={(e) => handleChange('stockCritico', e.target.value)}
                style={inputStyle('stockCritico')}
              />
            </div>
            {/* Descripción */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Descripción</label>
              <textarea
                id="input-descripcion"
                value={form.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                rows={3}
                style={{ ...inputStyle('descripcion'), resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border, #E2DDD0)', paddingTop: '1rem' }}>
            <button
              type="button"
              id="btn-cancelar-modal"
              onClick={onCerrar}
              style={{
                padding: '0.7rem 1.4rem', borderRadius: 'var(--radius-sm, 4px)',
                background: 'var(--color-surface, #ffffff)', border: '1px solid var(--color-border, #E2DDD0)',
                color: 'var(--color-text-muted, #615E54)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-guardar-modal"
              style={{
                padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-sm, 4px)',
                background: 'var(--color-primary, #1A2413)',
                border: 'none', color: 'var(--color-bg, #FAF8F2)', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)',
              }}
            >
              {esNuevo ? '💾 Crear Producto' : '💾 Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalConfirmarEliminar({ producto, onConfirmar, onCerrar }) {
  return (
    <div
      id="modal-confirmar-overlay"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '1rem',
      }}
    >
      <div style={{
        background: 'var(--color-surface, #ffffff)', borderRadius: 'var(--radius-lg, 12px)', padding: '2rem',
        width: '100%', maxWidth: '420px',
        border: '1px solid var(--color-border, #E2DDD0)',
        boxShadow: 'var(--shadow-elevated)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🗑️</div>
          <h2 style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Eliminar Producto</h2>
          <p style={{ color: 'var(--color-text-muted, #615E54)', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
            ¿Estás seguro de que deseas eliminar{' '}
            <strong style={{ color: 'var(--color-text-main, #1A2413)' }}>{producto?.nombre}</strong>?
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            id="btn-cancelar-eliminar"
            onClick={onCerrar}
            style={{
              padding: '0.65rem 1.4rem', borderRadius: 'var(--radius-sm, 4px)',
              background: 'var(--color-surface, #ffffff)', border: '1px solid var(--color-border, #E2DDD0)',
              color: 'var(--color-text-muted, #615E54)', cursor: 'pointer', fontWeight: 600,
            }}
          >
            Cancelar
          </button>
          <button
            id="btn-confirmar-eliminar"
            onClick={() => onConfirmar(producto)}
            style={{
              padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-sm, 4px)',
              background: 'var(--color-danger, #A33A3A)',
              border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: 700,
            }}
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductos() {
  const [inventario, setInventario] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_INVENTARIO_STORAGE);
      return guardado ? JSON.parse(guardado) : PRODUCTOS_SONIDO_VIVO;
    } catch {
      return PRODUCTOS_SONIDO_VIVO;
    }
  });

  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [modalProducto, setModalProducto] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const persistir = useCallback((nuevaLista) => {
    setInventario(nuevaLista);
    try {
      localStorage.setItem(CLAVE_INVENTARIO_STORAGE, JSON.stringify(nuevaLista));
    } catch {
      // Ignorar error de cuota en entornos restringidos
    }
  }, []);

  const mostrarToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }, []);

  const productosFiltrados = useMemo(() => {
    return inventario.filter((p) => {
      const coincideBusqueda =
        !busqueda.trim() ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.marca && p.marca.toLowerCase().includes(busqueda.toLowerCase()));
      const coincideCat = !filtroCategoria || p.categoria === filtroCategoria;
      return coincideBusqueda && coincideCat;
    });
  }, [inventario, busqueda, filtroCategoria]);

  const handleGuardar = useCallback(
    (productoEditado) => {
      const esNuevo = !inventario.find((p) => p.codigo === productoEditado.codigo);
      const nuevaLista = esNuevo
        ? [...inventario, productoEditado]
        : inventario.map((p) => (p.codigo === productoEditado.codigo ? productoEditado : p));
      persistir(nuevaLista);
      setModalProducto(null);
      mostrarToast(esNuevo ? `✅ "${productoEditado.nombre}" creado exitosamente` : `✅ "${productoEditado.nombre}" actualizado`);
    },
    [inventario, persistir, mostrarToast]
  );

  const handleEliminar = useCallback(
    (producto) => {
      const nuevaLista = inventario.filter((p) => p.codigo !== producto.codigo);
      persistir(nuevaLista);
      setModalEliminar(null);
      mostrarToast(`🗑️ "${producto.nombre}" eliminado`);
    },
    [inventario, persistir, mostrarToast]
  );

  const thStyle = {
    padding: '0.85rem 1rem', textAlign: 'left', color: 'var(--color-text-muted, #615E54)',
    fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border, #E2DDD0)',
    background: 'var(--color-surface-hover, #F3EFE3)',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '0.85rem 1rem', borderBottom: '1px solid var(--color-border, #E2DDD0)',
    color: 'var(--color-text-main, #1A2413)', fontSize: '0.9rem', verticalAlign: 'middle',
  };

  return (
    <div style={{ fontFamily: 'var(--font-family)', padding: '1rem 0' }}>
      {/* Toast */}
      {toastMsg && (
        <div
          id="toast-admin"
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10000,
            background: 'var(--color-primary, #1A2413)', border: '1px solid var(--color-accent, #D49B28)',
            borderRadius: 'var(--radius-sm, 4px)', padding: '1rem 1.5rem', color: 'var(--color-bg, #FAF8F2)',
            fontWeight: 700, fontSize: '0.9rem',
            boxShadow: 'var(--shadow-elevated)',
            animation: 'slideIn 0.3s ease',
          }}
        >
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--color-text-main, #1A2413)', fontSize: '1.85rem', fontWeight: 800 }}>
            📋 Gestión de Inventario
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted, #615E54)', fontSize: '0.92rem' }}>
            {inventario.length} productos registrados · {productosFiltrados.length} visibles en catálogo
          </p>
        </div>
        <button
          id="btn-nuevo-producto"
          onClick={() => setModalProducto({ ...PRODUCTO_VACIO, _esNuevo: true })}
          style={{
            background: 'var(--color-primary, #1A2413)',
            border: 'none', color: 'var(--color-bg, #FAF8F2)', padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-sm, 4px)', fontWeight: 700, cursor: 'pointer',
            fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: 'var(--shadow-sm)',
            transition: 'background-color 0.2s ease, transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-primary-hover, #29381E)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-primary, #1A2413)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ➕ Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          id="input-busqueda-admin"
          type="search"
          placeholder="🔍 Buscar por nombre, código o marca..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            flex: '1', minWidth: '220px',
            background: '#ffffff', border: '1px solid var(--color-border, #E2DDD0)',
            borderRadius: 'var(--radius-sm, 4px)', padding: '0.65rem 1rem', color: 'var(--color-text-main, #1A2413)',
            fontSize: '0.9rem', outline: 'none',
          }}
        />
        <select
          id="select-filtro-categoria"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{
            background: '#ffffff', border: '1px solid var(--color-border, #E2DDD0)',
            borderRadius: 'var(--radius-sm, 4px)', padding: '0.65rem 1rem', color: 'var(--color-text-main, #1A2413)',
            fontSize: '0.9rem', outline: 'none', minWidth: '180px',
          }}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS_SONIDO_VIVO.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div
        style={{
          background: 'var(--color-surface, #ffffff)',
          borderRadius: 'var(--radius-md, 8px)',
          border: '1px solid var(--color-border, #E2DDD0)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table id="tabla-inventario" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Producto</th>
                <th style={thStyle}>Categoría</th>
                <th style={thStyle}>Precio</th>
                <th style={thStyle}>Stock</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: 'var(--color-text-muted, #615E54)', padding: '3rem' }}>
                    Sin resultados para la búsqueda actual
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((p) => {
                  const critico = p.stock <= (p.stockCritico ?? 3);
                  return (
                    <tr
                      key={p.codigo}
                      id={`fila-${p.codigo}`}
                      style={{ transition: 'background-color 0.15s ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-hover, #F3EFE3)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={obtenerRutaImagen(p)}
                            alt={p.nombre}
                            onError={(e) => { e.target.style.display = 'none'; }}
                            style={{
                              width: '42px', height: '42px', objectFit: 'cover',
                              borderRadius: 'var(--radius-sm, 4px)',
                              border: '1px solid var(--color-border, #E2DDD0)',
                              background: 'var(--color-surface-hover, #F3EFE3)',
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--color-text-main, #1A2413)', fontSize: '0.92rem' }}>
                              {p.nombre}
                            </div>
                            <div style={{ color: 'var(--color-text-muted, #615E54)', fontSize: '0.8rem' }}>
                              {p.codigo} · {p.marca}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          background: 'var(--color-surface-hover, #F3EFE3)',
                          color: 'var(--color-text-main, #1A2413)',
                          border: '1px solid var(--color-border, #E2DDD0)',
                          padding: '0.25rem 0.65rem', borderRadius: '14px', fontSize: '0.78rem', fontWeight: 600,
                        }}>
                          {p.categoria}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 800, color: 'var(--color-accent, #D49B28)', fontSize: '0.95rem' }}>
                        {formatearPrecioCLP(p.precio)}
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          background: critico ? 'var(--color-danger-bg, #FDF0F0)' : 'var(--color-success-bg, #EEF4E6)',
                          color: critico ? 'var(--color-danger, #A33A3A)' : 'var(--color-success, #4E632E)',
                          border: `1px solid ${critico ? 'rgba(163, 58, 58, 0.25)' : 'rgba(78, 99, 46, 0.25)'}`,
                          padding: '0.25rem 0.65rem', borderRadius: '20px',
                          fontWeight: 700, fontSize: '0.85rem',
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        }}>
                          {critico ? '⚠️ ' : ''}{p.stock}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            id={`btn-editar-${p.codigo}`}
                            onClick={() => setModalProducto({ ...p })}
                            style={{
                              background: 'var(--color-surface, #ffffff)', border: '1px solid var(--color-border, #E2DDD0)',
                              color: 'var(--color-text-main, #1A2413)', borderRadius: 'var(--radius-sm, 4px)', padding: '0.45rem 0.8rem',
                              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-hover, #F3EFE3)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-surface, #ffffff)')}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            id={`btn-eliminar-${p.codigo}`}
                            onClick={() => setModalEliminar(p)}
                            style={{
                              background: 'var(--color-danger-bg, #FDF0F0)', border: '1px solid rgba(163, 58, 58, 0.3)',
                              color: 'var(--color-danger, #A33A3A)', borderRadius: 'var(--radius-sm, 4px)', padding: '0.45rem 0.8rem',
                              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-danger-bg, #FDF0F0)')}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {modalProducto && (
        <ModalProducto
          producto={modalProducto}
          onGuardar={handleGuardar}
          onCerrar={() => setModalProducto(null)}
        />
      )}
      {modalEliminar && (
        <ModalConfirmarEliminar
          producto={modalEliminar}
          onConfirmar={handleEliminar}
          onCerrar={() => setModalEliminar(null)}
        />
      )}
    </div>
  );
}
