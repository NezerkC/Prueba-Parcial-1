import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Carrito from './Carrito';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

const STORAGE_KEY = 'sonido_vivo_carrito_v1';
const AUTH_KEY = 'sonido_vivo_auth_v1';

function renderCarrito(initialItems = []) {
  if (initialItems.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialItems));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }

  return render(
    <MemoryRouter initialEntries={['/carrito']}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/productos" element={<div>Página de Catálogo Mock</div>} />
            <Route path="/checkout" element={<div>Checkout Mock</div>} />
            <Route path="/login" element={<div>Login Mock</div>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('<Carrito />', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra la vista de carrito vacío cuando no hay artículos agregados', () => {
    renderCarrito([]);

    expect(screen.getByTestId('cart-empty-view')).toBeInTheDocument();
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
    expect(screen.getByTestId('btn-ir-catalogo')).toBeInTheDocument();
  });

  it('renderiza la tabla y resumen de orden cuando hay productos', () => {
    const productosDemo = [
      {
        codigo: 'GE001',
        nombre: 'Fender Stratocaster Player',
        marca: 'Fender',
        precio: 850000,
        cantidad: 1,
      },
    ];

    renderCarrito(productosDemo);

    expect(screen.getByTestId('cart-page')).toBeInTheDocument();
    expect(screen.getByText('Fender Stratocaster Player')).toBeInTheDocument();
    expect(screen.getByTestId('summary-subtotal')).toBeInTheDocument();
    expect(screen.getByTestId('summary-iva')).toBeInTheDocument();
    expect(screen.getByTestId('summary-total')).toBeInTheDocument();
  });

  it('permite modificar la cantidad de un ítem con los botones + y -', async () => {
    const productosDemo = [
      {
        codigo: 'GE001',
        nombre: 'Fender Stratocaster',
        marca: 'Fender',
        precio: 100000,
        cantidad: 1,
      },
    ];

    renderCarrito(productosDemo);

    expect(screen.getByTestId('qty-val-GE001')).toHaveTextContent('1');

    const btnAumentar = screen.getByTestId('btn-aumentar-GE001');
    fireEvent.click(btnAumentar);

    await waitFor(() => {
      expect(screen.getByTestId('qty-val-GE001')).toHaveTextContent('2');
    });

    const btnDisminuir = screen.getByTestId('btn-disminuir-GE001');
    fireEvent.click(btnDisminuir);

    await waitFor(() => {
      expect(screen.getByTestId('qty-val-GE001')).toHaveTextContent('1');
    });
  });

  it('permite eliminar un ítem del carrito individualmente', async () => {
    const productosDemo = [
      {
        codigo: 'BA001',
        nombre: 'Bajo Yamaha TRBX',
        marca: 'Yamaha',
        precio: 450000,
        cantidad: 1,
      },
    ];

    renderCarrito(productosDemo);

    expect(screen.getByText('Bajo Yamaha TRBX')).toBeInTheDocument();

    const btnEliminar = screen.getByTestId('btn-eliminar-BA001');
    fireEvent.click(btnEliminar);

    await waitFor(() => {
      expect(screen.queryByText('Bajo Yamaha TRBX')).not.toBeInTheDocument();
      expect(screen.getByTestId('cart-empty-view')).toBeInTheDocument();
    });
  });

  it('abre el modal y vacía todo el carro tras confirmar', async () => {
    const productosDemo = [
      {
        codigo: 'TE001',
        nombre: 'Teclado Roland GO:KEYS',
        marca: 'Roland',
        precio: 320000,
        cantidad: 1,
      },
    ];

    renderCarrito(productosDemo);

    const btnVaciar = screen.getByTestId('btn-vaciar-carro');
    fireEvent.click(btnVaciar);

    await waitFor(() => {
      expect(screen.getByText(/¿Vaciar Carrito de Compras\?/i)).toBeInTheDocument();
    });

    const btnConfirmar = screen.getByTestId('btn-confirmar-vaciar');
    fireEvent.click(btnConfirmar);

    await waitFor(() => {
      expect(screen.getByTestId('cart-empty-view')).toBeInTheDocument();
    });
  });

  it('redirige a /login cuando un usuario sin sesión intenta continuar al checkout', async () => {
    const productosDemo = [
      {
        codigo: 'MI001',
        nombre: 'Micrófono Shure SM58',
        marca: 'Shure',
        precio: 120000,
        cantidad: 1,
      },
    ];

    renderCarrito(productosDemo);

    expect(screen.getByTestId('aviso-auth-checkout')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('btn-finalizar-compra'));

    await waitFor(() => {
      expect(screen.getByText('Login Mock')).toBeInTheDocument();
    });
  });

  it('lleva al checkout al hacer clic en Continuar al Checkout cuando el usuario tiene sesión activa', async () => {
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ rut: '19011022-K', correo: 'cliente@duoc.cl', rol: 'cliente' })
    );

    const productosDemo = [
      {
        codigo: 'MI001',
        nombre: 'Micrófono Shure SM58',
        marca: 'Shure',
        precio: 120000,
        cantidad: 1,
      },
    ];

    renderCarrito(productosDemo);

    expect(screen.queryByTestId('aviso-auth-checkout')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('btn-finalizar-compra'));

    await waitFor(() => {
      expect(screen.getByText('Checkout Mock')).toBeInTheDocument();
    });
  });
});
