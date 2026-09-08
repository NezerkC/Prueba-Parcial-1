# Guía de Estructura y Flujo de Trabajo — Prueba Parcial 1

Documento de referencia para el equipo de desarrollo. Define la arquitectura del proyecto, la convención de ramas, el protocolo de sincronización y el estándar de commits para garantizar orden, trazabilidad e integración limpia.

---

## 1. Estructura del Repositorio

El proyecto utiliza una arquitectura modular basada en tecnologías web estándar (HTML5 semántico, Vanilla CSS3 y Vanilla JavaScript ES6+), sin dependencias externas pesadas.

```text
Prueba-Parcial-1/
│
├── index.html                  # Página principal de inicio (Landing / Home)
│
├── assets/                     # Recursos estáticos
│   └── img/                    # Catálogo de imágenes (productos, banners, avatares)
│
├── css/                        # Capa de presentación y diseño
│   └── styles.css              # Hoja de estilos centralizada (variables CSS, layout, componentes, media queries)
│
├── js/                         # Capa de lógica de negocio y comportamiento dinámico
│   ├── admin.js                # Gestión del panel de administración (CRUD productos/usuarios)
│   ├── carrito.js              # Lógica de persistencia, cálculo de totales y render del carrito
│   ├── catalogo.js             # Listado de productos, filtros por categoría y ordenamiento
│   ├── regiones-comunas.js     # Datos geográficos para selectores en formularios
│   └── validaciones.js         # Validaciones de formularios (login, registro, checkout, contacto)
│
├── pages/                      # Vistas y páginas públicas secundarias
│   ├── blog-detalle.html       # Lectura individual de artículos de blog
│   ├── blogs.html              # Listado general de artículos
│   ├── carrito.html            # Vista del carrito de compras y checkout
│   ├── contacto.html           # Formulario de contacto y soporte
│   ├── login.html              # Inicio de sesión de usuarios
│   ├── nosotros.html           # Información institucional de la empresa
│   ├── producto-detalle.html   # Ficha técnica y detalle de producto
│   ├── productos.html          # Catálogo completo con grilla y filtros
│   ├── registro.html           # Formulario de registro de clientes
│   │
│   └── admin/                  # Vistas exclusivas para administración
│       ├── home.html           # Dashboard principal administrativo
│       ├── productos.html      # Gestión de inventario de productos
│       └── usuarios.html       # Gestión de cuentas de usuario
│
└── docs/                       # Documentación formal del proyecto
    └── ...                     # Requisitos de software (ERS) y especificaciones
```

---

## 2. Estrategia de Ramas (Branching Model)

Para evitar colisiones entre miembros del equipo y mantener el historial ordenado, las ramas se clasifican estrictamente según el **tipo de archivo / capa** y su **alcance**.

### Rama Principal
* **`main`**: Rama de producción y entrega. Solo contiene código probado, estable e integrado mediante Pull Requests o merges validados. **Nunca se trabaja directamente sobre `main`**.

### Convención de Nomenclatura para Ramas de Trabajo

El nombre de la rama sigue el patrón:

$$\text{tipo}/\text{alcance}$$

#### A. Prefijo por Tipo de Archivo / Capa técnica
* `style/` : Modificaciones exclusivas de hojas de estilo (`css/styles.css`).
* `js/` : Modificaciones de scripts y lógica de negocio (`js/*.js`).
* `html/` : Creación o edición de estructura y marcado (`index.html` o vistas en `pages/`).
* `assets/` : Incorporación, reemplazo u optimización de imágenes y recursos multimedia.
* `feat/` : Nuevas funcionalidades completas que tocan transversalmente múltiples capas sincronizadas.

#### B. Sufijo por Alcance
* **`general`**: Si la tarea abarca refactorizaciones globales, estilos transversales a todo el sitio o lógica transversal compartida.
* **Sustantivo específico**: Cuando la tarea se enfoca en un módulo, vista o componente concreto (en minúsculas y separado por guiones si es compuesto).

