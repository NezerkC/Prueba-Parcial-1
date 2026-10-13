// src/utils/finanzas.js
// Cálculo financiero e IVA (19%) portado desde base html/js/carrito.js

export function calcularTotalesFinancieros(items = []) {
  const subtotalNeto = items.reduce(
    (acc, item) => acc + (Number(item.precio) || 0) * (Number(item.cantidad) || 0),
    0
  );
  const iva = Math.round(subtotalNeto * 0.19);
  const costoDespacho = 0; // Despacho gratis para Viña del Mar / Valparaíso
  const total = subtotalNeto + iva + costoDespacho;

  return {
    subtotalNeto,
    iva,
    costoDespacho,
    total,
  };
}

export function formatearPrecioCLP(monto) {
  const numero = Number(monto) || 0;
  if (numero === 0) return 'Gratis';
  return `$${numero.toLocaleString('es-CL')}`;
}
