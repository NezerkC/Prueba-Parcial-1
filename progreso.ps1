# ==============================================================================
# Sonido Vivo - Asistente Local de Progreso y AI Task Coach
# Evalua el codigo fuente y muestra el estado del proyecto en tiempo real
# ==============================================================================

[CmdletBinding()]
param()

$baseDir = Join-Path $PSScriptRoot "fullstack-react-parcial-1"

function Test-FileRel($relPath) {
    return Test-Path (Join-Path $baseDir $relPath)
}

function Test-ContentRel($relPath, $text) {
    $fullPath = Join-Path $baseDir $relPath
    if (-not (Test-Path $fullPath)) { return $false }
    $content = Get-Content -Path $fullPath -Raw -ErrorAction SilentlyContinue
    return ($content -and $content.Contains($text))
}

# Definicion de las 12 tareas secuenciales
$tasks = @(
    @{
        Id = 1
        Tag = "Tarea 01"
        Title = "Setup de Arquitectura, Vite, Vitest y Bootstrap"
        Responsable = "NezerkC"
        Check = { (Test-FileRel "vite.config.js") -and (Test-FileRel "src/setupTests.js") -and (Test-FileRel "package.json") }
        Tip = "Configura Vite con el plugin de React, Vitest para jsdom y carga los estilos de Bootstrap en src/main.jsx."
    },
    @{
        Id = 2
        Tag = "Tarea 02"
        Title = "Motor de Utilidades y Reglas de Negocio (RUT, IVA y Stock)"
        Responsable = "dysandoval"
        Check = { (Test-FileRel "src/utils/validaciones.js") -and (Test-FileRel "src/utils/finanzas.js") -and (Test-FileRel "src/utils/stock.js") }
        Tip = "Implementa el algoritmo Modulo 11 en validaciones.js, el calculo de IVA 19% en finanzas.js y el stock critico en stock.js con sus tests."
    },
    @{
        Id = 3
        Tag = "Tarea 03"
        Title = "Estado Global del Carrito con CartContext y Custom Hook useContador"
        Responsable = "dysandoval"
        Check = { (Test-FileRel "src/context/CartContext.jsx") -and (Test-FileRel "src/hooks/useContador.js") }
        Tip = "Crea el CartProvider con persistencia en localStorage y el custom hook useContador con limites de stock minimo y maximo."
    },
    @{
        Id = 4
        Tag = "Tarea 04"
        Title = "Capa de Servicios HTTP y Catalogo de Datos Maestro"
        Responsable = "NezerkC"
        Check = { (Test-FileRel "src/services/api.js") -and (Test-FileRel "src/data/productos.js") }
        Tip = "Configura la instancia de Axios en api.js y exporta el catalogo de 51 productos en src/data/productos.js."
    },
    @{
        Id = 5
        Tag = "Tarea 05"
        Title = "Navegacion Global (Navbar, Footer) y Landing Page Home"
        Responsable = "Daakhen"
        Check = { (Test-FileRel "src/components/Navbar.jsx") -and (Test-FileRel "src/pages/Home.jsx") }
        Tip = "Construye la barra de navegacion con el badge reactivo del carrito, el Footer y la vista Home con sus secciones modulares."
    },
    @{
        Id = 6
        Tag = "Tarea 06"
        Title = "Catalogo de Productos Completo con Filtros y Buscador"
        Responsable = "Daakhen"
        Check = { (Test-FileRel "src/pages/Productos.jsx") -and (Test-ContentRel "src/App.jsx" "Productos") }
        Tip = "Construye src/pages/Productos.jsx con buscador en tiempo real, filtros por categoria con chips y conecta la ruta /productos en App.jsx."
    },
    @{
        Id = 7
        Tag = "Tarea 07"
        Title = "Ficha Tecnica de Producto Individual (ProductDetail)"
        Responsable = "Daakhen"
        Check = { (Test-FileRel "src/pages/ProductoDetalle.jsx") -and (Test-ContentRel "src/App.jsx" "ProductoDetalle") }
        Tip = "Crea src/pages/ProductoDetalle.jsx usando useParams para obtener el :codigo del producto, integrando selector de cantidad useContador y boton de agregar."
    },
    @{
        Id = 8
        Tag = "Tarea 08"
        Title = "Carrito de Compras Interactivo y Resumen Fiscal"
        Responsable = "NezerkC"
        Check = { (Test-FileRel "src/pages/Carrito.jsx") -and (Test-ContentRel "src/App.jsx" "Carrito") }
        Tip = "Crea src/pages/Carrito.jsx conectado al CartContext, con tabla interactiva, desglose de IVA 19% y total CLP, estado vacio amigable y boton de checkout."
    },
    @{
        Id = 9
        Tag = "Tarea 09"
        Title = "Formularios de Autenticacion (Login) y Registro con Validacion Reactiva"
        Responsable = "NezerkC"
        Check = { (Test-FileRel "src/pages/Login.jsx") -and (Test-FileRel "src/pages/Registro.jsx") -and (Test-ContentRel "src/App.jsx" "Login") }
        Tip = "Crea src/pages/Login.jsx y src/pages/Registro.jsx con validacion reactiva de RUT (Modulo 11) y selectores en cascada Region-Comuna."
    },
    @{
        Id = 10
        Tag = "Tarea 10"
        Title = "Paginas Institucionales (Nosotros, Contacto y Blogs)"
        Responsable = "Daakhen"
        Check = { (Test-FileRel "src/pages/Nosotros.jsx") -and (Test-FileRel "src/pages/Contacto.jsx") -and (Test-ContentRel "src/App.jsx" "Contacto") }
        Tip = "Implementa Nosotros.jsx y Contacto.jsx con contador reactivo de caracteres (limite 500) y conecta sus enlaces en el Navbar y Footer."
    },
    @{
        Id = 11
        Tag = "Tarea 11"
        Title = "Modulo Administrativo (Dashboard y CRUD de Inventario)"
        Responsable = "dysandoval"
        Check = { ((Test-FileRel "src/pages/Admin.jsx") -or (Test-FileRel "src/pages/admin/AdminDashboard.jsx") -or (Test-FileRel "src/pages/admin/AdminProductos.jsx")) -and ((Test-ContentRel "src/App.jsx" "Admin") -or (Test-ContentRel "src/App.jsx" "admin")) }
        Tip = "Construye el panel administrativo con metricas de catalogo, stock critico y tabla CRUD interactiva para administrar productos."
    },
    @{
        Id = 12
        Tag = "Tarea 12"
        Title = "Suite Integral de Pruebas Unitarias, Cobertura y Accesibilidad"
        Responsable = "dysandoval"
        Check = { (Test-FileRel "src/pages/Productos.test.jsx") -or (Test-FileRel "src/pages/Carrito.test.jsx") -or (Test-FileRel "src/pages/Registro.test.jsx") }
        Tip = "Escribe pruebas de componentes con Testing Library para las paginas principales y valida accesibilidad con jest-axe hasta superar el 80% de cobertura."
    }
)

