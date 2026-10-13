// Guía 2.3.2 / 2.3.3: Medición de tiempos de renderizado con performance.now()
import { test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductGrid from './components/ProductGrid';
import { CartProvider } from './context/CartContext';
import { PRODUCTOS_SONIDO_VIVO } from './data/productos';

test('renderiza el catálogo de productos rápidamente', () => {
  const inicio = performance.now();
  render(
    <BrowserRouter>
      <CartProvider>
        <ProductGrid productos={PRODUCTOS_SONIDO_VIVO.slice(0, 12)} />
      </CartProvider>
    </BrowserRouter>
  );
  const fin = performance.now();
  expect(fin - inicio).toBeLessThan(500);
});
