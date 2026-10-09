# Guía Metodológica de Migración: HTML a React con TDD y Vitest

**Proyecto:** Sonido Vivo — Plataforma Web de E-commerce y Gestión  
**Paradigma:** Desarrollo Guiado por Pruebas (Test-Driven Development - TDD)  
**Herramientas:** Vite 8, React 19, Vitest 5, React Testing Library, JSDOM, jest-axe  

---

## 1. El Ciclo Riguroso de TDD (Red - Green - Refactor)

La migración no se aborda copiando etiquetas HTML en archivos JSX. En un enfoque de ingeniería calculador y meticuloso, cada función de negocio, componente de UI y hook de estado debe ser precedido por su correspondiente suite de pruebas.

```text
 ┌────────────────────────────────────────────────────────┐
 │ 1. RED (Fallo)                                         │
 │ Escribir la prueba que define el contrato de entrada,  │
 │ comportamiento esperado y aserciones. Ejecutar y fallar│
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ 2. GREEN (Éxito)                                       │
 │ Escribir la implementación mínima estricta en código   │
 │ para satisfacer la prueba sin sobreingeniería.         │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ 3. REFACTOR (Optimización)                             │
 │ Limpiar el código, eliminar duplicación, optimizar     │
 │ rendimiento sin alterar el comportamiento verificado.  │
 └────────────────────────────────────────────────────────┘
```

---

## 2. Fase 1: TDD en Lógica Pura y Reglas de Negocio (Unit Testing)

Antes de levantar cualquier interfaz de usuario, se extrae la lógica de `validaciones.js`, `carrito.js` y `admin.js` en módulos de funciones puras independientes del DOM.

### 2.1. Especificación del Algoritmo Módulo 11 y Correo Institucional
**Archivo de prueba a crear primero:** `src/utils/validaciones.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import {
  validarRutChileno,
  validarEmailInstitucional,
  formatearRutChileno,
} from './validaciones';

describe('Motor de Validaciones - Reglas de Negocio Chilenas', () => {
  describe('validarRutChileno() - Algoritmo Módulo 11', () => {
    it('debe validar RUTs reales válidos sin formato', () => {
      expect(validarRutChileno('19011022K')).toBe(true);
      expect(validarRutChileno('111111111')).toBe(true);
      expect(validarRutChileno('201234560')).toBe(true);
    });

    it('debe rechazar RUTs con dígito verificador incorrecto', () => {
      expect(validarRutChileno('190110229')).toBe(false);
      expect(validarRutChileno('123456780')).toBe(false);
    });

    it('debe rechazar cadenas vacías o longitudes fuera del rango (7-9 caracteres)', () => {
      expect(validarRutChileno('')).toBe(false);
      expect(validarRutChileno('123')).toBe(false);
      expect(validarRutChileno('12345678901')).toBe(false);
      expect(validarRutChileno(null)).toBe(false);
    });

    it('debe ser insensible a mayúsculas y minúsculas en el DV', () => {
      expect(validarRutChileno('19011022k')).toBe(true);
    });
  });

  describe('validarEmailInstitucional() - Dominios Permitidos', () => {
    it('debe autorizar correos de los 3 dominios válidos', () => {
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
});
```

---

### 2.2. Especificación Financiera y Desglose de IVA (19%)
**Archivo de prueba a crear primero:** `src/utils/finanzas.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { calcularTotalesFinancieros, formatearPrecioCLP } from './finanzas';

describe('Motor Financiero y Desglose Tributario (IVA 19%)', () => {
  it('debe calcular $0 cuando el carrito está vacío', () => {
    const resultado = calcularTotalesFinancieros([]);
    expect(resultado).toEqual({
      subtotalNeto: 0,
      iva: 0,
      costoDespacho: 0,
      total: 0,
    });
  });

  it('debe calcular exactamente el neto, el 19% de IVA y el total acumulado', () => {
    const items = [
      { precio: 100000, cantidad: 2 }, // $200.000 neto
      { precio: 50000, cantidad: 1 },  // $50.000 neto
    ];
    // Subtotal: 250.000
    // IVA (19%): 47.500
    // Total: 297.500
    const resultado = calcularTotalesFinancieros(items);
    expect(resultado.subtotalNeto).toBe(250000);
    expect(resultado.iva).toBe(47500);
    expect(resultado.costoDespacho).toBe(0); // Despacho gratis en V Región
    expect(resultado.total).toBe(297500);
  });

  it('debe redondear el IVA a números enteros sin decimales flotantes', () => {
    const items = [{ precio: 129990, cantidad: 1 }];
    // 129990 * 0.19 = 24698.1 -> Redondeo: 24698
    const resultado = calcularTotalesFinancieros(items);
    expect(resultado.iva).toBe(24698);
    expect(resultado.total).toBe(129990 + 24698);
  });

  it('debe formatear montos en pesos chilenos según norma local', () => {
    expect(formatearPrecioCLP(129990)).toMatch(/\$129\.990/);
    expect(formatearPrecioCLP(0)).toBe('Gratis');
  });
});
```

---

