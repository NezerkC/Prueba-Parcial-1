import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CustomObjectsSection from './CustomObjectsSection';
import { AuthProvider } from '../../context/AuthContext';

describe('<CustomObjectsSection />', () => {
  const objetosMock = [
    {
      id: 'SRV-001',
      codigo: 'SRV-001',
      nombre: 'Calibración de Guitarras',
      categoria: 'Servicios de Luthier',
      descripcion: 'Ajuste de alma y octavación completa.',
      precio: 25000,
      estado: 'Disponible',
      icono: '🛠️',
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renderiza la lista de servicios y ranura de sólo lectura para visitantes', () => {
    render(
      <AuthProvider>
        <CustomObjectsSection objetos={objetosMock} />
      </AuthProvider>
    );

    expect(screen.getByText(/Calibración de Guitarras/i)).toBeInTheDocument();
    expect(screen.getByText(/SRV-001/i)).toBeInTheDocument();
    expect(screen.getByText('$25.000')).toBeInTheDocument();
    expect(screen.getByTestId('custom-card-slot-readonly')).toBeInTheDocument();
    expect(screen.queryByTestId('btn-abrir-modal-crear-objeto')).not.toBeInTheDocument();
  });

  it('permite agregar un servicio al carrito llamando a onAddToCart', async () => {
    const user = userEvent.setup();
    const mockAdd = vi.fn();

    render(
      <AuthProvider>
        <CustomObjectsSection objetos={objetosMock} onAddToCart={mockAdd} />
      </AuthProvider>
    );

    const btnAgregar = screen.getByTestId('btn-agregar-custom-SRV-001');
    await user.click(btnAgregar);

    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: 'SRV-001',
        nombre: 'Calibración de Guitarras',
        precio: 25000,
      })
    );
  });

  it('muestra el botón para crear objeto cuando el usuario es Administrador', () => {
    localStorage.setItem(
      'sonido_vivo_auth_v1',
      JSON.stringify({ correo: 'admin@profesor.duoc.cl', rol: 'admin', nombre: 'Martín' })
    );

    render(
      <AuthProvider>
        <CustomObjectsSection objetos={objetosMock} />
      </AuthProvider>
    );

    expect(screen.getByTestId('btn-abrir-modal-crear-objeto')).toBeInTheDocument();
    expect(screen.queryByTestId('custom-card-slot-readonly')).not.toBeInTheDocument();
  });

  it('permite al Administrador abrir el modal y registrar un nuevo servicio', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'sonido_vivo_auth_v1',
      JSON.stringify({ correo: 'admin@profesor.duoc.cl', rol: 'admin', nombre: 'Martín' })
    );

    render(
      <AuthProvider>
        <CustomObjectsSection objetos={objetosMock} />
      </AuthProvider>
    );

    // Abrir modal
    const btnAbrirModal = screen.getByTestId('btn-abrir-modal-crear-objeto');
    await user.click(btnAbrirModal);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre del Objeto \/ Servicio:/i)).toBeInTheDocument();

    // Llenar formulario
    const inputNombre = screen.getByLabelText(/Nombre del Objeto \/ Servicio:/i);
    const inputPrecio = screen.getByLabelText(/Precio \(CLP\):/i);
    const inputDesc = screen.getByLabelText(/Descripción del Servicio \/ Especificación:/i);

    await user.type(inputNombre, 'Clase de Batería Avanzada');
    await user.type(inputPrecio, '30000');
    await user.type(inputDesc, 'Técnicas de doble pedal y polirritmia con profesor certificado.');

    const btnGuardar = screen.getByTestId('btn-guardar-nuevo-objeto');
    await user.click(btnGuardar);

    // Verificar que el modal se cerró y el nuevo objeto aparece
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole('heading', { name: /Clase de Batería Avanzada/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('custom-card-SRV-002')).toBeInTheDocument();
  });


  it('permite al Administrador eliminar un servicio con confirmación', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    localStorage.setItem(
      'sonido_vivo_auth_v1',
      JSON.stringify({ correo: 'admin@profesor.duoc.cl', rol: 'admin', nombre: 'Martín' })
    );

    render(
      <AuthProvider>
        <CustomObjectsSection objetos={objetosMock} />
      </AuthProvider>
    );

    const btnEliminar = screen.getByTestId('btn-eliminar-custom-SRV-001');
    await user.click(btnEliminar);

    expect(window.confirm).toHaveBeenCalled();
    expect(screen.queryByText(/Calibración de Guitarras/i)).not.toBeInTheDocument();
  });
});
