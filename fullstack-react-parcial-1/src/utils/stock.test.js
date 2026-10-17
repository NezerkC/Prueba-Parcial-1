import { describe, it, expect } from 'vitest';
import { evaluarNivelStock } from './stock';

describe('Evaluador Semántico de Inventario y Stock Crítico', () => {
  it('debe retornar AGOTADO y badge-danger cuando el stock es menor o igual a cero', () => {
    const estado = evaluarNivelStock(0, 3);
    expect(estado.estado).toBe('AGOTADO');
    expect(estado.badgeCss).toBe('badge-danger');
    expect(estado.alertaCritica).toBe(true);
  });

  it('debe retornar CRÍTICO y badge-critical cuando el stock es positivo pero menor o igual al umbral', () => {
    const estado = evaluarNivelStock(3, 3);
    expect(estado.estado).toBe('CRÍTICO (3 un.)');
    expect(estado.badgeCss).toBe('badge-critical');
    expect(estado.alertaCritica).toBe(true);
  });

  it('debe retornar DISPONIBLE y badge-ok cuando el stock supera el umbral crítico', () => {
    const estado = evaluarNivelStock(8, 3);
    expect(estado.estado).toBe('DISPONIBLE (8 un.)');
    expect(estado.badgeCss).toBe('badge-ok');
    expect(estado.alertaCritica).toBe(false);
  });
});
