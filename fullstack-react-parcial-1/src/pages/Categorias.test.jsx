import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Categorias from './Categorias';
import CategoriaDetalle from './CategoriaDetalle';
import { CartProvider } from '../context/CartContext';

describe('<Categorias /> (Página de Categorías)', () => {
  it('renderiza el título principal y las tarjetas de las categorías del catálogo', () => {
    render(
      <BrowserRouter>
        <Categorias />
      </BrowserRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /categorías de instrumentos y audio/i })
    ).toBeInTheDocument();

    // Comprobar presencia de categorías clave
    expect(screen.getByText('Guitarras Acústicas')).toBeInTheDocument();
    expect(screen.getByText('Baterías')).toBeInTheDocument();
    expect(screen.getByText('Micrófonos')).toBeInTheDocument();
    expect(screen.getByText('Estudio y Grabación')).toBeInTheDocument();
  });

  it('permite filtrar categorías mediante el buscador interactivo', () => {
    render(
      <BrowserRouter>
        <Categorias />
      </BrowserRouter>
    );

    const input = screen.getByTestId('input-buscar-categoria');
    fireEvent.change(input, { target: { value: 'Baterías' } });

    expect(screen.getByText('Baterías')).toBeInTheDocument();
    expect(screen.queryByText('Guitarras Acústicas')).not.toBeInTheDocument();
  });

  it('muestra mensaje amigable cuando ninguna categoría coincide con la búsqueda', () => {
    render(
      <BrowserRouter>
        <Categorias />
      </BrowserRouter>
    );

    const input = screen.getByTestId('input-buscar-categoria');
    fireEvent.change(input, { target: { value: 'CategoriaInexistenteXYZ' } });

    expect(
      screen.getByText(/no encontramos categorías que coincidan/i)
    ).toBeInTheDocument();
  });
});

describe('<CategoriaDetalle /> (Vista de una categoría específica)', () => {
  it('muestra los productos pertenecientes a la categoría seleccionada reutilizando ProductGrid', () => {
    render(
      <MemoryRouter initialEntries={['/categorias/Guitarras%20Ac%C3%BAsticas']}>
        <CartProvider>
          <Routes>
            <Route path="/categorias/:categoria" element={<CategoriaDetalle />} />
          </Routes>
        </CartProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('categoria-titulo')).toHaveTextContent('Guitarras Acústicas');
    expect(screen.getByTestId('categoria-contador')).toHaveTextContent(/instrumentos y accesorios disponibles/i);
    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    // Productos de Guitarras Acústicas (ej: GA001, GA002)
    expect(screen.getByTestId('product-card-GA001')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-GA002')).toBeInTheDocument();
  });

  it('muestra estado vacío amigable cuando la categoría no existe o no tiene productos', () => {
    render(
      <MemoryRouter initialEntries={['/categorias/InstrumentosEspaciales99']}>
        <CartProvider>
          <Routes>
            <Route path="/categorias/:categoria" element={<CategoriaDetalle />} />
          </Routes>
        </CartProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('categoria-vacia')).toBeInTheDocument();
    expect(screen.getByText(/categoría no encontrada o sin stock/i)).toBeInTheDocument();
  });
});
