import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('<App /> (Integración del Layout y Home)', () => {
  it('renderiza la barra de navegacion con la marca y el carrito', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /ir a página de inicio/i })).toBeInTheDocument();
    expect(screen.getByTestId('navbar-cart-count')).toHaveTextContent('0');
  });

  it('renderiza la seccion hero y los instrumentos destacados', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText(/Tu Sonido, Tu Pasión/i)).toBeInTheDocument();
    expect(screen.getByText(/Instrumentos Destacados/i)).toBeInTheDocument();
    expect(screen.getByText(/Despacho a Todo Chile/i)).toBeInTheDocument();
  });
});
