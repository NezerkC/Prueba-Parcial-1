import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { obtenerCatalogoActivo } from '../../data/productos';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { usuario } = useAuth();
  const catalogo = useMemo(() => obtenerCatalogoActivo(), []);

  const valoracionTotal = useMemo(
    () => catalogo.reduce((acc, p) => acc + p.precio * p.stock, 0),
    [catalogo]
  );

  const productosCriticos = useMemo(
    () => catalogo.filter((p) => p.stock <= (p.stockCritico ?? 3)),
    [catalogo]
  );

  const totalProductos = catalogo.length;
  const totalUnidades = catalogo.reduce((acc, p) => acc + p.stock, 0);

  const kpis = [
    {
      id: 'kpi-valoracion',
      label: 'Valoración Total Inventario',
      valor: '$' + valoracionTotal.toLocaleString('es-CL'),
      icono: '💰',
      color: 'var(--color-success, #4E632E)',
      bg: 'var(--color-success-bg, #EEF4E6)',
      border: 'var(--color-success, #4E632E)',
    },
    {
      id: 'kpi-productos',
      label: 'Productos en Catálogo',
      valor: totalProductos,
      icono: '📦',
      color: '#1D4ED8',
      bg: '#EFF6FF',
      border: '#93C5FD',
    },
    {
      id: 'kpi-unidades',
      label: 'Unidades en Stock',
      valor: totalUnidades,
      icono: '🏷️',
      color: '#6D28D9',
      bg: '#F5F3FF',
      border: '#C4B5FD',
    },
    {
      id: 'kpi-criticos',
      label: 'Alertas Stock Crítico',
      valor: productosCriticos.length,
      icono: '⚠️',
      color: productosCriticos.length > 0 ? 'var(--color-danger, #A33A3A)' : 'var(--color-success, #4E632E)',
      bg: productosCriticos.length > 0 ? 'var(--color-danger-bg, #FDF0F0)' : 'var(--color-success-bg, #EEF4E6)',
      border: productosCriticos.length > 0 ? 'rgba(163, 58, 58, 0.4)' : 'rgba(78, 99, 46, 0.4)',
    },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-family)', padding: '1rem 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }} aria-hidden="true">🛡️</span>
          <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-text-main, #1A2413)' }}>
            Panel Administrativo
          </h1>
        </div>
        <p style={{ margin: 0, color: 'var(--color-text-muted, #615E54)', fontSize: '0.95rem' }}>
          Bienvenido,{' '}
          <strong style={{ color: 'var(--color-accent, #D49B28)', fontWeight: 700 }}>
            {usuario?.nombre || 'Administrador'}
          </strong>{' '}
          · Sonido Vivo
        </p>
      </div>

      {/* KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {kpis.map((k) => (
          <div
            key={k.id}
            id={k.id}
            style={{
              background: 'var(--color-surface, #FFFFFF)',
              border: '1px solid var(--color-border, #E2DDD0)',
              borderRadius: 'var(--radius-md, 8px)',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              boxShadow: 'var(--shadow-card, 0 1px 3px rgba(26, 36, 19, 0.05))',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-hover, 0 8px 24px rgba(26, 36, 19, 0.09))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-card, 0 1px 3px rgba(26, 36, 19, 0.05))';
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                background: k.bg,
                border: `1px solid ${k.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                flexShrink: 0,
              }}
            >
              {k.icono}
            </div>
            <div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: k.color, lineHeight: 1.1 }}>
                {k.valor}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted, #615E54)', marginTop: '0.35rem', fontWeight: 600 }}>
                {k.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ color: 'var(--color-text-main, #1A2413)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
          Acciones Rápidas
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/admin/productos"
            id="btn-ir-crud"
            style={{
              background: 'var(--color-primary, #1A2413)',
              color: 'var(--color-bg, #FAF8F2)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-sm, 4px)',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
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
            📋 Gestionar Inventario
          </Link>
          <Link
            to="/admin/usuarios"
            id="btn-ir-usuarios"
            style={{
              background: 'var(--color-surface, #FFFFFF)',
              color: 'var(--color-text-main, #1A2413)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-sm, 4px)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: '1px solid var(--color-border, #E2DDD0)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'background-color 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-surface-hover, #F3EFE3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-surface, #FFFFFF)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            👥 Mantenedor de Usuarios
          </Link>
          <Link
            to="/productos"
            id="btn-ir-catalogo"
            style={{
              background: 'var(--color-surface, #FFFFFF)',
              color: 'var(--color-text-main, #1A2413)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-sm, 4px)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: '1px solid var(--color-border, #E2DDD0)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'background-color 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-surface-hover, #F3EFE3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-surface, #FFFFFF)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🛍️ Ver Catálogo Público
          </Link>
        </div>
      </div>

      {/* Tabla alertas críticas */}
      {productosCriticos.length > 0 && (
        <div>
          <h2 style={{ color: 'var(--color-danger, #A33A3A)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
            ⚠️ Productos con Stock Crítico ({productosCriticos.length})
          </h2>
          <div
            style={{
              background: 'var(--color-surface, #FFFFFF)',
              border: '1px solid var(--color-border, #E2DDD0)',
              borderRadius: 'var(--radius-md, 8px)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                id="tabla-stock-critico"
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr style={{ background: 'var(--color-surface-hover, #F3EFE3)', borderBottom: '1px solid var(--color-border, #E2DDD0)' }}>
                    {['Código', 'Producto', 'Categoría', 'Stock', 'Mínimo'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '0.85rem 1rem',
                          textAlign: 'left',
                          color: 'var(--color-text-muted, #615E54)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productosCriticos.map((p) => (
                    <tr
                      key={p.codigo}
                      style={{
                        borderTop: '1px solid var(--color-border, #E2DDD0)',
                        background: 'transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-hover, #F3EFE3)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-danger, #A33A3A)', fontWeight: 700, fontSize: '0.85rem' }}>
                        {p.codigo}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-main, #1A2413)', fontWeight: 600, fontSize: '0.9rem' }}>
                        {p.nombre}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted, #615E54)', fontSize: '0.85rem' }}>
                        {p.categoria}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            background: 'var(--color-danger-bg, #FDF0F0)',
                            color: 'var(--color-danger, #A33A3A)',
                            border: '1px solid rgba(163, 58, 58, 0.25)',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '20px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          ⚠️ {p.stock}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted, #615E54)', fontSize: '0.85rem', fontWeight: 600 }}>
                        {p.stockCritico ?? 3}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
