function CustomObjectCard({ objeto }) {
  return (
    <article className="custom-card">
      <span className="product-code-tag">{objeto.id}</span>
      <h4>{objeto.nombre}</h4>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
        {objeto.descripcion}
      </p>
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '10px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 700 }}>
          ${Number(objeto.precio).toLocaleString('es-CL')}
        </span>
        <span className="badge badge-ok">{objeto.estado}</span>
      </div>
    </article>
  );
}

export default CustomObjectCard;
