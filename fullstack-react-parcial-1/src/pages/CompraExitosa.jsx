import { Col, Row } from 'react-bootstrap';
import { Link, Navigate, useLocation } from 'react-router-dom';
import ResumenPedido from '../components/checkout/ResumenPedido';
import { REGIONES_CHILE } from '../data/regiones';
import { TIPOS_ENTREGA } from '../utils/checkout';

function describirEntrega(entrega) {
  if (entrega.tipo === TIPOS_ENTREGA.RETIRO) return 'Retiro en tienda Sonido Vivo, Viña del Mar';
  const region = REGIONES_CHILE.find((r) => r.id === entrega.region)?.nombre || entrega.region;
  const depto = entrega.departamento ? `, ${entrega.departamento}` : '';
  return `${entrega.direccion}${depto}, ${entrega.comuna}, ${region}`;
}

function CompraExitosa() {
  const { state } = useLocation();
  const orden = state?.orden;

  // Sin una orden (por ejemplo, entrando directo a la URL) no hay nada que mostrar
  if (!orden) return <Navigate to="/carrito" replace />;

  const cuentaCliente = orden.usuario?.rut || orden.cliente?.rut;

  return (
    <div className="my-4" data-testid="compra-exitosa">
      <div className="alert alert-success p-4 mb-4" role="status">
        <h1 className="h3 fw-bold mb-2">🎉 ¡Compra realizada con éxito!</h1>
        <p className="mb-1">
          Gracias {orden.cliente.nombre}. Tu número de orden es{' '}
          <strong data-testid="numero-orden">{orden.numero}</strong>.
        </p>
        <p className="mb-0 small" data-testid="confirmacion-cuenta-asociada">
          {cuentaCliente
            ? `Orden vinculada formalmente a la cuenta registrada (${cuentaCliente} · ${orden.cliente.correo}). Enviaremos el comprobante a tu casilla.`
            : `Enviaremos el comprobante a ${orden.cliente.correo}.`}
        </p>
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <section className="form-card" aria-label="Datos de entrega">
            <h2 className="h5 fw-bold mb-3">Entrega</h2>
            <p className="mb-1">
              {orden.cliente.nombre} {orden.cliente.apellidos}
            </p>
            <p className="mb-0 text-muted" data-testid="entrega-descripcion">
              {describirEntrega(orden.entrega)}
            </p>
          </section>
          <Link to="/productos" className="btn btn-primary mt-3">
            Seguir Comprando
          </Link>
        </Col>
        <Col lg={5}>
          <ResumenPedido
            items={orden.items}
            subtotal={orden.subtotal}
            iva={orden.iva}
            total={orden.total}
          />
        </Col>
      </Row>
    </div>
  );
}

export default CompraExitosa;
