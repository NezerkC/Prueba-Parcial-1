# Especificación de Requisitos de Software (ERS)
## Proyecto: Tienda Online Sonido Vivo — Migración a React
### Asignatura: DSY1104 — Desarrollo Fullstack II (Evaluación Parcial 2)

---

## 1. Introducción y Alcance

### 1.1 Propósito del Documento
El presente documento define la Especificación de Requisitos de Software (ERS) para la segunda etapa del proyecto semestral: la modernización y migración de la tienda online de instrumentos y equipos de audio **Sonido Vivo** desde su arquitectura estática inicial (HTML5, Vanilla CSS3 y Vanilla JavaScript) hacia una **Single Page Application (SPA)** construida con **React**, **Vite** y **React-Bootstrap**, respaldada por una suite de pruebas unitarias automatizadas con **Jasmine y Karma**.

### 1.2 Alcance del Sistema
La plataforma cubre el ciclo completo de experiencia del cliente y la operación básica de la tienda en modo demostrativo:
- Exploración de catálogo con filtrado por familias de instrumentos (Guitarras, Bajos, Baterías, Teclados, Audio en Vivo, Accesorios) y búsqueda en tiempo real.
- Vista de detalle con especificaciones técnicas, precio, descuento y control de stock disponible.
- Gestión de carrito de compra reactivo con cálculo automático de subtotal, IVA (19%) y total.
- Flujo de despacho y checkout validado con regiones y comunas de Chile.
- Simulación de compra con generación de orden de pedido y seguimiento.
- Panel de administración demostrativo para control de inventario y estado de órdenes.
- Canal de contacto y soporte con validaciones estrictas en cliente.
- Suite de pruebas unitarias sobre componentes de interfaz y lógica de negocio.

---

## 2. Requisitos Generales y Arquitectura Tecnológica

