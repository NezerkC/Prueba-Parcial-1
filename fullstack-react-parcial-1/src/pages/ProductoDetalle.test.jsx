import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import ProductoDetalle from './ProductoDetalle';
import { CartProvider } from '../context/CartContext';

function renderDetalle(codigo) {
  return render(
    <MemoryRouter initialEntries={[`/producto/${codigo}`]}>
      <CartProvider>
        <Routes>
          <Route path="/producto/:codigo" element={<ProductoDetalle />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );
}

describe('<ProductoDetalle />', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra la ficha del producto cuando el código existe', () => {
    renderDetalle('GE001');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Guitarra Eléctrica Stratocaster' })
    ).toBeInTheDocument();
    expect(screen.getByText('CÓD: GE001')).toBeInTheDocument();
    expect(screen.getByTestId('detalle-stock')).toHaveTextContent('5 unidades disponibles');
  });

  it('muestra la vista de producto no encontrado con un código inválido', () => {
    renderDetalle('XX999');

    expect(screen.getByRole('heading', { name: /Producto no encontrado/i })).toBeInTheDocument();
    expect(screen.getByText('XX999')).toBeInTheDocument();
  });

  it('no permite elegir más unidades que el stock disponible', async () => {
    const user = userEvent.setup();
    renderDetalle('GE001');

    const aumentar = screen.getByRole('button', { name: /Aumentar cantidad/i });
    for (let i = 0; i < 6; i += 1) {
      await user.click(aumentar);
    }

    expect(screen.getByTestId('det-cantidad')).toHaveTextContent('5');
    expect(aumentar).toBeDisabled();
  });

  it('agrega la cantidad elegida al carrito y muestra la confirmación', async () => {
    const user = userEvent.setup();
    renderDetalle('GE001');

    await user.click(screen.getByRole('button', { name: /Aumentar cantidad/i }));
    await user.click(screen.getByRole('button', { name: /Añadir al Carrito/i }));

    expect(screen.getByText(/Se agregaron 2 unidades/i)).toBeInTheDocument();
  });
});
