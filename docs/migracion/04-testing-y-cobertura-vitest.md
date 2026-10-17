# Configuración Avanzada de Testing, Cobertura y Métricas con Vitest

**Proyecto:** Sonido Vivo — Plataforma Web de E-commerce y Gestión  
**Referencia Académica:** Guías DSY1104 (2.3.2, 2.3.3 y 2.3.4)  
**Clasificación:** Manual Técnico de Aseguramiento de Calidad (QA) y Cobertura  

---

## 1. Arquitectura del Entorno de Pruebas

El entorno de pruebas de la solución se desacopla en capas independientes para garantizar tiempos de retroalimentación mínimos durante el ciclo de desarrollo local y ejecuciones estables en canales de CI/CD.

```text
┌────────────────────────────────────────────────────────┐
│                   VITEST (Test Runner)                 │
├───────────────────────────┬────────────────────────────┤
│ JSDOM (Simulación de DOM) │ @vitest/coverage-v8        │
├───────────────────────────┴────────────────────────────┤
│           @testing-library/react (Queries de usuario)  │
│           @testing-library/user-event (Interacciones)  │
│           jest-axe (Auditoría de Accesibilidad A11y)   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Configuración Defensiva en `vite.config.js`

Para mitigar riesgos de sobrecalentamiento de memoria o congelamiento de procesos en servidores de integración continua con recursos limitados (ej. GitHub Actions estándar o instancias AWS t2.micro), la configuración de paralelismo se fija de manera determinista:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    maxWorkers: 2,        // Restricción intencional de hilos concurrentes
    maxConcurrency: 1,    // Aislamiento de ejecución para evitar colisiones
    coverage: {
      provider: 'v8',     // Motor V8 nativo de Node.js
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx',
        'src/**/*.test.{js,jsx}',
        'src/**/*.a11y.test.{js,jsx}',
        'src/setupTests.js',
      ],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
```

---

## 3. Configuración Global de Pruebas (`src/setupTests.js`)

Este archivo se ejecuta automáticamente antes de cada archivo de prueba, inyectando los matchers extendidos de Jest DOM y los polyfills que JSDOM no implementa de forma nativa:

```javascript
import '@testing-library/jest-dom/vitest';

// Polyfill para window.matchMedia (utilizado por componentes responsivos y Bootstrap)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Polyfill para ResizeObserver (utilizado en tablas responsivas y carruseles)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill para scrollIntoView
window.HTMLElement.prototype.scrollIntoView = () => {};
```

---

## 4. Tipologías de Pruebas y Estrategias de Mocking

### 4.1. Aislamiento de `window.localStorage`
Para evitar contaminación cruzada entre pruebas unitarias del carrito e inventario, `localStorage` se limpia sistemáticamente antes de cada ejecución:

```javascript
import { beforeEach } from 'vitest';

beforeEach(() => {
  window.localStorage.clear();
});
```

### 4.2. Mocking de Navegación (`react-router-dom`)
Cuando se prueban componentes individuales que hacen uso de `<Link />` o hooks como `useNavigate()`, se encapsulan dentro de un enrutador en memoria:

```javascript
import { MemoryRouter, Routes, Route } from 'react-router-dom';

render(
  <MemoryRouter initialEntries={['/catalogo']}>
    <Routes>
      <Route path="/catalogo" element={<CatalogPage />} />
    </Routes>
  </MemoryRouter>
);
```

### 4.3. Mocking de Servicios de Red (Axios / Fetch)
Para verificar la resiliencia ante caídas de servidor, se interceptan las llamadas HTTP con `vi.spyOn`:

```javascript
import axios from 'axios';
import { vi, describe, it, expect } from 'vitest';

describe('ServicioAPI - Manejo Defensivo de Errores', () => {
  it('captura errores de red 500 y retorna fallback seguro', async () => {
    vi.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Internal Server Error'));

    const resultado = await obtenerCatalogoRemoto();
    expect(resultado).toEqual({ error: true, data: [] });
  });
});
```

---

## 5. Interpretación de Métricas de Cobertura (Guía 2.3.4)

El comando `npm run coverage` genera un reporte detallado en `./coverage/index.html` con cuatro cuadrantes de análisis:

| Métrica | Definición Operativa | Umbral Crítico | Impacto de Fallo |
| :--- | :--- | :--- | :--- |
| **Líneas (% Lines)** | Proporción de líneas de código fuente que fueron ejecutadas al menos una vez por las pruebas. | **80%** | Código muerto o rutas de ejecución no exploradas. |
| **Funciones (% Funcs)** | Proporción de funciones declaradas que fueron invocadas en el test runner. | **80%** | Métodos huérfanos o controladores de eventos desvinculados. |
| **Ramas (% Branches)** | Proporción de bifurcaciones lógicas (`if`, `else`, `switch`, ternarios) evaluadas en todos sus caminos (tanto `true` como `false`). | **75%** | Vulnerabilidad ante datos inesperados o casos de borde (ej. RUT nulo). |
| **Sentencias (% Stmts)** | Proporción de instrucciones individuales procesadas. | **80%** | Expresiones o asignaciones omitidas en la suite. |

---

## 6. Comandos Operativos de la Suite

```bash
# Modo desarrollo con observador en caliente (Watch Mode)
npm run test

# Ejecución única determinista (Modo CI/CD)
npm run test:run

# Generación de reporte de cobertura completo con parada por umbrales
npm run coverage
```
