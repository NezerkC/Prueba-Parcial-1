import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { formatearPrecioCLP } from '../utils/finanzas';

function Carrito() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    iva,
    totalConIva,
  } = useCart();

  const navigate = useNavigate();
  const [showVaciarModal, setShowVaciarModal] = useState(false);

  const handleConfirmarVaciar = () => {
    clearCart();
    setShowVaciarModal(false);
  };

  const handleIrAlCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty-state text-center py-5" data-testid="cart-empty-view">
        <div className="empty-icon fs-1 mb-3" aria-hidden="true">
          🛒
        </div>
        <h1 className="h3 fw-bold">Tu carrito está vacío</h1>
        <p className="text-muted my-3">
          Aún no has agregado ningún instrumento o equipo de audio a tu orden.
        </p>
        <Link to="/productos" className="btn btn-primary" data-testid="btn-ir-catalogo">
          Ver Catálogo de Instrumentos
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page my-4" data-testid="cart-page">
      <header className="section-header mb-4">
        <h1 className="h2 fw-bold">Tu Carrito de Compras</h1>
        <p className="text-muted">
          Los artículos se mantienen guardados en tu navegador de forma segura.
        </p>
      </header>

      {items.length > 0 && (
        <div className="cart-layout">
          {/* Columna Izquierda: Tabla de Artículos */}
          <section
            className="cart-items-card"
            aria-label="Productos en el carrito"
            data-testid="cart-items-section"
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold mb-0">Instrumentos Seleccionados</h2>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => setShowVaciarModal(true)}
                data-testid="btn-vaciar-carro"
              >
                🗑️ Vaciar Carro
              </button>
            </div>

            <div className="cart-table-wrapper table-responsive">
              <table className="cart-table table align-middle" aria-label="Listado de ítems para comprar">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody data-testid="cart-table-body">
                  {items.map((item) => {
                    const subtotalItem = (Number(item.precio) || 0) * (Number(item.cantidad) || 0);

                    return (
                      <tr key={item.codigo} data-testid={`cart-item-${item.codigo}`}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {item.imagen && (
                              <img
                                src={item.imagen}
                                alt={item.nombre}
                                width="48"
                                height="48"
                                className="rounded object-fit-cover border"
                              />
                            )}
                            <div>
                              <strong className="d-block text-dark">{item.nombre}</strong>
                              <small className="text-muted">
                                {item.marca} · {item.codigo}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>{formatearPrecioCLP(item.precio)}</td>
                        <td>
                          <div className="qty-control d-inline-flex align-items-center border rounded">
                            <button
                              type="button"
                              className="qty-btn btn btn-sm px-2 py-0"
                              onClick={() => updateQuantity(item.codigo, -1)}
                              aria-label={`Disminuir cantidad de ${item.nombre}`}
                              data-testid={`btn-disminuir-${item.codigo}`}
                            >
                              -
                            </button>
                            <span
                              className="qty-val px-2 fw-semibold"
                              data-testid={`qty-val-${item.codigo}`}
                            >
                              {item.cantidad}
                            </span>
                            <button
                              type="button"
                              className="qty-btn btn btn-sm px-2 py-0"
                              onClick={() => updateQuantity(item.codigo, 1)}
                              aria-label={`Aumentar cantidad de ${item.nombre}`}
                              data-testid={`btn-aumentar-${item.codigo}`}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="fw-semibold text-dark">
                          {formatearPrecioCLP(subtotalItem)}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFromCart(item.codigo)}
                            aria-label={`Eliminar ${item.nombre} del carrito`}
                            data-testid={`btn-eliminar-${item.codigo}`}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-3">
              <Link to="/productos" className="btn btn-secondary btn-sm">
                &larr; Seguir Comprando en el Catálogo
              </Link>
            </div>
          </section>

          {/* Columna Derecha: Resumen de Totales e Impuestos */}
          <aside className="cart-summary-card" aria-label="Resumen de pago" data-testid="cart-summary">
            <h2 className="h5 fw-bold mb-3">Resumen de la Orden</h2>

            <div className="summary-row d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal Neto:</span>
              <strong data-testid="summary-subtotal">{formatearPrecioCLP(subtotal)}</strong>
            </div>

            <div className="summary-row d-flex justify-content-between mb-2">
              <span className="text-muted">IVA Estimado (19%):</span>
              <strong data-testid="summary-iva">{formatearPrecioCLP(iva)}</strong>
            </div>

            <div className="summary-row d-flex justify-content-between mb-2">
              <span className="text-muted">Despacho a Domicilio:</span>
              <span className="text-success fw-bold">¡GRATIS Viña / Valparaíso!</span>
            </div>

            <hr className="my-3" />

            <div className="summary-row total d-flex justify-content-between align-items-baseline mb-3">
              <span className="fw-bold fs-5">Total a Pagar (CLP):</span>
              <span className="fs-4 fw-bold text-primary" data-testid="summary-total">
                {formatearPrecioCLP(totalConIva)}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-primary w-100 py-2 fw-semibold"
              onClick={handleIrAlCheckout}
              data-testid="btn-finalizar-compra"
            >
              💳 Continuar al Checkout
            </button>

            <div className="mt-3 text-center">
              <small className="text-muted">
                🔒 En el siguiente paso ingresas tus datos de envío. El pago es simulado.
              </small>
            </div>
          </aside>
        </div>
      )}

      {/* Modal de Confirmación para Vaciar Carro */}
      <Modal show={showVaciarModal} onHide={() => setShowVaciarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5">¿Vaciar Carrito de Compras?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Esta acción eliminará todos los instrumentos agregados actualmente a tu orden. ¿Deseas continuar?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVaciarModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmarVaciar} data-testid="btn-confirmar-vaciar">
            Sí, Vaciar Carro
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Carrito;
