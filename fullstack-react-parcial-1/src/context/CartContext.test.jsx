import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { CartProvider, useCart } from './CartContext';

function TestConsumer() {
  const { items, addToCart, removeFromCart, totalUnidades, totalConIva } = useCart();
  return (
    <div>
      <span data-testid="cart-count">{totalUnidades}</span>
      <span data-testid="cart-total">{totalConIva}</span>
      <button
        onClick={() =>
          addToCart({ codigo: 'GA001', nombre: 'Guitarra Acustica', precio: 100000 })
        }
      >
        Agregar Guitarra
      </button>
      <button onClick={() => removeFromCart('GA001')}>Eliminar Guitarra</button>
      <ul>
        {items.map((i) => (
          <li key={i.codigo} data-testid={`item-${i.codigo}`}>
            {i.nombre} - Cantidad: {i.cantidad}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe('CartContext (Gestión de Estado Global)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('inicia con carrito vacio', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
  });

  it('agrega un producto y calcula subtotal + IVA (19%) correctamente', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    const boton = screen.getByRole('button', { name: /agregar guitarra/i });
    await user.click(boton);

    // 1 unidad, total = 100.000 + 19.000 = 119.000
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(screen.getByTestId('cart-total').textContent).toBe('119000');
    expect(screen.getByTestId('item-GA001')).toBeInTheDocument();
  });

  it('incrementa cantidad si el producto ya existia en el carrito', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    const boton = screen.getByRole('button', { name: /agregar guitarra/i });
    await user.click(boton);
    await user.click(boton);

    expect(screen.getByTestId('cart-count').textContent).toBe('2');
    expect(screen.getByTestId('item-GA001').textContent).toContain('Cantidad: 2');
  });
});
