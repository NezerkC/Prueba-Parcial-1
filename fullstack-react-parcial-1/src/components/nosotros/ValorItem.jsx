function ValorItem({ titulo, texto }) {
  return (
    <div className="valor-item">
      <strong>{titulo}</strong>
      <span>{texto}</span>
    </div>
  );
}

export default ValorItem;
