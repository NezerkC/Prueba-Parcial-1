# Descomposición de la Interfaz bajo Metodología Atomic Design

**Proyecto:** Sonido Vivo (Migración HTML5 a React + Vite + Vitest)  
**Estándar:** Metodología de Diseño Atómico (Brad Frost) & Contratos de Componentes React  
**Clasificación:** Especificación Técnica de Interfaz de Usuario  

---

## 1. Fundamentos y Jerarquía del Sistema

La metodología Atomic Design descompone las interfaces web en cinco niveles discretos de abstracción. Esta arquitectura elimina la duplicación de código, garantiza la reutilización estricta de elementos y permite aplicar pruebas unitarias independientes en cada capa:

```text
 ÁTOMOS         MOLÉCULAS        ORGANISMOS          PLANTILLAS         PÁGINAS
┌───────┐     ┌───────────┐    ┌─────────────┐     ┌───────────┐     ┌───────────┐
│ Button│ ──> │ FormField │ ─> │ LoginForm   │ ──> │ AuthLayout│ ──> │ LoginPage │
│ Input │     │ SearchBar │    │ ProductCard │     │ MainLayout│     │ Catalog   │
│ Badge │     │ StatCard  │    │ CartTable   │     │ AdminGrid │     │ Dashboard │
└───────┘     └───────────┘    └─────────────┘     └───────────┘     └───────────┘
```

---

## 2. Nivel 1: Átomos (Atoms)

Los átomos son los bloques indivisibles de la interfaz. No poseen dependencias internas ni lógica de negocio, encapsulando únicamente propiedades visuales y eventos nativos.

| Componente | Props / Contrato | Clases CSS / Tokens Vinculados | Rol ARIA / A11y |
| :--- | :--- | :--- | :--- |
| `<Button />` | `variant: 'primary' \| 'secondary' \| 'outline' \| 'danger'`<br>`size: 'sm' \| 'md' \| 'lg'`<br>`block?: boolean`<br>`disabled?: boolean`<br>`onClick?: () => void`<br>`children: ReactNode` | `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-danger`, `.btn-sm`, `.btn-block` | `role="button"`<br>`aria-disabled={disabled}` |
| `<Input />` | `type: 'text' \| 'email' \| 'password' \| 'number' \| 'date'`<br>`value: string \| number`<br>`placeholder?: string`<br>`isInvalid?: boolean`<br>`maxLength?: number`<br>`onChange: (e) => void`<br>`onBlur?: (e) => void` | `.search-input`, `.input-error`, variables `--color-border-focus` | `aria-invalid={isInvalid}`<br>`aria-describedby={errorId}` |
| `<Select />` | `options: Array<{ value: string, label: string }>`<br>`value: string`<br>`isInvalid?: boolean`<br>`onChange: (e) => void` | `form-group select`, `.input-error` | `role="combobox"` |
| `<Textarea />` | `value: string`<br>`rows?: number`<br>`maxLength?: number`<br>`isInvalid?: boolean`<br>`onChange: (e) => void` | `textarea`, `.input-error` | `aria-multiline="true"` |
| `<Badge />` | `variant: 'ok' \| 'critical' \| 'danger' \| 'category' \| 'admin'`<br>`children: ReactNode` | `.badge`, `.badge-ok`, `.badge-critical`, `.badge-danger`, `.badge-category`, `.badge-admin` | `role="status"` |
| `<Icon />` | `name: 'cart' \| 'musical' \| 'check' \| 'trash' \| 'search' \| 'user'`<br>`size?: number`<br>`className?: string` | `.cart-icon`, SVG stroke/fill | `aria-hidden="true"` |
| `<PriceTag />` | `monto: number`<br>`isFree?: boolean`<br>`className?: string` | `.product-price`, `.product-price.free` | `aria-label="Precio: X pesos chilenos"` |
| `<VideoPlayer />` | `src: string`<br>`poster?: string`<br>`controls?: boolean`<br>`className?: string` | `.responsive-video` | `role="region"` con título descriptivo |
| `<QuantityButton />`| `action: 'increment' \| 'decrement'`<br>`disabled?: boolean`<br>`onClick: () => void` | `.qty-btn`, `.btn-outline` | `aria-label="Aumentar / Reducir cantidad"` |

