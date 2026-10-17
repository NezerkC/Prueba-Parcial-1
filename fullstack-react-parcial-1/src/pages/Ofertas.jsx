import { useMemo, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { useCart } from '../context/CartContext';
import { obtenerProductosEnOferta } from '../data/productos';

function Ofertas() {
  const { addToCart } = useCart();
  const productosBaseOferta = useMemo(() => obtenerProductosEnOferta(), []);

  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [orden, setOrden] = useState('descuento-desc');

  // Categorías que realmente tienen productos en oferta
  const categoriasDisponibles = useMemo(() => {
    const set = new Set(productosBaseOferta.map((p) => p.categoria).filter(Boolean));
    return ['Todas', ...Array.from(set)];
  }, [productosBaseOferta]);

  const productosFiltrados = useMemo(() => {
    let lista = [...productosBaseOferta];

    if (categoriaFiltro !== 'Todas') {
      lista = lista.filter(
        (p) => (p.categoria || '').toLowerCase() === categoriaFiltro.toLowerCase()
      );
    }

    if (orden === 'descuento-desc') {
      lista.sort((a, b) => (Number(b.descuento) || 0) - (Number(a.descuento) || 0));
    } else if (orden === 'precio-asc') {
      lista.sort((a, b) => Number(a.precio) - Number(b.precio));
    } else if (orden === 'precio-desc') {
      lista.sort((a, b) => Number(b.precio) - Number(a.precio));
    } else if (orden === 'nombre-asc') {
      lista.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
    }

    return lista;
  }, [productosBaseOferta, categoriaFiltro, orden]);

  return (
    <Container className="py-4 ofertas-page" as="section" aria-label="Catálogo de Productos en Oferta">
      <nav aria-label="Migas de pan" className="detalle-breadcrumb mb-3">
        <p className="mb-0">
          <Link to="/">Inicio</Link> &gt;{' '}
          <span className="detalle-breadcrumb-actual">Ofertas</span>
        </p>
      </nav>

      {/* Banner Principal de Ofertas */}
      <div className="ofertas-banner text-center text-md-start mb-4">
        <span className="ofertas-badge">🔥 Promociones Exclusivas</span>
        <h1 className="h2 fw-bold text-white mb-2" data-testid="ofertas-titulo">
          Ofertas y Precios Especiales
        </h1>
        <p className="text-white-50 mb-3" style={{ maxWidth: '720px' }}>
          Equipa tu estudio o escenario con los mejores precios del mercado. Descuentos por tiempo limitado
          en marcas líderes con garantía oficial y despacho a todo Chile.
        </p>
        <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
          <span className="badge bg-light text-dark px-3 py-2 fw-semibold">
            ✓ Hasta 25% de Ahorro
          </span>
          <span className="badge bg-light text-dark px-3 py-2 fw-semibold">
            ✓ 12 Meses de Garantía
          </span>
          <span className="badge bg-light text-dark px-3 py-2 fw-semibold">
            ✓ Stock Limitado
          </span>
        </div>
      </div>

      {/* Controles de Filtrado y Orden */}
      <div className="p-3 bg-white border rounded shadow-sm mb-4">
        <Row className="align-items-center g-3">
          <Col xs={12} md={5}>
            <div className="d-flex align-items-center gap-2">
              <Form.Label htmlFor="select-categoria-oferta" className="mb-0 small fw-bold text-muted text-nowrap">
                Categoría:
              </Form.Label>
              <Form.Select
                id="select-categoria-oferta"
                size="sm"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                data-testid="filtro-categoria-oferta"
              >
                {categoriasDisponibles.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Col>

          <Col xs={12} md={4}>
            <div className="d-flex align-items-center gap-2">
              <Form.Label htmlFor="select-orden-oferta" className="mb-0 small fw-bold text-muted text-nowrap">
                Ordenar por:
              </Form.Label>
              <Form.Select
                id="select-orden-oferta"
                size="sm"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                data-testid="filtro-orden-oferta"
              >
                <option value="descuento-desc">Mayor Descuento</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="nombre-asc">Nombre A-Z</option>
              </Form.Select>
            </div>
          </Col>

          <Col xs={12} md={3} className="text-md-end">
            <span className="text-muted small fw-semibold" data-testid="contador-ofertas">
              {productosFiltrados.length}{' '}
              {productosFiltrados.length === 1 ? 'oferta disponible' : 'ofertas disponibles'}
            </span>
          </Col>
        </Row>
      </div>

      {/* Grilla de Ofertas reutilizando ProductGrid */}
      {productosFiltrados.length > 0 ? (
        <ProductGrid
          productos={productosFiltrados}
          onAddToCart={addToCart}
          emptyMessage="No hay productos en oferta con el filtro seleccionado."
        />
      ) : (
        <div className="text-center py-5 border rounded bg-white shadow-sm my-4" data-testid="ofertas-vacio">
          <div style={{ fontSize: '3rem' }}>🏷️</div>
          <h2 className="h4 mt-3">No encontramos ofertas para este filtro</h2>
          <p className="text-muted">
            Intenta seleccionar &quot;Todas&quot; las categorías para ver todas las promociones vigentes.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setCategoriaFiltro('Todas')}
          >
            Ver Todas las Ofertas
          </button>
        </div>
      )}
    </Container>
  );
}

export default Ofertas;
