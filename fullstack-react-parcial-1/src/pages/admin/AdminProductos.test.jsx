import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import AdminProductos from './AdminProductos';
import { CLAVE_INVENTARIO_STORAGE } from '../../data/productos';

const INVENTARIO_PRUEBA = [
  {
    codigo: 'GA001',
    nombre: 'Guitarra Acústica Folk',
    marca: 'Yamaha',
    modelo: 'F310',
    categoria: 'Guitarras Acústicas',
    precio: 150000,
    stock: 10,
    stockCritico: 3,
    imagen: 'GA001.jpg',
  },
  {
    codigo: 'BA001',
    nombre: 'Bajo Eléctrico Jazz',
    marca: 'Fender',
    modelo: 'Jazz Bass',
    categoria: 'Bajos Eléctricos',
    precio: 600000,
    stock: 2,
    stockCritico: 3,
    imagen: 'BA001.jpg',
  },
];

function inventarioGuardado() {
  return JSON.parse(localStorage.getItem(CLAVE_INVENTARIO_STORAGE));
}

function renderAdmin() {
  return render(<AdminProductos />);
}

function escribir(container, id, valor) {
  fireEvent.change(container.querySelector(`#${id}`), { target: { value: valor } });
}

function completarFormulario(container, datos) {
  Object.entries(datos).forEach(([id, valor]) => escribir(container, id, valor));
}

describe('<AdminProductos /> (CRUD de inventario)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(CLAVE_INVENTARIO_STORAGE, JSON.stringify(INVENTARIO_PRUEBA));
  });

  it('lista los productos guardados en el inventario', () => {
    const { container } = renderAdmin();

    expect(container.querySelector('#fila-GA001')).toBeInTheDocument();
    expect(container.querySelector('#fila-BA001')).toBeInTheDocument();
    expect(screen.getByText(/2 productos/)).toBeInTheDocument();
  });

  it('crea un producto nuevo, lo muestra en la tabla y lo guarda en localStorage', () => {
    const { container } = renderAdmin();

    fireEvent.click(container.querySelector('#btn-nuevo-producto'));
    completarFormulario(container, {
      'input-codigo': 'TC010',
      'input-nombre': 'Teclado Digital 61 teclas',
      'select-categoria': 'Teclados y Pianos',
      'input-precio': '199990',
      'input-stock': '4',
    });
    fireEvent.click(container.querySelector('#btn-guardar-modal'));

    expect(container.querySelector('#fila-TC010')).toBeInTheDocument();
    expect(inventarioGuardado()).toHaveLength(3);
    expect(inventarioGuardado().find((p) => p.codigo === 'TC010').precio).toBe(199990);
  });

  it('edita un producto existente y actualiza sus datos', () => {
    const { container } = renderAdmin();

    fireEvent.click(container.querySelector('#btn-editar-GA001'));
    escribir(container, 'input-stock', '25');
    fireEvent.click(container.querySelector('#btn-guardar-modal'));

    expect(inventarioGuardado().find((p) => p.codigo === 'GA001').stock).toBe(25);
    expect(inventarioGuardado()).toHaveLength(2);
  });

  it('elimina un producto tras confirmar', () => {
    const { container } = renderAdmin();

    fireEvent.click(container.querySelector('#btn-eliminar-BA001'));
    fireEvent.click(container.querySelector('#btn-confirmar-eliminar'));

    expect(container.querySelector('#fila-BA001')).not.toBeInTheDocument();
    expect(inventarioGuardado().map((p) => p.codigo)).toEqual(['GA001']);
  });

  it('muestra errores y no guarda cuando el código es corto, el nombre muy largo o el precio negativo', () => {
    const { container } = renderAdmin();

    fireEvent.click(container.querySelector('#btn-nuevo-producto'));
    completarFormulario(container, {
      'input-codigo': 'A',
      'input-nombre': 'x'.repeat(101),
      'select-categoria': 'Accesorios',
      'input-precio': '-1',
      'input-stock': '1',
    });
    fireEvent.click(container.querySelector('#btn-guardar-modal'));

    const modal = within(container.querySelector('#modal-producto-overlay'));
    expect(modal.getByText('Mínimo 3 caracteres')).toBeInTheDocument();
    expect(modal.getByText('Máximo 100 caracteres')).toBeInTheDocument();
    expect(modal.getByText('Precio inválido')).toBeInTheDocument();
    expect(inventarioGuardado()).toHaveLength(2);
  });

  it('acepta un producto con precio 0', () => {
    const { container } = renderAdmin();

    fireEvent.click(container.querySelector('#btn-nuevo-producto'));
    completarFormulario(container, {
      'input-codigo': 'AC099',
      'input-nombre': 'Púa de regalo',
      'select-categoria': 'Accesorios',
      'input-precio': '0',
      'input-stock': '100',
    });
    fireEvent.click(container.querySelector('#btn-guardar-modal'));

    expect(container.querySelector('#fila-AC099')).toBeInTheDocument();
  });
});
