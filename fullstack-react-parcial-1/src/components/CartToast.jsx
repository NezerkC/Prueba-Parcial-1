import { Toast, ToastContainer } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

// Aviso flotante al agregar productos (equivale a mostrarNotificacionToast de carrito.js)
const DURACION_MS = 2500;

function CartToast() {
  const { toastMensaje, clearToast } = useCart();

  return (
    <ToastContainer position="bottom-end" className="p-4 cart-toast-container">
      <Toast
        show={Boolean(toastMensaje)}
        onClose={clearToast}
        delay={DURACION_MS}
        autohide
        className="cart-toast"
      >
        <Toast.Body role="status">{toastMensaje}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default CartToast;
