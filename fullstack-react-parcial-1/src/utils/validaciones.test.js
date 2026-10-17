import { describe, it, expect } from 'vitest';
import {
  validarRutChileno,
  validarEmailInstitucional,
  formatearRutChileno,
  validarClave,
  validarFormularioContacto,
} from './validaciones';

describe('Motor de Validaciones - Reglas de Negocio Chilenas', () => {
  describe('validarRutChileno() - Algoritmo Módulo 11', () => {
    it('debe validar RUTs reales válidos sin formato y con formato', () => {
      expect(validarRutChileno('19011029K')).toBe(true);
      expect(validarRutChileno('19.011.029-K')).toBe(true);
      expect(validarRutChileno('111111111')).toBe(true);
      expect(validarRutChileno('190110222')).toBe(true);
    });

    it('debe rechazar RUTs con dígito verificador incorrecto', () => {
      expect(validarRutChileno('190110299')).toBe(false);
      expect(validarRutChileno('123456780')).toBe(false);
    });

    it('debe rechazar cadenas vacías o longitudes fuera del rango (7-9 caracteres)', () => {
      expect(validarRutChileno('')).toBe(false);
      expect(validarRutChileno('123')).toBe(false);
      expect(validarRutChileno('12345678901')).toBe(false);
      expect(validarRutChileno(null)).toBe(false);
    });

    it('debe ser insensible a mayúsculas y minúsculas en el DV', () => {
      expect(validarRutChileno('19011029k')).toBe(true);
    });

    it('debe formatear un RUT con puntos y guión', () => {
      expect(formatearRutChileno('19011029k')).toBe('19.011.029-K');
    });
  });

  describe('validarEmailInstitucional() - Dominios Permitidos', () => {
    it('debe autorizar correos de los 3 dominios válidos (@duoc.cl, @profesor.duoc.cl, @gmail.com)', () => {
      expect(validarEmailInstitucional('alumno@duoc.cl')).toBe(true);
      expect(validarEmailInstitucional('profesor@profesor.duoc.cl')).toBe(true);
      expect(validarEmailInstitucional('cliente@gmail.com')).toBe(true);
    });

    it('debe rechazar dominios externos no permitidos', () => {
      expect(validarEmailInstitucional('usuario@hotmail.com')).toBe(false);
      expect(validarEmailInstitucional('usuario@yahoo.es')).toBe(false);
      expect(validarEmailInstitucional('usuario@duoc.com')).toBe(false);
    });

    it('debe rechazar correos con longitud superior a 100 caracteres o cadenas vacías', () => {
      const emailLargo = `${'a'.repeat(95)}@duoc.cl`;
      expect(validarEmailInstitucional(emailLargo)).toBe(false);
      expect(validarEmailInstitucional('')).toBe(false);
    });
  });

  describe('validarClave()', () => {
    it('acepta claves entre 4 y 10 caracteres', () => {
      expect(validarClave('1234')).toBe(true);
      expect(validarClave('123')).toBe(false);
      expect(validarClave('12345678901')).toBe(false);
    });
  });

  describe('validarFormularioContacto()', () => {
    it('no devuelve errores cuando los tres campos son válidos', () => {
      const errores = validarFormularioContacto({
        nombre: 'Danilo',
        correo: 'danilo@duoc.cl',
        comentario: 'Consulta por stock',
      });
      expect(errores).toEqual({});
    });

    it('devuelve un error por cada campo vacío, inválido o demasiado largo', () => {
      const errores = validarFormularioContacto({
        nombre: '   ',
        correo: 'danilo@hotmail.com',
        comentario: 'a'.repeat(501),
      });
      expect(Object.keys(errores)).toEqual(['nombre', 'correo', 'comentario']);
    });
  });
});