---

## 3. Nivel 2: Moléculas (Molecules)

Combinaciones funcionales de átomos que resuelven una unidad operativa concreta.

### 3.1. `<FormField />`
* **Composición:** `<label>` + `<Input />` | `<Select />` | `<Textarea />` + `<small class="error-msg">`.
* **Props:** `id`, `label`, `error?: string`, `required?: boolean`, `children: ReactElement`.
* **Comportamiento:** Si `error` tiene valor, inyecta `aria-invalid="true"` en el control hijo y despliega el mensaje con la clase `.show`.

### 3.2. `<SearchBar />`
* **Composición:** `<Input type="text" />` + `<Icon name="search" />` + botón de limpieza opcional.
* **Props:** `query: string`, `onSearchChange: (valor: string) => void`, `placeholder?: string`.
* **Comportamiento:** Emite cambios en tiempo real aplicando un debounce opcional de 150 ms para optimizar el filtrado de catálogo.

### 3.3. `<CategoryChip />`
* **Composición:** `<Button />` estilizado como cápsula interactiva (`.chip`).
* **Props:** `label: string`, `icon?: string`, `isActive: boolean`, `onClick: () => void`.
* **Comportamiento:** Alterna la clase `.active` y la apariencia visual Olivini Gold al seleccionarse.

### 3.4. `<CartBadgeButton />`
* **Composición:** Enlace con icono de bolsa de compras + `<Badge />` numérico superpuesto (`.cart-badge`).
* **Props:** `totalItems: number`, `to: string`.
* **Comportamiento:** Muestra el número acumulado de unidades en el carro. Si `totalItems === 0`, renderiza el contador en cero.

### 3.5. `<QuantityControl />`
* **Composición:** `<QuantityButton action="decrement" />` + `<Input type="number" />` + `<QuantityButton action="increment" />`.
* **Props:** `cantidad: number`, `stockMax: number`, `onChange: (nuevaCant: number) => void`.
* **Regla de negocio:** No permite decrementar a menos de 1 en el selector de ficha técnica; en la tabla de carrito, reducir desde 1 solicita confirmación o remueve el ítem.

### 3.6. `<StatCard />`
* **Composición:** Ícono contenedor + cifra destacada (`.stat-number`) + etiqueta descriptiva (`.stat-label`).
* **Props:** `titulo: string`, `valor: string | number`, `icono: string`, `alertClass?: string`.
* **Uso:** Utilizado en el Dashboard Administrativo para Valoración de Inventario, Stock Crítico y Total de Clientes.

### 3.7. `<RegionComunaPicker />`
* **Composición:** Dos `<FormField>` con elementos `<Select />` acoplados en cascada.
* **Props:** `regionSeleccionada: string`, `comunaSeleccionada: string`, `onRegionChange: (r: string) => void`, `onComunaChange: (c: string) => void`.
* **Regla de negocio:** Al mutar la región, la comuna se reinicia automáticamente y la lista desplegable de comunas se repuebla según el índice geográfico.

---

## 4. Nivel 3: Organismos (Organisms)

Estructuras complejas y autocontenidas que agrupan moléculas y átomos para formar secciones clave del producto.

### 4.1. `<PublicHeader />`
* **Módulos integrados:** Logo corporativo SVG + Menú de navegación principal + Botón de acceso ("Ingresar" / "Mi Perfil") + `<CartBadgeButton />` + Interruptor hamburguesa para móviles (`.menu-toggle`).
* **Estado interno:** `isMenuOpen: boolean` (control de menú colapsable en pantallas `< 768px`).

### 4.2. `<AdminHeader />`
* **Módulos integrados:** Logo con distintivo `<Badge variant="admin">` + Indicador de sesión activa ("Martín Gómez - Admin") + Botón "Ver Tienda Pública" + Botón "Cerrar Sesión".

