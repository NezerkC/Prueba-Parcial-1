import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import AdminDashboard from './AdminDashboard';
import { AuthProvider } from '../../context/AuthContext';
import { CLAVE_INVENTARIO_STORAGE } from '../../data/productos';

const INVENTARIO_PRUEBA = [
  { codigo: 'GA001', nombre: 'Guitarra Folk', categoria: 'Guitarras Acústicas', precio: 100000, stock: 10, stockCritico: 3 },
  { codigo: 'BA001', nombre: 'Bajo Jazz', categoria: 'Bajos Eléctricos', precio: 500000, stock: 2, stockCritico: 3 },
  { codigo: 'AC001', nombre: 'Cable Plug', categoria: 'Accesorios', precio: 10000, stock: 0, stockCritico: 5 },
];

function renderDashboard() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AdminDashboard />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('<AdminDashboard /> (KPIs de inventario)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(CLAVE_INVENTARIO_STORAGE, JSON.stringify(INVENTARIO_PRUEBA));
  });

  it('calcula los KPIs a partir del inventario guardado', () => {
    const { container } = renderDashboard();

    expect(container.querySelector('#kpi-productos')).toHaveTextContent('3');
    expect(container.querySelector('#kpi-unidades')).toHaveTextContent('12');
    expect(container.querySelector('#kpi-valoracion')).toHaveTextContent('$2.000.000');
  });

  it('cuenta y lista los productos en stock crítico', () => {
    const { container } = renderDashboard();

    expect(container.querySelector('#kpi-criticos')).toHaveTextContent('2');
    const tabla = container.querySelector('#tabla-stock-critico');
    expect(tabla).toHaveTextContent('BA001');
    expect(tabla).toHaveTextContent('AC001');
    expect(tabla).not.toHaveTextContent('GA001');
  });
});
