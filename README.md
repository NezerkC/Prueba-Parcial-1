# Sonido Vivo — Plataforma Web de E-commerce y Gestión (Migración a React)

**Asignatura:** DSY1104 FullStack II — Duoc UC  
**Equipo de Desarrollo:** NezerkC, Daakhen, dysandoval  
**Stack Tecnológico:** React 19 · Vite 8 · React-Bootstrap · React Router 7 · Vitest 5 · Testing Library · jest-axe  

---

> [!NOTE]
> ### 🏛️ ¿Dónde está el proyecto anterior (HTML / CSS / JS Vanilla)?
> Todo el código, estilos, scripts, informe ERS y presentación de la **Etapa 1 (HTML estático)** se encuentra respaldado e intacto en la rama dedicada:
> 👉 **[`proyecto-html-base`](https://github.com/NezerkC/Prueba-Parcial-1/tree/proyecto-html-base)**
>
> La rama **`main`** (junto con `componentes`, `desing` y `test`) contiene exclusivamente la **Migración a React**.

---

## 1. Estructura Limpia del Repositorio (`main`)

```text
Prueba-Parcial-1/
│
├── fullstack-react-parcial-1/   # ⚛️ Aplicación Principal en React (SPA)
│   ├── public/assets/img/       # 56 recursos multimedia (instrumentos, logos SVG, videos MP4)
│   ├── src/
│   │   ├── components/          # Componentes UI (Navbar, Footer, ProductCard, ProductGrid, home/)
│   │   ├── context/             # Estado global del Carrito con localStorage (CartContext)
│   │   ├── data/                # Catálogo de 51 productos (productos.js) y comunas (regiones.js)
│   │   ├── hooks/               # Custom Hooks (useContador con límites de stock)
│   │   ├── pages/               # Vistas de la aplicación (Home y páginas de la tienda)
│   │   ├── services/            # Capa de consumo HTTP con Axios (api.js, ServicioAPI.js)
│   │   ├── utils/               # Reglas de negocio (RUT Módulo 11, IVA 19%, nivel de stock)
│   │   ├── App.jsx              # Enrutador principal (React Router)
│   │   └── index.css            # Sistema de diseño Olivini Gold + Bootstrap 5
│   ├── buildspec.yml            # Configuración CI/CD para AWS CodeBuild
│   ├── package.json             # Dependencias y scripts de la app
│   └── vite.config.js           # Configuración de Vite, Vitest (jsdom) y cobertura v8
│
├── docs/migracion/              # 📚 Documentación Técnica y Arquitectura de Migración
│   ├── 01-auditoria-arquitectura-base-html-vs-entorno-pruebas.md
│   ├── 02-descomposicion-atomic-design.md
│   ├── 03-guia-migracion-tdd-vitest.md
│   ├── 04-testing-y-cobertura-vitest.md
│   ├── 05-estrategia-git-cicd-cloud-y-base-de-datos.md
│   └── 06-flujo-colaborativo-git-ramas-y-trabajo-en-equipo.md
│
├── .github/workflows/ci.yml     # 🤖 Pipeline CI en GitHub Actions (Linter + Vitest + Build)
├── .devcontainer/               # ☁️ Configuración lista para GitHub Codespaces
└── package.json                 # Orquestador raíz (npm workspaces)
```

---

## 2. Inicio Rápido para el Equipo

Puedes ejecutar los comandos desde la raíz del repositorio o entrando a `fullstack-react-parcial-1/`:

```bash
# 1. Sincronizar con la rama principal
git switch main
git pull origin main

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo (http://localhost:5173)
npm run dev

# 4. Ejecutar las 30 pruebas unitarias (Vitest)
npm run test:run

# 5. Verificar linter y reporte de cobertura
npm run lint
npm run coverage
```

---

## 3. Mapa de Ramas y Flujo Colaborativo en Git

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ main (Rama de Producción / Estable / Solo Pull Requests)               │
 └───────▲───────────────────────▲────────────────────────▲───────────────┘
         │ PR                    │ PR                     │ PR
 ┌───────┴──────────────┐ ┌──────┴──────────────┐  ┌──────┴───────────────┐
 │ componentes          │ │ test                │  │ desing               │
 │ (Lógica JSX / Vistas)│ │ (Vitest / A11y)     │  │ (CSS / Olivini Gold) │
 └──────────────────────┘ └─────────────────────┘  └──────────────────────┘

 📦 proyecto-html-base  --> Rama histórica con el proyecto HTML/CSS/JS original intacto
```

### Asignación de Roles del Equipo (ver detalle en [`docs/migracion/06`](docs/migracion/06-flujo-colaborativo-git-ramas-y-trabajo-en-equipo.md))

| Integrante | Rol Principal | Ramas de Trabajo | Entregables en React |
| :--- | :--- | :--- | :--- |
| **NezerkC** | *Arquitectura, Router & Admin* | `feat/routing-navegacion`<br>`feat/auth-login`<br>`feat/panel-admin` | Rutas en `App.jsx`, vista de Login (`/login`) y Dashboard/CRUD Administrativo (`/admin`). |
| **Daakhen** | *Catálogo, Vistas & Diseño* | `desing`<br>`feat/catalogo-productos`<br>`feat/producto-detalle` | Catálogo con filtros (`/productos`), detalle de producto (`/producto/:codigo`), Nosotros y Blogs. |
| **dysandoval** | *Carrito, Validación & TDD* | `test`<br>`feat/carrito-checkout`<br>`feat/validaciones-registro` | Vista de Carrito/Checkout (`/carrito`), formulario de Registro (`/registro`), Contacto y pruebas TDD. |

---

## 4. Estándar de Commits (Conventional Commits)

```bash
git commit -m "feat(catalogo): implementar filtro por categoria y buscador en vivo"
git commit -m "feat(carrito): construir tabla de productos y resumen de pago con IVA"
git commit -m "test(validaciones): agregar pruebas de borde para formulario de registro"
git commit -m "style(ui): ajustar espaciado responsive en tarjetas de producto"
```