### 4.3. `<ProductCard />`
* **Módulos integrados:** Miniatura de producto con respaldo de imagen fallback + `<Badge />` de categoría + Etiqueta de código de producto (`.product-code-tag`) + Marca y título comercial + Descripción resumida + `<PriceTag />` + Botón "Ver Detalle" (Link) + Botón "Añadir al Carro" (`<Button variant="primary">`).
* **Props:** `producto: Producto`, `onAddToCart: (p: Producto) => void`.

### 4.4. `<ProductGrid />`
* **Módulos integrados:** Grilla responsiva CSS (`display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`) que renderiza una lista de `<ProductCard />` o un estado visual vacío cuando no existen coincidencias.

### 4.5. `<CartTable />`
* **Módulos integrados:** Tabla semántica `<table>` con cabeceras (Producto, Precio Unitario, Cantidad, Subtotal, Acción). Cada fila despliega miniatura, controles `<QuantityControl />` y botón de eliminación con icono de papelera.

### 4.6. `<CartSummary />`
* **Módulos integrados:** Tarjeta lateral de liquidación con desglose:
  - Subtotal Neto (sumatoria de base imponible).
  - IVA Estimado (19% calculado con `Math.round(neto * 0.19)`).
  - Indicador de costo de despacho (Gratis para la V Región).
  - Total a Pagar en CLP.
  - Botón de acción principal: `<Button block variant="primary">Finalizar Compra</Button>`.

### 4.7. Formularios Especializados:
* **`<LoginForm />`:** Validación de correo (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`) y clave (4 a 10 caracteres).
* **`<RegisterForm />`:** Integración de RUN chileno (Módulo 11), nombres, apellidos, correo institucional, `<RegionComunaPicker />` y dirección física.
* **`<ContactForm />`:** Nombre, correo institucional, textarea con contador regresivo de caracteres (0/500).
* **`<AdminProductCrudTable />`:** Listado de bodega con indicador dinámico de stock (`evaluarNivelStock`) y acciones reactivas para editar y dar de baja artículos.
* **`<AdminUserCrudTable />`:** Matriz de cuentas registradas con cambio rápido de rol y estado.

---

## 5. Nivel 4: Plantillas (Templates)

Esquemas de disposición espacial abstractos que definen el layout estructural sin fijar contenido estático:

1. **`PublicLayout`:**
   ```jsx
   <div className="app-shell">
     <PublicHeader totalItems={cartCount} />
     <main className="container page-content">
       <Outlet />
     </main>
     <MainFooter />
   </div>
   ```
2. **`AdminLayout`:**
   ```jsx
   <div className="admin-shell">
     <AdminHeader usuario={currentUser} />
     <main className="container page-content">
       <div className="admin-layout">
         <AdminSidebar currentRoute={location.pathname} />
         <section className="admin-main">
           <Outlet />
         </section>
       </div>
     </main>
   </div>
   ```
3. **`CatalogLayout`:**
   Disposición a dos columnas con barra lateral de búsqueda y chips (`.catalog-sidebar`) junto a la sección de resultados (`.product-grid`).

---

## 6. Nivel 5: Páginas (Pages)

Instancias finales de la aplicación donde las plantillas se vinculan con datos reales y manejadores de estado global:

1. **`HomePage`:** Hero con video de tienda, sección de propuesta de valor, grilla de productos destacados y banner institucional Duoc.
2. **`CatalogPage`:** Orquestación de filtros, búsqueda reactiva y catálogo de 51 instrumentos.
3. **`ProductDetailPage`:** Ficha de producto con resolución de parámetro dinámico `:codigo`, selector de cantidad y ficha técnica de luthería.
4. **`CartPage`:** Vista de carro con alternancia automática entre vista de tabla o vista vacía (`CartEmptyState`).
5. **`LoginPage` / `RegisterPage` / `ContactPage`:** Páginas centradas con formularios validados.
6. **`AboutPage` / `BlogsPage` / `BlogDetailPage`:** Páginas de contenido editorial.
7. **`AdminDashboardPage`:** Métricas de inventario consolidado y tabla de alertas críticas.
8. **`AdminProductsPage`:** Mantenedor de catálogo en bodega.
9. **`AdminUsersPage`:** Mantenedor de cuentas de usuario y perfiles de acceso.
