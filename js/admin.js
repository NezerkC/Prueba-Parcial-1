const STORAGE_INVENTARIO = 'sonido_vivo_inventario_v1';
const STORAGE_USUARIOS = 'sonido_vivo_usuarios_v1';


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