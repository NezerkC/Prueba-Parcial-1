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
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${errores[campo] ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: '8px',
    padding: '0.6rem 0.9rem',
    color: '#f1f5f9',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  });

  const labelStyle = { color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', display: 'block' };

  return (
    <div
      id="modal-producto-overlay"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '1rem',
      }}
      onClick={(e) => e.target.id === 'modal-producto-overlay' && onCerrar()}
    >
      <div
        style={{
          background: '#1e293b', borderRadius: '16px', padding: '2rem',
          width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: '1.2rem', fontWeight: 700 }}>
            {esNuevo ? '➕ Nuevo Producto' : '✏️ Editar Producto'}
          </h2>
          <button
            id="btn-cerrar-modal"
            onClick={onCerrar}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}
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
                style={{ ...inputStyle('codigo'), opacity: !esNuevo ? 0.5 : 1 }}
              />
              {errores.codigo && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errores.codigo}</span>}
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
              {errores.nombre && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errores.nombre}</span>}
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
                style={{ ...inputStyle('categoria'), appearance: 'none' }}
              >
                <option value="">Seleccionar categoría...</option>
                {CATEGORIAS_SONIDO_VIVO.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errores.categoria && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errores.categoria}</span>}
            </div>
            {/* Precio */}
            <div>
              <label style={labelStyle}>Precio (CLP) *</label>
              <input
                id="input-precio"
                type="number"
                min="0"
                value={form.precio}
                onChange={(e) => handleChange('precio', e.target.value)}
                placeholder="129990"
                style={inputStyle('precio')}
              />
              {errores.precio && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errores.precio}</span>}
            </div>
            {/* Stock */}
            <div>
              <label style={labelStyle}>Stock *</label>
              <input
                id="input-stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                placeholder="10"
                style={inputStyle('stock')}
              />
              {errores.stock && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errores.stock}</span>}
            </div>
            {/* Stock crítico */}
            <div>
              <label style={labelStyle}>Stock Crítico</label>
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

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              id="btn-cancelar-modal"
              onClick={onCerrar}
              style={{
                padding: '0.65rem 1.25rem', borderRadius: '8px',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-guardar-modal"
              style={{
                padding: '0.65rem 1.25rem', borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', color: '#fff', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.9rem',
              }}
            >
              {esNuevo ? 'Crear Producto' : 'Guardar Cambios'}
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
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '1rem',
      }}
    >
      <div style={{
        background: '#1e293b', borderRadius: '16px', padding: '2rem',
        width: '100%', maxWidth: '420px',
        border: '1px solid rgba(248,113,113,0.3)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🗑️</div>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.15rem', margin: '0 0 0.5rem' }}>Eliminar Producto</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            ¿Estás seguro de que deseas eliminar{' '}
            <strong style={{ color: '#fca5a5' }}>{producto?.nombre}</strong>?
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            id="btn-cancelar-eliminar"
            onClick={onCerrar}
            style={{
              padding: '0.65rem 1.5rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', cursor: 'pointer', fontWeight: 600,
            }}
          >
            Cancelar
          </button>
          <button
            id="btn-confirmar-eliminar"
            onClick={() => onConfirmar(producto)}
            style={{
              padding: '0.65rem 1.5rem', borderRadius: '8px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700,
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
      if (guardado) {
        const lista = JSON.parse(guardado);
        if (Array.isArray(lista) && lista.length > 0) return lista;
      }
    } catch { /* vacío */ }
    return PRODUCTOS_SONIDO_VIVO;
  });

  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [modalProducto, setModalProducto] = useState(null); // null | { producto, _esNuevo }
  const [modalEliminar, setModalEliminar] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const mostrarToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }, []);

  const persistir = useCallback((nuevaLista) => {
    try {
      localStorage.setItem(CLAVE_INVENTARIO_STORAGE, JSON.stringify(nuevaLista));
    } catch { /* vacío */ }
    setInventario(nuevaLista);
  }, []);

  const productosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return inventario.filter((p) => {
      const coincideBusqueda =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.codigo.toLowerCase().includes(q) ||
        (p.marca || '').toLowerCase().includes(q);
      const coincideCategoria = !filtroCategoria || p.categoria === filtroCategoria;
      return coincideBusqueda && coincideCategoria;
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
      mostrarToast(esNuevo ? `✅ "${productoEditado.nombre}" creado` : `✅ "${productoEditado.nombre}" actualizado`);
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
    padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b',
    fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.07)',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '0.8rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#e2e8f0', fontSize: '0.88rem', verticalAlign: 'middle',
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", padding: '1rem 0' }}>
      {/* Toast */}
      {toastMsg && (
        <div
          id="toast-admin"
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10000,
            background: '#1e293b', border: '1px solid rgba(99,102,241,0.5)',
            borderRadius: '12px', padding: '1rem 1.5rem', color: '#e2e8f0',
            fontWeight: 600, fontSize: '0.9rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            animation: 'slideIn 0.3s ease',
          }}
        >
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#f1f5f9', fontSize: '1.6rem', fontWeight: 700 }}>
            📋 Gestión de Inventario
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            {inventario.length} productos · {productosFiltrados.length} visibles
          </p>
        </div>
        <button
          id="btn-nuevo-producto"
          onClick={() => setModalProducto({ ...PRODUCTO_VACIO, _esNuevo: true })}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: '#fff', padding: '0.7rem 1.3rem',
            borderRadius: '10px', fontWeight: 700, cursor: 'pointer',
            fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
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
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '0.6rem 1rem', color: '#f1f5f9',
            fontSize: '0.9rem', outline: 'none',
          }}
        />
        <select
          id="select-filtro-categoria"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '0.6rem 1rem', color: '#f1f5f9',
            fontSize: '0.9rem', outline: 'none', appearance: 'none', minWidth: '180px',
          }}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS_SONIDO_VIVO.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
        <table id="tabla-inventario" style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(30,41,59,0.6)' }}>
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
                <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#475569', padding: '3rem' }}>
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
                    style={{ transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={obtenerRutaImagen(p)}
                          alt={p.nombre}
                          onError={(e) => { e.target.style.display = 'none'; }}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{p.nombre}</div>
                          <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                            {p.codigo} · {p.marca}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        background: 'rgba(99,102,241,0.15)', color: '#a5b4fc',
                        padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                      }}>
                        {p.categoria}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#4ade80' }}>
                      {formatearPrecioCLP(p.precio)}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        background: critico ? 'rgba(248,113,113,0.15)' : 'rgba(74,222,128,0.1)',
                        color: critico ? '#f87171' : '#4ade80',
                        padding: '0.25rem 0.7rem', borderRadius: '20px',
                        fontWeight: 700, fontSize: '0.85rem',
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
                            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                            color: '#a5b4fc', borderRadius: '7px', padding: '0.4rem 0.75rem',
                            cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.3)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.15)')}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          id={`btn-eliminar-${p.codigo}`}
                          onClick={() => setModalEliminar(p)}
                          style={{
                            background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
                            color: '#f87171', borderRadius: '7px', padding: '0.4rem 0.75rem',
                            cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(248,113,113,0.25)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(248,113,113,0.1)')}
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
