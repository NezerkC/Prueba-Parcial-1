import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';

function renderWithProviders(initialRoute = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<div>Panel Admin Mock</div>} />
          <Route path="/" element={<div>Home Mock</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('<Login />', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renderiza correctamente el formulario y campos de entrada', () => {
    renderWithProviders();

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.getByTestId('input-correo')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('btn-login-submit')).toBeInTheDocument();
    expect(screen.getByTestId('credenciales-demo')).toBeInTheDocument();
  });

  it('muestra mensajes de validación ante campos vacíos o inválidos', async () => {
    renderWithProviders();

    const submitBtn = screen.getByTestId('btn-login-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Ingresa un correo válido con dominio @duoc.cl/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/La contraseña debe tener estrictamente entre 4 y 10 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it('inicia sesión con credenciales de admin y redirige al panel admin', async () => {
    renderWithProviders();

    const inputCorreo = screen.getByTestId('input-correo');
    const inputPass = screen.getByTestId('input-password');
    const submitBtn = screen.getByTestId('btn-login-submit');

    fireEvent.change(inputCorreo, { target: { value: 'admin@profesor.duoc.cl' } });
    fireEvent.change(inputPass, { target: { value: '123456' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Panel Admin Mock')).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error cuando las credenciales no coinciden', async () => {
    renderWithProviders();

    const inputCorreo = screen.getByTestId('input-correo');
    const inputPass = screen.getByTestId('input-password');
    const submitBtn = screen.getByTestId('btn-login-submit');

    fireEvent.change(inputCorreo, { target: { value: 'usuario@gmail.com' } });
    fireEvent.change(inputPass, { target: { value: 'erronea1' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('login-server-error')).toBeInTheDocument();
      expect(
        screen.getByText(/Credenciales inválidas. Verifica tu correo y contraseña/i)
      ).toBeInTheDocument();
    });
  });
});
