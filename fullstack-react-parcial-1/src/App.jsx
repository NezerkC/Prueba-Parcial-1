import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Route, Routes, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import Navigation from './components/Navbar';
import CartToast from './components/CartToast';
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Categorias from './pages/Categorias';
import CategoriaDetalle from './pages/CategoriaDetalle';
import Ofertas from './pages/Ofertas';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Blogs from './pages/Blogs';
import BlogDetalle from './pages/BlogDetalle';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import CompraExitosa from './pages/CompraExitosa';
import PagoFallido from './pages/PagoFallido';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductos from './pages/admin/AdminProductos';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function RutaAdmin({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />;
  return children;
}

RutaAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

function RutaCliente({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login?redirect=/checkout" replace />;
  return children;
}

RutaCliente.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navigation />

          <Container as="main" className="page-content flex-grow-1 py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categorias/:categoria" element={<CategoriaDetalle />} />
              <Route path="/ofertas" element={<Ofertas />} />
              <Route path="/producto/:codigo" element={<ProductoDetalle />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetalle />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<RutaCliente><Checkout /></RutaCliente>} />
              <Route path="/compra-exitosa" element={<CompraExitosa />} />
              <Route path="/pago-fallido" element={<PagoFallido />} />
              <Route path="/admin" element={<RutaAdmin><AdminDashboard /></RutaAdmin>} />
              <Route path="/admin/productos" element={<RutaAdmin><AdminProductos /></RutaAdmin>} />
              <Route path="/admin/usuarios" element={<RutaAdmin><AdminUsuarios /></RutaAdmin>} />
            </Routes>
          </Container>

          <Footer />
          <CartToast />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