### Ejemplos de Ramas Válidas
| Rama | Archivos Involucrados | Propósito |
| :--- | :--- | :--- |
| `style/general` | `css/styles.css` | Sistema de diseño base, tipografías globales, resets o media queries globales. |
| `style/catalogo` | `css/styles.css` | Ajustes de presentación exclusivos de las tarjetas o grilla del catálogo. |
| `js/general` | `js/*.js` | Integración transversal de scripts, utilitarios comunes o almacenamiento. |
| `js/carrito` | `js/carrito.js` | Funcionalidad específica de cálculo de totales o persistencia en localStorage. |
| `js/validaciones`| `js/validaciones.js` | Reglas de validación para formularios de registro o checkout. |
| `html/login` | `pages/login.html` | Corrección de accesibilidad o estructura del formulario de acceso. |
| `assets/catalogo`| `assets/img/*` | Adición de fotografías de productos del catálogo. |

---

## 3. Reglas de Oro del Flujo de Trabajo

### Regla 1: Sincronización Obligatoria Antes de Comenzar
> [!IMPORTANT]
> **Prohibido iniciar trabajo sobre una base desactualizada.**
> Antes de escribir cualquier línea de código, debes descargar los últimos cambios aprobados en el repositorio remoto para prevenir conflictos y sobrescrituras accidentales.

1. Cambiar a la rama base (`main` o la rama de integración activa):
   ```bash
   git switch main
   ```
2. Descargar los cambios más recientes del remoto:
   ```bash
   git pull origin main
   ```

---

### Regla 2: Análisis Previo y Elección de Rama
Antes de abrir archivos para editar, responde estas dos preguntas:
1. **¿Qué tipo de archivo voy a tocar?** (¿CSS, JS, HTML o imágenes?) $\rightarrow$ Determina el prefijo (`style/`, `js/`, `html/`, `assets/`).
2. **¿Es un cambio puntual o transversal?** $\rightarrow$ Si es amplio, usa `general`; si es específico, usa el sustantivo correspondiente.

* **Si la rama ya existe en local o remoto**:
  ```bash
  git switch <nombre-de-rama>
  git pull origin <nombre-de-rama>
  ```
* **Si es una tarea nueva**, créala partiendo de `main` actualizado:
  ```bash
  git switch -c <tipo>/<alcance>
  ```

---

### Regla 3: Ciclo de Desarrollo y Verificación
1. **Comprobar qué archivos se modificaron**:
   ```bash
   git status
   ```
2. **Revisar visualmente el diff para evitar subir código de depuración o cambios indeseados**:
   ```bash
   git diff
   ```
3. **Preparar archivos de forma atómica** (agrega únicamente los archivos pertinentes a la tarea):
   ```bash
   git add css/styles.css
   # O si son varios relacionados:
   git add pages/login.html js/validaciones.js
   ```

---

## 4. Estándar de Commits (Conventional Commits)

Los mensajes de commit deben describir con precisión **qué** se hizo y **dónde**, facilitando la lectura del historial del proyecto.

### Formato

```text
tipo(alcance): descripción breve en imperativo y en minúsculas

[cuerpo opcional con detalles técnicos adicionales]
```

### Tipos Permitidos
* `feat`: Nueva funcionalidad para el usuario (ej. cálculo de descuento en carrito, filtro de búsqueda).
* `fix`: Corrección de un error o bug (ej. error en selector de comunas, validación de RUT).
* `style`: Cambios visuales que no alteran la lógica (CSS, espaciados, colores, responsive design).
* `refactor`: Reestructuración de código sin agregar funcionalidad ni corregir bugs.
* `perf`: Mejoras de rendimiento (carga de fuentes, optimización de imágenes, reducción de repaints).
* `docs`: Cambios exclusivos en documentación (`README.md`, especificaciones).
* `chore`: Mantenimiento general, limpieza de archivos obsoletos o configuración de entorno.

### Ejemplos Correctos
```bash
git commit -m "style(responsive): ajustar grilla de productos para resoluciones moviles"
git commit -m "feat(carrito): implementar persistencia del contador en localstorage"
git commit -m "fix(validaciones): corregir expresion regular del campo correo en registro"
git commit -m "docs(workflow): documentar estructura del repositorio y estandar de ramas"
```

