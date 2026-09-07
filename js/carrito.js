const CLAVE_STORAGE = 'sonido_vivo_carrito_v1';


function obtenerCarrito() {
    try {
        const datos = localStorage.getItem(CLAVE_STORAGE);
        return datos ? JSON.parse(datos) : [];
    } catch (error) {
        console.error('Error al leer carrito desde LocalStorage:', error);
        return [];
    }
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(carrito));
        actualizarContadorBadge();
    } catch (error) {
        console.error('Error al guardar carrito en LocalStorage:', error);
    }
}

function agregarProductoAlCarrito(producto) {
    if (!producto || !producto.codigo) return;
    const carrito = obtenerCarrito();
    const index = carrito.findIndex(item => item.codigo === producto.codigo);
    if (index !== -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: Number(producto.precio) || 0,
            categoria: producto.categoria || 'Instrumentos',
            icono: producto.icono || '🎵',
            cantidad: 1
        });
    }
    guardarCarrito(carrito);
}