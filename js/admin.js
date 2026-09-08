/**
 * ============================================================================
 * admin.js
 * Lógica del Panel de Administración, CRUD de Inventario, Usuarios y Stock Crítico
 * Proyecto: Sonido Vivo (Evaluación Parcial 1 - DSY1104)
 * ============================================================================
 */

const STORAGE_INVENTARIO = 'sonido_vivo_inventario_v1';
const STORAGE_USUARIOS = 'sonido_vivo_usuarios_v1';

/**
 * --------------------------------------------------------------------------
 * NOMBRE:       Evaluador Semántico de Niveles de Stock
 * AFECTA A:     Badges de inventario y tablas administrativas (.badge-ok, .badge-critical, .badge-danger)
 * QUÉ HACE:     Calcula el estado del producto (Agotado, Crítico o Disponible) según el umbral
 * CÓMO LO HACE: Comparación numérica entre stock actual y stock crítico retornando estado y clase CSS
 * --------------------------------------------------------------------------
 */
function evaluarNivelStock(stockActual, stockCritico) {
    const actual = parseInt(stockActual, 10) || 0;
    const umbral = parseInt(stockCritico, 10) || 0;

    if (actual <= 0) {
        return {
            estado: 'AGOTADO',
            badgeCss: 'badge-danger',
            alertaCritica: true
        };
    } else if (actual <= umbral) {
        return {
            estado: `CRÍTICO (${actual} un.)`,
            badgeCss: 'badge-critical',
            alertaCritica: true
        };
    } else {
        return {
            estado: `DISPONIBLE (${actual} un.)`,
            badgeCss: 'badge-ok',
            alertaCritica: false
        };
    }
}

/**
 * --------------------------------------------------------------------------
 * NOMBRE:       Gestor de Persistencia de Inventario de Bodega
 * AFECTA A:     LocalStorage ('sonido_vivo_inventario_v1') y array en memoria
 * QUÉ HACE:     Carga o almacena la lista completa de productos e inicializa con catálogo base
 * CÓMO LO HACE: JSON.parse() y JSON.stringify() sobre LocalStorage con manejo de excepciones try/catch
 * --------------------------------------------------------------------------
 */
function obtenerInventarioAdmin() {
    const guardado = localStorage.getItem(STORAGE_INVENTARIO);
    if (guardado) {
        try {
            return JSON.parse(guardado);
        } catch (e) {
            console.error('Error al parsear inventario:', e);
        }
    }

    // Si no hay nada guardado, cargamos el catálogo base
    const inicial = (typeof PRODUCTOS_SONIDO_VIVO !== 'undefined') ? PRODUCTOS_SONIDO_VIVO : [];
    localStorage.setItem(STORAGE_INVENTARIO, JSON.stringify(inicial));
    return inicial;
}

function guardarInventarioAdmin(lista) {
    localStorage.setItem(STORAGE_INVENTARIO, JSON.stringify(lista));
}

/**
 * --------------------------------------------------------------------------
 * NOMBRE:       Gestor de Persistencia de Usuarios y Roles
 * AFECTA A:     LocalStorage ('sonido_vivo_usuarios_v1')
 * QUÉ HACE:     Provee la lista persistida de cuentas (Admin, Vendedor, Cliente) con perfiles semilla
 * CÓMO LO HACE: Lectura/escritura serializada en LocalStorage con fallback a array inicial de 3 usuarios
 * --------------------------------------------------------------------------
 */
function obtenerUsuariosAdmin() {
    const guardado = localStorage.getItem(STORAGE_USUARIOS);
    if (guardado) {
        try {
            return JSON.parse(guardado);
        } catch (e) {
            console.error('Error al parsear usuarios:', e);
        }
    }

    const inicial = [
        {
            rut: "19011022K",
            nombre: "Martín",
            apellidos: "Gómez Saavedra",
            correo: "martin.gomez@duoc.cl",
            rol: "Administrador",
            region: "V",
            comuna: "Viña del Mar",
            direccion: "Av. Libertad 1240, Dpto 502"
        },
        {
            rut: "185423194",
            nombre: "Camila",
            apellidos: "Pérez Morales",
            correo: "c.perez@profesor.duoc.cl",
            rol: "Vendedor",
            region: "V",
            comuna: "Valparaíso",
            direccion: "Calle Prat 450, Of. 20"
        },
        {
            rut: "201248912",
            nombre: "Ignacio",
            apellidos: "Silva Valenzuela",
            correo: "ignacio.silva@gmail.com",
            rol: "Cliente",
            region: "V",
            comuna: "Concón",
            direccion: "Bosques de Montemar 890"
        }
    ];

    localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(inicial));
    return inicial;
}

