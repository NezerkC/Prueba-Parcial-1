import { formatearPrecioCLP } from '../../utils/finanzas';

// Muestra los productos y totales de un pedido. Se reutiliza en el checkout
// y en las vistas de compra exitosa y pago fallido.
function ResumenPedido({ items, subtotal, iva, total, titulo = 'Resumen del Pedido' }) {
  return (
    <aside className="cart-summary-card" aria-label={titulo} data-testid="resumen-pedido">
      <h2 className="h5 fw-bold mb-3">{titulo}</h2>

      <ul className="list-unstyled mb-3">
        {items.map((item) => (
          <li
            key={item.codigo}
            className="d-flex justify-content-between gap-2 mb-2"
            data-testid={`resumen-item-${item.codigo}`}
          >
            <span>
              {item.nombre} <span className="text-muted">× {item.cantidad}</span>
            </span>
            <strong>{formatearPrecioCLP(item.precio * item.cantidad)}</strong>
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-between mb-2">
        <span className="text-muted">Subtotal Neto:</span>
        <strong data-testid="resumen-subtotal">{formatearPrecioCLP(subtotal)}</strong>
      </div>
      <div className="d-flex justify-content-between mb-2">
        <span className="text-muted">IVA (19%):</span>
        <strong data-testid="resumen-iva">{formatearPrecioCLP(iva)}</strong>
      </div>
      <hr className="my-3" />
      <div className="d-flex justify-content-between align-items-baseline">
        <span className="fw-bold">Total (CLP):</span>
        <span className="fs-5 fw-bold text-primary" data-testid="resumen-total">
          {formatearPrecioCLP(total)}
        </span>
      </div>
    </aside>
  );
}

export default ResumenPedido;
