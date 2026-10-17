# Estrategia de Git, CI/CD, Despliegue en Vercel e Integración SQL/PLSQL con Supabase

**Proyecto:** Sonido Vivo — Plataforma Web de E-commerce y Gestión  
**Destinos Cloud:** GitHub, Vercel, Supabase (PostgreSQL / PL/pgSQL)  
**Clasificación:** Plan de Arquitectura DevOps, Integración Continua y Persistencia Relacional  

---

## 1. Topología de Ramas Git y Flujo de Trabajo

Para evitar colisiones entre el desarrollo de la interfaz gráfica, la suite de pruebas y el sistema de diseño visual, el repositorio operará bajo una topología de cuatro ramas estructuradas:

```text
 ┌────────────────────────────────────────────────────────┐
 │ main (Producción / Estable / Protegida)               │
 └───────▲─────────────────▲────────────────────▲─────────┘
         │ PR              │ PR                 │ PR
 ┌───────┴──────┐  ┌───────┴──────┐     ┌───────┴───────┐
 │ componentes  │  │ test         │     │ desing        │
 │ (JSX / Logic)│  │ (Vitest/A11y)│     │ (CSS/Tokens)  │
 └──────────────┘  └──────────────┘     └───────────────┘
```

### 1.1. Matriz de Responsabilidades por Rama

| Rama | Propósito Estricto | Políticas de Modificación |
| :--- | :--- | :--- |
| `main` | Código fuente productivo, estable y desplegable. | Prohibido el push directo (`git push origin main`). Solo se actualiza mediante Pull Requests aprobados con suite de CI exitosa al 100%. |
| `componentes` | Construcción de componentes en Atomic Design (átomos, moléculas, organismos, páginas y layouts). | Depende de la lógica validada en `test` y los estilos de `desing`. Commits bajo convención `feat:`. |
| `test` | Implementación de pruebas unitarias, integración, cobertura, accesibilidad (`jest-axe`) y mocks. | No modifica UI visual; define y ajusta contratos de software. Commits bajo convención `test:`. |
| `desing` | Hojas de estilo CSS modulares, paleta Olivini Gold (`:root`), variables de color, tipografía y adaptación de Bootstrap. | No modifica lógica de negocio ni componentes funcionales. Commits bajo convención `style:`. |

### 1.2. Protocolo de Comandos para Inicialización Local

```bash
# 1. Asegurar estado en rama main
git checkout main

# 2. Creación y publicación de ramas especializadas
git checkout -b desing
git checkout -b test
git checkout -b componentes

# 3. Retorno a rama de trabajo inicial
git checkout test
```

---

## 2. Pipeline de Integración Continua (CI/CD) con GitHub Actions

Se define un pipeline determinista en `.github/workflows/ci.yml` que audita automáticamente cada commit y pull request antes de autorizar su integración a `main`.

```yaml
name: CI / Quality Assurance Pipeline

on:
  push:
    branches: [ main, componentes, test, desing ]
  pull_request:
    branches: [ main ]

jobs:
  audit-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Descargar Código Fuente
        uses: actions/checkout@v4

      - name: Configurar Entorno Node.js (LTS)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Instalación Limpia de Dependencias
        run: npm ci

      - name: Auditoría de Linter (ESLint)
        run: npm run lint

      - name: Ejecución de Suite de Pruebas Unitarias e Integración
        run: npm run test:run

      - name: Verificación de Umbrales de Cobertura (Mínimo 80%)
        run: npm run coverage

      - name: Verificación de Compilación de Producción (Vite Build)
        run: npm run build

      - name: Publicar Artefactos de Cobertura
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
```

*Comportamiento preventivo:* Si cualquiera de los pasos falla (cobertura menor al 80%, error de linter o falla en compilación), el pipeline detiene el proceso y bloquea el merge hacia la rama principal.

---

## 3. Estrategia de Despliegue en la Nube: Vercel

