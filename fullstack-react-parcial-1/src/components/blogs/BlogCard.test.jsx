import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import BlogCard from './BlogCard';

const articuloPrueba = {
  id: '7',
  titulo: 'Cómo cambiar las cuerdas de un bajo',
  resumen: 'Guía paso a paso para principiantes.',
  categoriaListado: 'Mantenimiento',
  fechaListado: '10 Oct 2026',
  miniatura: '/assets/img/thumb_prueba.jpg',
  altMiniatura: 'Miniatura del artículo de prueba',
  etiquetaVideo: 'Video Guía',
};

describe('<BlogCard />', () => {
  it('renderiza el título, el resumen y los datos del artículo recibido por props', () => {
    render(
      <MemoryRouter>
        <BlogCard articulo={articuloPrueba} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: articuloPrueba.titulo })).toBeInTheDocument();
    expect(screen.getByText(articuloPrueba.resumen)).toBeInTheDocument();
    expect(screen.getByText(/Mantenimiento • 10 Oct 2026/)).toBeInTheDocument();
    expect(screen.getByAltText(articuloPrueba.altMiniatura)).toHaveAttribute(
      'src',
      articuloPrueba.miniatura
    );
  });

  it('enlaza al detalle del artículo usando su id', () => {
    render(
      <MemoryRouter>
        <BlogCard articulo={articuloPrueba} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /Leer Artículo Completo/i })).toHaveAttribute(
      'href',
      '/blogs/7'
    );
  });
});
