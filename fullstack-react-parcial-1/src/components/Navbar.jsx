import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { totalUnidades } = useCart();
  const { usuario, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <Navbar expand="lg" data-bs-theme="dark" className="main-header py-2">
      <Container className="header-content">
        <Navbar.Brand
          as={Link}
          to="/"
          className="logo"
          aria-label="Ir a página de inicio de Sonido Vivo"
        >
          <img
            src="/assets/img/logo.svg"
            alt="Sonido Vivo - Instrumentos Musicales y Audio"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="mx-auto main-nav">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/productos">
              Catálogo
            </Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">
              Nosotros
            </Nav.Link>
            <Nav.Link as={NavLink} to="/blogs">
              Blogs
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">
              Contacto
            </Nav.Link>
          </Nav>

          <div className="header-actions mt-3 mt-lg-0 d-flex align-items-center">
            {isAuthenticated ? (
              <div className="d-flex align-items-center me-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="btn btn-outline-warning btn-sm me-2 fw-semibold"
                    data-testid="navbar-admin-link"
                  >
                    Panel Admin
                  </Link>
                )}
                <span className="me-2 small fw-semibold text-dark" data-testid="navbar-user-greeting">
                  Hola, {usuario?.nombre}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="btn btn-outline-secondary btn-sm"
                  data-testid="navbar-logout-btn"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-secondary btn-sm me-2" data-testid="navbar-login-link">
                Ingresar
              </Link>
            )}

            <Link
              to="/carrito"
              className="cart-btn"
              aria-label="Ver carrito de compras"
            >
              <svg
                className="cart-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span id="cart-count" className="cart-badge" data-testid="navbar-cart-count">
                {totalUnidades}
              </span>
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
