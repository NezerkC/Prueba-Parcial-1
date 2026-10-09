import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import { CartProvider } from '../context/CartContext';

describe('<ProductCard />', () => {
  const mockProducto = {
    codigo: 'GE001',
    nombre: 'Guitarra Electrica Stratocaster',
    marca: 'Fender',
    modelo: 'Player Series',
    categoria: 'Cuerdas',
    precio: 749990,
  };

  it('renderiza la informacion del producto, codigo y precio formateado', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ProductCard producto={mockProducto} />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Guitarra Electrica Stratocaster')).toBeInTheDocument();
    expect(screen.getByText(/CÓD: GE001/i)).toBeInTheDocument();
    expect(screen.getByText('$749.990')).toBeInTheDocument();
  });

  it('dispara el callback onAddToCart cuando se hace clic', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();

    render(
      <BrowserRouter>
        <CartProvider>
          <ProductCard producto={mockProducto} onAddToCart={mockOnAdd} />
        </CartProvider>
      </BrowserRouter>
    );

    const boton = screen.getByRole('button', { name: /añadir al carro/i });
    await user.click(boton);

    expect(mockOnAdd).toHaveBeenCalledWith(mockProducto);
  });
});
