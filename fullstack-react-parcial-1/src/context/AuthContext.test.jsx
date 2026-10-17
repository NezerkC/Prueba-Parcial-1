import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('inicializa sin usuario autenticado por defecto', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.usuario).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it('permite iniciar sesión como administrador con credenciales demo', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      const resp = result.current.login('admin@profesor.duoc.cl', '123456');
      expect(resp.exito).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.usuario?.nombre).toBe('Martín');
    expect(result.current.usuario?.rol).toBe('admin');
  });

  it('permite iniciar sesión como cliente y cerrar sesión', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      const resp = result.current.login('cliente@duoc.cl', 'pass12');
      expect(resp.exito).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.usuario).toBeNull();
  });

  it('rechaza credenciales incorrectas', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    let resp;
    act(() => {
      resp = result.current.login('erroneo@duoc.cl', 'clavefalsa');
    });

    expect(resp.exito).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });
});
