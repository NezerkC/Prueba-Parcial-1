import { Link } from 'react-router-dom';

function ProductoNoEncontrado({ codigo }) {
  return (
    <section className="form-card producto-no-encontrado" aria-labelledby="titulo-no-encontrado">
      <span className="producto-no-encontrado-icono" aria-hidden="true">
        🎸
      </span>
      <h1 id="titulo-no-encontrado">Producto no encontrado</h1>
      <p>
        No encontramos ningún instrumento con el código{' '}
        <strong>{codigo || '(sin código)'}</strong> en el catálogo de Sonido Vivo.
      </p>
      <Link to="/productos" className="btn btn-primary">
        &larr; Volver al Catálogo
      </Link>
    </section>
  );
}

export default ProductoNoEncontrado;
