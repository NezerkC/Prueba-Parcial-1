# Documento de Cobertura de Testing
## Proyecto: Tienda Online Sonido Vivo (React)
### Asignatura: DSY1104 — Desarrollo Fullstack II (Evaluación Parcial 2)

---

## 1. Datos Generales
- **Proyecto:** Sonido Vivo — Tienda de Instrumentos y Audio Profesional
- **Framework Frontend:** React 19 + Vite + React-Bootstrap + React Router DOM 7
- **Framework de Pruebas:** Vitest v5.0.3 + Testing Library (React 16, Jest-DOM, User-Event) + JSDOM
- **Herramienta de Cobertura:** `@vitest/coverage-v8` (V8 Coverage Engine)
- **Repositorio GitHub:** [NezerkC/Prueba-Parcial-1](https://github.com/NezerkC/Prueba-Parcial-1)
- **Rama Activa:** `feat/auth-login-registro`
- **Fecha de Ejecución:** 16 de Octubre de 2026

---

## 2. Herramientas y Configuración del Entorno de Pruebas

El entorno de pruebas unitarias automatizadas está integrado directamente con Vitest y Vite:

### Paquetes Clave (`package.json`)
- `vitest`: Motor de ejecución y aserciones compatible con ESM nativo y Vite.
- `@vitest/coverage-v8`: Instrumentación de código V8 nativa de alto rendimiento.
- `@testing-library/react` y `@testing-library/jest-dom`: Utilidades para renderizado de componentes y aserciones sobre el DOM virtual (`jsdom`).
- `jest-axe`: Pruebas automatizadas de accesibilidad (WCAG 2.1 AA).

### Script de Ejecución
```bash
npm test              # Ejecución interactiva
npm run test:run      # Ejecución en un solo paso
npm run coverage      # Generación de métricas de cobertura completas
```

---

## 3. Alcance de las Pruebas

### 3.1 Módulos y Componentes Probados (14 Suites de Pruebas)
1. **`Navbar` (`src/components/Navbar.jsx`):** Renderizado de enlaces, roles, sesión activa y badge del carrito.
2. **`ProductCard` (`src/components/ProductCard.jsx` & `ProductCard.a11y.test.jsx`):** Despliegue de datos, precios CLP, stock disponible y auditoría de accesibilidad.
3. **`ProductGrid` & `FiltrosCatalogo`:** Grilla responsiva y filtros combinados.
4. **`Productos` (`src/pages/Productos.jsx`):** Catálogo completo, estados vacíos, filtrado en tiempo real.
5. **`Login` & `Registro` (`src/pages/`):** Formularios de autenticación con validación reactiva de RUT (Módulo 11), correos institucionales y cascada Región/Comuna.
6. **`AuthContext` & `CartContext` (`src/context/`):** Estado global, persistencia en `localStorage`, roles y control de cuotas.
7. **Servicios y Utilidades (`src/services/` & `src/utils/`):** Consumo de API (`ServicioAPI`, `api.js`), cálculos tributarios (`finanzas.js`), stock crítico (`stock.js`) y validador de reglas chilenas (`validaciones.js`).

---

## 4. Resumen de Ejecución de Pruebas

- **Archivos de Prueba:** 14 pasados de 14 (100% PASS)
- **Total de Pruebas Unitarias:** 46 pruebas ejecutadas exitosamente (46 passed, 0 failed)
- **Tiempo de Ejecución:** 10.45 segundos

---

## 5. Resultados de Cobertura de Código (Reporte Real V8)

| Métrica | Meta Mínima Pauta DUOC | Cobertura Obtenida | Estado de Cumplimiento |
| :--- | :---: | :---: | :---: |
| **% Statements (Sentencias)** | 80.00 % | **82.79 %** | **CUMPLIDO** |
| **% Branches (Ramas / Condicionales)** | 70.00 % | **72.52 %** | **CUMPLIDO** |
| **% Functions (Funciones)** | 80.00 % | **80.17 %** | **CUMPLIDO** |
| **% Lines (Líneas)** | 80.00 % | **86.03 %** | **CUMPLIDO** |

### Desglose por Módulos Principales:

| Archivo / Módulo | % Stmts | % Branch | % Funcs | % Lines |
| :--- | :---: | :---: | :---: | :---: |
| **`src/services/` (api.js, ServicioAPI.js)** | 100.0% | 100.0% | 100.0% | 100.0% |
| **`src/utils/` (finanzas, stock, validaciones)** | 94.7% | 87.5% | 100.0% | 97.8% |
| **`src/pages/Home.jsx`** | 100.0% | 50.0% | 100.0% | 100.0% |
| **`src/pages/Login.jsx`** | 89.2% | 84.4% | 83.3% | 91.4% |
| **`src/pages/Registro.jsx`** | 89.0% | 91.9% | 84.2% | 93.5% |
| **`src/context/AuthContext.jsx`** | 88.5% | 75.0% | 100.0% | 88.2% |
| **`src/context/CartContext.jsx`** | 68.6% | 56.5% | 55.5% | 71.7% |
| **`src/components/ProductCard.jsx`** | 71.4% | 50.0% | 66.6% | 76.9% |
| **TOTAL CONSOLIDADO** | **82.79%** | **72.52%** | **80.17%** | **86.03%** |

---

## 6. Interpretación de Resultados

- **Líneas (86.03%) y Sentencias (82.79%):** Superan holgadamente la exigencia del 80% requerida por la pauta. Las instrucciones principales del catálogo, login, registro y utilidades operan bajo cobertura total.
- **Funciones (80.17%):** Se comprueban todas las funciones de validación de RUT, cómputo del 19% de IVA, alertas de stock crítico y llamadas del servicio.
- **Ramas (72.52%):** Supera el 70% solicitado por la rúbrica. Las ramas pendientes corresponden a branches defensivas de errores poco comunes (como cuota excedida en storage del navegador).

---

## 7. Acciones de Mejora Identificadas

1. **`CartContext.jsx`:** Incrementar pruebas sobre la función de remoción y vaciado completo del carrito.
2. **`ProductCard.jsx`:** Agregar caso de prueba con producto sin imagen definida para probar el fallback visual por defecto.
