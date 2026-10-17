const DATOS_TIENDA = [
  {
    etiqueta: 'Dirección',
    valor:
      'Calle Valparaíso 740, Galería Cristal, Local 12, Viña del Mar, Región de Valparaíso.',
  },
  { etiqueta: 'Teléfono Ventas', valor: '+56 32 268 9000' },
  { etiqueta: 'WhatsApp Consultas', valor: '+56 9 8765 4321' },
  { etiqueta: 'Email', valor: 'contacto@sonidovivo.cl' },
];

function DatosTienda() {
  return (
    <article className="benefit-card contacto-card">
      <h3>Tienda Física Viña del Mar</h3>
      {DATOS_TIENDA.map((dato) => (
        <p className="contacto-dato" key={dato.etiqueta}>
          <strong>{dato.etiqueta}:</strong> {dato.valor}
        </p>
      ))}
    </article>
  );
}

export default DatosTienda;
