// Artículos del blog, portados desde base html/pages/blogs.html y blog-detalle.html
// El contenido se guarda como JSX para conservar <strong> y <em> del original.

export const ARTICULOS_BLOG = [
  {
    id: '1',
    categoriaListado: 'LUTHERÍA & MANTENIMIENTO',
    categoria: 'Luthería y Cuidados',
    fecha: '5 de Septiembre, 2026',
    fechaListado: '5 DE SEPTIEMBRE, 2026',
    titulo: 'Cómo Proteger tu Guitarra de la Humedad y Salinidad en Viña del Mar',
    tituloCorto: 'Guitarras y Humedad',
    migaDePan: 'Guitarras y Humedad en Viña del Mar',
    tituloPestana: 'Sonido Vivo | Cuidado de Guitarras y Humedad',
    resumen:
      'Vivir cerca del océano tiene una magia única para componer, pero el aire marino y la humedad costera de la V Región pueden oxidar trastes y descalibrar el mástil en semanas si no tomás estas 4 medidas preventivas.',
    miniatura: '/assets/img/thumb_guitarra_humedad.jpg',
    altMiniatura: 'Cómo proteger tu guitarra de la humedad',
    etiquetaVideo: 'Video Guía',
    autor: 'Rodrigo Tapia (Luthier Jefe Sonido Vivo)',
    lectura: '4 min de lectura',
    video: {
      src: '/assets/img/Proteger_guitarra_de_humedad_1080p_202609081822.mp4',
      poster: '/assets/img/thumb_guitarra_humedad.jpg',
      descripcion:
        'Demostración práctica: Técnicas de limpieza y protección contra salinidad en nuestro taller de Viña del Mar.',
    },
    introduccion: (
      <>
        En ciudades costeras como <strong>Viña del Mar, Valparaíso y Concón</strong>,
        la humedad relativa del aire suele superar habitualmente el 75% o incluso
        85% durante las mañanas de vaguada costera. Para las maderas de
        instrumentos acústicos y eléctricos, esto representa un desafío mayúsculo
        que puede arruinar una guitarra si no se toman medidas a tiempo.
      </>
    ),
    secciones: [
      {
        titulo: '1. El Alma del Mástil (Truss Rod) y la Curvatura',
        texto: (
          <>
            La madera absorbe la humedad ambiental expandiéndose. En guitarras
            con diapasón de palisandro o arce, esto provoca que el mástil tienda a
            arquearse hacia adelante (bow), elevando la acción de las cuerdas y
            volviendo el instrumento duro y desafinado en los trastes agudos.
            Recomendamos chequear la curvatura una vez por mes con una regla de
            precisión y llave Allen adecuada.
          </>
        ),
      },
      {
        titulo: '2. Oxidación Rápida de Trastes de Níquel y Cuerdas',
        texto: (
          <>
            La salinidad arrastrada por la brisa marina acelera la corrosión
            galvánica de las cuerdas de acero niquelado. Al terminar de tocar,{' '}
            <em>siempre pasá un paño de microfibra seco</em> por cada cuerda y
            aplicá un limpiador de diapasón a base de aceite de limón para sellar
            los poros de la madera.
          </>
        ),
      },
      {
        titulo: '3. El Secreto del Silica Gel dentro de la Funda',
        texto: (
          <>
            Nunca dejes tu guitarra colgada de la pared expuesta a ventanas
            durante la noche. Guardala siempre en su estuche rígido o funda
            acolchada con al menos{' '}
            <strong>2 bolsitas de gel de sílice (Silica Gel)</strong> renovadas
            cada trimestre. Esto absorbe el exceso de condensación y mantiene el
            microclima entre el 45% y 55% de humedad relativa, el rango ideal de
            calibración de fábrica.
          </>
        ),
      },
    ],
  },
  {
    id: '2',
    categoriaListado: 'AUDIO EN VIVO & ESTUDIO',
    categoria: 'Audio Profesional',
    fecha: '28 de Agosto, 2026',
    fechaListado: '28 DE AGOSTO, 2026',
    titulo: 'Shure SM58 vs SM57: ¿Cuál es el Micrófono Definitivo para tu Banda?',
    tituloCorto: 'Shure SM58 vs SM57',
    migaDePan: 'Shure SM58 vs SM57',
    tituloPestana: 'Sonido Vivo | Shure SM58 vs SM57',
    resumen:
      'Ambos son leyendas indestructibles del rock y la música en vivo, pero sus respuestas de frecuencia y rejillas marcan diferencias cruciales entre la voz principal y la captura de un amplificador de guitarra.',
    miniatura: '/assets/img/thumb_shure_mics.jpg',
    altMiniatura: 'Comparativa Shure SM58 vs SM57',
    etiquetaVideo: 'Video Comparativa',
    autor: 'Andrés Silva (Ingeniero de Sonido Sonido Vivo)',
    lectura: '5 min de lectura',
    video: {
      src: '/assets/img/Shure_microphones_compared_1080p_202609081822.mp4',
      poster: '/assets/img/thumb_shure_mics.jpg',
      descripcion:
        'Comparativa en video: Shure SM58 vs SM57 en respuesta sonora y aplicaciones de escenario.',
    },
    introduccion: (
      <>
        Desde su lanzamiento en la década de 1960 por la firma estadounidense{' '}
        <strong>Shure</strong>, el <strong>SM58</strong> y el <strong>SM57</strong>{' '}
        se han convertido en los micrófonos dinámicos cardioides más vendidos y
        utilizados en la historia de la música grabada y el sonido en vivo.
        Aunque comparten casi la misma cápsula interna (el transductor Unidyne
        III), su diseño acústico exterior genera diferencias que debés conocer
        antes de invertir tu presupuesto.
      </>
    ),
    secciones: [
      {
        titulo: '1. La Rejilla Esférica y el Filtro Antipop del SM58',
        texto: (
          <>
            El <strong>Shure SM58</strong> posee una rejilla esférica de acero
            reforzado que aloja un filtro de espuma interior. Esto está diseñado
            específicamente para dispersar las consonantes oclusivas (&apos;P&apos;,
            &apos;B&apos;, &apos;T&apos;) que producen golpes de aire violentos sobre el diafragma
            al cantar de cerca. Es la elección indiscutible para vocalistas
            principales y coros en escenarios en vivo.
          </>
        ),
      },
      {
        titulo: '2. La Respuesta en Frecuencia y Proximidad del SM57',
        texto: (
          <>
            El <strong>Shure SM57</strong> prescinde de la bola protectora y
            utiliza una rejilla cilíndrica más compacta. Esto permite acercar el
            elemento transductor a apenas milímetros de la fuente sonora,
            aprovechando al máximo el <em>efecto de proximidad</em>. Es el
            estándar de oro para microfonear la caja (redoblante) de una batería,
            amplificadores de guitarra eléctrica (como un Marshall o Fender
            Frontman) y metales como trompetas y saxofones.
          </>
        ),
      },
      {
        titulo: '3. El Veredicto de Sonido Vivo',
        texto: (
          <>
            Si sos vocalista, tu primera compra obligatoria debe ser el{' '}
            <strong>SM58</strong>. Si tenés una banda o estás montando tu home
            studio en Viña del Mar y necesitás capturar instrumentos con punch y
            definición, el <strong>SM57</strong> es el micrófono más versátil del
            planeta. Disponemos de ambos modelos con entrega inmediata en nuestra
            tienda.
          </>
        ),
      },
    ],
  },
];

// Igual que el script original: si el id no existe, se muestra el primer artículo.
export function obtenerArticuloBlog(id) {
  return ARTICULOS_BLOG.find((articulo) => articulo.id === id) ?? ARTICULOS_BLOG[0];
}
