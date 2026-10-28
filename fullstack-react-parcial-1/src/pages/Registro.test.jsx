import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Registro from './Registro';
import { AuthProvider } from '../context/AuthContext';

function renderWithProviders(initialRoute = '/registro') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/checkout" element={<div>Checkout Mock</div>} />
          <Route path="/" element={<div>Home Mock</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('<Registro />', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renderiza todos los campos de formulario y selector de regiones', () => {
    renderWithProviders();

    expect(screen.getByTestId('registro-page')).toBeInTheDocument();
    expect(screen.getByTestId('input-registro-rut')).toBeInTheDocument();
    expect(screen.getByTestId('input-registro-nombre')).toBeInTheDocument();
    expect(screen.getByTestId('input-registro-apellidos')).toBeInTheDocument();
    expect(screen.getByTestId('input-registro-correo')).toBeInTheDocument();
    expect(screen.getByTestId('input-registro-clave')).toBeInTheDocument();
    expect(screen.getByTestId('select-registro-region')).toBeInTheDocument();
    expect(screen.getByTestId('select-registro-comuna')).toBeInTheDocument();
    expect(screen.getByTestId('input-registro-direccion')).toBeInTheDocument();
    expect(screen.getByTestId('btn-registro-submit')).toBeInTheDocument();
  });

  it('mantiene deshabilitado el selector de comunas hasta elegir una región', () => {
    renderWithProviders();

    const selectRegion = screen.getByTestId('select-registro-region');
    const selectComuna = screen.getByTestId('select-registro-comuna');

    expect(selectComuna).toBeDisabled();

    // Seleccionar región Valparaíso (id 'V')
    fireEvent.change(selectRegion, { target: { value: 'V' } });

    expect(selectComuna).not.toBeDisabled();
    expect(screen.getByRole('option', { name: /Viña del Mar/i })).toBeInTheDocument();
  });

  it('valida el algoritmo Módulo 11 en el campo RUN/RUT', async () => {
    renderWithProviders();

    const inputRut = screen.getByTestId('input-registro-rut');
    const submitBtn = screen.getByTestId('btn-registro-submit');

    // RUT inválido (el DV para 11111111 es 1, por lo que 9 es inválido)
    fireEvent.change(inputRut, { target: { value: '11111111-9' } });
    fireEvent.blur(inputRut);

    await waitFor(() => {
      expect(
        screen.getByText(/Debe tener entre 7 y 9 dígitos con dígito verificador válido/i)
      ).toBeInTheDocument();
    });

    fireEvent.click(submitBtn);

    // No debe enviar con RUT inválido
    expect(screen.queryByText('Home Mock')).not.toBeInTheDocument();
  });

  it('permite registrar un usuario nuevo válido y redirigir a Home', async () => {
    renderWithProviders();

    fireEvent.change(screen.getByTestId('input-registro-rut'), {
      target: { value: '19011029K' },
    });
    fireEvent.blur(screen.getByTestId('input-registro-rut'));

    fireEvent.change(screen.getByTestId('input-registro-nombre'), {
      target: { value: 'Carlos' },
    });
    fireEvent.change(screen.getByTestId('input-registro-apellidos'), {
      target: { value: 'Santana' },
    });
    fireEvent.change(screen.getByTestId('input-registro-correo'), {
      target: { value: 'csantana@duoc.cl' },
    });
    fireEvent.change(screen.getByTestId('input-registro-clave'), {
      target: { value: 'clave123' },
    });
    fireEvent.change(screen.getByTestId('input-registro-confirmar-clave'), {
      target: { value: 'clave123' },
    });

    // Cascada Región -> Comuna
    fireEvent.change(screen.getByTestId('select-registro-region'), {
      target: { value: 'V' },
    });
    fireEvent.change(screen.getByTestId('select-registro-comuna'), {
      target: { value: 'Viña del Mar' },
    });

    fireEvent.change(screen.getByTestId('input-registro-direccion'), {
      target: { value: 'Av. Marina 400' },
    });

    fireEvent.click(screen.getByTestId('btn-registro-submit'));

    await waitFor(() => {
      expect(screen.getByText('Home Mock')).toBeInTheDocument();
    });
  });

  it('tras registrarse con parámetro ?redirect=/checkout navega directamente al checkout', async () => {
    renderWithProviders('/registro?redirect=/checkout');

    expect(screen.getByTestId('alerta-registro-redirect-checkout')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('input-registro-rut'), {
      target: { value: '19011029K' },
    });
    fireEvent.blur(screen.getByTestId('input-registro-rut'));

    fireEvent.change(screen.getByTestId('input-registro-nombre'), {
      target: { value: 'Carlos' },
    });
    fireEvent.change(screen.getByTestId('input-registro-apellidos'), {
      target: { value: 'Santana' },
    });
    fireEvent.change(screen.getByTestId('input-registro-correo'), {
      target: { value: 'csantana@duoc.cl' },
    });
    fireEvent.change(screen.getByTestId('input-registro-clave'), {
      target: { value: 'clave123' },
    });
    fireEvent.change(screen.getByTestId('input-registro-confirmar-clave'), {
      target: { value: 'clave123' },
    });

    fireEvent.change(screen.getByTestId('select-registro-region'), {
      target: { value: 'V' },
    });
    fireEvent.change(screen.getByTestId('select-registro-comuna'), {
      target: { value: 'Viña del Mar' },
    });
    fireEvent.change(screen.getByTestId('input-registro-direccion'), {
      target: { value: 'Av. Marina 400' },
    });

    fireEvent.click(screen.getByTestId('btn-registro-submit'));

    await waitFor(() => {
      expect(screen.getByText('Checkout Mock')).toBeInTheDocument();
    });
  });
});
