import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navigation from './components/Navbar';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Blogs from './pages/Blogs';
import BlogDetalle from './pages/BlogDetalle';
import Home from './pages/Home';
import Productos from './pages/Productos';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navigation />

        <Container as="main" className="page-content flex-grow-1 py-4">
           <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetalle />} />
          </Routes>
        </Container>

        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
