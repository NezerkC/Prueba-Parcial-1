import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResumenPedido from './ResumenPedido';

const ITEMS = [
  { codigo: 'GE001', nombre: 'Guitarra Eléctrica', precio: 100000, cantidad: 2 },
  { codigo: 'AC001', nombre: 'Cable Plug', precio: 10000, cantidad: 1 },
];

describe('<ResumenPedido />', () => {
  it('lista cada producto recibido por props con su subtotal', () => {
    render(<ResumenPedido items={ITEMS} subtotal={210000} iva={39900} total={249900} />);

    expect(screen.getByTestId('resumen-item-GE001')).toHaveTextContent('Guitarra Eléctrica');
    expect(screen.getByTestId('resumen-item-GE001')).toHaveTextContent('$200.000');
    expect(screen.getByTestId('resumen-item-AC001')).toHaveTextContent('× 1');
  });

  it('muestra los totales y el título recibidos por props', () => {
    render(
      <ResumenPedido items={ITEMS} subtotal={210000} iva={39900} total={249900} titulo="Pedido no pagado" />
    );

    expect(screen.getByRole('heading', { name: 'Pedido no pagado' })).toBeInTheDocument();
    expect(screen.getByTestId('resumen-subtotal')).toHaveTextContent('$210.000');
    expect(screen.getByTestId('resumen-iva')).toHaveTextContent('$39.900');
    expect(screen.getByTestId('resumen-total')).toHaveTextContent('$249.900');
  });
});
