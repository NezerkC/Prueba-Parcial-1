import { useState } from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatearPrecioCLP, obtenerRutaImagen } from '../data/productos';
import { useCart } from '../context/CartContext';

function ProductCard({ producto, onAddToCart }) {
  const [imgError, setImgError] = useState(false);
  const cartContext = useCart();

  if (!producto) return null;

  const esGratis = Number(producto.precio) === 0;
  const srcImagen = obtenerRutaImagen(producto);
  const altTexto = `${producto.nombre} (${producto.marca || ''} ${producto.modelo || ''})`.trim();

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(producto);
    } else if (cartContext?.addToCart) {
      cartContext.addToCart(producto);
    }
  };

  return (
    <Card as="article" className="product-card h-100 border-0" data-testid={`product-card-${producto.codigo}`}>
      <div className="product-thumb">
        {!imgError && srcImagen ? (
          <img
            src={srcImagen}
            alt={altTexto}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="product-thumb-fallback d-flex align-items-center justify-content-center"
            style={{ fontSize: '2.5rem' }}
          >
            {producto.icono || '🎵'}
          </div>
        )}
        <span className="product-thumb-indicator">
          {(producto.categoria || 'Instrumento').toUpperCase()}
        </span>
        <span className="product-code-tag">CÓD: {producto.codigo}</span>
      </div>

      <Card.Body className="product-info d-flex flex-column">
        <span className="product-brand">{producto.marca || 'Sonido Vivo'}</span>
        <Card.Title as="h3" className="product-title">
          {producto.nombre}
        </Card.Title>
        <Card.Text className="product-desc">
          {producto.descripcion || `${producto.marca || ''} ${producto.modelo || ''}`}
        </Card.Text>

        <div className="product-meta mt-auto">
          <div>
            <Badge bg="light" text="dark" className="badge badge-category">
              {producto.categoria}
            </Badge>
          </div>
          <span className={esGratis ? 'product-price free' : 'product-price'}>
            {formatearPrecioCLP(producto.precio)}
          </span>
        </div>

        <div className="product-actions mt-3">
          <Link
            to={`/producto/${producto.codigo}`}
            className="btn btn-secondary btn-sm flex-grow-1"
          >
            Ver Detalle
          </Link>
          <Button
            variant="primary"
            size="sm"
            className="btn-add-cart"
            onClick={handleAdd}
          >
            Añadir al Carro
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
