import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import EspecificacionesProducto from '../components/producto/EspecificacionesProducto';
import ProductoNoEncontrado from '../components/producto/ProductoNoEncontrado';
import SelectorCantidad from '../components/producto/SelectorCantidad';
import { useCart } from '../context/CartContext';
import {
  buscarProductoPorCodigo,
  formatearPrecioCLP,
  obtenerCatalogoActivo,
  obtenerRutaImagen,
} from '../data/productos';
import useContador from '../hooks/useContador';
import { evaluarNivelStock } from '../utils/stock';

const DESCRIPCION_POR_DEFECTO =
  'Instrumento musical original con garantía oficial de Sonido Vivo Viña del Mar.';

function ProductoDetalle() {
  const { codigo } = useParams();
  const producto = buscarProductoPorCodigo(obtenerCatalogoActivo(), codigo);

  if (!producto) {
    return <ProductoNoEncontrado codigo={codigo} />;
  }

  // key: si se navega de un producto a otro, el detalle se reinicia (cantidad en 1)
  return <DetalleProducto key={producto.codigo} producto={producto} />;
}

function DetalleProducto({ producto }) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [agregado, setAgregado] = useState(null);

  const stock = Number(producto.stock) || 0;
  const sinStock = stock <= 0;
  const nivelStock = evaluarNivelStock(stock, producto.stockCritico);
  const { contador, incrementar, decrementar } = useContador(1, {
    min: 1,
    max: Math.max(stock, 1),
  });

  const srcImagen = obtenerRutaImagen(producto);

  // Igual que el original: el título de la pestaña muestra el producto
  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = `Sonido Vivo | ${producto.nombre} (${producto.marca} ${producto.modelo})`;
    return () => {
      document.title = tituloAnterior;
    };
  }, [producto]);

  const handleAgregar = () => {
    if (sinStock) return;
    addToCart(producto, contador);
    setAgregado(contador);
  };

  return (
    <>
      <nav aria-label="Migas de pan" className="detalle-breadcrumb">
        <p>
          <Link to="/">Inicio</Link> &gt; <Link to="/productos">Catálogo</Link> &gt;{' '}
          <span className="detalle-breadcrumb-actual">{producto.categoria}</span>
        </p>
      </nav>

      <section className="detail-card" aria-label="Ficha técnica del producto">
        {/* Lado izquierdo: imagen del instrumento */}
        <div className="detail-visual">
          <div className="detail-visual-placeholder">
            {!imgError && srcImagen ? (
              <img
                src={srcImagen}
                alt={`${producto.nombre} (${producto.marca} ${producto.modelo})`}
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="detalle-icono" aria-hidden="true">
                {producto.icono || '🎵'}
              </span>
            )}
          </div>
          <span className="product-code-tag detalle-codigo">CÓD: {producto.codigo}</span>
          <div className="detalle-garantia">
            <span className="badge badge-ok">✓ Garantía Oficial 12 Meses</span>
          </div>
        </div>

        {/* Lado derecho: datos, especificaciones y adición al carro */}
        <div className="detail-info">
          <span className="product-brand">{producto.marca}</span>
          <h1>{producto.nombre}</h1>

          <div className="detalle-badges">
            <span className="badge badge-category">{producto.categoria}</span>
            <span className="badge">{producto.modelo}</span>
          </div>

          <div className="detail-price-box">
            <div>
              <span className="detalle-precio-label">PRECIO OFICIAL (IVA INCLUIDO):</span>
              <span className="detail-price">{formatearPrecioCLP(producto.precio)}</span>
            </div>
            <span className={`badge ${nivelStock.badgeCss}`} data-testid="detalle-stock">
              {sinStock ? 'Agotado' : `${stock} unidades disponibles`}
            </span>
          </div>

          <p className="detalle-descripcion">
            {producto.descripcion || DESCRIPCION_POR_DEFECTO}
          </p>

          <EspecificacionesProducto producto={producto} />

          <div className="detalle-acciones">
            <SelectorCantidad
              cantidad={contador}
              onIncrementar={incrementar}
              onDecrementar={decrementar}
              min={1}
              max={Math.max(stock, 1)}
              deshabilitado={sinStock}
            />
            <button
              type="button"
              className="btn btn-primary detalle-btn-agregar"
              onClick={handleAgregar}
              disabled={sinStock}
            >
              {sinStock ? 'Sin Stock Disponible' : 'Añadir al Carrito de Compras'}
            </button>
          </div>

          {agregado !== null && (
            <Alert variant="success" className="mt-3 mb-0" role="status">
              Se agregaron {agregado} {agregado === 1 ? 'unidad' : 'unidades'} de &quot;
              {producto.nombre}&quot; al carrito.
            </Alert>
          )}

          <div className="detalle-enlaces">
            <Link to="/productos" className="btn btn-secondary btn-sm">
              &larr; Volver al Catálogo
            </Link>
            <Link to="/carrito" className="btn btn-outline btn-sm">
              Ir al Carrito &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductoDetalle;
