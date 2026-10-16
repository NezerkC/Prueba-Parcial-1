function SelectorCantidad({
  cantidad,
  onIncrementar,
  onDecrementar,
  min = 1,
  max = Infinity,
  deshabilitado = false,
}) {
  return (
    <div className="selector-cantidad">
      <span className="selector-cantidad-label" id="det-cantidad-label">
        Cantidad:
      </span>
      <div className="selector-cantidad-controles" role="group" aria-labelledby="det-cantidad-label">
        <button
          type="button"
          className="selector-cantidad-btn"
          onClick={onDecrementar}
          disabled={deshabilitado || cantidad <= min}
          aria-label="Disminuir cantidad"
        >
          −
        </button>
        <output className="selector-cantidad-valor" aria-live="polite" data-testid="det-cantidad">
          {cantidad}
        </output>
        <button
          type="button"
          className="selector-cantidad-btn"
          onClick={onIncrementar}
          disabled={deshabilitado || cantidad >= max}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default SelectorCantidad;