# Evaluacion
$completedCount = 0
$firstPending = $null
$evaluatedTasks = @()

foreach ($t in $tasks) {
    $isDone = & $t.Check
    $status = ""
    if ($isDone) {
        $status = "[LISTO]"
        $completedCount++
    } elseif (-not $firstPending) {
        $status = "[EN CURSO]"
        $firstPending = $t
    } else {
        $status = "[PENDIENTE]"
    }
    $evaluatedTasks += [PSCustomObject]@{
        Tag = $t.Tag
        Estado = $status
        Tarea = $t.Title
        Responsable = $t.Responsable
        Tip = $t.Tip
    }
}

$totalTasks = $tasks.Count
$percentage = [math]::Round(($completedCount / $totalTasks) * 100, 1)

# Renderizado en consola
Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host " SONIDO VIVO :: AUTOPILOT DE PROGRESO Y SEGUIMIENTO DE PROYECTO               " -ForegroundColor Cyan
Write-Host " Repositorio: NezerkC/Prueba-Parcial-1 | DSY1104 FullStack II - Duoc UC         " -ForegroundColor DarkCyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

# Barra de progreso
$barTotal = 30
$barFilled = [math]::Floor(($completedCount / $totalTasks) * $barTotal)
$barEmpty = $barTotal - $barFilled
$bar = ("=" * $barFilled) + ("-" * $barEmpty)

Write-Host "  AVANCE GLOBAL: [$bar] $percentage% ($completedCount/$totalTasks Tareas)" -ForegroundColor Yellow
Write-Host ""
Write-Host ("  {0,-10} {1,-12} {2,-50} {3,-12}" -f "CODIGO", "ESTADO", "TAREA", "RESPONSABLE") -ForegroundColor Gray
Write-Host ("  {0,-10} {1,-12} {2,-50} {3,-12}" -f "------", "------", "-----", "-----------") -ForegroundColor Gray

foreach ($et in $evaluatedTasks) {
    $color = "Gray"
    if ($et.Estado -eq "[LISTO]") { $color = "Green" }
    elseif ($et.Estado -eq "[EN CURSO]") { $color = "Yellow" }

    $shortTitle = $et.Tarea
    if ($shortTitle.Length -gt 48) { $shortTitle = $shortTitle.Substring(0, 45) + "..." }

    Write-Host ("  {0,-10} {1,-12} {2,-50} {3,-12}" -f $et.Tag, $et.Estado, $shortTitle, $et.Responsable) -ForegroundColor $color
}

Write-Host ""
Write-Host "--------------------------------------------------------------------------------" -ForegroundColor DarkGray

if ($firstPending) {
    Write-Host " [!] QUE TOCA HACER AHORA:" -ForegroundColor Magenta
    Write-Host "     Tarea Activa: " -NoNewline -ForegroundColor White
    Write-Host "$($firstPending.Tag) - $($firstPending.Title)" -ForegroundColor Yellow
    Write-Host "     Asignado a:   " -NoNewline -ForegroundColor White
    Write-Host "$($firstPending.Responsable)" -ForegroundColor Cyan
    Write-Host "     Instruccion:  " -NoNewline -ForegroundColor White
    Write-Host "$($firstPending.Tip)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "     Para avanzar en el chat, solo di: 'avancemos' o 'hacer tarea actual'." -ForegroundColor DarkYellow
} else {
    Write-Host " [V] FELICITACIONES: Todas las tareas estan completadas al 100%!" -ForegroundColor Green
}

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""
