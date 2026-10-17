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
      color: '#4ade80',
      bg: 'rgba(74,222,128,0.1)',
    },
    {
      id: 'kpi-productos',
      label: 'Productos en Catálogo',
      valor: totalProductos,
      icono: '📦',
      color: '#60a5fa',
      bg: 'rgba(96,165,250,0.1)',
    },
    {
      id: 'kpi-unidades',
      label: 'Unidades en Stock',
      valor: totalUnidades,
      icono: '🏷️',
      color: '#a78bfa',
      bg: 'rgba(167,139,250,0.1)',
    },
    {
      id: 'kpi-criticos',
      label: 'Alertas Stock Crítico',
      valor: productosCriticos.length,
      icono: '⚠️',
      color: productosCriticos.length > 0 ? '#f87171' : '#4ade80',
      bg:
        productosCriticos.length > 0
          ? 'rgba(248,113,113,0.1)'
          : 'rgba(74,222,128,0.1)',
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", padding: '1rem 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>🛡️</span>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#f1f5f9' }}>
            Panel Administrativo
          </h1>
        </div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
          Bienvenido, <strong style={{ color: '#e2e8f0' }}>{usuario?.nombre}</strong> · Sonido Vivo
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
              background: k.bg,
              border: `1px solid ${k.color}33`,
              borderRadius: '14px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <span style={{ fontSize: '2.4rem' }}>{k.icono}</span>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color }}>{k.valor}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '1rem' }}>Acciones Rápidas</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/admin/productos"
            id="btn-ir-crud"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            📋 Gestionar Inventario
          </Link>
          <Link
            to="/productos"
            id="btn-ir-catalogo"
            style={{
              background: 'rgba(255,255,255,0.07)',
              color: '#e2e8f0',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            🛍️ Ver Catálogo Público
          </Link>
        </div>
      </div>

      {/* Tabla alertas críticas */}
      {productosCriticos.length > 0 && (
        <div>
          <h2 style={{ color: '#f87171', fontSize: '1.1rem', marginBottom: '1rem' }}>
            ⚠️ Productos con Stock Crítico ({productosCriticos.length})
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table
              id="tabla-stock-critico"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'rgba(248,113,113,0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <thead>
                <tr style={{ background: 'rgba(248,113,113,0.15)' }}>
                  {['Código', 'Producto', 'Categoría', 'Stock', 'Mínimo'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        color: '#fca5a5',
                        fontSize: '0.8rem',
                        fontWeight: 600,
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
                    style={{ borderTop: '1px solid rgba(248,113,113,0.15)' }}
                  >
                    <td style={{ padding: '0.75rem 1rem', color: '#fca5a5', fontWeight: 600, fontSize: '0.85rem' }}>
                      {p.codigo}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#f1f5f9', fontSize: '0.9rem' }}>{p.nombre}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>{p.categoria}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          background: 'rgba(248,113,113,0.2)',
                          color: '#f87171',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                        }}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>
                      {p.stockCritico ?? 3}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
