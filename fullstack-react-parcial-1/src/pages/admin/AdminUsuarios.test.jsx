import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import AdminUsuarios from './AdminUsuarios';
import { AuthProvider } from '../../context/AuthContext';

const USUARIOS_TEST = [
  {
    rut: '12345678-5',
    nombre: 'Martín',
    apellidos: 'Gómez',
    correo: 'admin@profesor.duoc.cl',
    clave: '123456',
    rol: 'admin',
    region: 'V',
    comuna: 'Viña del Mar',
    direccion: 'Av. Libertad 1234',
  },
  {
    rut: '19011022-K',
    nombre: 'Sebastián',
    apellidos: 'Valenzuela',
    correo: 'cliente@duoc.cl',
    clave: 'pass12',
    rol: 'cliente',
    region: 'V',
    comuna: 'Valparaíso',
    direccion: 'Cerro Alegre 14',
  },
  {
    rut: '18765432-7',
    nombre: 'Camila',
    apellidos: 'Reyes',
    correo: 'usuario@gmail.com',
    clave: 'pass12',
    rol: 'vendedor',
    region: 'RM',
    comuna: 'Santiago',
    direccion: 'Santa Isabel 450',
  },
];

function renderAdminUsuarios() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AdminUsuarios />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('<AdminUsuarios /> - Mantenedor de Usuarios (Tarea 16 / RF-08)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('sonido_vivo_usuarios_v1', JSON.stringify(USUARIOS_TEST));
  });

  it('renderiza la lista de usuarios y el encabezado principal', () => {
    renderAdminUsuarios();

    expect(screen.getByTestId('admin-usuarios-titulo')).toHaveTextContent(/mantenedor de usuarios/i);
    expect(screen.getByText('Martín Gómez')).toBeInTheDocument();
    expect(screen.getByText('Sebastián Valenzuela')).toBeInTheDocument();
    expect(screen.getByText('Camila Reyes')).toBeInTheDocument();
    expect(screen.getByText('admin@profesor.duoc.cl')).toBeInTheDocument();
  });

  it('filtra usuarios por texto de búsqueda en tiempo real', async () => {
    const user = userEvent.setup();
    renderAdminUsuarios();

    const inputBusqueda = screen.getByTestId('filtro-usuarios-busqueda');
    await user.type(inputBusqueda, 'Sebastián');

    expect(screen.getByText('Sebastián Valenzuela')).toBeInTheDocument();
    expect(screen.queryByText('Martín Gómez')).not.toBeInTheDocument();
    expect(screen.queryByText('Camila Reyes')).not.toBeInTheDocument();
  });

  it('filtra usuarios por rol seleccionado', async () => {
    const user = userEvent.setup();
    renderAdminUsuarios();

    const selectRol = screen.getByTestId('filtro-usuarios-rol');
    await user.selectOptions(selectRol, 'vendedor');

    expect(screen.getByText('Camila Reyes')).toBeInTheDocument();
    expect(screen.queryByText('Martín Gómez')).not.toBeInTheDocument();
    expect(screen.queryByText('Sebastián Valenzuela')).not.toBeInTheDocument();
  });

  it('muestra mensajes de error cuando los campos del formulario son inválidos', async () => {
    const user = userEvent.setup();
    renderAdminUsuarios();

    const btnNuevo = screen.getByTestId('btn-nuevo-usuario');
    await user.click(btnNuevo);

    // Intentar guardar con campos vacíos
    const btnGuardar = screen.getByTestId('btn-guardar-usuario');
    await user.click(btnGuardar);

    expect(screen.getByTestId('error-rut')).toBeInTheDocument();
    expect(screen.getByTestId('error-nombre')).toBeInTheDocument();
    expect(screen.getByTestId('error-apellidos')).toBeInTheDocument();
    expect(screen.getByTestId('error-correo')).toBeInTheDocument();
    expect(screen.getByTestId('error-clave')).toBeInTheDocument();
  });

  it('permite registrar un nuevo usuario con validaciones y rol asignado', async () => {
    const user = userEvent.setup();
    renderAdminUsuarios();

    const btnNuevo = screen.getByTestId('btn-nuevo-usuario');
    await user.click(btnNuevo);

    // Llenar formulario con RUN válido chileno
    await user.type(screen.getByTestId('modal-input-rut'), '11111111-1');
    await user.type(screen.getByTestId('modal-input-nombre'), 'Esteban');
    await user.type(screen.getByTestId('modal-input-apellidos'), 'Paredes');
    await user.type(screen.getByTestId('modal-input-correo'), 'esteban@duoc.cl');
    await user.type(screen.getByTestId('modal-input-clave'), 'goleador9');
    await user.selectOptions(screen.getByTestId('modal-select-rol'), 'vendedor');

    const btnGuardar = screen.getByTestId('btn-guardar-usuario');
    await user.click(btnGuardar);

    await waitFor(() => {
      expect(screen.getByText('Esteban Paredes')).toBeInTheDocument();
      expect(screen.getByText('esteban@duoc.cl')).toBeInTheDocument();
    });

    // Verificar persistencia en localStorage
    const guardados = JSON.parse(localStorage.getItem('sonido_vivo_usuarios_v1') || '[]');
    expect(guardados.some((u) => u.correo === 'esteban@duoc.cl')).toBe(true);
  });

  it('permite editar un usuario existente', async () => {
    const user = userEvent.setup();
    renderAdminUsuarios();

    const btnEditar = screen.getByTestId('btn-editar-usuario-18765432-7');
    await user.click(btnEditar);

    const inputNombre = screen.getByTestId('modal-input-nombre');
    await user.clear(inputNombre);
    await user.type(inputNombre, 'Camila Paz');

    const btnGuardar = screen.getByTestId('btn-guardar-usuario');
    await user.click(btnGuardar);

    await waitFor(() => {
      expect(screen.getByText('Camila Paz Reyes')).toBeInTheDocument();
    });
  });

  it('permite eliminar un usuario del sistema', async () => {
    const user = userEvent.setup();
    renderAdminUsuarios();

    const btnEliminar = screen.getByTestId('btn-eliminar-usuario-19011022-K');
    await user.click(btnEliminar);

    // Confirmar en el modal
    const btnConfirmar = screen.getByTestId('btn-confirmar-eliminar-usuario');
    await user.click(btnConfirmar);

    await waitFor(() => {
      expect(screen.queryByText('Sebastián Valenzuela')).not.toBeInTheDocument();
    });

    const guardados = JSON.parse(localStorage.getItem('sonido_vivo_usuarios_v1') || '[]');
    expect(guardados.some((u) => u.rut === '19011022-K')).toBe(false);
  });
});