### 2.3. Especificación de Evaluación de Niveles de Stock
**Archivo de prueba a crear primero:** `src/utils/stock.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { evaluarNivelStock } from './stock';

describe('Evaluador Semántico de Inventario y Stock Crítico', () => {
  it('debe retornar AGOTADO y badge-danger cuando el stock es menor o igual a cero', () => {
    const estado = evaluarNivelStock(0, 3);
    expect(estado.estado).toBe('AGOTADO');
    expect(estado.badgeCss).toBe('badge-danger');
    expect(estado.alertaCritica).toBe(true);
  });

  it('debe retornar CRÍTICO y badge-critical cuando el stock es positivo pero menor o igual al umbral', () => {
    const estado = evaluarNivelStock(3, 3);
    expect(estado.estado).toBe('CRÍTICO (3 un.)');
    expect(estado.badgeCss).toBe('badge-critical');
    expect(estado.alertaCritica).toBe(true);
  });

  it('debe retornar DISPONIBLE y badge-ok cuando el stock supera el umbral crítico', () => {
    const estado = evaluarNivelStock(8, 3);
    expect(estado.estado).toBe('DISPONIBLE (8 un.)');
    expect(estado.badgeCss).toBe('badge-ok');
    expect(estado.alertaCritica).toBe(false);
  });
});
```

---

## 3. Fase 2: TDD en Componentes UI (React Testing Library)

### 3.1. Prueba de Contrato para `<ProductCard />`
**Archivo de prueba:** `src/components/ProductCard.test.jsx`

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

const mockProducto = {
  codigo: 'GA001',
  imagen: 'GA001.jpg',
  categoria: 'Guitarras Acústicas',
  nombre: 'Guitarra Acústica Folk',
  marca: 'Yamaha',
  modelo: 'F310',
  stock: 8,
  precio: 129990,
  descripcion: 'Tapa de abeto, aros y fondo de meranti.',
};

describe('<ProductCard /> - Pruebas de Renderizado e Interacción', () => {
  it('renderiza la información completa del producto conforme al diseño base', () => {
    render(
      <BrowserRouter>
        <ProductCard producto={mockProducto} />
      </BrowserRouter>
    );

    expect(screen.getByText('Guitarra Acústica Folk')).toBeInTheDocument();
    expect(screen.getByText('Yamaha')).toBeInTheDocument();
    expect(screen.getByText(/CÓD: GA001/i)).toBeInTheDocument();
    expect(screen.getByText(/\$129\.990/)).toBeInTheDocument();
  });

  it('dispara la función onAddToCart cuando el usuario presiona "Añadir al Carro"', async () => {
    const user = userEvent.setup();
    const handleAddToCart = vi.fn();

    render(
      <BrowserRouter>
        <ProductCard producto={mockProducto} onAddToCart={handleAddToCart} />
      </BrowserRouter>
    );

    const boton = screen.getByRole('button', { name: /añadir al carro/i });
    await user.click(boton);

    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    expect(handleAddToCart).toHaveBeenCalledWith(mockProducto);
  });
});
```

---

### 3.2. Prueba de Accesibilidad Automatizada con `jest-axe`
**Archivo de prueba:** `src/components/ProductCard.a11y.test.jsx`

```javascript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

describe('<ProductCard /> - Auditoría de Accesibilidad (WCAG 2.1 AA)', () => {
  it('no presenta violaciones de accesibilidad automatizadas', async () => {
    const { container } = render(
      <BrowserRouter>
        <ProductCard
          producto={{
            codigo: 'GA001',
            imagen: 'GA001.jpg',
            categoria: 'Guitarras Acústicas',
            nombre: 'Guitarra Acústica Folk',
            marca: 'Yamaha',
            precio: 129990,
          }}
        />
      </BrowserRouter>
    );

    const resultados = await axe(container);
    expect(resultados).toHaveNoViolations();
  });
});
```

---

## 4. Fase 3: TDD en Estado Global (`CartContext`)

### 4.1. Verificación del Hook `useCart`
**Archivo de prueba:** `src/context/CartContext.test.jsx`

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const productoPrueba = {
  codigo: 'GA001',
  nombre: 'Guitarra Acústica Folk',
  precio: 129990,
};

describe('CartContext - Máquina de Estados del Carrito', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('inicializa con un carrito vacío si no hay datos en localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });

  it('agrega un nuevo producto e incrementa el contador general', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(productoPrueba);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(1);
    expect(result.current.totalItems).toBe(1);
  });

  it('incrementa la cantidad si se añade el mismo producto dos veces', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(productoPrueba);
      result.current.addToCart(productoPrueba);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(2);
  });

  it('elimina el producto si su cantidad disminuye a 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(productoPrueba);
      result.current.updateQuantity(productoPrueba.codigo, -1);
    });

    expect(result.current.items).toHaveLength(0);
  });
});
```

---

## 5. Matriz de Ejecución y Métricas de Aprobación

Para validar el éxito de la migración bajo este estándar, ningún componente o funcionalidad será considerado completado si no cumple la siguiente matriz:

1. **Test Suite Exitosa:** Ejecución sin fallos (`npm run test:run`).
2. **Cobertura Mínima Exigida:**
   - Líneas cubiertas: `>= 80%`
   - Funciones cubiertas: `>= 80%`
   - Ramas lógicas (branches): `>= 75%`
3. **Cero Violaciones A11y:** Pruebas `axe()` en verde para cada organismo y layout principal.
4. **Verificación de Compilación:** Compilación estática de Vite libre de advertencias de tipos o linting (`npm run build`).
