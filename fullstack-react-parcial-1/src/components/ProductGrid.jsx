import { Col, Row } from 'react-bootstrap';
import ProductCard from './ProductCard';

function ProductGrid({
  productos = [],
  onAddToCart,
  emptyMessage = 'No se encontraron productos.',
}) {
  if (productos.length === 0) {
    return <p className="text-center text-muted py-5">{emptyMessage}</p>;
  }

  return (
    <Row className="g-4" data-testid="product-grid">
      {productos.map((producto) => (
        <Col key={producto.codigo} sm={6} lg={4}>
          <ProductCard producto={producto} onAddToCart={onAddToCart} />
        </Col>
      ))}
    </Row>
  );
}

export default ProductGrid;
