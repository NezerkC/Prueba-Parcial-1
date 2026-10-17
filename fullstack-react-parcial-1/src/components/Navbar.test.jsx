import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import Navigation from './Navbar';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

const CLAVE_SESION = 'sonido_vivo_auth_v1';

function renderNavbar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Navigation />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('<Navbar />', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra el botón Ingresar cuando no hay sesión iniciada', () => {
    renderNavbar();

    expect(screen.getByTestId('navbar-login-link')).toHaveAttribute('href', '/login');
    expect(screen.queryByTestId('navbar-user-greeting')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navbar-admin-link')).not.toBeInTheDocument();
  });

  it('muestra el saludo y el acceso al panel cuando inicia sesión un administrador', () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: 'Martín', rol: 'admin' }));
    renderNavbar();

    expect(screen.getByTestId('navbar-user-greeting')).toHaveTextContent('Hola, Martín');
    expect(screen.getByTestId('navbar-admin-link')).toBeInTheDocument();
    expect(screen.queryByTestId('navbar-login-link')).not.toBeInTheDocument();
  });

  it('oculta el panel admin a un cliente y cierra la sesión al hacer clic en Salir', async () => {
    const user = userEvent.setup();
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: 'Camila', rol: 'cliente' }));
    renderNavbar();

    expect(screen.getByTestId('navbar-user-greeting')).toHaveTextContent('Hola, Camila');
    expect(screen.queryByTestId('navbar-admin-link')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('navbar-logout-btn'));

    expect(screen.getByTestId('navbar-login-link')).toBeInTheDocument();
    expect(screen.queryByTestId('navbar-user-greeting')).not.toBeInTheDocument();
  });

  it('muestra el contador del carrito en 0 al iniciar', () => {
    renderNavbar();

    expect(screen.getByTestId('navbar-cart-count')).toHaveTextContent('0');
  });
});
