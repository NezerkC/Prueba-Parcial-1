import { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { useCart } from '../context/CartContext';
import { obtenerProductosPorCategoria } from '../data/productos';

function CategoriaDetalle() {
  const { categoria } = useParams();
  const nombreCategoria = decodeURIComponent(categoria || '').trim();
  const { addToCart } = useCart();

  const productos = useMemo(
    () => obtenerProductosPorCategoria(categoria),
    [categoria]
  );

  return (
    <Container className="py-4 categoria-detalle-page" as="section" aria-label={`Categoría: ${nombreCategoria}`}>
      <nav aria-label="Migas de pan" className="detalle-breadcrumb mb-3">
        <p className="mb-0">
          <Link to="/">Inicio</Link> &gt; <Link to="/categorias">Categorías</Link> &gt;{' '}
          <span className="detalle-breadcrumb-actual">{nombreCategoria || 'Categoría'}</span>
        </p>
      </nav>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1" data-testid="categoria-titulo">
            {nombreCategoria}
          </h1>
          <p className="text-muted mb-0" data-testid="categoria-contador">
            {productos.length === 1
              ? '1 instrumento o accesorio disponible'
              : `${productos.length} instrumentos y accesorios disponibles`}
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/categorias" className="btn btn-outline-secondary btn-sm" data-testid="btn-volver-categorias">
            &larr; Ver Todas las Categorías
          </Link>
          <Link to="/productos" className="btn btn-secondary btn-sm">
            Catálogo Completo
          </Link>
        </div>
      </div>

      {productos.length > 0 ? (
        <ProductGrid
          productos={productos}
          onAddToCart={addToCart}
          emptyMessage={`No hay productos disponibles actualmente en la categoría "${nombreCategoria}".`}
        />
      ) : (
        <div className="text-center py-5 border rounded bg-white shadow-sm my-4" data-testid="categoria-vacia">
          <div style={{ fontSize: '3rem' }}>🎸</div>
          <h2 className="h4 mt-3">Categoría no encontrada o sin stock</h2>
          <p className="text-muted">
            No se encontraron productos registrados bajo &quot;{nombreCategoria}&quot;.
          </p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Link to="/categorias" className="btn btn-primary">
              Explorar Otras Categorías
            </Link>
            <Link to="/productos" className="btn btn-outline-secondary">
              Ir al Catálogo Completo
            </Link>
          </div>
        </div>
      )}
    </Container>
  );
}

export default CategoriaDetalle;
