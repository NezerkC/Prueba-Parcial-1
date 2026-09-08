/**
 * --------------------------------------------------------------------------
 * NOMBRE:       Catálogo Maestro de Instrumentos y Equipos de Audio (Forma B)
 * AFECTA A:     Estructura global de datos PRODUCTOS_SONIDO_VIVO (51 items)
 * QUÉ HACE:     Almacena especificaciones, categorías, precios y umbrales de stock base
 * CÓMO LO HACE: Arreglo inmutable de objetos JavaScript con claves normalizadas (código, marca, etc.)
 * --------------------------------------------------------------------------
 */
const PRODUCTOS_SONIDO_VIVO = [
    {
        "codigo": "GA001",
        "imagen": "GA001.jpg",
        "categoria": "Guitarras Acústicas",
        "nombre": "Guitarra Acústica Folk",
        "marca": "Yamaha",
        "modelo": "F310",
        "stock": 8,
        "precio": 129990,
        "descripcion": "Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes.",
        "icono": "🎸",
        "stockCritico": 3
    },
    {
        "codigo": "GA002",
        "imagen": "GA002.jpg",
        "categoria": "Guitarras Acústicas",
        "nombre": "Guitarra Acústica Dreadnought",
        "marca": "Fender",
        "modelo": "CD-60S",
        "stock": 5,
        "precio": 189990,
        "descripcion": "Tapa de abeto macizo, brazo de caoba. Sonido cálido y proyectado.",
        "icono": "🎸",
        "stockCritico": 3
    },
    {
        "codigo": "GA003",
        "imagen": "GA003.jpg",
        "categoria": "Guitarras Acústicas",
        "nombre": "Guitarra Acústica Clásica 4/4",
        "marca": "Yamaha",
        "modelo": "C40",
        "stock": 10,
        "precio": 89990,
        "descripcion": "Nailon, tapa de abeto. Ideal para estudio y flamenco.",
        "icono": "🎸",
        "stockCritico": 3
    },
    {
        "codigo": "GA004",
        "imagen": "GA004.jpg",
        "categoria": "Guitarras Acústicas",
        "nombre": "Guitarra Electroacústica",
        "marca": "Takamine",
        "modelo": "GN20CE",
        "stock": 3,
        "precio": 349990,
        "descripcion": "Pickup integrado, afinador incorporado.",
        "icono": "🎸",
        "stockCritico": 3
    },
    {
        "codigo": "GA005",
        "imagen": "GA005.jpg",
        "categoria": "Guitarras Acústicas",
        "nombre": "Guitarra 3/4 Niños",
        "marca": "Yamaha",
        "modelo": "JR1",
        "stock": 6,
        "precio": 79990,
        "descripcion": "Tamaño reducido para niños de 6 a 10 años.",
        "icono": "🎸",
        "stockCritico": 3
    },
    {
        "codigo": "GE001",
        "imagen": "GE001.jpg",
        "categoria": "Guitarras Eléctricas",
        "nombre": "Guitarra Eléctrica Stratocaster",
        "marca": "Squier",
        "modelo": "Affinity Strat",
        "stock": 5,
        "precio": 249990,
        "descripcion": "Cuerpo de álamo, mástil de arce, pastillas SSS.",
        "icono": "⚡🎸",
        "stockCritico": 3
    },
    {
        "codigo": "GE002",
        "imagen": "GE002.jpg",
        "categoria": "Guitarras Eléctricas",
        "nombre": "Guitarra Eléctrica Les Paul",
        "marca": "Epiphone",
        "modelo": "Les Paul Std",
        "stock": 4,
        "precio": 329990,
        "descripcion": "Cuerpo caoba, tapa arce, pastillas humbucker.",
        "icono": "⚡🎸",
        "stockCritico": 3
    },
    {
        "codigo": "GE003",
        "imagen": "GE003.jpg",
        "categoria": "Guitarras Eléctricas",
        "nombre": "Guitarra Eléctrica SG",
        "marca": "Epiphone",
        "modelo": "SG Standard",
        "stock": 3,
        "precio": 319990,
        "descripcion": "Cuerpo caoba, mástil caoba, 2 humbuckers.",
        "icono": "⚡🎸",
        "stockCritico": 3
    },
    {
        "codigo": "GE004",
        "imagen": "GE004.jpg",
        "categoria": "Guitarras Eléctricas",
        "nombre": "Guitarra Eléctrica Telecaster",
        "marca": "Squier",
        "modelo": "Affinity Tele",
        "stock": 4,
        "precio": 239990,
        "descripcion": "Cuerpo álamo, clavijero vintage, 2 pastillas single.",
        "icono": "⚡🎸",
        "stockCritico": 3
    },
    {
        "codigo": "GE005",
        "imagen": "GE005.jpg",
        "categoria": "Guitarras Eléctricas",
        "nombre": "Guitarra Eléctrica Semi-hollow",
        "marca": "Epiphone",
        "modelo": "ES-335",
        "stock": 2,
        "precio": 549990,
        "descripcion": "Semi-hueca, 2 humbuckers, ideal para jazz y blues.",
        "icono": "⚡🎸",
        "stockCritico": 3
    },
    {
        "codigo": "BA001",
        "imagen": "BA001.jpg",
        "categoria": "Bajos Eléctricos",
        "nombre": "Bajo Eléctrico 4 Cuerdas",
        "marca": "Squier",
        "modelo": "Affinity PJ",
        "stock": 5,
        "precio": 299990,
        "descripcion": "Pickup PJ, cuerpo álamo, mástil arce.",
        "icono": "🎸",
        "stockCritico": 3
    },
    {
        "codigo": "BA002",
        "imagen": "BA002.jpg",
        "categoria": "Bajos Eléctricos",
        "nombre": "Bajo Eléctrico Jazz Bass",
        "marca": "Fender",
        "modelo": "Player Jazz",
        "stock": 2,
        "precio": 699990,
        "descripcion": "Alder body, 2 Alnico V Jazz single-coil.",
        "icono": "🎸",
        "stockCritico": 3
    },
    {
        "codigo": "BA003",
        "imagen": "BA003.jpg",
        "categoria": "Bajos Eléctricos",
        "nombre": "Bajo Acústico 4 Cuerdas",
        "marca": "Yamaha",
        "modelo": "APX700II",
        "stock": 2,
        "precio": 429990,
        "descripcion": "Electroacústico, afinador incorporado.",
        "icono": "🎸",
        "stockCritico": 3
    },
    {
        "codigo": "BT001",
        "imagen": "BT001.jpg",
        "categoria": "Baterías",
        "nombre": "Batería Acústica 5 piezas",
        "marca": "Pearl",
        "modelo": "Roadshow",
        "stock": 2,
        "precio": 599990,
        "descripcion": "Incluye stands, platillos y pedal de bombo.",
        "icono": "🥁",
        "stockCritico": 3
    },
    {
        "codigo": "BT002",
        "imagen": "BT002.jpg",
        "categoria": "Baterías",
        "nombre": "Batería Electrónica 8 pads",
        "marca": "Roland",
        "modelo": "TD-02KV",
        "stock": 2,
        "precio": 799990,
        "descripcion": "Módulo TD-02, 8 pads de goma, pedal hi-hat.",
        "icono": "🥁",
        "stockCritico": 3
    },
    {
        "codigo": "BT003",
        "imagen": "BT003.jpg",
        "categoria": "Baterías",
        "nombre": "Caja Snare 14\"",
        "marca": "Pearl",
        "modelo": "STE1450",
        "stock": 4,
        "precio": 89990,
        "descripcion": "Acero, 14x5\", 10 tensores.",
        "icono": "🥁",
        "stockCritico": 3
    },
    {
        "codigo": "BT004",
        "imagen": "BT004.jpg",
        "categoria": "Baterías",
        "nombre": "Platillo Hi-Hat 14\"",
        "marca": "Zildjian",
        "modelo": "A Series",
        "stock": 3,
        "precio": 149990,
        "descripcion": "Latón B20, sonido brillante y claro.",
        "icono": "🥁",
        "stockCritico": 3
    },
    {
        "codigo": "BT005",
        "imagen": "BT005.jpg",
        "categoria": "Baterías",
        "nombre": "Platillo Crash 16\"",
        "marca": "Zildjian",
        "modelo": "A Series",
        "stock": 3,
        "precio": 129990,
        "descripcion": "Latón B20, ataque rápido.",
        "icono": "🥁",
        "stockCritico": 3
    },
    {
        "codigo": "TC001",
        "imagen": "TC001.jpg",
        "categoria": "Teclados y Pianos",
        "nombre": "Teclado Digital 61 teclas",
        "marca": "Yamaha",
        "modelo": "PSR-E373",
        "stock": 4,
        "precio": 249990,
        "descripcion": "61 teclas sensibles al tacto, 622 voces.",
        "icono": "🎹",
        "stockCritico": 3
    },
    {
        "codigo": "TC002",
        "imagen": "TC002.jpg",
        "categoria": "Teclados y Pianos",
        "nombre": "Piano Digital 88 teclas",
        "marca": "Yamaha",
        "modelo": "P-45",
        "stock": 2,
        "precio": 499990,
        "descripcion": "88 teclas pesadas, 10 voces, pedal sustain incluido.",
        "icono": "🎹",
        "stockCritico": 3
    },
    {
        "codigo": "TC003",
        "imagen": "TC003.jpg",
        "categoria": "Teclados y Pianos",
        "nombre": "Sintetizador 49 teclas",
        "marca": "Arturia",
        "modelo": "MiniLab MKII",
        "stock": 5,
        "precio": 129990,
        "descripcion": "MIDI controller, 49 mini teclas.",
        "icono": "🎹",
        "stockCritico": 3
    },
    {
        "codigo": "TC004",
        "imagen": "TC004.jpg",
        "categoria": "Teclados y Pianos",
        "nombre": "Teclado MIDI 88 teclas",
        "marca": "M-Audio",
        "modelo": "Hammer 88",
        "stock": 2,
        "precio": 399990,
        "descripcion": "88 teclas martillo, sin sonidos propios.",
        "icono": "🎹",
        "stockCritico": 3
    },
    {
        "codigo": "AM001",
        "imagen": "AM001.jpg",
        "categoria": "Amplificadores",
        "nombre": "Amplificador Guitarra 15W",
        "marca": "Fender",
        "modelo": "Frontman 15G",
        "stock": 5,
        "precio": 99990,
        "descripcion": "15W, distorsión incorporada, entrada auxiliar.",
        "icono": "🔊",
        "stockCritico": 3
    },
    {
        "codigo": "AM002",
        "imagen": "AM002.jpg",
        "categoria": "Amplificadores",
        "nombre": "Amplificador Guitarra 40W",
        "marca": "Marshall",
        "modelo": "MG40GFX",
        "stock": 3,
        "precio": 299990,
        "descripcion": "40W, 4 canales, efectos digitales integrados.",
        "icono": "🔊",
        "stockCritico": 3
    },
    {
        "codigo": "AM003",
        "imagen": "AM003.jpg",
        "categoria": "Amplificadores",
        "nombre": "Amplificador Bajo 100W",
        "marca": "Hartke",
        "modelo": "HD100",
        "stock": 2,
        "precio": 449990,
        "descripcion": "100W, tweeter integrado, ecualizador de 4 bandas.",
        "icono": "🔊",
        "stockCritico": 3
    },
    {
        "codigo": "AM004",
        "imagen": "AM004.jpg",
        "categoria": "Amplificadores",
        "nombre": "Amplificador Acústico 40W",
        "marca": "Fishman",
        "modelo": "Loudbox Mini",
        "stock": 2,
        "precio": 499990,
        "descripcion": "60W, 2 canales, reverb y chorus incorporados.",
        "icono": "🔊",
        "stockCritico": 3
    },
    {
        "codigo": "MI001",
        "imagen": "MI001.jpg",
        "categoria": "Micrófonos",
        "nombre": "Micrófono Dinámico Cardioide",
        "marca": "Shure",
        "modelo": "SM58",
        "stock": 8,
        "precio": 149990,
        "descripcion": "Estándar industria para voz en vivo.",
        "icono": "🎙️",
        "stockCritico": 3
    },
    {
        "codigo": "MI002",
        "imagen": "MI002.jpg",
        "categoria": "Micrófonos",
        "nombre": "Micrófono Dinámico Instrumento",
        "marca": "Shure",
        "modelo": "SM57",
        "stock": 6,
        "precio": 139990,
        "descripcion": "Ideal para captura de instrumentos y amplificadores.",
        "icono": "🎙️",
        "stockCritico": 3
    },
    {
        "codigo": "MI003",
        "imagen": "MI003.jpg",
        "categoria": "Micrófonos",
        "nombre": "Micrófono Condensador",
        "marca": "Audio-Tech.",
        "modelo": "AT2020",
        "stock": 4,
        "precio": 199990,
        "descripcion": "Cardioide, XLR, ideal para grabación en estudio.",
        "icono": "🎙️",
        "stockCritico": 3
    },
    {
        "codigo": "MI004",
        "imagen": "MI004.jpg",
        "categoria": "Micrófonos",
        "nombre": "Micrófono USB de Condensador",
        "marca": "Blue",
        "modelo": "Yeti",
        "stock": 5,
        "precio": 299990,
        "descripcion": "USB, 4 patrones polares, ideal para streaming y podcast.",
        "icono": "🎙️",
        "stockCritico": 3
    },
    {
        "codigo": "PE001",
        "imagen": "PE001.jpg",
        "categoria": "Pedales de Efectos",
        "nombre": "Pedal Distorsión",
        "marca": "Boss",
        "modelo": "DS-1",
        "stock": 7,
        "precio": 79990,
        "descripcion": "Clásico pedal de distorsión, 3 controles.",
        "icono": "🎛️",
        "stockCritico": 3
    },
    {
        "codigo": "PE002",
        "imagen": "PE002.jpg",
        "categoria": "Pedales de Efectos",
        "nombre": "Pedal Reverb",
        "marca": "Boss",
        "modelo": "RV-6",
        "stock": 4,
        "precio": 179990,
        "descripcion": "8 modos de reverb, control de shimmer.",
        "icono": "🎛️",
        "stockCritico": 3
    },
    {
        "codigo": "PE003",
        "imagen": "PE003.jpg",
        "categoria": "Pedales de Efectos",
        "nombre": "Pedal Multi-efectos",
        "marca": "Boss",
        "modelo": "ME-80",
        "stock": 2,
        "precio": 349990,
        "descripcion": "Diseño tipo pedalboard, 8 efectos simultáneos.",
        "icono": "🎛️",
        "stockCritico": 3
    },
    {
        "codigo": "PE004",
        "imagen": "PE004.jpg",
        "categoria": "Pedales de Efectos",
        "nombre": "Pedal Tuner Cromático",
        "marca": "Boss",
        "modelo": "TU-3",
        "stock": 8,
        "precio": 89990,
        "descripcion": "Afinador cromático, indicador de tono.",
        "icono": "🎛️",
        "stockCritico": 3
    },
    {
        "codigo": "PE005",
        "imagen": "PE005.jpg",
        "categoria": "Pedales de Efectos",
        "nombre": "Pedal Delay",
        "marca": "MXR",
        "modelo": "Carbon Copy",
        "stock": 4,
        "precio": 179990,
        "descripcion": "Delay analógico cálido, tiempo 600ms.",
        "icono": "🎛️",
        "stockCritico": 3
    },
    {
        "codigo": "PE006",
        "imagen": "PE006.jpg",
        "categoria": "Pedales de Efectos",
        "nombre": "Pedal Overdrive",
        "marca": "Ibanez",
        "modelo": "TS9",
        "stock": 6,
        "precio": 99990,
        "descripcion": "Tube Screamer clásico, sonido suave y orgánico.",
        "icono": "🎛️",
        "stockCritico": 3
    },
    {
        "codigo": "AC001",
        "imagen": "AC001.jpg",
        "categoria": "Accesorios",
        "nombre": "Cuerdas Guitarra Eléctrica 09-42",
        "marca": "Ernie Ball",
        "modelo": "Super Slinky",
        "stock": 25,
        "precio": 8990,
        "descripcion": "Juego 6 cuerdas, calibre ligero.",
        "icono": "🎼",
        "stockCritico": 3
    },
    {
        "codigo": "AC002",
        "imagen": "AC002.jpg",
        "categoria": "Accesorios",
        "nombre": "Cuerdas Guitarra Acústica 12-53",
        "marca": "Ernie Ball",
        "modelo": "Earthwood",
        "stock": 20,
        "precio": 10990,
        "descripcion": "Bronce fósforo, sonido cálido.",
        "icono": "🎼",
        "stockCritico": 3
    },
    {
        "codigo": "AC003",
        "imagen": "AC003.jpg",
        "categoria": "Accesorios",
        "nombre": "Cuerdas Bajo 45-105",
        "marca": "Ernie Ball",
        "modelo": "Regular Slinky",
        "stock": 12,
        "precio": 14990,
        "descripcion": "Cuerdas de níquel enrollado, set 4 cuerdas.",
        "icono": "🎼",
        "stockCritico": 3
    },
    {
        "codigo": "AC004",
        "imagen": "AC004.jpg",
        "categoria": "Accesorios",
        "nombre": "Púas de Guitarra x10 (0.73mm)",
        "marca": "Fender",
        "modelo": "351",
        "stock": 50,
        "precio": 3990,
        "descripcion": "Celulosa, grosor medio.",
        "icono": "🎼",
        "stockCritico": 3
    },
    {
        "codigo": "AC005",
        "imagen": "AC005.jpg",
        "categoria": "Accesorios",
        "nombre": "Capotraste Guitarra",
        "marca": "Dunlop",
        "modelo": "Trigger",
        "stock": 15,
        "precio": 12990,
        "descripcion": "Capotraste de resorte, compatible 6 cuerdas.",
        "icono": "🎼",
        "stockCritico": 3
    },
    {
        "codigo": "AC006",
        "imagen": "AC006.jpg",
        "categoria": "Accesorios",
        "nombre": "Afinador de Clip",
        "marca": "Snark",
        "modelo": "SN-5",
        "stock": 20,
        "precio": 8990,
        "descripcion": "Afinador cromático de clip, pantalla giratoria.",
        "icono": "🎼",
        "stockCritico": 3
    },
    {
        "codigo": "AC007",
        "imagen": "AC007.jpg",
        "categoria": "Accesorios",
        "nombre": "Cable Instrumento 3m",
        "marca": "Monster",
        "modelo": "S100-I-3",
        "stock": 15,
        "precio": 12990,
        "descripcion": "Cable trenzado, conectores dorados, 3 metros.",
        "icono": "🎼",
        "stockCritico": 3
    },
    {
        "codigo": "AC008",
        "imagen": "AC008.jpg",
        "categoria": "Accesorios",
        "nombre": "Cable Instrumento 6m",
        "marca": "Monster",
        "modelo": "S100-I-6",
        "stock": 10,
        "precio": 17990,
        "descripcion": "Cable trenzado, conectores dorados, 6 metros.",
        "icono": "🎼",
        "stockCritico": 3
    },
    {
        "codigo": "AC009",
        "imagen": "AC009.jpg",
        "categoria": "Accesorios",
        "nombre": "Soporte Guitarra de Piso",
        "marca": "Hercules",
        "modelo": "GS302B",
        "stock": 12,
        "precio": 22990,
        "descripcion": "Soporte plegable con enganche automático.",
        "icono": "🎼",
        "stockCritico": 3
    },
    {
        "codigo": "AC010",
        "imagen": "AC010.jpg",
        "categoria": "Accesorios",
        "nombre": "Soporte Guitarra de Pared",
        "marca": "Hercules",
        "modelo": "WAH-202",
        "stock": 10,
        "precio": 18990,
        "descripcion": "Montaje a pared, enganche automático.",
        "icono": "🎼",
        "stockCritico": 3
    },
    {
        "codigo": "ES001",
        "imagen": "ES001.jpg",
        "categoria": "Estudio y Grabación",
        "nombre": "Interfaz de Audio 2x2 USB",
        "marca": "Focusrite",
        "modelo": "Scarlett Solo",
        "stock": 4,
        "precio": 149990,
        "descripcion": "1 entrada XLR+instrumento, 2 salidas, 24bit/192kHz.",
        "icono": "🎧",
        "stockCritico": 3
    },
    {
        "codigo": "ES002",
        "imagen": "ES002.jpg",
        "categoria": "Estudio y Grabación",
        "nombre": "Auriculares de Estudio",
        "marca": "Audio-Tech.",
        "modelo": "ATH-M20x",
        "stock": 6,
        "precio": 79990,
        "descripcion": "Circumaurales, respuesta 15Hz-20kHz.",
        "icono": "🎧",
        "stockCritico": 3
    },
    {
        "codigo": "ES003",
        "imagen": "ES003.jpg",
        "categoria": "Estudio y Grabación",
        "nombre": "Auriculares de Estudio Pro",
        "marca": "Audio-Tech.",
        "modelo": "ATH-M50x",
        "stock": 4,
        "precio": 219990,
        "descripcion": "Referencia de industria, sonido neutro y detallado.",
        "icono": "🎧",
        "stockCritico": 3
    },
    {
        "codigo": "ES004",
        "imagen": "ES004.jpg",
        "categoria": "Estudio y Grabación",
        "nombre": "Monitor de Estudio 5\"",
        "marca": "Yamaha",
        "modelo": "HS5",
        "stock": 2,
        "precio": 349990,
        "descripcion": "Altavoz activo, respuesta plana, ideal mezcla.",
        "icono": "🎧",
        "stockCritico": 3
    },
    {
        "codigo": "ES005",
        "imagen": "ES005.jpg",
        "categoria": "Estudio y Grabación",
        "nombre": "Pop Filter para Micrófono",
        "marca": "Sennheiser",
        "modelo": "MZP 40",
        "stock": 8,
        "precio": 14990,
        "descripcion": "Doble malla, brazo flexible con clip.",
        "icono": "🎧",
        "stockCritico": 3
    }
];