function guardarUsuariosAdmin(lista) {
    localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(lista));
}

// ============================================================================
// VISTA 1: DASHBOARD HOME (pages/admin/home.html)
// ----------------------------------------------------------------------------
// NOMBRE:       Controlador del Dashboard Operativo y Alertas
// AFECTA A:     #stat-total-productos, #stat-stock-critico, #stat-valor-inventario, #tabla-admin-criticos
// QUÉ HACE:     Calcula métricas globales de bodega, valor monetario en CLP y lista alertas urgentes
// CÓMO LO HACE: Agregación con forEach(), formateo toLocaleString('es-CL') e inyección dinámica en innerHTML
// ============================================================================
function inicializarDashboardAdmin() {
    const statProductos = document.getElementById('stat-total-productos');
    if (!statProductos) return;

    const productos = obtenerInventarioAdmin();
    const usuarios = obtenerUsuariosAdmin();

    let criticosCount = 0;
    let valorTotalInventario = 0;

    productos.forEach(p => {
        const evaluacion = evaluarNivelStock(p.stock, p.stockCritico || 3);
        if (evaluacion.alertaCritica) {
            criticosCount++;
        }
        valorTotalInventario += (Number(p.precio) || 0) * (Number(p.stock) || 0);
    });

    const statCriticos = document.getElementById('stat-stock-critico');
    const statUsers = document.getElementById('stat-total-usuarios');
    const statValor = document.getElementById('stat-valor-inventario');

    statProductos.textContent = productos.length;
    if (statCriticos) statCriticos.textContent = criticosCount;
    if (statUsers) statUsers.textContent = usuarios.length;
    if (statValor) statValor.textContent = '$' + valorTotalInventario.toLocaleString('es-CL');

    // Renderizar tabla rápida de alertas críticas
    const tbodyCriticos = document.getElementById('tabla-admin-criticos');
    if (tbodyCriticos) {
        const prodsCriticos = productos.filter(p => evaluarNivelStock(p.stock, p.stockCritico || 3).alertaCritica);
        if (prodsCriticos.length === 0) {
            tbodyCriticos.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--color-success);">✓ Todo el stock se encuentra en niveles óptimos.</td></tr>';
        } else {
            tbodyCriticos.innerHTML = prodsCriticos.slice(0, 5).map(p => {
                const ev = evaluarNivelStock(p.stock, p.stockCritico || 3);
                return `
          <tr>
            <td><strong>${p.codigo}</strong></td>
            <td>${p.nombre}</td>
            <td>${p.stock} un.</td>
            <td>${p.stockCritico || 3} un.</td>
            <td><span class="badge ${ev.badgeCss}">${ev.estado}</span></td>
          </tr>
        `;
            }).join('');
        }
    }
}

