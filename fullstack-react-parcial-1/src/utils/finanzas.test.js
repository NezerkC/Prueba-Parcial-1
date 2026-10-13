import { describe, it, expect } from 'vitest';
import { calcularTotalesFinancieros, formatearPrecioCLP } from './finanzas';

describe('Motor Financiero y Desglose Tributario (IVA 19%)', () => {
  it('debe calcular $0 cuando el carrito está vacío', () => {
    const resultado = calcularTotalesFinancieros([]);
    expect(resultado).toEqual({
      subtotalNeto: 0,
      iva: 0,
      costoDespacho: 0,
      total: 0,
    });
  });

  it('debe calcular exactamente el neto, el 19% de IVA y el total acumulado', () => {
    const items = [
      { precio: 100000, cantidad: 2 },
      { precio: 50000, cantidad: 1 },
    ];
    const resultado = calcularTotalesFinancieros(items);
    expect(resultado.subtotalNeto).toBe(250000);
    expect(resultado.iva).toBe(47500);
    expect(resultado.costoDespacho).toBe(0);
    expect(resultado.total).toBe(297500);
  });

  it('debe redondear el IVA a números enteros sin decimales flotantes', () => {
    const items = [{ precio: 129990, cantidad: 1 }];
    const resultado = calcularTotalesFinancieros(items);
    expect(resultado.iva).toBe(24698);
    expect(resultado.total).toBe(129990 + 24698);
  });

  it('debe formatear montos en pesos chilenos según norma local', () => {
    expect(formatearPrecioCLP(129990)).toMatch(/\$129\.990/);
    expect(formatearPrecioCLP(0)).toBe('Gratis');
  });
});
