# 01 · Auditoría Arquitectónica Exhaustiva: Base HTML vs. Entorno de Pruebas

**Fecha de Evaluación:** Octubre 2026  
**Proyecto:** Sonido Vivo — Plataforma Web de E-commerce y Gestión  
**Asignatura / Entorno:** DSY1104 FullStack II — Duoc UC  
**Clasificación:** Auditoría de Ingeniería de Software y Especificación Técnica Profunda  

---

## 1. Topología y Desglose Físico del Sistema Origen (`base html`)

El proyecto original está construido bajo el paradigma MPA (*Multi-Page Application*) estático, desacoplado en archivos HTML individuales vinculados mediante rutas relativas (`../`, `../../`). La lógica operativa descansa en scripts Vanilla JavaScript (ES6+) con persistencia en `window.localStorage` y un archivo de estilos CSS monolítico.

```text
base html/
├── assets/
│   └── img/                    # Total: 56 recursos multimedia
│       ├── BT001.jpg a BT005.jpg   # Baterías (5 archivos)
│       ├── ES001.jpg a ES005.jpg   # Audio / Estudio (5 archivos)
│       ├── GA001.jpg a GA005.jpg   # Guitarras Acústicas (5 archivos)
│       ├── GE001.jpg a GE005.jpg   # Guitarras Eléctricas (5 archivos)
│       ├── MI001.jpg a MI004.jpg   # Micrófonos (4 archivos)
│       ├── PE001.jpg a PE006.jpg   # Pedales (6 archivos)
│       ├── TC001.jpg a TC004.jpg   # Teclados (4 archivos)
│       ├── thumb_*.jpg             # Miniaturas de videos y blogs (4 archivos)
│       ├── *.mp4                   # Videos comerciales y técnicos (3 archivos)
│       └── *.svg                   # Logotipo y símbolos vectoriales (2 archivos)
├── css/
│   └── styles.css              # Hoja de estilos central (1.269 líneas, 32.344 bytes)
├── docs/                       # Especificaciones funcionales ERS (IEEE 830) y guiones de defensa
├── js/
│   ├── admin.js                # Lógica del panel administrativo y CRUDs (22.331 bytes, 506 líneas)
│   ├── carrito.js              # Carro de compras y cálculo fiscal (9.766 bytes, 265 líneas)
│   ├── catalogo.js             # Catálogo maestro (36.588 bytes, 1.040 líneas, 51 productos)
│   ├── regiones-comunas.js     # Diccionario geográfico en cascada (3.339 bytes, 76 líneas)
│   └── validaciones.js         # Motor de validaciones y RUT Módulo 11 (15.037 bytes, 381 líneas)
└── pages/
    ├── admin/
    │   ├── home.html           # Dashboard con KPIs y alertas de stock (190 líneas)
    │   ├── productos.html      # Mantenedor CRUD de inventario (179 líneas)
    │   └── usuarios.html       # Mantenedor CRUD de perfiles y roles (184 líneas)
    ├── blog-detalle.html       # Visualizador de artículo técnico (12.641 bytes)
    ├── blogs.html              # Listado de guías y publicaciones (118 líneas)
    ├── carrito.html            # Tabla de compra y desglose financiero (157 líneas)
    ├── contacto.html           # Formulario de consultas con contador de caracteres (153 líneas)
    ├── login.html              # Formulario de acceso con credenciales demo (112 líneas)
    ├── nosotros.html           # Historia institucional y pilares de marca (172 líneas)
    ├── producto-detalle.html   # Ficha técnica individual y selector de cantidad (132 líneas)
    ├── productos.html          # Catálogo interactivo con filtros por familia (120 líneas)
    └── registro.html           # Formulario de cliente con selector en cascada (153 líneas)
```

---

## 2. Auditoría Detallada de Páginas y Contratos del DOM

Cada página del proyecto base presenta identificadores de anclaje (`id`), atributos de formulario y scripts dependientes que constituyen el **contrato funcional estricto** a replicar en la migración a React:

| Archivo HTML | Identificadores Críticos del DOM | Formularios y Atributos | Scripts Requeridos | Responsabilidad en la Migración |
| :--- | :--- | :--- | :--- | :--- |
| `productos.html` | `#buscar-producto`, `.category-chips .chip`, `#grid-productos`, `#catalogo-contador`, `#cart-count` | Input de búsqueda con `autocomplete="off"` | `catalogo.js`<br>`carrito.js`<br>`validaciones.js` | Migrar a `CatalogPage` gestionando estado local de filtro por texto y categoría con `useMemo`. |
| `producto-detalle.html` | `#det-icono`, `#det-codigo`, `#det-marca`, `#det-nombre`, `#det-categoria`, `#det-modelo`, `#det-precio`, `#det-stock`, `#det-descripcion`, `#det-cantidad`, `#btn-agregar-detalle` | Input numérico `min="1" max="10"` | `catalogo.js`<br>`carrito.js`<br>`validaciones.js` | Migrar a `ProductDetailPage` consumiendo parámetro `:codigo` mediante `useParams()` de React Router. |
| `carrito.html` | `#cart-empty-view`, `#cart-table-wrapper`, `#cart-table-body`, `#btn-vaciar-carrito`, `#cart-subtotal`, `#cart-iva`, `#cart-total`, `#btn-checkout` | Tabla con `<tbody id="cart-table-body">` y botón checkout | `catalogo.js`<br>`carrito.js`<br>`validaciones.js` | Migrar a `CartPage` conectado al `CartContext`. Reemplazar mutaciones manuales del DOM por renderizado condicional. |
| `login.html` | `#form-login`, `#login-correo`, `#login-pass`, `#error-login-correo`, `#error-login-pass` | `<form id="form-login" novalidate>` | `validaciones.js`<br>`carrito.js` | Migrar a `LoginPage` con validación reactiva de dominios institucionales y contraseña (4-10 caracteres). |
| `registro.html` | `#form-registro`, `#reg-rut`, `#reg-nombre`, `#reg-apellidos`, `#reg-correo`, `#reg-fecha`, `#select-region`, `#select-comuna`, `#reg-direccion` | Inputs con longitudes estrictas (`maxlength="9"`, `"50"`, `"100"`, `"300"`) | `regiones-comunas.js`<br>`validaciones.js`<br>`carrito.js` | Migrar a `RegisterPage` integrando el algoritmo Módulo 11 en tiempo real y selector en cascada. |
| `contacto.html` | `#form-contacto`, `#contacto-nombre`, `#contacto-correo`, `#contacto-mensaje`, `#char-count` | Textarea con límite de 500 caracteres (`maxlength="500"`) | `validaciones.js`<br>`carrito.js` | Migrar a `ContactPage` con cálculo reactivo del contador de caracteres `length/500`. |
| `admin/home.html` | `#stat-valoracion`, `#stat-criticos`, `#stat-usuarios`, `#tabla-alertas-stock`, `.admin-user-tag` | Dashboard con tarjetas métricas `.stats-grid` | `catalogo.js`<br>`admin.js`<br>`validaciones.js` | Migrar a `AdminDashboardPage` con métricas derivadas de `InventoryContext`. |
| `admin/productos.html` | `#form-producto-admin`, `#prod-codigo`, `#prod-nombre`, `#prod-categoria`, `#prod-marca`, `#prod-modelo`, `#prod-precio`, `#prod-stock`, `#prod-critico`, `#tabla-crud-productos` | Formulario CRUD para inserción y actualización de inventario | `catalogo.js`<br>`admin.js`<br>`validaciones.js` | Migrar a `AdminProductsPage` con acciones de alta, baja y modificación persistidas en estado. |
| `admin/usuarios.html` | `#form-usuario-admin`, `#admin-user-rut`, `#admin-user-rol`, `#admin-user-nombre`, `#admin-user-apellidos`, `#admin-user-correo`, `#tabla-crud-usuarios` | Formulario de control de perfiles y asignación de roles | `admin.js`<br>`validaciones.js` | Migrar a `AdminUsersPage` con gestión de roles (`Administrador`, `Vendedor`, `Cliente`). |

---

## 3. Desglose Quirúrgico de los Scripts Vanilla JS

### 3.1. `validaciones.js` — Motor de Reglas de Negocio Chilenas
El script contiene la lógica matemática y de negocio más crítica de la aplicación.

