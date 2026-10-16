import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navigation from './components/Navbar';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navigation />

        <Container as="main" className="page-content flex-grow-1 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </Container>

        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
