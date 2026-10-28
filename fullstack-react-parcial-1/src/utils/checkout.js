// Reglas del checkout: validación de datos de envío y creación de la orden.
// Son funciones puras para poder probarlas sin renderizar componentes.

export const TIPOS_ENTREGA = {
  DOMICILIO: 'domicilio',
  RETIRO: 'retiro',
};

export const ORDENES_STORAGE_KEY = 'sonido_vivo_ordenes_v1';

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

export function crearOrden({ datos, items, subtotal, iva, total, usuario = null, fecha = new Date() }) {
  const rutUsuario = usuario?.rut || datos.rut || '';
  const correoUsuario = usuario?.correo || datos.correo.trim();

  return {
    numero: generarNumeroOrden(fecha),
    fecha: fecha.toISOString(),
    cliente: {
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      ...(rutUsuario ? { rut: rutUsuario } : {}),
    },
    usuario: usuario
      ? {
          rut: usuario.rut,
          correo: usuario.correo,
          nombre: `${usuario.nombre || ''} ${usuario.apellidos || ''}`.trim(),
          rol: usuario.rol || 'cliente',
        }
      : (datos.rut ? { rut: datos.rut, correo: correoUsuario } : null),
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

export function guardarOrdenStorage(orden) {
  try {
    const raw = localStorage.getItem(ORDENES_STORAGE_KEY);
    const ordenes = raw ? JSON.parse(raw) : [];
    ordenes.push(orden);
    localStorage.setItem(ORDENES_STORAGE_KEY, JSON.stringify(ordenes));
    return true;
  } catch (error) {
    console.error('Error al guardar la orden en localStorage:', error);
    return false;
  }
}

export function obtenerOrdenesStorage(identificadorUsuario = null) {
  try {
    const raw = localStorage.getItem(ORDENES_STORAGE_KEY);
    const ordenes = raw ? JSON.parse(raw) : [];
    if (!identificadorUsuario) return ordenes;
    const filtro = String(identificadorUsuario).trim().toLowerCase();
    return ordenes.filter(
      (o) =>
        (o.usuario?.rut && o.usuario.rut.toLowerCase() === filtro) ||
        (o.usuario?.correo && o.usuario.correo.toLowerCase() === filtro) ||
        (o.cliente?.correo && o.cliente.correo.toLowerCase() === filtro) ||
        (o.cliente?.rut && o.cliente.rut.toLowerCase() === filtro)
    );
  } catch (error) {
    console.error('Error al recuperar órdenes desde localStorage:', error);
    return [];
  }
}