#### A. Algoritmo Módulo 11 (`validarRutChileno`)
Valida la integridad del Rol Único Nacional / Rol Único Tributario chileno:
1. **Normalización:** Limpia espacios y convierte a mayúsculas (`trim().toUpperCase()`).
2. **Validación de formato:** Regex estricto `/^[0-9]{7,8}[0-9K]$/`. Exige entre 7 y 8 dígitos para el cuerpo y 1 dígito o `K` para el dígito verificador (DV).
3. **Ponderación ponderada:** Itera el cuerpo de derecha a izquierda multiplicando por la serie cíclica $[2, 3, 4, 5, 6, 7]$:
   $$\text{Suma} = \sum_{i=0}^{n-1} \text{cuerpo}[n-1-i] \times \text{multiplicador}_i$$
4. **Cálculo del resto:** $\text{Resto} = 11 - (\text{Suma} \pmod{11})$.
5. **Determinación del DV esperado:**
   - Si $\text{Resto} = 11 \implies \text{DV} = \text{'0'}$
   - Si $\text{Resto} = 10 \implies \text{DV} = \text{'K'}$
   - En cualquier otro caso $\implies \text{DV} = \text{Resto}$
6. **Comparación:** Valida estrictamente si `dvIngresado === dvEsperado`.

#### B. Validación de Dominios Institucionales (`validarEmailInstitucional`)
Aplica la expresión regular:
```javascript
const REGEX_EMAIL_VALIDO = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
```
Restricción: Rechaza cualquier dominio que no pertenezca a la lista blanca institucional o Gmail, y rechaza correos con longitud superior a 100 caracteres.

#### C. Acoplamiento al DOM en `validaciones.js`
El script original manipula el DOM de forma imperativa:
```javascript
function mostrarError(input, errorElement, mensaje) {
  input.classList.add("input-error");
  input.closest(".form-group")?.classList.add("has-error");
  errorElement.textContent = mensaje;
  errorElement.classList.add("show");
}
```
*Riesgo de migración:* En React, esta manipulación imperativa debe transformarse en **estado declarativo** (`errors.rut`, `touched.rut`), de modo que la UI reaccione a los cambios sin tocar el DOM directamente.

---

### 3.2. `catalogo.js` — Catálogo Maestro y Motor de Búsqueda
Contiene la base de datos en memoria `PRODUCTOS_SONIDO_VIVO` con **51 productos** distribuidos en 10 categorías:

| Familia / Categoría | Conteo | Rango de Precios (CLP) | Stock Crítico Base |
| :--- | :---: | :---: | :---: |
| Guitarras Acústicas | 5 | \$79.990 – \$349.990 | 3 |
| Guitarras Eléctricas | 5 | \$249.990 – \$1.199.990 | 3 |
| Bajos Eléctricos | 3 | \$289.990 – \$549.990 | 2 |
| Baterías y Percusión | 5 | \$329.990 – \$1.299.990 | 2 |
| Teclados y Pianos | 4 | \$189.990 – \$899.990 | 2 |
| Amplificadores | 4 | \$99.990 – \$649.990 | 2 |
| Micrófonos | 4 | \$89.990 – \$399.990 | 4 |
| Pedales de Efectos | 6 | \$59.990 – \$289.990 | 3 |
| Accesorios | 10 | \$4.990 – \$49.990 | 5 |
| Estudio y Grabación | 5 | \$129.990 – \$799.990 | 2 |

#### Algoritmo de Búsqueda y Filtrado en `catalogo.js`:
```javascript
const productosFiltrados = PRODUCTOS_SONIDO_VIVO.filter(p => {
    const coincideCategoria = (categoriaActiva === 'TODAS' || p.categoria === categoriaActiva);
    const termino = busquedaTexto.toLowerCase();
    const coincideTexto = p.nombre.toLowerCase().includes(termino) ||
                          p.marca.toLowerCase().includes(termino) ||
                          p.modelo.toLowerCase().includes(termino) ||
                          p.descripcion.toLowerCase().includes(termino);
    return coincideCategoria && coincideTexto;
});
```
*Patrón a seguir en React:* Este filtrado debe ejecutarse mediante `useMemo` dependiente de dos estados: `searchQuery` y `selectedCategory`.

