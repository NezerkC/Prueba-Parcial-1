import { Container } from 'react-bootstrap';
import { Route, Routes, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import Navigation from './components/Navbar';
import CartToast from './components/CartToast';
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Blogs from './pages/Blogs';
import BlogDetalle from './pages/BlogDetalle';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductos from './pages/admin/AdminProductos';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function RutaAdmin({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />;
  return children;
}

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
              <Route path="/producto/:codigo" element={<ProductoDetalle />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetalle />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/admin" element={<RutaAdmin><AdminDashboard /></RutaAdmin>} />
              <Route path="/admin/productos" element={<RutaAdmin><AdminProductos /></RutaAdmin>} />
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

