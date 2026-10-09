function BenefitCard({ indicador, titulo, texto }) {
  return (
    <article className="benefit-card h-100">
      <span className="benefit-indicator">{indicador}</span>
      <h3>{titulo}</h3>
      <p>{texto}</p>
    </article>
  );
}

export default BenefitCard;