### 3.1. Mitigación del Error 404 en Aplicaciones de Página Única (SPA)
Dado que React Router manipula el historial del navegador del lado del cliente (`HTML5 History API`), las peticiones directas a rutas como `/catalogo`, `/carrito` o `/admin/home` generarán un error HTTP 404 si el servidor web de Vercel intenta resolverlas como archivos físicos.

Para prevenir este fallo, se configurará el archivo `vercel.json` en la raíz del proyecto:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3.2. Gestión de Variables de Entorno
En el panel de configuración de Vercel se registrarán las claves de conexión a la base de datos sin exponer secretos en el repositorio:
* `VITE_SUPABASE_URL`: Endpoint de la instancia en la nube.
* `VITE_SUPABASE_ANON_KEY`: Llave pública anonimizada para operaciones desde el frontend con Row Level Security (RLS).

---

## 4. Estrategia de Integración de Base de Datos: SQL y PL/SQL hacia Supabase

### 4.1. Análisis Técnico: Diferencias de Sintaxis y Adaptación a Supabase

Supabase está construido sobre PostgreSQL, cuyo motor procedural es **PL/pgSQL**. Si el script existente del usuario fue desarrollado en Oracle PL/SQL o SQL Server T-SQL, se deben anticipar las siguientes conversiones obligatorias:

| Característica | Oracle PL/SQL | Supabase / PostgreSQL (PL/pgSQL) |
| :--- | :--- | :--- |
| **Tipos de Texto** | `VARCHAR2(n)` | `VARCHAR(n)` o `TEXT` |
| **Tipos Numéricos** | `NUMBER(10,2)` | `NUMERIC(10,2)` o `INTEGER` |
| **Identificadores Autoincrementables** | `SEQUENCE + Trigger` o `NUMBER GENERATED BY DEFAULT AS IDENTITY` | `SERIAL`, `BIGSERIAL` o `GENERATED ALWAYS AS IDENTITY` |
| **Fecha / Hora Actual** | `SYSDATE` | `CURRENT_TIMESTAMP` o `now()` |
| **Procedimientos Almacenados** | `CREATE OR REPLACE PROCEDURE ...` | `CREATE OR REPLACE PROCEDURE ...` o `CREATE OR REPLACE FUNCTION ... RETURNS void` |
| **Estructura de Triggers** | El disparador incluye el bloque de código procedural directamente. | **Desacoplado en dos pasos:** 1) Función que retorna tipo `trigger`, 2) Declaración del `CREATE TRIGGER` que invoca dicha función. |
| **Variables de Fila en Triggers** | `:NEW.columna`, `:OLD.columna` (con dos puntos) | `NEW.columna`, `OLD.columna` (sin dos puntos) |

---

### 4.2. Esquema Relacional de Base de Datos para Sonido Vivo

Esquema SQL compatible al 100% con Supabase para sustituir la persistencia estática de `base html`:

```sql
-- ============================================================================
-- ESQUEMA RELACIONAL: SONIDO VIVO (PostgreSQL / Supabase)
-- ============================================================================

-- 1. Tabla de Roles de Usuario
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (nombre) VALUES 
('Administrador'), ('Vendedor'), ('Cliente')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rut VARCHAR(12) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    rol_id INT REFERENCES roles(id) DEFAULT 3,
    region VARCHAR(100),
    comuna VARCHAR(100),
    direccion VARCHAR(300),
    fecha_nacimiento DATE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Categorías de Instrumentos
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    icono VARCHAR(10) DEFAULT '🎸'
);

INSERT INTO categorias (nombre, icono) VALUES
('Guitarras Acústicas', '🎸'),
('Guitarras Eléctricas', '⚡🎸'),
('Bajos Eléctricos', '🎸'),
('Baterías', '🥁'),
('Teclados y Pianos', '🎹'),
('Amplificadores', '🔊'),
('Micrófonos', '🎙️'),
('Pedales de Efectos', '🎛️'),
('Accesorios', '🎼'),
('Estudio y Grabación', '🎧')
ON CONFLICT (nombre) DO NOTHING;

-- 4. Tabla de Productos e Inventario
CREATE TABLE IF NOT EXISTS productos (
    codigo VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100),
    categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL,
    precio INT NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    stock_critico INT NOT NULL DEFAULT 3 CHECK (stock_critico >= 0),
    descripcion TEXT,
    imagen VARCHAR(255),
    icono VARCHAR(10) DEFAULT '🎵',
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla de Órdenes de Compra
CREATE TABLE IF NOT EXISTS ordenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    subtotal_neto INT NOT NULL CHECK (subtotal_neto >= 0),
    iva INT NOT NULL CHECK (iva >= 0),
    total INT NOT NULL CHECK (total >= 0),
    estado VARCHAR(30) DEFAULT 'COMPLETADA',
    fecha_orden TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Detalle de Ordenes (Ítems)
CREATE TABLE IF NOT EXISTS orden_detalles (
    id SERIAL PRIMARY KEY,
    orden_id UUID REFERENCES ordenes(id) ON DELETE CASCADE,
    producto_codigo VARCHAR(20) REFERENCES productos(codigo) ON DELETE RESTRICT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario INT NOT NULL CHECK (precio_unitario >= 0),
    subtotal INT NOT NULL CHECK (subtotal >= 0)
);
```

