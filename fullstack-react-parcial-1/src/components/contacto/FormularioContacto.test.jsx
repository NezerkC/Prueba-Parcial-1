import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FormularioContacto, { MENSAJE_EXITO_CONTACTO } from './FormularioContacto';

describe('<FormularioContacto />', () => {
  it('no muestra mensajes de error antes de enviar el formulario', () => {
    render(<FormularioContacto />);

    expect(screen.queryByText(/Nombre requerido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Solo correos autorizados/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Comentario requerido/i)).not.toBeInTheDocument();
  });

  it('muestra los mensajes de error solo cuando los campos son inválidos', async () => {
    const user = userEvent.setup();
    render(<FormularioContacto />);

    await user.type(screen.getByLabelText(/Correo Electrónico/i), 'persona@hotmail.com');
    await user.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

    expect(screen.getByText(/Nombre requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/Solo correos autorizados/i)).toBeInTheDocument();
    expect(screen.getByText(/Comentario requerido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre Completo/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('actualiza el estado del comentario y el contador al escribir', async () => {
    const user = userEvent.setup();
    render(<FormularioContacto />);

    const comentario = screen.getByLabelText(/Consulta o Comentario/i);
    await user.type(comentario, 'Hola');

    expect(comentario).toHaveValue('Hola');
    expect(screen.getByText('4/500')).toBeInTheDocument();
  });

  it('envía los datos válidos, limpia el formulario y muestra la confirmación', async () => {
    const user = userEvent.setup();
    const onEnviar = vi.fn();
    render(<FormularioContacto onEnviar={onEnviar} />);

    await user.type(screen.getByLabelText(/Nombre Completo/i), 'Danilo Sepúlveda');
    await user.type(screen.getByLabelText(/Correo Electrónico/i), 'danilo@duoc.cl');
    await user.type(screen.getByLabelText(/Consulta o Comentario/i), '¿Tienen stock de cuerdas?');
    await user.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

    expect(onEnviar).toHaveBeenCalledWith({
      nombre: 'Danilo Sepúlveda',
      correo: 'danilo@duoc.cl',
      comentario: '¿Tienen stock de cuerdas?',
    });
    expect(screen.getByText(MENSAJE_EXITO_CONTACTO)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre Completo/i)).toHaveValue('');
  });
});
