import { Col, Row } from 'react-bootstrap';
import { Link, Navigate, useLocation } from 'react-router-dom';
import ResumenPedido from '../components/checkout/ResumenPedido';

function PagoFallido() {
  const { state } = useLocation();
  const orden = state?.orden;

  if (!orden) return <Navigate to="/carrito" replace />;

  return (
    <div className="my-4" data-testid="pago-fallido">
      <div className="alert alert-danger p-4 mb-4" role="alert">
        <h1 className="h3 fw-bold mb-2">No se pudo realizar el pago</h1>
        <p className="mb-0">
          El pago de la orden <strong>{orden.numero}</strong> fue rechazado. Tus productos siguen
          guardados en el carrito, así que puedes intentarlo de nuevo.
        </p>
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/checkout" className="btn btn-primary" data-testid="btn-reintentar-pago">
              🔁 Volver a Intentar el Pago
            </Link>
            <Link to="/carrito" className="btn btn-secondary">
              Revisar el Carrito
            </Link>
          </div>
        </Col>
        <Col lg={5}>
          <ResumenPedido
            items={orden.items}
            subtotal={orden.subtotal}
            iva={orden.iva}
            total={orden.total}
            titulo="Pedido no pagado"
          />
        </Col>
      </Row>
    </div>
  );
}

export default PagoFallido;
