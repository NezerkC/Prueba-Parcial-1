// src/utils/validaciones.js
// Reglas de negocio portadas desde base html/js/validaciones.js

const DOMINIOS_PERMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

export function limpiarRut(rut) {
  if (!rut || typeof rut !== 'string') return '';
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
}

export function validarRutChileno(rut) {
  const limpio = limpiarRut(rut);
  if (!/^[0-9]{7,8}[0-9K]$/.test(limpio)) return false;

  const cuerpo = limpio.slice(0, -1);
  const dvIngresado = limpio.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado;
  if (resto === 11) {
    dvEsperado = '0';
  } else if (resto === 10) {
    dvEsperado = 'K';
  } else {
    dvEsperado = String(resto);
  }

  return dvIngresado === dvEsperado;
}

export function formatearRutChileno(rut) {
  const limpio = limpiarRut(rut);
  if (limpio.length <= 1) return limpio;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
}

export function validarEmailInstitucional(email) {
  if (!email || typeof email !== 'string') return false;
  const correo = email.trim().toLowerCase();
  if (correo.length === 0 || correo.length > 100) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return false;
  return DOMINIOS_PERMITIDOS.some((dominio) => correo.endsWith(dominio));
}

export function validarClave(clave) {
  if (!clave || typeof clave !== 'string') return false;
  return clave.length >= 4 && clave.length <= 10;
}

// Formulario de Contacto (portado desde base html/js/validaciones.js)
export const LIMITE_NOMBRE_CONTACTO = 100;
export const LIMITE_COMENTARIO_CONTACTO = 500;

export function validarFormularioContacto({ nombre = '', correo = '', comentario = '' } = {}) {
  const errores = {};

  const nombreLimpio = nombre.trim();
  if (!nombreLimpio || nombreLimpio.length > LIMITE_NOMBRE_CONTACTO) {
    errores.nombre = 'Nombre requerido (máximo 100 caracteres).';
  }

  if (!validarEmailInstitucional(correo)) {
    errores.correo =
      'Solo correos autorizados (@duoc.cl, @profesor.duoc.cl o @gmail.com).';
  }

  const comentarioLimpio = comentario.trim();
  if (!comentarioLimpio || comentarioLimpio.length > LIMITE_COMENTARIO_CONTACTO) {
    errores.comentario = 'Comentario requerido (máximo 500 caracteres).';
  }

  return errores;
}
