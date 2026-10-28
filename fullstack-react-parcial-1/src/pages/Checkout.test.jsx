import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import Checkout from './Checkout';
import CompraExitosa from './CompraExitosa';
import PagoFallido from './PagoFallido';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ORDENES_STORAGE_KEY } from '../utils/checkout';

const CLAVE_CARRITO = 'sonido_vivo_carrito_v1';
const CLAVE_SESION = 'sonido_vivo_auth_v1';
const CARRITO_PRUEBA = [
  { codigo: 'GE001', nombre: 'Guitarra Eléctrica Stratocaster', precio: 100000, cantidad: 1 },
];

const USUARIO_SESION_BASE = {
  rut: '19011022-K',
  nombre: '',
  apellidos: '',
  correo: '',
  rol: 'cliente',
};

function renderCheckout() {
  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/carrito" element={<div>Carrito Mock</div>} />
            <Route path="/login" element={<div>Login Mock</div>} />
            <Route path="/compra-exitosa" element={<CompraExitosa />} />
            <Route path="/pago-fallido" element={<PagoFallido />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

async function completarDatosValidos(user) {
  await user.type(screen.getByLabelText('Nombre'), 'Danilo');
  await user.type(screen.getByLabelText('Apellidos'), 'Sepúlveda');
  await user.type(screen.getByLabelText('Correo'), 'danilo@duoc.cl');
  await user.type(screen.getByLabelText('Calle y número'), 'Av. Libertad 1234');
  await user.selectOptions(screen.getByLabelText('Región'), 'V');
  await user.selectOptions(screen.getByLabelText('Comuna'), 'Viña del Mar');
}

describe('<Checkout />', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(CARRITO_PRUEBA));
    localStorage.setItem(CLAVE_SESION, JSON.stringify(USUARIO_SESION_BASE));
  });

  it('redirige al carrito cuando no hay productos', () => {
    localStorage.removeItem(CLAVE_CARRITO);
    renderCheckout();

    expect(screen.getByText('Carrito Mock')).toBeInTheDocument();
  });

  it('redirige a /login cuando el usuario no está autenticado', () => {
    localStorage.removeItem(CLAVE_SESION);
    renderCheckout();

    expect(screen.getByText('Login Mock')).toBeInTheDocument();
  });

  it('muestra el formulario y el resumen del pedido con los totales', () => {
    renderCheckout();

    expect(screen.getByRole('form', { name: 'Datos de envío' })).toBeInTheDocument();
    expect(screen.getByTestId('resumen-item-GE001')).toBeInTheDocument();
    expect(screen.getByTestId('resumen-total')).toHaveTextContent('$119.000');
  });

  it('muestra errores de validación y no avanza con el formulario vacío', async () => {
    const user = userEvent.setup();
    renderCheckout();

    await user.click(screen.getByTestId('btn-confirmar-pago'));

    expect(screen.getByText(/Nombre requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/Ingresa un correo válido/i)).toBeInTheDocument();
    expect(screen.getByText(/La dirección es obligatoria/i)).toBeInTheDocument();
    expect(screen.getByTestId('checkout-page')).toBeInTheDocument();
  });

  it('habilita la comuna solo después de elegir una región', async () => {
    const user = userEvent.setup();
    renderCheckout();

    expect(screen.getByLabelText('Comuna')).toBeDisabled();
    await user.selectOptions(screen.getByLabelText('Región'), 'V');

    expect(screen.getByLabelText('Comuna')).toBeEnabled();
    expect(screen.getByRole('option', { name: 'Viña del Mar' })).toBeInTheDocument();
  });

  it('oculta la dirección cuando se elige retiro en tienda', async () => {
    const user = userEvent.setup();
    renderCheckout();

    await user.click(screen.getByLabelText(/Retiro en tienda/i));

    expect(screen.queryByTestId('checkout-direccion')).not.toBeInTheDocument();
  });

  it('completa automáticamente los datos cuando hay sesión iniciada', () => {
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({
        nombre: 'Camila',
        apellidos: 'Reyes',
        correo: 'usuario@gmail.com',
        direccion: 'Santa Isabel 450',
        region: 'RM',
        comuna: 'Santiago',
        rol: 'cliente',
      })
    );
    renderCheckout();

    expect(screen.getByLabelText('Nombre')).toHaveValue('Camila');
    expect(screen.getByLabelText('Correo')).toHaveValue('usuario@gmail.com');
    expect(screen.getByLabelText('Calle y número')).toHaveValue('Santa Isabel 450');
    expect(screen.getByLabelText('Comuna')).toHaveValue('Santiago');
  });

  it('con pago aprobado muestra la compra exitosa y vacía el carrito', async () => {
    const user = userEvent.setup();
    renderCheckout();

    await completarDatosValidos(user);
    await user.click(screen.getByTestId('btn-confirmar-pago'));

    expect(screen.getByTestId('compra-exitosa')).toBeInTheDocument();
    expect(screen.getByTestId('numero-orden')).toHaveTextContent(/^SV-\d{6}$/);
    expect(screen.getByTestId('entrega-descripcion')).toHaveTextContent(
      'Av. Libertad 1234, Viña del Mar, Valparaíso'
    );
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toEqual([]);

    // Verifica persistencia en localStorage de la orden asociada al cliente
    const ordenesGuardadas = JSON.parse(localStorage.getItem(ORDENES_STORAGE_KEY));
    expect(ordenesGuardadas).toHaveLength(1);
    expect(ordenesGuardadas[0].usuario.rut).toBe('19011022-K');
    expect(screen.getByTestId('confirmacion-cuenta-asociada')).toHaveTextContent(
      '19011022-K'
    );
  });

  it('con pago rechazado muestra el pago fallido y conserva el carrito', async () => {
    const user = userEvent.setup();
    renderCheckout();

    await completarDatosValidos(user);
    await user.click(screen.getByLabelText(/Simular pago rechazado/i));
    await user.click(screen.getByTestId('btn-confirmar-pago'));

    expect(screen.getByTestId('pago-fallido')).toBeInTheDocument();
    expect(screen.getByTestId('btn-reintentar-pago')).toHaveAttribute('href', '/checkout');
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toHaveLength(1);
  });
});