---

### 3.3. `carrito.js` — Máquina de Estados y Desglose Tributario

#### A. Persistencia y Llave de Almacenamiento
* **Clave de LocalStorage:** `'sonido_vivo_carrito_v1'`
* **Estructura de cada ítem:**
  ```typescript
  interface CartItem {
    codigo: string;
    nombre: string;
    precio: number;
    categoria: string;
    icono: string;
    imagen: string;
    cantidad: number;
  }
  ```

#### B. Modelo Matemático Tributario
El sistema opera bajo la legislación tributaria chilena (IVA 19%):
$$\text{Subtotal Neto} = \sum_{i=1}^{n} (\text{precio}_i \times \text{cantidad}_i)$$
$$\text{IVA Estimado} = \text{Math.round}(\text{Subtotal Neto} \times 0.19)$$
$$\text{Costo Despacho} = 0 \quad (\text{Gratis para Viña del Mar / Valparaíso})$$
$$\text{Total a Pagar} = \text{Subtotal Neto} + \text{IVA Estimado}$$

#### C. Operaciones y Casos de Borde:
* `agregarProductoAlCarrito(producto)`: Si el código ya existe, incrementa `cantidad += 1`. Si no existe, lo inserta con `cantidad: 1`.
* `modificarCantidad(codigo, delta)`: `cantidad += delta`. Si `cantidad <= 0`, el ítem es purgado automáticamente del arreglo.
* `eliminarProducto(codigo)`: Remueve el elemento mediante `filter()`.
* `vaciarCarrito()`: Limpia la clave de `localStorage` y resetea contadores.
* `actualizarContadorBadge()`: Calcula la suma de `cantidad` de todos los ítems y actualiza `#cart-count` en el encabezado.

---

### 3.4. `admin.js` — Panel de Gestión y Control de Stock

#### A. Persistencia Administrativa
* **Inventario:** Llave `'sonido_vivo_inventario_v1'` (inicializado a partir de `PRODUCTOS_SONIDO_VIVO`).
* **Usuarios:** Llave `'sonido_vivo_usuarios_v1'` (inicializado con 3 cuentas semilla):
  1. `19011022K` — Martín Gómez (Administrador, Viña del Mar).
  2. `185423194` — Camila Pérez (Vendedor, Valparaíso).
  3. `201248912` — Ignacio Silva (Cliente, Concón).

#### B. Función Semántica de Control de Stock (`evaluarNivelStock`):
```javascript
function evaluarNivelStock(stockActual, stockCritico) {
    const actual = parseInt(stockActual, 10) || 0;
    const umbral = parseInt(stockCritico, 10) || 0;

    if (actual <= 0) {
        return { estado: 'AGOTADO', badgeCss: 'badge-danger', alertaCritica: true };
    } else if (actual <= umbral) {
        return { estado: `CRÍTICO (${actual} un.)`, badgeCss: 'badge-critical', alertaCritica: true };
    } else {
        return { estado: `DISPONIBLE (${actual} un.)`, badgeCss: 'badge-ok', alertaCritica: false };
    }
}
```

#### C. KPIs Operativos del Negocio:
* **Valoración Total del Inventario:** $\sum (\text{precio} \times \text{stock})$ para todos los productos en bodega.
* **Alertas de Stock Crítico:** Conteo de productos donde `stock <= stockCritico`.
* **Cuentas Activas:** Total de registros en la lista de usuarios.

---

### 3.5. `regiones-comunas.js` — Jerarquía Geográfica
Exporta un mapa estructurado de regiones de Chile con sus respectivas comunas. En la versión HTML se enlaza mediante un listener `change` en el selector de región que vacía y recrea las opciones del selector de comuna. En React se modela como un selector dependiente puro sin efectos secundarios en el DOM.

---

## 4. Análisis del Sistema de Diseño CSS (`styles.css`)

### 4.1. Tokens y Variables del Sistema Olivini Gold
El archivo `styles.css` utiliza un sistema coherente de variables en `:root`:

