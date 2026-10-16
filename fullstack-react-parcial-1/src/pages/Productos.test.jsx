import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CartProvider } from '../context/CartContext';
import Productos from './Productos';

function renderConProviders(ui) {
  return render(
    <BrowserRouter>
      <CartProvider>{ui}</CartProvider>
    </BrowserRouter>
  );
}

describe('<Productos /> (Página de Catálogo)', () => {
  it('renderiza el título, buscador y la grilla inicial de productos', () => {
    renderConProviders(<Productos />);

    expect(
      screen.getByRole('heading', { name: /catálogo de instrumentos y audio/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('chip-todas')).toBeInTheDocument();
    expect(screen.getByTestId('products-grid')).toBeInTheDocument();
  });

  it('filtra productos por texto ingresado en el buscador en tiempo real', async () => {
    const user = userEvent.setup();
    renderConProviders(<Productos />);

    const input = screen.getByTestId('search-input');
    await user.type(input, 'Yamaha');

    expect(input).toHaveValue('Yamaha');
    const productos = screen.getAllByRole('article');
    expect(productos.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Yamaha/i).length).toBeGreaterThan(0);
  });

  it('filtra por chip de categoría al hacer clic', async () => {
    const user = userEvent.setup();
    renderConProviders(<Productos />);

    const chipGuitarras = screen.getByTestId('chip-guitarras-acústicas');
    await user.click(chipGuitarras);

    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('muestra mensaje amigable cuando no hay resultados coincidentes', async () => {
    const user = userEvent.setup();
    renderConProviders(<Productos />);

    const input = screen.getByTestId('search-input');
    await user.type(input, 'termino_inexistente_xyz_123');

    expect(screen.getByTestId('no-products-message')).toBeInTheDocument();
    expect(screen.getByText(/no encontramos instrumentos para tu búsqueda/i)).toBeInTheDocument();
  });
});
