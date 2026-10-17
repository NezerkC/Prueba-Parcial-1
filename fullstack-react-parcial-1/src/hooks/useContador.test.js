// Guía 2.3.2 - Prueba unitaria de custom hook con renderHook y act
import { test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useContador from './useContador';

test('incrementa, decrementa y reinicia el contador respetando límites', () => {
  const { result } = renderHook(() => useContador(1, { min: 1, max: 5 }));

  expect(result.current.contador).toBe(1);

  act(() => {
    result.current.incrementar();
  });
  expect(result.current.contador).toBe(2);

  act(() => {
    result.current.decrementar();
  });
  expect(result.current.contador).toBe(1);

  act(() => {
    result.current.incrementar();
    result.current.reiniciar();
  });
  expect(result.current.contador).toBe(1);
});
