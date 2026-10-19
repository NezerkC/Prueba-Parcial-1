import PropTypes from 'prop-types';

function CustomObjectCard({ objeto, onAddToCart, isAdmin = false, onEliminar }) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        codigo: objeto.codigo || objeto.id,
        id: objeto.id,
        nombre: objeto.nombre,
        precio: Number(objeto.precio),
        categoria: objeto.categoria || 'Servicios Especiales',
        descripcion: objeto.descripcion,
        imagen: objeto.icono || '🛠️',
      });
    }
  };

  return (
    <article className="custom-card" data-testid={`custom-card-${objeto.id}`}>
      <div className="custom-card-header">
        <span className="product-code-tag">{objeto.id}</span>
        {objeto.categoria && (
          <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
            {objeto.categoria}
          </span>
        )}
      </div>

      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '8px 0 4px' }}>
        {objeto.icono ? `${objeto.icono} ` : ''}
        {objeto.nombre}
      </h4>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', flexGrow: 1 }}>
        {objeto.descripcion}
      </p>

      <div className="custom-card-price-row">
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
          ${Number(objeto.precio).toLocaleString('es-CL')}
        </span>
        <span className="badge badge-ok">{objeto.estado || 'Disponible'}</span>
      </div>

      <div className="custom-card-actions">
        <button
          type="button"
          className="btn btn-sm btn-primary w-100"
          onClick={handleAddToCart}
          data-testid={`btn-agregar-custom-${objeto.id}`}
        >
          🛒 Agregar al Carro
        </button>

        {isAdmin && onEliminar && (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => onEliminar(objeto.id)}
            title="Eliminar objeto (Modo Admin)"
            aria-label={`Eliminar ${objeto.nombre}`}
            data-testid={`btn-eliminar-custom-${objeto.id}`}
          >
            🗑️
          </button>
        )}
      </div>
    </article>
  );
}

CustomObjectCard.propTypes = {
  objeto: PropTypes.shape({
    id: PropTypes.string.isRequired,
    codigo: PropTypes.string,
    nombre: PropTypes.string.isRequired,
    categoria: PropTypes.string,
    descripcion: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    estado: PropTypes.string,
    icono: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func,
  isAdmin: PropTypes.bool,
  onEliminar: PropTypes.func,
};

export default CustomObjectCard;