---

## 5. Integración y Merges (Fusión de Ramas)

La integración entre ramas debe seguir un orden estricto para proteger la estabilidad de `main` y resolver posibles conflictos en la rama de trabajo antes de tocar la rama principal.

### Caso A: Traer los cambios de `main` hacia tu rama (`main` $\rightarrow$ rama)
**¿Cuándo se usa?**
* Cuando otro compañero integró cambios a `main` y necesitas tenerlos en tu código.
* Antes de fusionar tu rama hacia `main`, para resolver cualquier conflicto de forma aislada en tu entorno y no romper producción.

**Paso a paso:**
1. Asegúrate de tener guardados y commiteados los cambios de tu rama (`git status` limpio).
2. Cambia a `main` y descarga la última versión del repositorio:
   ```bash
   git switch main
   git pull origin main
   ```
3. Regresa a tu rama de trabajo:
   ```bash
   git switch <tu-rama>
   ```
4. Fusiona `main` dentro de tu rama:
   ```bash
   git merge main
   ```
5. **Si no hay conflictos**: Git creará un commit de merge automáticamente.
6. **Si hay conflictos**:
   * Git indicará los archivos en conflicto.
   * Abre los archivos marcados, decide qué cambios conservar y elimina los marcadores (`<<<<<<<`, `=======`, `>>>>>>>`).
   * Guarda los archivos y marca los conflictos como resueltos:
     ```bash
     git add <archivos-resueltos>
     git commit -m "fix(merge): resolver conflictos con main"
     ```
7. Sube tu rama actualizada al remoto:
   ```bash
   git push origin <tu-rama>
   ```

---

### Caso B: Integrar tu rama terminada hacia `main` (rama $\rightarrow$ `main`)
**¿Cuándo se usa?**
* Cuando la tarea de tu rama está 100% terminada, probada y lista para la entrega o release.

> [!TIP]
> **Práctica recomendada de Arquitectura:**
> Antes de fusionar hacia `main`, ejecuta siempre el **Caso A** (merge de `main` en tu rama). Si algo rompe o hay conflictos, los solucionas en tu rama sin poner en riesgo la estabilidad del proyecto.

**Paso a paso:**
1. Una vez validada tu rama y con `main` ya integrado en ella, cambia a `main`:
   ```bash
   git switch main
   ```
2. Asegura tener `main` al día:
   ```bash
   git pull origin main
   ```
3. Fusiona tu rama de trabajo en `main`:
   ```bash
   git merge <tu-rama>
   ```
4. Publica la versión integrada en el repositorio remoto:
   ```bash
   git push origin main
   ```
5. *(Opcional)* Si la rama ya cumplió su ciclo y no se usará más, elimínala para mantener el árbol limpio:
   ```bash
   # Eliminar rama local
   git branch -d <tu-rama>
   # Eliminar rama remota (si aplica)
   git push origin --delete <tu-rama>
   ```

---

## 6. Resumen del Flujo Paso a Paso (Cheat Sheet)

```bash
# === INICIO DE TAREA ===
# 1. Asegurar tener el código más reciente de main
git switch main
git pull origin main

# 2. Elegir o crear la rama de trabajo adecuada
git switch -c style/catalogo

# === DESARROLLO Y CONFIRMACIÓN ===
# 3. Realizar cambios en el editor y verificar
git status
git diff

# 4. Agregar archivos y commitear con estándar
git add css/styles.css
git commit -m "style(catalogo): alinear tarjetas de productos y badges de descuento"

# 5. Subir la rama al remoto
git push -u origin style/catalogo

# === ACTUALIZAR RAMA CON MAIN (CASO A) ===
git switch main
git pull origin main
git switch style/catalogo
git merge main
git push origin style/catalogo

# === FINALIZAR E INTEGRAR EN MAIN (CASO B) ===
git switch main
git pull origin main
git merge style/catalogo
git push origin main
```