```css
:root {
    --color-bg: #FAF8F2;
    --color-dark: #1A2413;
    --color-surface: #FFFFFF;
    --color-surface-hover: #F3EFE3;
    --color-border: #E2DDD0;
    --color-border-subtle: #EBE7DC;
    --color-border-focus: #D49B28;
    --color-text-main: #1A2413;
    --color-text-muted: #615E54;
    --color-text-light: #8C887B;
    --font-family: 'DM Sans', system-ui, sans-serif;
    --font-heading: 'Newsreader', Georgia, serif;
    --color-primary: #1A2413;
    --color-primary-hover: #29381E;
    --color-accent: #D49B28;
    --color-accent-hover: #B8831B;
    --color-secondary: #FFFFFF;
    --color-secondary-hover: #FAF8F2;
    --color-success: #4E632E;
    --color-success-bg: #EEF4E6;
    --color-danger: #A33A3A;
    --color-danger-bg: #FDF0F0;
    --color-warning: #94783B;
    --color-warning-bg: #FAF4E4;
    --max-width: 1200px;
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --shadow-card: 0 1px 3px rgba(26, 36, 19, 0.05), 0 4px 12px rgba(26, 36, 19, 0.03);
    --shadow-hover: 0 8px 24px rgba(26, 36, 19, 0.09);
    --transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 4.2. Análisis de Colisiones Potenciales con Bootstrap 5
El proyecto base utiliza clases con nombres idénticos a los de Bootstrap 5:
* `.container` — En `styles.css` tiene `max-width: 1200px; padding: 0 20px;`. Bootstrap inyecta paddings y media queries propios.
* `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-sm`, `.btn-block` — En `styles.css` tienen bordes redondeados específicos, tipografía `DM Sans`, y colores `--color-primary` (`#1A2413`). Bootstrap por defecto los teñirá de azul (`#0d6efd`).
* `.badge`, `.badge-ok`, `.badge-danger` — En `styles.css` tienen rellenos pastel con bordes suaves (`--color-success-bg`). Bootstrap aplica fondos saturados.
* `.card` / `.form-card` — En `styles.css` tienen sombras sutiles personalizadas (`--shadow-card`).

*Estrategia de Mitigación Defensiva:*  
1. No importar el CSS de Bootstrap de forma global sobreescribiendo todo.
2. Mantener `styles.css` importado en `src/index.css` **después** del reset de Bootstrap, o utilizar módulos CSS / clases utilitarias de React-Bootstrap configuradas con variantes personalizadas.
3. Asegurar que las variables CSS `--color-primary` prevalezcan en los componentes renderizados.

---

## 5. Auditoría Quirúrgica de `mi-proyecto-pruebas`

El proyecto `mi-proyecto-pruebas` implementa el estándar oficial de la Unidad 2 de DSY1104. Se auditaron minuciosamente los 17 archivos de prueba presentes en `src/`:

```text
mi-proyecto-pruebas/src/
├── App.a11y.test.jsx                   # Prueba de accesibilidad global con jest-axe
├── App.test.jsx                        # Prueba de integración: flujo completo de autenticación
├── medirRendimiento.test.jsx           # Telemetría de tiempo de renderizado con performance.now()
├── estructura.test.js                  # Validación de estructura del proyecto
├── login.test.js                       # Prueba aislada de login
├── setupTests.js                       # Extensión de Jest DOM matchers
├── components/
│   ├── ComponentePesado.test.jsx       # Prueba de carga de componentes
│   ├── Contador.test.jsx               # Prueba de eventos de usuario e incremento de estado
│   ├── Formulario.test.jsx             # Prueba de inputs y submit de formularios
│   ├── Input.test.jsx                  # Prueba de seguridad contra ataques de inyección XSS
│   ├── MiComponente.a11y.test.jsx      # Accesibilidad a nivel de componente atómico
│   ├── MiComponente.estructura.test.jsx# Verificación de nodos DOM esperados
│   └── MiComponente.test.jsx           # Verificación de render básico
├── hooks/
│   └── useContador.test.js             # Prueba unitaria de hook con renderHook y act()
└── services/
    ├── api.test.js                     # Prueba de consumo exitoso de API con mock
    ├── api.errores.test.js             # Prueba de manejo de error 500 con mockRejectedValue
    ├── apiData.test.js                 # Validación de estructura de payload
    └── ServicioAPI.test.js             # Prueba de servicio encapsulado
```

