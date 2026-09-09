

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
        if (!carrito[index].imagen && (producto.imagen || producto.codigo)) {
            carrito[index].imagen = producto.imagen || `${producto.codigo}.jpg`;
        }
    } else {
        carrito.push({
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: Number(producto.precio) || 0,
            categoria: producto.categoria || 'Instrumentos',
            icono: producto.icono || '🎵',
            imagen: producto.imagen || `${producto.codigo}.jpg`,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    mostrarNotificacionToast(`"${producto.nombre}" añadido al carrito.`);
}

/**
 * Modifica la cantidad (+1 o -1) de un ítem en el carrito.
 */
function modificarCantidad(codigo, delta) {
    let carrito = obtenerCarrito();
    const index = carrito.findIndex(p => p.codigo === codigo);

    if (index === -1) return;

    carrito[index].cantidad += delta;

    if (carrito[index].cantidad <= 0) {
        carrito = carrito.filter(p => p.codigo !== codigo);
    }

    guardarCarrito(carrito);
    renderizarTablaCarrito();
}

/**
 * Elimina por completo un producto del carrito.
 */
function eliminarProducto(codigo) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(p => p.codigo !== codigo);
    guardarCarrito(carrito);
    renderizarTablaCarrito();
}

/**
 * Vacía la totalidad de los artículos del carrito previa confirmación.
 */
function vaciarCarrito() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return;

    if (confirm('¿Estás seguro de que deseas vaciar el carrito de compras?')) {
        localStorage.removeItem(CLAVE_STORAGE);
        actualizarContadorBadge();
        renderizarTablaCarrito();
    }
}


function calcularTotalesFinancieros() {
    const carrito = obtenerCarrito();
    const subtotalNeto = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const iva = Math.round(subtotalNeto * 0.19);
    const total = subtotalNeto + iva;

    return {
        subtotal: subtotalNeto,
        iva: iva,
        total: total
    };
}


function actualizarContadorBadge() {
    const badges = document.querySelectorAll('#cart-count, .cart-badge');
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    badges.forEach(b => {
        b.textContent = totalItems;
    });
}

/**
 * Muestra una pequeña notificación visual no invasiva en pantalla.
 */
function mostrarNotificacionToast(mensaje) {
    let toast = document.getElementById('toast-cart-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-cart-notification';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.right = '24px';
        toast.style.background = '#1A2413';
        toast.style.color = '#FAF8F2';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '6px';
        toast.style.fontWeight = '600';
        toast.style.fontSize = '0.9rem';
        toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        toast.style.zIndex = '9999';
        toast.style.border = '1px solid #D49B28';
        toast.style.transition = 'all 0.2s ease';
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        document.body.appendChild(toast);
    }

    toast.textContent = mensaje;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
    }, 2500);
}


function renderizarTablaCarrito() {
    const tbody = document.getElementById('cart-table-body');
    const emptyView = document.getElementById('cart-empty-view');
    const tableWrapper = document.getElementById('cart-table-wrapper');
    const summaryCard = document.getElementById('cart-summary-card');

    if (!tbody) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        if (emptyView) emptyView.style.display = 'block';
        if (tableWrapper) tableWrapper.style.display = 'none';
        if (summaryCard) summaryCard.style.display = 'none';
        return;
    }

    if (emptyView) emptyView.style.display = 'none';
    if (tableWrapper) tableWrapper.style.display = 'block';
    if (summaryCard) summaryCard.style.display = 'block';

    tbody.innerHTML = carrito.map(item => {
        const subtotalItem = item.precio * item.cantidad;
        const precioStr = item.precio === 0 ? '¡GRATIS!' : '$' + item.precio.toLocaleString('es-CL');
        const subtotalStr = subtotalItem === 0 ? '¡GRATIS!' : '$' + subtotalItem.toLocaleString('es-CL');

        const imgHtml = (typeof generarImgProductoHtml === 'function')
            ? generarImgProductoHtml(item, {
                style: 'width: 48px; height: 48px; object-fit: contain; border-radius: var(--radius-sm); border: 1px solid var(--color-border); padding: 2px; background: #fff;',
                fallbackSize: '1.6rem'
              })
            : (function () {
                const baseImg = window.location.pathname.includes('/pages/') ? '../assets/img/' : 'assets/img/';
                const foto = item.imagen || (item.codigo ? `${item.codigo}.jpg` : '');
                return foto
                    ? `<img src="${baseImg}${foto}" alt="${item.nombre}" style="width: 48px; height: 48px; object-fit: contain; border-radius: var(--radius-sm); border: 1px solid var(--color-border); padding: 2px; background: #fff;" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';"><span style="display:none; font-size: 1.6rem;">${item.icono || '🎵'}</span>`
                    : `<span style="font-size: 1.6rem;">${item.icono || '🎵'}</span>`;
            })();

        return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            ${imgHtml}
            <div>
              <strong>${item.nombre}</strong>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">Cód: ${item.codigo} | ${item.categoria}</div>
            </div>
          </div>
        </td>
        <td>${precioStr}</td>
        <td>
          <div class="qty-control">
            <button type="button" class="qty-btn" onclick="modificarCantidad('${item.codigo}', -1)" aria-label="Restar una unidad">-</button>
            <span class="qty-val">${item.cantidad}</span>
            <button type="button" class="qty-btn" onclick="modificarCantidad('${item.codigo}', 1)" aria-label="Sumar una unidad">+</button>
          </div>
        </td>
        <td><strong>${subtotalStr}</strong></td>
        <td>
          <button type="button" class="btn btn-danger btn-sm" onclick="eliminarProducto('${item.codigo}')" title="Eliminar del carro">
            🗑️
          </button>
        </td>
      </tr>
    `;
    }).join('');

    // Actualización de los valores de resumen
    const totales = calcularTotalesFinancieros();
    const elemSubtotal = document.getElementById('cart-subtotal');
    const elemIva = document.getElementById('cart-iva');
    const elemTotal = document.getElementById('cart-total');

    if (elemSubtotal) elemSubtotal.textContent = '$' + totales.subtotal.toLocaleString('es-CL');
    if (elemIva) elemIva.textContent = '$' + totales.iva.toLocaleString('es-CL');
    if (elemTotal) elemTotal.textContent = '$' + totales.total.toLocaleString('es-CL');
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorBadge();
    renderizarTablaCarrito();

    const btnVaciar = document.getElementById('btn-vaciar-carrito');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', vaciarCarrito);
    }

    const btnCheckout = document.getElementById('btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            const carrito = obtenerCarrito();
            if (carrito.length === 0) {
                alert('El carrito está vacío.');
                return;
            }
            const totales = calcularTotalesFinancieros();
            const numPedido = 'SV-' + Math.floor(100000 + Math.random() * 900000);
            alert(`¡Gracias por tu compra en Sonido Vivo Viña del Mar!\n\nN° Pedido: ${numPedido}\nTotal Pagado: $${totales.total.toLocaleString('es-CL')} CLP\n\nTe hemos enviado los datos de seguimiento a tu correo registrado.`);
            localStorage.removeItem(CLAVE_STORAGE);
            actualizarContadorBadge();
            renderizarTablaCarrito();
        });
    }
});