/**
 * --------------------------------------------------------------------------
 * NOMBRE:       Formateador de Moneda Local (Pesos Chilenos - CLP)
 * AFECTA A:     Etiquetas de precio en catálogo, ficha técnica y tablas
 * QUÉ HACE:     Convierte números en formato monetario chileno ($XXX.XXX) o '¡GRATIS!' si es 0
 * CÓMO LO HACE: toLocaleString('es-CL') con validación de valor cero
 * --------------------------------------------------------------------------
 */
function formatearPrecioCLP(precio) {
    const num = Number(precio);
    if (num === 0) {
        return '¡GRATIS / FREE!';
    }
    return '$' + num.toLocaleString('es-CL');
}

/**
 * --------------------------------------------------------------------------
 * NOMBRE:       Selector de Catálogo Activo y Persistente
 * AFECTA A:     Todas las vistas de catálogo y home
 * QUÉ HACE:     Carga inventario modificado desde LocalStorage o recurre al catálogo maestro
 * CÓMO LO HACE: localStorage.getItem('sonido_vivo_inventario_v1') con fallback transparente
 * --------------------------------------------------------------------------
 */
function obtenerCatalogoActivo() {
    const guardados = localStorage.getItem('sonido_vivo_inventario_v1');
    if (guardados) {
        try {
            const list = JSON.parse(guardados);
            if (Array.isArray(list) && list.length > 0) {
                return list.map(item => {
                    if (!item.imagen) {
                        const maestro = PRODUCTOS_SONIDO_VIVO.find(m => m.codigo === item.codigo);
                        item.imagen = (maestro && maestro.imagen) ? maestro.imagen : `${item.codigo}.jpg`;
                    }
                    return item;
                });
            }
        } catch (e) {
            console.error('Error al parsear inventario de LocalStorage:', e);
        }
    }
    return PRODUCTOS_SONIDO_VIVO;
}

