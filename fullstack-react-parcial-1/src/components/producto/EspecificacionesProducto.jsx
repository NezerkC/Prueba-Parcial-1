function EspecificacionesProducto({ producto }) {
  const especificaciones = [
    { etiqueta: 'Marca', valor: producto.marca },
    { etiqueta: 'Modelo', valor: producto.modelo },
    { etiqueta: 'Categoría', valor: producto.categoria },
    { etiqueta: 'Código', valor: producto.codigo },
  ].filter((item) => item.valor);

  return (
    <dl className="detalle-especificaciones" aria-label="Especificaciones técnicas">
      {especificaciones.map((item) => (
        <div className="detalle-especificacion" key={item.etiqueta}>
          <dt>{item.etiqueta}</dt>
          <dd>{item.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

export default EspecificacionesProducto;