### 2.1 Stack Tecnológico
- **Librería UI:** React 19 / 18 con enfoque funcional y React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`).
- **Empaquetador y Servidor de Desarrollo:** Vite.
- **Enrutamiento:** React Router DOM (arquitectura declarativa de rutas).
- **Sistema de Diseño y Responsividad:** React-Bootstrap 2.x sobre Bootstrap 5 y CSS modular.
- **Persistencia de Datos:** `localStorage` y `sessionStorage` para catálogos demostrativos, sesiones y carritos.
- **Testing Unitario:** Jasmine Core + Karma Runner + Babel Loader + Istanbul para informes de cobertura de código.

### 2.2 Roles de Usuario
1. **Cliente / Visitante:** Navega el catálogo, filtra productos, gestiona su carrito, completa formulario de despacho y realiza compras simuladas.
2. **Administrador:** Accede al panel de control para visualizar métricas, crear/modificar productos del catálogo y auditar pedidos realizados.

---

## 3. Requisitos Funcionales (RF)

| ID | Nombre | Descripción | Criterio de Aceptación |
| :--- | :--- | :--- | :--- |
| **RF-01** | Navegación SPA y Enrutamiento | El usuario debe navegar entre Inicio, Catálogo, Detalle, Carrito, Nosotros, Blog y Contacto sin recarga de página. | Uso de `BrowserRouter`, `Routes` y `Route` de React Router; URL sincronizada con el estado. |
| **RF-02** | Catálogo y Búsqueda Reactiva | Grilla responsiva de productos con buscador por nombre/código y filtros combinados por categoría y rango de precio. | Los resultados se actualizan inmediatamente al escribir o seleccionar un filtro mediante estado local. |
| **RF-03** | Ficha Detallada de Producto | Vista individual que muestra galería de imágenes, descripción técnica, precio normal/oferta, disponibilidad y selector de cantidad. | No permite seleccionar cantidades superiores al stock disponible ni valores menores a 1. |
| **RF-04** | Carrito de Compras Persistente | Permite agregar, incrementar, decrementar o eliminar productos. Guarda el estado ante recargas de página. | Persistencia en `localStorage`; cálculo reactivo de subtotal, IVA (19%) y total final. Badge numérico en navbar. |
| **RF-05** | Formulario de Despacho y Envío | Captura y valida los datos de entrega: Región, Comuna, Calle, Número, Depto/Casa y Referencias. | Selectores dinámicos dependientes (Región -> Comuna); validación de campos obligatorios antes de pagar. |
| **RF-06** | Confirmación y Seguimiento | Generación de número de orden y comprobante de compra con detalle de productos, dirección de despacho y total. | Orden registrada en el historial local; vista de consulta de estado ("En preparación", "En ruta", "Entregado"). |
| **RF-07** | Formulario de Contacto y Validación | Envío de consultas con validación de nombre, correo y mensaje. | Rechazo de correos inválidos; aceptación exclusiva de dominios institucionales (`@duoc.cl`, `@profesor.duoc.cl`) y `@gmail.com`. |
| **RF-08** | Autenticación y Perfil Simulado | Formulario de inicio de sesión y registro de clientes con validación de contraseñas y RUT chileno. | Manejo de sesión activa en memoria/almacenamiento y alternancia de enlaces en navbar (Login / Mi Cuenta / Salir). |
| **RF-09** | Panel de Administración Demostrativo | Gestión de catálogo (agregar, editar precio/stock y eliminar) y consulta de listado global de pedidos. | Cambios reflejados de inmediato en el catálogo del cliente dentro del entorno local. |

---

## 4. Requisitos No Funcionales (RNF)

| ID | Categoría | Requisito | Métrica / Verificación |
| :--- | :--- | :--- | :--- |
| **RNF-01** | Responsividad | La interfaz debe adaptarse fluidamente a dispositivos móviles (>=360px), tablets (>=768px) y escritorios (>=1200px). | Sistema de grillas de Bootstrap (`col-12`, `col-md-6`, `col-lg-4`) sin desbordamiento horizontal. |
| **RNF-02** | Rendimiento y Carga | Carga inicial rápida de componentes y módulos diferidos (Lazy Loading cuando aplique). | Build de producción optimizado mediante Vite con tiempo de compilación menor a 2 segundos. |
| **RNF-03** | Calidad y Pruebas Unitarias | La suite de pruebas debe cubrir la lógica de componentes clave, renderizado condicional y manipulación de eventos. | Pruebas ejecutadas con Jasmine y Karma (`npm test`) alcanzando más del 80% de cobertura en funciones y líneas. |
| **RNF-04** | Mantenibilidad y Estructura | Separación estricta de responsabilidades (componentes presentacionales, contenedores, hooks y utilitarios). | Código modular bajo `src/components/`, `src/pages/`, `src/context/` o `src/services/`. |
| **RNF-05** | Accesibilidad (a11y) | Marcado semántico HTML5, atributos `aria-*` en modales y navegación accesible por teclado. | Estándares WCAG 2.1 AA en formularios y botones principales. |

---

## 5. Arquitectura de Componentes Propuesta

```text
src/
├── assets/                  # Logos, íconos y recursos estáticos
├── components/
│   ├── common/              # Navbar, Footer, ZonasDespacho, LoadingSpinner
│   ├── catalogo/            # ProductCard, ProductGrid, ProductFilters, SearchBar
│   ├── carrito/             # CartItem, CartSummary, CartBadge
│   ├── checkout/            # DespachoForm, OrderSummary, PaymentSimulator
│   └── admin/               # ProductTableRow, OrderTableRow, AdminSidebar
├── context/                 # CartContext, AuthContext (Estado global)
├── data/                    # productos.json, regiones-comunas.json
├── pages/                   # Home, CatalogoPage, ProductoDetallePage, CarritoPage, CheckoutPage, ContactoPage, AdminDashboard
├── services/                # storageService.js, validationService.js
└── test/                    # *.spec.jsx (Suites de Jasmine)
```

---

## 6. Plan de Pruebas Unitarias y Cobertura (Jasmine + Karma)

Las pruebas unitarias verificarán:
1. **Renderizado de Navbar y Footer:** Presencia de enlaces de navegación y renderizado del contador de items del carrito.
2. **ProductCard:** Despliegue correcto de nombre, precio formateado con pesos chilenos (`$`), badge de descuento y disparo del evento `onAddToCart`.
3. **CartSummary:** Cálculo matemático preciso de subtotal, impuesto (19%) y total final ante modificaciones de cantidad.
4. **DespachoForm:** Validación de campos vacíos, filtrado correcto de comunas según la región seleccionada y bloqueo de envío con datos inválidos.
5. **ValidationService:** Algoritmo de validación de correo institucional y verificación de formato de teléfono y RUT.
