// src/utils/stock.js
// Función semántica de control de stock portada desde base html/js/admin.js

export function evaluarNivelStock(stockActual, stockCritico = 3) {
  const actual = parseInt(stockActual, 10) || 0;
  const umbral = parseInt(stockCritico, 10) || 0;

  if (actual <= 0) {
    return {
      estado: 'AGOTADO',
      badgeCss: 'badge-danger',
      alertaCritica: true,
    };
  }
  if (actual <= umbral) {
    return {
      estado: `CRÍTICO (${actual} un.)`,
      badgeCss: 'badge-critical',
      alertaCritica: true,
    };
  }
  return {
    estado: `DISPONIBLE (${actual} un.)`,
    badgeCss: 'badge-ok',
    alertaCritica: false,
  };
}