// ============================================================================
// VISTA 2: CRUD MANTENEDOR DE PRODUCTOS (pages/admin/productos.html)
// ----------------------------------------------------------------------------
// NOMBRE:       Controlador CRUD de Productos e Inventario
// AFECTA A:     table#tabla-crud-productos, form#form-producto-admin
// QUÉ HACE:     Permite crear, listar, editar y eliminar productos con validación estricta de stock
// CÓMO LO HACE: Delegación de eventos, mutación en array de LocalStorage y re-render reactivo de tabla
// ============================================================================
function inicializarMantenedorProductos() {
    const tabla = document.getElementById('tabla-crud-productos');
    if (!tabla) return;

    function renderTabla() {
        const productos = obtenerInventarioAdmin();
        const tbody = tabla.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = productos.map(p => {
            const ev = evaluarNivelStock(p.stock, p.stockCritico || 3);
            const precioStr = Number(p.precio) === 0 ? 'FREE' : '$' + Number(p.precio).toLocaleString('es-CL');

            return `
        <tr>
          <td><strong>${p.codigo}</strong></td>
          <td>${p.nombre}</td>
          <td><span class="badge badge-category">${p.categoria}</span></td>
          <td>${precioStr}</td>
          <td><strong>${p.stock}</strong></td>
          <td><span class="badge ${ev.badgeCss}">${ev.estado}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="editarProductoAdmin('${p.codigo}')">✏️ Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarProductoAdmin('${p.codigo}')">🗑️</button>
          </td>
        </tr>
      `;
        }).join('');
    }

    // Manejo del formulario de creación / edición de producto
    const formProducto = document.getElementById('form-producto-admin');
    if (formProducto) {
        formProducto.addEventListener('submit', (e) => {
            e.preventDefault();

            const codigo = document.getElementById('prod-codigo').value.trim().toUpperCase();
            const nombre = document.getElementById('prod-nombre').value.trim();
            const categoria = document.getElementById('prod-categoria').value;
            const precio = parseFloat(document.getElementById('prod-precio').value);
            const stock = parseInt(document.getElementById('prod-stock').value, 10);
            const stockCritico = parseInt(document.getElementById('prod-critico').value, 10) || 0;
            const descripcion = document.getElementById('prod-descripcion').value.trim();

            // Validaciones de negocio del Anexo 1
            if (codigo.length < 3) {
                alert('El código del producto debe tener al menos 3 caracteres.');
                return;
            }
            if (!nombre || nombre.length > 100) {
                alert('El nombre es obligatorio y debe tener como máximo 100 caracteres.');
                return;
            }
            if (!categoria) {
                alert('Debes seleccionar una categoría.');
                return;
            }
            if (isNaN(precio) || precio < 0) {
                alert('El precio debe ser un número mayor o igual a 0.');
                return;
            }
            if (isNaN(stock) || stock < 0) {
                alert('El stock debe ser un número entero mayor o igual a 0.');
                return;
            }

            let productos = obtenerInventarioAdmin();
            const indiceExistente = productos.findIndex(p => p.codigo === codigo);

            if (indiceExistente !== -1) {
                // Modo Edición
                productos[indiceExistente].nombre = nombre;
                productos[indiceExistente].categoria = categoria;
                productos[indiceExistente].precio = precio;
                productos[indiceExistente].stock = stock;
                productos[indiceExistente].stockCritico = stockCritico;
                productos[indiceExistente].descripcion = descripcion;
                alert(`Producto ${codigo} actualizado correctamente.`);
            } else {
                // Modo Creación
                productos.unshift({
                    codigo: codigo,
                    nombre: nombre,
                    marca: 'Sonido Vivo',
                    modelo: 'Estándar',
                    categoria: categoria,
                    precio: precio,
                    stock: stock,
                    stockCritico: stockCritico,
                    descripcion: descripcion,
                    icono: '🎵'
                });
                alert(`Producto ${codigo} registrado con éxito.`);
            }

            guardarInventarioAdmin(productos);
            formProducto.reset();
            document.getElementById('prod-codigo').removeAttribute('readonly');
            renderTabla();
        });
    }

    // Función global para editar producto
    window.editarProductoAdmin = function (codigo) {
        const productos = obtenerInventarioAdmin();
        const p = productos.find(item => item.codigo === codigo);
        if (!p) return;

        document.getElementById('prod-codigo').value = p.codigo;
        document.getElementById('prod-codigo').setAttribute('readonly', 'true');
        document.getElementById('prod-nombre').value = p.nombre;
        document.getElementById('prod-categoria').value = p.categoria;
        document.getElementById('prod-precio').value = p.precio;
        document.getElementById('prod-stock').value = p.stock;
        document.getElementById('prod-critico').value = p.stockCritico || 0;
        document.getElementById('prod-descripcion').value = p.descripcion || '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Función global para eliminar producto
    window.eliminarProductoAdmin = function (codigo) {
        if (confirm(`¿Estás seguro de eliminar el producto con código ${codigo}?`)) {
            let productos = obtenerInventarioAdmin();
            productos = productos.filter(p => p.codigo !== codigo);
            guardarInventarioAdmin(productos);
            renderTabla();
        }
    };

    renderTabla();
}
function inicializarMantenedorUsuarios() {
    const tabla = document.getElementById('tabla-crud-usuarios');
    if (!tabla) return;

    function renderTabla() {
        const usuarios = obtenerUsuariosAdmin();
        const tbody = tabla.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = usuarios.map(u => {
            let rolBadgeClass = 'badge-ok';
            if (u.rol === 'Administrador') rolBadgeClass = 'badge-danger';
            if (u.rol === 'Vendedor') rolBadgeClass = 'badge-category';

            return `
        <tr>
          <td><strong>${u.rut}</strong></td>
          <td>${u.nombre} ${u.apellidos}</td>
          <td>${u.correo}</td>
          <td><span class="badge ${rolBadgeClass}">${u.rol}</span></td>
          <td>${u.comuna} (Reg. ${u.region})</td>
          <td>${u.direccion}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="editarUsuarioAdmin('${u.rut}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarUsuarioAdmin('${u.rut}')">🗑️</button>
          </td>
        </tr>
      `;
        }).join('');
    }

    // Manejo del formulario de creación / edición de usuario
    const formUsuario = document.getElementById('form-usuario-admin');
    if (formUsuario) {
        formUsuario.addEventListener('submit', (e) => {
            e.preventDefault();

            const rut = document.getElementById('admin-user-rut').value.trim().toUpperCase();
            const nombre = document.getElementById('admin-user-nombre').value.trim();
            const apellidos = document.getElementById('admin-user-apellidos').value.trim();
            const correo = document.getElementById('admin-user-correo').value.trim();
            const rol = document.getElementById('admin-user-rol').value;
            const region = document.getElementById('admin-user-region').value;
            const comuna = document.getElementById('admin-user-comuna').value;
            const direccion = document.getElementById('admin-user-direccion').value.trim();

            if (typeof validarRutChileno === 'function' && !validarRutChileno(rut)) {
                alert('RUN chileno inválido (Módulo 11 sin puntos ni guión, ej: 19011022K).');
                return;
            }
            if (!nombre || nombre.length > 50) {
                alert('Nombre obligatorio (máx 50 caracteres).');
                return;
            }
            if (!apellidos || apellidos.length > 100) {
                alert('Apellidos obligatorios (máx 100 caracteres).');
                return;
            }
            if (typeof validarEmailInstitucional === 'function' && !validarEmailInstitucional(correo)) {
                alert('Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com.');
                return;
            }
            if (!rol) {
                alert('Debes asignar un rol al usuario.');
                return;
            }
            if (!region || !comuna) {
                alert('Debes seleccionar región y comuna.');
                return;
            }
            if (!direccion || direccion.length > 300) {
                alert('Dirección obligatoria (máx 300 caracteres).');
                return;
            }

            let usuarios = obtenerUsuariosAdmin();
            const index = usuarios.findIndex(u => u.rut === rut);

            if (index !== -1) {
                // Actualizar
                usuarios[index].nombre = nombre;
                usuarios[index].apellidos = apellidos;
                usuarios[index].correo = correo;
                usuarios[index].rol = rol;
                usuarios[index].region = region;
                usuarios[index].comuna = comuna;
                usuarios[index].direccion = direccion;
                alert(`Usuario ${rut} actualizado.`);
            } else {
                // Agregar
                usuarios.push({
                    rut, nombre, apellidos, correo, rol, region, comuna, direccion
                });
                alert(`Usuario ${rut} registrado con éxito.`);
            }

            guardarUsuariosAdmin(usuarios);
            formUsuario.reset();
            document.getElementById('admin-user-rut').removeAttribute('readonly');
            renderTabla();
        });
    }

    window.editarUsuarioAdmin = function (rut) {
        const usuarios = obtenerUsuariosAdmin();
        const u = usuarios.find(item => item.rut === rut);
        if (!u) return;

        document.getElementById('admin-user-rut').value = u.rut;
        document.getElementById('admin-user-rut').setAttribute('readonly', 'true');
        document.getElementById('admin-user-nombre').value = u.nombre;
        document.getElementById('admin-user-apellidos').value = u.apellidos;
        document.getElementById('admin-user-correo').value = u.correo;
        document.getElementById('admin-user-rol').value = u.rol;
        document.getElementById('admin-user-region').value = u.region;

        // Disparar evento change para cargar comunas
        const event = new Event('change');
        document.getElementById('admin-user-region').dispatchEvent(event);
        document.getElementById('admin-user-comuna').value = u.comuna;

        document.getElementById('admin-user-direccion').value = u.direccion;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.eliminarUsuarioAdmin = function (rut) {
        if (confirm(`¿Estás seguro de eliminar el usuario con RUN ${rut}?`)) {
            let usuarios = obtenerUsuariosAdmin();
            usuarios = usuarios.filter(u => u.rut !== rut);
            guardarUsuariosAdmin(usuarios);
            renderTabla();
        }
    };

    renderTabla();
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    inicializarDashboardAdmin();
    inicializarMantenedorProductos();
    inicializarMantenedorUsuarios();
});
