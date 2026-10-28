import { describe, it, expect, beforeEach } from 'vitest';
import {
  TIPOS_ENTREGA,
  ORDENES_STORAGE_KEY,
  crearOrden,
  generarNumeroOrden,
  validarDatosEnvio,
  guardarOrdenStorage,
  obtenerOrdenesStorage,
} from './checkout';

const DATOS_VALIDOS = {
  nombre: 'Danilo',
  apellidos: 'Sepúlveda',
  correo: 'danilo@duoc.cl',
  tipoEntrega: TIPOS_ENTREGA.DOMICILIO,
  direccion: 'Av. Libertad 1234',
  departamento: '',
  region: 'V',
  comuna: 'Viña del Mar',
};

describe('Reglas del checkout', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('no devuelve errores con datos de envío completos', () => {
    expect(validarDatosEnvio(DATOS_VALIDOS)).toEqual({});
  });

  it('exige nombre, apellidos y un correo válido', () => {
    const errores = validarDatosEnvio({ ...DATOS_VALIDOS, nombre: ' ', apellidos: '', correo: 'sin-arroba' });
    expect(Object.keys(errores)).toEqual(['nombre', 'apellidos', 'correo']);
  });

  it('exige dirección, región y comuna solo para despacho a domicilio', () => {
    const sinDireccion = { ...DATOS_VALIDOS, direccion: '', region: '', comuna: '' };

    expect(Object.keys(validarDatosEnvio(sinDireccion))).toEqual(['direccion', 'region', 'comuna']);
    expect(validarDatosEnvio({ ...sinDireccion, tipoEntrega: TIPOS_ENTREGA.RETIRO })).toEqual({});
  });

  it('genera el número de orden con el prefijo SV y 6 dígitos', () => {
    expect(generarNumeroOrden(new Date(1760000123456))).toBe('SV-123456');
  });

  it('crea la orden con los datos del cliente, los productos y los totales', () => {
    const items = [{ codigo: 'GE001', nombre: 'Guitarra', precio: 1000, cantidad: 2, marca: 'Fender' }];
    const orden = crearOrden({ datos: DATOS_VALIDOS, items, subtotal: 2000, iva: 380, total: 2380 });

    expect(orden.cliente).toEqual({ nombre: 'Danilo', apellidos: 'Sepúlveda', correo: 'danilo@duoc.cl' });
    expect(orden.entrega.comuna).toBe('Viña del Mar');
    expect(orden.items).toEqual([{ codigo: 'GE001', nombre: 'Guitarra', precio: 1000, cantidad: 2 }]);
    expect(orden.total).toBe(2380);
  });

  it('asocia la orden al usuario autenticado (RUT y correo)', () => {
    const items = [{ codigo: 'GE001', nombre: 'Guitarra', precio: 1000, cantidad: 1 }];
    const usuarioAuth = {
      rut: '19011022-K',
      correo: 'cliente@duoc.cl',
      nombre: 'Sebastián',
      apellidos: 'Valenzuela',
      rol: 'cliente',
    };

    const orden = crearOrden({
      datos: DATOS_VALIDOS,
      items,
      subtotal: 1000,
      iva: 190,
      total: 1190,
      usuario: usuarioAuth,
    });

    expect(orden.cliente.rut).toBe('19011022-K');
    expect(orden.usuario).toEqual({
      rut: '19011022-K',
      correo: 'cliente@duoc.cl',
      nombre: 'Sebastián Valenzuela',
      rol: 'cliente',
    });
  });

  it('persiste y recupera órdenes en localStorage asociadas al cliente', () => {
    const orden1 = {
      numero: 'SV-100001',
      usuario: { rut: '19011022-K', correo: 'cliente@duoc.cl' },
      total: 50000,
    };
    const orden2 = {
      numero: 'SV-100002',
      usuario: { rut: '12345678-5', correo: 'otro@duoc.cl' },
      total: 80000,
    };

    guardarOrdenStorage(orden1);
    guardarOrdenStorage(orden2);

    const todas = obtenerOrdenesStorage();
    expect(todas).toHaveLength(2);

    const filtradasPorRut = obtenerOrdenesStorage('19011022-K');
    expect(filtradasPorRut).toHaveLength(1);
    expect(filtradasPorRut[0].numero).toBe('SV-100001');

    const raw = JSON.parse(localStorage.getItem(ORDENES_STORAGE_KEY));
    expect(raw).toHaveLength(2);
  });
});
