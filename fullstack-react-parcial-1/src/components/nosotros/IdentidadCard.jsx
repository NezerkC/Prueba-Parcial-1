function IdentidadCard({ icono, titulo, children }) {
  return (
    <article className="benefit-card nosotros-card h-100">
      <span className="nosotros-card-icon" aria-hidden="true">
        {icono}
      </span>
      <h2 className="nosotros-card-title">{titulo}</h2>
      <p className="nosotros-text mb-0">{children}</p>
    </article>
  );
}

export default IdentidadCard;
