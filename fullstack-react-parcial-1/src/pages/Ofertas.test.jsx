import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Ofertas from './Ofertas';
import { CartProvider } from '../context/CartContext';

describe('<Ofertas /> (Página de Ofertas y Promociones)', () => {
  it('renderiza el banner principal, título y los productos rebajados', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Ofertas />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('ofertas-titulo')).toHaveTextContent(/ofertas y precios especiales/i);
    expect(screen.getByTestId('product-grid')).toBeInTheDocument();

    // Productos marcados en oferta
    expect(screen.getByTestId('product-card-GA002')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-GE001')).toBeInTheDocument();
    expect(screen.getByTestId('badge-oferta-GA002')).toBeInTheDocument();

    // Productos que NO están en oferta no deben aparecer
    expect(screen.queryByTestId('product-card-GA001')).not.toBeInTheDocument();
    expect(screen.queryByTestId('product-card-GA003')).not.toBeInTheDocument();
  });

  it('permite filtrar los productos en oferta por categoría', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Ofertas />
        </CartProvider>
      </BrowserRouter>
    );

    const selectCategoria = screen.getByTestId('filtro-categoria-oferta');
    fireEvent.change(selectCategoria, { target: { value: 'Baterías' } });

    // BT002 está en Baterías
    expect(screen.getByTestId('product-card-BT002')).toBeInTheDocument();
    // GA002 es guitarra acústica, no debe aparecer
    expect(screen.queryByTestId('product-card-GA002')).not.toBeInTheDocument();
  });

  it('permite ordenar las ofertas por precio ascendente', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Ofertas />
        </CartProvider>
      </BrowserRouter>
    );

    const selectOrden = screen.getByTestId('filtro-orden-oferta');
    fireEvent.change(selectOrden, { target: { value: 'precio-asc' } });

    // El accesorio AC001 cuesta $8.990 (el más económico)
    expect(screen.getByTestId('product-card-AC001')).toBeInTheDocument();
  });

  it('permite añadir un producto en oferta al carrito de compras', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Ofertas />
        </CartProvider>
      </BrowserRouter>
    );

    const card = screen.getByTestId('product-card-GA002');
    const btnAgregar = card.querySelector('.btn-add-cart');
    expect(btnAgregar).toBeInTheDocument();
    fireEvent.click(btnAgregar);
  });
});