/**
 * --------------------------------------------------------------------------
 * NOMBRE:       Renderizador Universal de Grillas de Productos
 * AFECTA A:     #grid-productos, #grid-destacados
 * QUÉ HACE:     Inyecta tarjetas semánticas <article> con badges, precios y botones de compra
 * CÓMO LO HACE: Array.map() generando HTML dinámico con eventos 'click' delegados a btn-add-cart
 * --------------------------------------------------------------------------
 */
/**
 * --------------------------------------------------------------------------
 * NOMBRE:       Base de Assets e Helper Universal de Ruta de Imagen
 * AFECTA A:     Todas las vistas (index, catálogo, detalle, carrito, admin)
 * QUÉ HACE:     Calcula la ruta relativa hacia assets/img/ según la profundidad del archivo en el árbol
 * CÓMO LO HACE: Inspecciona window.location.pathname (/admin/ -> ../../, /pages/ -> ../, root -> assets/)
 * --------------------------------------------------------------------------
 */
function baseAssetsImg() {
    const p = (window.location.pathname || '').replace(/\\/g, '/');
    if (p.includes('/admin/')) return '../../assets/img/';
    if (p.includes('/pages/')) return '../assets/img/';
    return 'assets/img/';
}

function rutaImagen(prod) {
    if (!prod) return '';
    const archivo = typeof prod === 'string'
        ? prod
        : (prod.imagen || (prod.codigo ? `${prod.codigo}.jpg` : ''));
    if (!archivo) return '';
    if (/^(https?:|data:|\/\/)/i.test(archivo)) return archivo;
    return baseAssetsImg() + archivo;
}