### 5.1. Análisis de Pruebas Críticas en `mi-proyecto-pruebas`

#### A. Prueba de Seguridad contra XSS (`src/components/Input.test.jsx`)
```javascript
test('previene inyección XSS', async () => {
  const user = userEvent.setup();
  render(<Input />);
  await user.type(screen.getByRole('textbox'), '<script>alert("XSS")</script>');
  expect(screen.getByRole('textbox')).toHaveValue('<script>alert("XSS")</script>');
  expect(document.body.innerHTML).not.toContain('<script>alert("XSS")</script>');
});
```
*Lección aprendida:* En Sonido Vivo, los formularios de Registro, Contacto y Edición de Productos deben garantizar que React escape automáticamente cualquier payload malicioso introducido por el usuario.

#### B. Telemetría de Rendimiento (`src/medirRendimiento.test.jsx`)
```javascript
function medirRendimiento(componente) {
  const inicio = performance.now();
  render(componente);
  const fin = performance.now();
  console.log(`Tiempo de renderizado: ${fin - inicio} ms`);
}
```
*Lección aprendida:* La renderización del catálogo de 51 productos (`ProductGrid`) debe instrumentarse para asegurar que el montaje ocurra en menos de **200 ms** en JSDOM.

#### C. Manejo Defensivo de Errores de API (`src/services/api.errores.test.js`)
```javascript
vi.mock('axios');
test('maneja errores de API correctamente', async () => {
  axios.get.mockRejectedValue(new Error('API Error'));
  await expect(fetchDatos()).rejects.toThrow('API Error');
});
```
*Lección aprendida:* Al integrar la base de datos de Supabase, la capa de servicios debe interceptar errores de red y retornar estados de degradación controlados sin provocar pantallas en blanco.

---

## 6. Matriz de Trampas de Migración y Medidas Preventivas

| Trampa de Migración | Causa Raíz | Síntoma / Falla en Tiempo de Ejecución | Medida Preventiva Obligatoria |
| :--- | :--- | :--- | :--- |
| **1. Colisión de Selectores CSS** | Nombres de clase comunes (`.btn`, `.card`, `.badge`) compartidos entre Bootstrap y `styles.css`. | Botones azules genéricos de Bootstrap que destruyen la identidad Olivini Gold. | Preservar `styles.css` con mayor precedencia o encapsularlo en clases temáticas (`.sonido-vivo-app`). |
| **2. Fugas de Memoria en JSDOM** | Creación repetida de entornos JSDOM pesados en cada archivo de test. | Pruebas lentas o congelamiento del proceso de Vitest en GitHub Actions / AWS t2.micro. | Mantener `maxWorkers: 2` y `maxConcurrency: 1` en `vite.config.js`. |
| **3. Polución de `localStorage`** | Pruebas que persisten datos en el almacenamiento sin limpiarlo al finalizar. | Tests de carrito o inventario que fallan de forma intermitente según el orden de ejecución. | Invocar `window.localStorage.clear()` en un bloque `beforeEach()` global. |
| **4. Error 404 en Navegación SPA** | Intentar acceder a rutas como `/catalogo` o `/admin/home` en servidores estáticos (Vercel). | Código HTTP 404 al recargar el navegador. | Incluir archivo `vercel.json` con reescritura hacia `/index.html`. |
| **5. Dependencia de Atributos de DOM Nativos** | Uso de `event.target.closest()` o `document.getElementById()` en componentes React. | Fallos en el ciclo de vida de React, warnings de mutación y pruebas que no encuentran nodos. | Reemplazar toda consulta al DOM por estados controlados (`useState`, `useReducer`) y referencias (`useRef`). |
| **6. Desajustes en Tipos de Moneda** | Manipulación de precios como strings ("\$129.990") en lugar de enteros numéricos (`129990`). | Errores de cálculo en subtotales e IVA (`NaN` o concatenación de texto). | Mantener los precios en el modelo como enteros (`number`) y formatear exclusivamente en la capa de renderizado con `formatearPrecioCLP()`. |
