import { describe, it, expect } from 'vitest';
import { TIPOS_ENTREGA, crearOrden, generarNumeroOrden, validarDatosEnvio } from './checkout';

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
});