/**
 * --------------------------------------------------------------------------
 * NOMBRE:       Generador de Etiquetas de Imagen con Fallback Universal
 * QUÉ HACE:     Genera el HTML <img> con lazy-loading, alt descriptivo y fallback elegante al ícono
 * CÓMO LO HACE: Si la imagen no carga, oculta el tag <img> y activa el ícono semántico del producto
 * --------------------------------------------------------------------------
 */
function generarImgProductoHtml(prod, opciones = {}) {
    const src = rutaImagen(prod);
    const alt = (prod && prod.nombre) ? `${prod.nombre} (${prod.marca || ''} ${prod.modelo || ''})` : (prod.codigo || 'Instrumento');
    const icono = (prod && prod.icono) ? prod.icono : '🎵';
    const extraClass = opciones.className || '';
    const style = opciones.style || '';
    const fallbackSize = opciones.fallbackSize || '2.5rem';

    if (!src) {
        return `<div class="product-thumb-fallback ${extraClass}" style="font-size: ${fallbackSize};">${icono}</div>`;
    }

    return `
      <img src="${src}" alt="${alt}" loading="lazy" class="${extraClass}" style="${style}"
           onerror="this.onerror=null; this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
      <div class="product-thumb-fallback" style="display:none; font-size: ${fallbackSize}; align-items: center; justify-content: center;">${icono}</div>
    `.trim();
}

