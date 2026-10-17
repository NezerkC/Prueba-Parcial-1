import { useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { obtenerCategoriasConMetadata, obtenerRutaImagen } from '../data/productos';

function Categorias() {
  const [filtro, setFiltro] = useState('');
  const categorias = useMemo(() => obtenerCategoriasConMetadata(), []);

  const categoriasFiltradas = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    if (!q) return categorias;
    return categorias.filter((c) => c.nombre.toLowerCase().includes(q));
  }, [categorias, filtro]);

  return (
    <Container className="py-4 categorias-page" as="section" aria-label="Explorar por Categorías">
      <nav aria-label="Migas de pan" className="detalle-breadcrumb mb-3">
        <p className="mb-0">
          <Link to="/">Inicio</Link> &gt;{' '}
          <span className="detalle-breadcrumb-actual">Categorías</span>
        </p>
      </nav>

      <header className="mb-4">
        <h1 className="h2 fw-bold text-dark">Categorías de Instrumentos y Audio</h1>
        <p className="text-muted mb-0">
          Explora nuestra selección completa organizada por familias de instrumentos, amplificación y accesorios.
        </p>
      </header>

      {/* Buscador de categorías */}
      <div className="mb-4" style={{ maxWidth: '480px' }}>
        <InputGroup>
          <InputGroup.Text id="categoria-search-addon" className="bg-white">
            🔍
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Buscar categoría (ej. Guitarras, Baterías, Micrófonos)..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Buscar categoría"
            aria-describedby="categoria-search-addon"
            data-testid="input-buscar-categoria"
          />
          {filtro && (
            <Button
              variant="outline-secondary"
              onClick={() => setFiltro('')}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </Button>
          )}
        </InputGroup>
      </div>

      {/* Grilla de Categorías */}
      {categoriasFiltradas.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4" data-testid="categorias-grid">
          {categoriasFiltradas.map((cat) => (
            <Col key={cat.nombre}>
              <Card
                as="article"
                className="category-card h-100 border-0"
                data-testid={`categoria-card-${cat.slug}`}
              >
                <div className="category-thumb">
                  {cat.imagen ? (
                    <img
                      src={obtenerRutaImagen(cat.imagen)}
                      alt={`Categoría ${cat.nombre}`}
                      loading="lazy"
                    />
                  ) : (
                    <span style={{ fontSize: '3rem' }} aria-hidden="true">
                      {cat.icono}
                    </span>
                  )}
                  <span className="category-count-badge" data-testid={`badge-count-${cat.slug}`}>
                    {cat.totalProductos} {cat.totalProductos === 1 ? 'producto' : 'productos'}
                  </span>
                </div>

                <Card.Body className="category-info d-flex flex-column">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ fontSize: '1.25rem' }}>{cat.icono}</span>
                    <Card.Title as="h2" className="category-title mb-0 h5">
                      {cat.nombre}
                    </Card.Title>
                  </div>
                  <Card.Text className="text-muted small mb-3 flex-grow-1">
                    Equipos e instrumentos garantizados para músicos y profesionales.
                  </Card.Text>

                  <Link
                    to={`/categorias/${cat.slug}`}
                    className="btn btn-secondary btn-sm w-100 mt-auto"
                    data-testid={`link-categoria-${cat.slug}`}
                  >
                    Ver Productos &rarr;
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5 border rounded bg-white shadow-sm my-4">
          <div style={{ fontSize: '3rem' }}>🔍</div>
          <h2 className="h4 mt-3">No encontramos categorías que coincidan</h2>
          <p className="text-muted">
            Intenta con otro término de búsqueda o limpia el filtro para ver todas las familias.
          </p>
          <Button variant="primary" onClick={() => setFiltro('')}>
            Mostrar Todas las Categorías
          </Button>
        </div>
      )}
    </Container>
  );
}

export default Categorias;
