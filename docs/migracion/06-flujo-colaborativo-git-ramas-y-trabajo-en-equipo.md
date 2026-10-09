# 06 · Flujo de Trabajo Colaborativo en Git, Topología de Ramas y Guía Operativa

**Proyecto:** Sonido Vivo — Plataforma Web de E-commerce y Gestión  
**Asignatura:** DSY1104 FullStack II — Duoc UC  
**Equipo de Desarrollo:** NezerkC, Daakhen, dysandoval  
**Repositorio Oficial:** [`NezerkC/Prueba-Parcial-1`](https://github.com/NezerkC/Prueba-Parcial-1)  
**Clasificación:** Guía Operativa de Control de Versiones, Gestión de Ramas y Concurrencia de Equipo  

---

## 1. Propósito y Filosofía de Trabajo

Para asegurar una colaboración limpia, libre de conflictos destructivos de código y con total trazabilidad entre los 3 integrantes del grupo, este documento define el **estándar oficial de Git** para la etapa de desarrollo en React.

### Principios Fundamentales
1. **Aislamiento Estricto:** Nadie programa directamente sobre `main`. Cada tarea tiene su propia rama.
2. **Sincronización Continua:** Se descargan cambios del remoto (`git pull`) antes de iniciar y antes de fusionar.
3. **Commits Descriptivos:** Se usa la convención *Conventional Commits* para saber exactamente qué cambió cada miembro.
4. **Validación Preventiva:** Antes de solicitar integración, la suite de pruebas locales (`npm run test:run`) debe pasar al 100%.

---

## 2. Mapa Oficial de Ramas del Proyecto

El repositorio opera bajo una arquitectura estructurada de ramas base y ramas de características (*Feature Branches*):

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ main (Rama de Producción / Estable / Protegida / Solo Pull Requests)   │
 └───────▲───────────────────────▲────────────────────────▲───────────────┘
         │ PR                    │ PR                     │ PR
 ┌───────┴──────────────┐ ┌──────┴──────────────┐  ┌──────┴───────────────┐
 │ componentes          │ │ test                │  │ desing               │
 │ (Lógica JSX / Vistas)│ │ (Vitest / A11y)     │  │ (CSS / Olivini Gold) │
 └───────▲──────────────┘ └──────▲──────────────┘  └──────▲───────────────┘
         │                       │                        │
 ┌───────┴──────────────┐ ┌──────┴──────────────┐  ┌──────┴───────────────┐
 │ feat/catalogo        │ │ test/validaciones   │  │ style/bootstrap-vars │
 │ feat/carrito         │ │ test/servicios-api  │  │ style/componentes    │
 │ feat/auth-login      │ │ test/carrito        │  │ style/responsive     │
 └──────────────────────┘ └─────────────────────┘  └──────────────────────┘
```

---

## 3. Matriz de Ramas y Responsabilidades

| Rama / Prefijo | Propósito Estricto | Archivos Típicos Involucrados | Reglas de Push |
| :--- | :--- | :--- | :--- |
| `main` | Código estable, probado y listo para entrega/evaluación. | Todo el proyecto. | **Prohibido el push directo.** Solo se actualiza mediante Pull Request aprobado. |
| `componentes` | Rama integradora de arquitectura Atomic Design (átomos, moléculas, organismos, páginas). | `src/components/**/*`, `src/pages/**/*` | Se fusionan aquí las ramas `feat/*`. |
| `test` | Rama integradora de calidad, pruebas unitarias, mocks y accesibilidad. | `src/**/__tests__/*`, `*.test.jsx`, `src/setupTests.js` | Se fusionan aquí las ramas `test/*`. |
| `desing` | Rama integradora del sistema visual, tokens Olivini Gold, tipografía y Bootstrap 5. | `src/index.css`, `src/styles/**/*`, variables `:root` | Se fusionan aquí las ramas `style/*`. |
| `feat/<nombre>` | Construcción de una funcionalidad específica (ej. catálogo, carrito, login). | Archivos de la funcionalidad asignada. | Push libre por el desarrollador responsable. |
| `style/<nombre>`| Ajustes visuales, paleta de colores, diseño responsive. | CSS, clases de Bootstrap y diseño adaptativo. | Push libre por el desarrollador responsable. |
| `test/<nombre>` | Creación de casos de prueba específicos con Vitest / Testing Library. | Archivos de prueba unitaria y mocks. | Push libre por el desarrollador responsable. |
| `fix/<nombre>`  | Corrección urgente de un error o bug detectado en componentes existentes. | Archivo con la falla puntual. | Push libre por el desarrollador responsable. |
| `docs/<nombre>` | Documentación técnica, manuales, bitácora de arquitectura y guías. | `docs/**/*`, `README.md` | Push libre por el desarrollador responsable. |

---

## 4. Distribución Sugerida de Tareas para los 3 Integrantes

Para repartir equitativamente el trabajo de la rúbrica y no cruzarse en los mismos archivos:

| Integrante | Rol Principal | Módulos y Ramas Asignadas | Entregables Clave |
| :--- | :--- | :--- | :--- |
| **NezerkC** | *Arquitectura, Layouts & Admin* | • `docs/migracion`<br>• `feat/auth-login`<br>• `feat/panel-admin`<br>• `feat/routing-navegacion` | Configuración de Vite/Router, componentes de Dashboard, CRUD administrativo y navegación global. |
| **Daakhen** | *Catálogo, UI & Sistema de Diseño* | • `desing`<br>• `style/tokens-olivini-gold`<br>• `feat/catalogo-productos`<br>• `feat/tarjetas-producto` | Descomposición de catálogo, átomos/moléculas visuales (botones, badges, tarjetas, modales) y estilos base. |
| **dysandoval** | *Lógica de Carrito, Validación & Suite TDD* | • `test`<br>• `test/validaciones-rut`<br>• `test/carrito-compras`<br>• `feat/carrito-checkout` | Carrito interactivo (localStorage), motor de validaciones (RUT/email), y tests unitarios en Vitest con >80% cobertura. |

---

## 5. Protocolo de Comandos Paso a Paso (Cheat Sheet Diario)

### Paso 1: Comenzar el día sincronizando `main`
Antes de escribir cualquier código, actualiza siempre tu repositorio local con lo último que subió el equipo:

```bash
# 1. Cambiar a la rama principal
git switch main

# 2. Descargar las últimas actualizaciones del equipo
git pull origin main
```

---

### Paso 2: Crear tu rama de trabajo
Crea tu rama basada siempre en `main` actualizado:

```bash
# Ejemplo si vas a programar el catálogo de productos:
git switch -c feat/catalogo-productos

# Ejemplo si vas a crear pruebas unitarias del carrito:
git switch -c test/carrito-compras

# Ejemplo si vas a retocar estilos o CSS:
git switch -c style/tokens-olivini-gold
```

---

### Paso 3: Desarrollar, probar y verificar el estado
Realiza los cambios en tu editor (VS Code, Antigravity, etc.). Antes de guardar un commit:

```bash
# 1. Ejecutar las pruebas para asegurarte de que nada se rompió
npm run test:run

# 2. Ver qué archivos modificaste
git status

# 3. Ver exactamente qué líneas cambiaste
git diff
```

---

### Paso 4: Preparar y commitear con Conventional Commits
Agrega únicamente los archivos de tu tarea y escribe un mensaje claro:

```bash
# Agregar archivos específicos
git add src/components/ProductCard.jsx src/components/ProductCard.test.jsx

# Commit según el estándar:
git commit -m "feat(catalogo): implementar tarjeta de producto con badge de descuento"
```

#### Prefijos de commit permitidos:
* `feat:` Nueva funcionalidad o componente visible.
* `fix:` Corrección de un bug o error.
* `style:` Cambios de diseño, CSS, espaciados o tokens de color (sin tocar lógica).
* `test:` Adición o modificación de pruebas unitarias en Vitest.
* `docs:` Cambios en archivos Markdown (`.md`) o comentarios técnicos.
* `refactor:` Limpieza o reestructuración de código sin cambiar el resultado.
* `chore:` Ajuste de dependencias, scripts de `package.json` o configuración.

---

### Paso 5: Subir tu rama a GitHub (`git push`)
La primera vez que subes tu rama, usa la bandera `-u` para vincularla al remoto:

```bash
# Subir tu rama al repositorio remoto
git push -u origin feat/catalogo-productos

# En las siguientes ocasiones bastará con:
git push
```

---

### Paso 6: Actualizar tu rama con los cambios de `main` (Evitar Conflictos)
Si un compañero tuyo ya integró código a `main` mientras tú estabas trabajando en tu rama, debes traer esos cambios a tu rama antes de pedir la integración final:

```bash
# 1. Traer y actualizar main local
git switch main
git pull origin main

# 2. Volver a tu rama de trabajo
git switch feat/catalogo-productos

# 3. Fusionar main dentro de tu rama
git merge main
```

* **Si no hay conflictos:** Git creará el merge limpiamente.
* **Si hay conflictos:**
  1. Git te avisará qué archivos tienen conflicto.
  2. Abre los archivos marcados y busca las marcas:
     ```text
     <<<<<<< HEAD (Tu código)
     Código que tú escribiste
     =======
     Código que escribió tu compañero en main
     >>>>>>> main
     ```
  3. Elige el código correcto o combínalos, y borra las marcas `<<<<<<<`, `=======`, `>>>>>>>`.
  4. Guarda el archivo, pruébalo (`npm run test:run`) y confírmalo:
     ```bash
     git add .
     git commit -m "fix(merge): resolver conflictos con rama main"
     git push origin feat/catalogo-productos
     ```

---

### Paso 7: Apertura de Pull Request (PR) e Integración Final
Una vez que tu rama está subida y sin conflictos:
1. Ve al repositorio en GitHub: [https://github.com/NezerkC/Prueba-Parcial-1](https://github.com/NezerkC/Prueba-Parcial-1).
2. Haz clic en **"Compare & pull request"**.
3. Selecciona la rama base destino (`componentes`, `test`, `desing` o directamente `main`).
4. Describe brevemente los cambios y qué integrante revisa.
5. Tras la aprobación, se pulsa **"Merge pull request"**.
6. En tu consola local, vuelves a `main` y actualizas:
   ```bash
   git switch main
   git pull origin main
   ```

---

## 6. Reglas de Oro para Todo el Equipo

> [!CAUTION]
> **1. NUNCA USAR `git push --force`**  
> El force push puede borrar el trabajo de tus compañeros en el servidor de GitHub. Está terminantemente prohibido sobre cualquier rama compartida.

> [!IMPORTANT]
> **2. NUNCA COMITEAR `node_modules/` NI ARCHIVOS TEMPORALES**  
> Verifica siempre que el archivo `.gitignore` contenga `node_modules/`, `dist/`, `.env`, y logs.

> [!TIP]
> **3. AVISAR EN EL GRUPO ANTES DE HACER MERGE A `main`**  
> Avisar por WhatsApp / Discord cuando vayas a fusionar un Pull Request grande para que los demás puedan hacer `git pull` de inmediato.

> [!NOTE]
> **4. COMMITS ATÓMICOS Y PEQUEÑOS**  
> Es mucho mejor hacer 5 commits pequeños y descriptivos durante la tarde que 1 solo commit gigante con 40 archivos modificados al final de la noche. Facilita enormemente depurar y revisar el código.
