// Reglas del checkout: validación de datos de envío y creación de la orden.
// Son funciones puras para poder probarlas sin renderizar componentes.

export const TIPOS_ENTREGA = {
  DOMICILIO: 'domicilio',
  RETIRO: 'retiro',
};

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarDatosEnvio(datos = {}) {
  const errores = {};
  const nombre = (datos.nombre || '').trim();
  const apellidos = (datos.apellidos || '').trim();
  const correo = (datos.correo || '').trim();

  if (!nombre || nombre.length > 50) errores.nombre = 'Nombre requerido (máximo 50 caracteres).';
  if (!apellidos || apellidos.length > 100) errores.apellidos = 'Apellidos requeridos.';
  if (!REGEX_CORREO.test(correo)) errores.correo = 'Ingresa un correo válido.';

  // La dirección solo se pide cuando el pedido se despacha a domicilio
  if (datos.tipoEntrega === TIPOS_ENTREGA.DOMICILIO) {
    if (!(datos.direccion || '').trim()) errores.direccion = 'La dirección es obligatoria.';
    if (!datos.region) errores.region = 'Selecciona una región.';
    if (!datos.comuna) errores.comuna = 'Selecciona una comuna.';
  }

  return errores;
}

export function generarNumeroOrden(fecha = new Date()) {
  return `SV-${String(fecha.getTime()).slice(-6)}`;
}

export function crearOrden({ datos, items, subtotal, iva, total, fecha = new Date() }) {
  return {
    numero: generarNumeroOrden(fecha),
    fecha: fecha.toISOString(),
    cliente: {
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
    },
    entrega: {
      tipo: datos.tipoEntrega,
      direccion: datos.direccion || '',
      departamento: datos.departamento || '',
      region: datos.region || '',
      comuna: datos.comuna || '',
    },
    items: items.map(({ codigo, nombre, precio, cantidad }) => ({ codigo, nombre, precio, cantidad })),
    subtotal,
    iva,
    total,
  };
}