---

### 4.3. Lógica Procedural y Triggers (PL/pgSQL)

#### Trigger de Control Automático de Stock al Procesar Compras:
Disminuye el stock físico automáticamente tras la inserción en `orden_detalles`, impidiendo ventas por encima de la disponibilidad real:

```sql
CREATE OR REPLACE FUNCTION fn_descontar_stock_por_venta()
RETURNS TRIGGER AS $$
DECLARE
    v_stock_actual INT;
BEGIN
    SELECT stock INTO v_stock_actual
    FROM productos
    WHERE codigo = NEW.producto_codigo;

    IF v_stock_actual < NEW.cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente para el producto % (Stock disponible: %, Solicitado: %)',
            NEW.producto_codigo, v_stock_actual, NEW.cantidad;
    END IF;

    UPDATE productos
    SET stock = stock - NEW.cantidad
    WHERE codigo = NEW.producto_codigo;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_descontar_stock
AFTER INSERT ON orden_detalles
FOR EACH ROW
EXECUTE FUNCTION fn_descontar_stock_por_venta();
```

#### Función Procedural para Registro de Orden Completa (Transacción Atómica):
```sql
CREATE OR REPLACE FUNCTION sp_crear_orden_compra(
    p_usuario_id UUID,
    p_subtotal INT,
    p_iva INT,
    p_total INT,
    p_items JSONB
)
RETURNS UUID AS $$
DECLARE
    v_orden_id UUID;
    v_item JSONB;
BEGIN
    -- 1. Insertar cabecera de la orden
    INSERT INTO ordenes (usuario_id, subtotal_neto, iva, total)
    VALUES (p_usuario_id, p_subtotal, p_iva, p_total)
    RETURNING id INTO v_orden_id;

    -- 2. Recorrer arreglo JSONB e insertar los detalles
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO orden_detalles (orden_id, producto_codigo, cantidad, precio_unitario, subtotal)
        VALUES (
            v_orden_id,
            v_item->>'codigo',
            (v_item->>'cantidad')::INT,
            (v_item->>'precio')::INT,
            ((v_item->>'cantidad')::INT * (v_item->>'precio')::INT)
        );
    END LOOP;

    RETURN v_orden_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 5. Patrón Repositorio en Frontend: Desacoplamiento para Tests

Para que la suite de Vitest continúe funcionando a máxima velocidad sin depender de llamadas de red a Supabase durante los tests unitarios, el frontend se programa contra una interfaz de repositorio (`Repository Pattern`):

```text
  React Components (UI)
           │
           ▼
     useInventory()
           │
     ┌─────┴─────────────────────┐
     ▼                           ▼
Mock Repository             Supabase Repository
(Para Vitest / TDD)         (Para Producción / Vercel)
```

Al ejecutar `npm test`, Vitest inyecta el repositorio en memoria predecible; al compilar en Vercel, la aplicación consume el cliente `@supabase/supabase-js` conectado a la base de datos relacional.