function renderizarProductosEnGrilla(productos, contenedorId = 'grid-productos') {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px;">
        <p style="font-size: 2.5rem; margin-bottom: 8px;">🔍</p>
        <h3 style="font-size: 1.3rem; margin-bottom: 8px;">No se encontraron instrumentos</h3>
        <p style="color: var(--color-text-muted);">Intenta cambiar el término de búsqueda o selecciona otra categoría.</p>
      </div>
    `;
        return;
    }

    contenedor.innerHTML = productos.map(p => {
        const esFree = Number(p.precio) === 0;
        const precioClass = esFree ? 'product-price free' : 'product-price';
        const linkDetalle = window.location.pathname.includes('/pages/')
            ? `producto-detalle.html?codigo=${p.codigo}`
            : `pages/producto-detalle.html?codigo=${p.codigo}`;

        return `
      <article class="product-card" data-codigo="${p.codigo}" data-categoria="${p.categoria}">
        <div class="product-thumb">
          ${generarImgProductoHtml(p, { fallbackSize: '2.5rem' })}
          <span class="product-thumb-indicator">${p.categoria.toUpperCase()}</span>
          <span class="product-code-tag">CÓD: ${p.codigo}</span>
        </div>
        <div class="product-info">
          <span class="product-brand">${p.marca || 'Sonido Vivo'}</span>
          <h3 class="product-title">${p.nombre}</h3>
          <p class="product-desc">${p.descripcion || (p.marca + ' ' + p.modelo)}</p>
          
          <div class="product-meta">
            <div>
              <span class="badge badge-category">${p.categoria}</span>
            </div>
            <span class="${precioClass}">${formatearPrecioCLP(p.precio)}</span>
          </div>

          <div class="product-actions">
            <a href="${linkDetalle}" class="btn btn-secondary btn-sm" style="flex: 1;">Ver Detalle</a>
            <button type="button" class="btn btn-primary btn-sm btn-add-cart" 
                    data-codigo="${p.codigo}">
              Añadir al Carro
            </button>
          </div>
        </div>
      </article>
    `;
    }).join('');

    // Vincular eventos click de botones Añadir
    contenedor.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const cod = btn.getAttribute('data-codigo');
            const prod = productos.find(item => item.codigo === cod);
            if (prod && typeof agregarProductoAlCarrito === 'function') {
                agregarProductoAlCarrito({
                    codigo: prod.codigo,
                    nombre: prod.nombre,
                    precio: prod.precio,
                    categoria: prod.categoria,
                    icono: prod.icono || '🎵',
                    imagen: prod.imagen || `${prod.codigo}.jpg`
                });
            }
        });
    });
}

/**
 * Renderiza los productos destacados en la Home (index.html).
 */
function inicializarDestacadosHome() {
    const contenedor = document.getElementById('grid-destacados');
    if (!contenedor) return;

    const catalogo = obtenerCatalogoActivo();
    const codigosDestacados = ['GA001', 'GE001', 'BA001', 'BT001', 'TC001', 'MI001'];
    const destacados = catalogo.filter(p => codigosDestacados.includes(p.codigo));

    renderizarProductosEnGrilla(destacados.length > 0 ? destacados : catalogo.slice(0, 6), 'grid-destacados');
}

/**
 * --------------------------------------------------------------------------
 * NOMBRE:       Motor de Filtros y Búsqueda en Vivo del Catálogo
 * AFECTA A:     input#buscar-producto, .category-chips, #grid-productos, #catalogo-contador
 * QUÉ HACE:     Filtra en tiempo real por texto (nombre/marca/código) y categoría seleccionada
 * CÓMO LO HACE: Eventos 'input' y 'click', filtrado reactivo con Array.filter() y actualización de contador
 * --------------------------------------------------------------------------
 */
function inicializarPaginaCatalogo() {
    const contenedor = document.getElementById('grid-productos');
    if (!contenedor) return;

    const catalogo = obtenerCatalogoActivo();
    let categoriaActual = 'TODAS';
    let busquedaActual = '';

    function aplicarFiltros() {
        let filtrados = catalogo;

        if (categoriaActual !== 'TODAS') {
            filtrados = filtrados.filter(p => p.categoria.toLowerCase() === categoriaActual.toLowerCase());
        }

        if (busquedaActual.trim() !== '') {
            const termino = busquedaActual.toLowerCase();
            filtrados = filtrados.filter(p =>
                p.nombre.toLowerCase().includes(termino) ||
                p.marca.toLowerCase().includes(termino) ||
                p.modelo.toLowerCase().includes(termino) ||
                p.codigo.toLowerCase().includes(termino)
            );
        }

        renderizarProductosEnGrilla(filtrados, 'grid-productos');
        const contador = document.getElementById('catalogo-contador');
        if (contador) contador.textContent = `Mostrando ${filtrados.length} de ${catalogo.length} instrumentos`;
    }

    // Buscador en vivo
    const searchInput = document.getElementById('buscar-producto');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            busquedaActual = e.target.value;
            aplicarFiltros();
        });
    }

    // Filtro de Categorías
    const chips = document.querySelectorAll('.category-chips .chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function () {
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            categoriaActual = this.getAttribute('data-categoria') || 'TODAS';
            aplicarFiltros();
        });
    });

    aplicarFiltros();
}


function inicializarDetalleProducto() {
    const contenedorDetalle = document.getElementById('detalle-producto-container');
    if (!contenedorDetalle) return;

    const urlParams = new URLSearchParams(window.location.search);
    const codigoBuscado = urlParams.get('codigo') || 'GA001';
    const catalogo = obtenerCatalogoActivo();
    const p = catalogo.find(item => item.codigo.toUpperCase() === codigoBuscado.toUpperCase()) || catalogo[0];

    if (!p) return;

    document.title = `Sonido Vivo | ${p.nombre} (${p.marca} ${p.modelo})`;

    const elemIcono = document.getElementById('det-icono');
    if (elemIcono) {
        elemIcono.innerHTML = generarImgProductoHtml(p, {
            style: 'max-height: 250px; max-width: 100%; object-fit: contain; display: block; margin: 0 auto; transition: transform 0.3s ease;',
            fallbackSize: '3.5rem'
        });
    }

    const elemTitulo = document.getElementById('det-nombre');
    if (elemTitulo) elemTitulo.textContent = p.nombre;

    const elemCodigo = document.getElementById('det-codigo');
    if (elemCodigo) elemCodigo.textContent = p.codigo;

    const elemMarca = document.getElementById('det-marca');
    if (elemMarca) elemMarca.textContent = p.marca;

    const elemModelo = document.getElementById('det-modelo');
    if (elemModelo) elemModelo.textContent = p.modelo;

    const elemCategoria = document.getElementById('det-categoria');
    if (elemCategoria) elemCategoria.textContent = p.categoria;

    const elemPrecio = document.getElementById('det-precio');
    if (elemPrecio) elemPrecio.textContent = formatearPrecioCLP(p.precio);

    const elemStock = document.getElementById('det-stock');
    if (elemStock) elemStock.textContent = `${p.stock} unidades disponibles`;

    const elemDesc = document.getElementById('det-descripcion');
    if (elemDesc) elemDesc.textContent = p.descripcion || 'Instrumento musical original con garantía oficial de Sonido Vivo Viña del Mar.';

    const btnAdd = document.getElementById('det-btn-add');
    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            const inputCant = document.getElementById('det-cantidad');
            const cant = inputCant ? parseInt(inputCant.value, 10) || 1 : 1;
            for (let i = 0; i < cant; i++) {
                if (typeof agregarProductoAlCarrito === 'function') {
                    agregarProductoAlCarrito({
                        codigo: p.codigo,
                        nombre: p.nombre,
                        precio: p.precio,
                        categoria: p.categoria,
                        icono: p.icono || '🎵',
                        imagen: p.imagen || `${p.codigo}.jpg`
                    });
                }
            }
        });
    }
}

/**
 * ============================================================================
 * SECCIÓN DE OBJETOS PROPIOS CREADOS POR EL PROGRAMADOR
 * ============================================================================
 * El desarrollador puede registrar aquí sus propios objetos o modelos.
 */
const OBJETOS_CREADOS_POR_PROGRAMADOR = [
    {
        id: 'OBJ-001',
        nombre: 'Objeto Base de Demostración',
        categoria: 'Módulo Propio',
        descripcion: 'Instancia de ejemplo inicial para verificar la estructura normalizada en el DOM.',
        precio: 0,
        estado: 'Activo'
    }
];

function inicializarSeccionObjetosPropios() {
    const contenedor = document.getElementById('grid-objetos-propios');
    if (!contenedor) return;

    const htmlObjetos = OBJETOS_CREADOS_POR_PROGRAMADOR.map(obj => `
    <article class="custom-card">
      <span class="product-code-tag">${obj.id}</span>
      <h4 style="font-size: 1rem; font-weight: 600; margin: 4px 0;">${obj.nombre}</h4>
      <p style="color: var(--color-text-muted); font-size: 0.85rem;">${obj.descripcion}</p>
      <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 700;">$${obj.precio.toLocaleString('es-CL')}</span>
        <span class="badge badge-ok">${obj.estado}</span>
      </div>
    </article>
  `).join('');

    contenedor.innerHTML = htmlObjetos + `
    <article class="custom-card placeholder">
      <span>+ Espacio disponible para tu siguiente objeto</span>
    </article>
  `;
}

// Auto-inicialización según la página
document.addEventListener('DOMContentLoaded', () => {
    inicializarDestacadosHome();
    inicializarPaginaCatalogo();
    inicializarDetalleProducto();
    inicializarSeccionObjetosPropios();
});
