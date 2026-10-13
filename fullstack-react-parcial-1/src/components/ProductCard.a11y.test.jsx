// Guía 2.3.3 - Paso 11: Prueba de accesibilidad automatizada con jest-axe
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import { CartProvider } from '../context/CartContext';

describe('<ProductCard /> - Auditoría de Accesibilidad (jest-axe)', () => {
  it('no presenta violaciones de accesibilidad automatizadas', async () => {
    const { container } = render(
      <BrowserRouter>
        <CartProvider>
          <ProductCard
            producto={{
              codigo: 'GA001',
              imagen: '/assets/img/GA001.jpg',
              categoria: 'Guitarras Acústicas',
              nombre: 'Guitarra Acústica Folk',
              marca: 'Yamaha',
              modelo: 'F310',
              precio: 129990,
            }}
          />
        </CartProvider>
      </BrowserRouter>
    );

    const resultados = await axe(container);
    expect(resultados).toHaveNoViolations();
  });
});
