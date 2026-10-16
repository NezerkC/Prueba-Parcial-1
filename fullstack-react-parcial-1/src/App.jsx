import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navigation from './components/Navbar';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Login from './pages/Login';
import Registro from './pages/Registro';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

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
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
            </Routes>
          </Container>

          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
