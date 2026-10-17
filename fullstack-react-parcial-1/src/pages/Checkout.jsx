import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ResumenPedido from '../components/checkout/ResumenPedido';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { REGIONES_CHILE } from '../data/regiones';
import { TIPOS_ENTREGA, crearOrden, validarDatosEnvio } from '../utils/checkout';

// Si hay sesión iniciada, los datos del cliente se completan automáticamente
function datosIniciales(usuario) {
  return {
    nombre: usuario?.nombre || '',
    apellidos: usuario?.apellidos || '',
    correo: usuario?.correo || '',
    tipoEntrega: TIPOS_ENTREGA.DOMICILIO,
    direccion: usuario?.direccion || '',
    departamento: '',
    region: usuario?.region || '',
    comuna: usuario?.comuna || '',
    simularRechazo: false,
  };
}

function Checkout() {
  const { usuario } = useAuth();
  const { items, subtotal, iva, totalConIva, clearCart } = useCart();
  const navigate = useNavigate();

  const [datos, setDatos] = useState(() => datosIniciales(usuario));
  const [errores, setErrores] = useState({});
  // evita que, al vaciar el carrito tras pagar, se redirija al carrito en vez del comprobante
  const [compraConfirmada, setCompraConfirmada] = useState(false);

  if (items.length === 0 && !compraConfirmada) {
    return <Navigate to="/carrito" replace />;
  }

  const comunas = REGIONES_CHILE.find((r) => r.id === datos.region)?.comunas || [];
  const esDomicilio = datos.tipoEntrega === TIPOS_ENTREGA.DOMICILIO;

  const handleChange = (evento) => {
    const { name, value, type, checked } = evento.target;
    setDatos((anteriores) => ({
      ...anteriores,
      [name]: type === 'checkbox' ? checked : value,
      // al cambiar de región, la comuna elegida deja de ser válida
      ...(name === 'region' ? { comuna: '' } : {}),
    }));
    if (errores[name]) setErrores((anteriores) => ({ ...anteriores, [name]: undefined }));
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();
    const nuevosErrores = validarDatosEnvio(datos);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const orden = crearOrden({ datos, items, subtotal, iva, total: totalConIva });

    // Pago simulado: no hay pasarela real en esta etapa del proyecto
    if (datos.simularRechazo) {
      navigate('/pago-fallido', { state: { orden } });
      return;
    }

    setCompraConfirmada(true);
    clearCart();
    navigate('/compra-exitosa', { state: { orden } });
  };

  return (
    <div className="my-4" data-testid="checkout-page">
      <header className="section-header mb-4">
        <h1 className="h2 fw-bold">Checkout</h1>
        <p className="text-muted">
          {usuario
            ? `Hola ${usuario.nombre}, completamos tus datos con tu cuenta. Revisa que estén correctos.`
            : 'Ingresa tus datos y la dirección de entrega para completar la compra.'}
        </p>
      </header>

      <Row className="g-4">
        <Col lg={7}>
          <Form noValidate onSubmit={handleSubmit} className="form-card" aria-label="Datos de envío">
            <h2 className="h5 fw-bold mb-3">Datos del cliente</h2>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="checkout-nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    name="nombre"
                    value={datos.nombre}
                    onChange={handleChange}
                    isInvalid={Boolean(errores.nombre)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="checkout-apellidos">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    name="apellidos"
                    value={datos.apellidos}
                    onChange={handleChange}
                    isInvalid={Boolean(errores.apellidos)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.apellidos}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="checkout-correo">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={datos.correo}
                    onChange={handleChange}
                    isInvalid={Boolean(errores.correo)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <h2 className="h5 fw-bold mt-4 mb-3">Entrega</h2>
            <div className="mb-3">
              <Form.Check
                type="radio"
                id="entrega-domicilio"
                name="tipoEntrega"
                value={TIPOS_ENTREGA.DOMICILIO}
                label="Despacho a domicilio"
                checked={esDomicilio}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                id="entrega-retiro"
                name="tipoEntrega"
                value={TIPOS_ENTREGA.RETIRO}
                label="Retiro en tienda (Viña del Mar)"
                checked={!esDomicilio}
                onChange={handleChange}
              />
            </div>

            {esDomicilio && (
              <Row className="g-3" data-testid="checkout-direccion">
                <Col md={8}>
                  <Form.Group controlId="checkout-calle">
                    <Form.Label>Calle y número</Form.Label>
                    <Form.Control
                      name="direccion"
                      value={datos.direccion}
                      onChange={handleChange}
                      isInvalid={Boolean(errores.direccion)}
                    />
                    <Form.Control.Feedback type="invalid">{errores.direccion}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="checkout-departamento">
                    <Form.Label>Depto. (opcional)</Form.Label>
                    <Form.Control
                      name="departamento"
                      value={datos.departamento}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="checkout-region">
                    <Form.Label>Región</Form.Label>
                    <Form.Select
                      name="region"
                      value={datos.region}
                      onChange={handleChange}
                      isInvalid={Boolean(errores.region)}
                    >
                      <option value="">Selecciona una región</option>
                      {REGIONES_CHILE.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="checkout-comuna">
                    <Form.Label>Comuna</Form.Label>
                    <Form.Select
                      name="comuna"
                      value={datos.comuna}
                      onChange={handleChange}
                      disabled={!datos.region}
                      isInvalid={Boolean(errores.comuna)}
                    >
                      <option value="">Selecciona una comuna</option>
                      {comunas.map((comuna) => (
                        <option key={comuna} value={comuna}>
                          {comuna}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Form.Check
              type="checkbox"
              id="checkout-simular-rechazo"
              name="simularRechazo"
              className="mt-4"
              label="Simular pago rechazado (modo demostración)"
              checked={datos.simularRechazo}
              onChange={handleChange}
            />

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button type="submit" className="btn btn-primary" data-testid="btn-confirmar-pago">
                💳 Confirmar y Pagar
              </button>
              <Link to="/carrito" className="btn btn-secondary">
                &larr; Volver al Carrito
              </Link>
            </div>
          </Form>
        </Col>

        <Col lg={5}>
          <ResumenPedido items={items} subtotal={subtotal} iva={iva} total={totalConIva} />
        </Col>
      </Row>
    </div>
  );
}

export default Checkout;
