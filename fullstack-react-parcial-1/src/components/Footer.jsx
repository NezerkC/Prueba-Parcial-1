import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="main-footer">
      <Container>
        <Row className="footer-grid gy-4">
          <Col md={6} lg={3} className="footer-col">
            <h4>Sonido Vivo</h4>
            <p>Tienda líder de instrumentos musicales, amplificación y microfonía.</p>
            <p>Dirección: Calle Valparaíso 740, Local 12, Chile.</p>
            <p>Tel: +56 32 268 9000 | Email: contacto@sonidovivo.cl</p>
          </Col>

          <Col md={6} lg={3} className="footer-col">
            <h4>Explorar</h4>
            <ul>
              <li>
                <Link to="/productos">Catálogo Completo</Link>
              </li>
              <li>
                <Link to="/nosotros">Quiénes Somos</Link>
              </li>
              <li>
                <Link to="/blogs">Blogs de Música</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto y Ubicación</Link>
              </li>
            </ul>
          </Col>

          <Col md={6} lg={3} className="footer-col">
            <h4>Atención al Cliente</h4>
            <ul>
              <li>
                <Link to="/login">Iniciar Sesión</Link>
              </li>
              <li>
                <Link to="/registro">Crear Cuenta</Link>
              </li>
              <li>
                <Link to="/carrito">Mi Carrito de Compras</Link>
              </li>
              <li>
                <Link to="/admin">Acceso Administrativo</Link>
              </li>
            </ul>
          </Col>

          <Col md={6} lg={3} className="footer-col">
            <h4>Horarios de Tienda</h4>
            <p>Lunes a Viernes: 10:00 - 19:30 hrs.</p>
            <p>Sábados: 10:30 - 14:30 hrs.</p>
            <p>Domingos y Feriados: Tienda online 24/7.</p>
          </Col>
        </Row>
      </Container>

      <Container className="footer-bottom">
        <p>
          &copy; 2026 Sonido Vivo Instrumentos Musicales — Proyecto DSY1104 FullStack II
          (Forma B). Desarrollado para Duoc UC.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
