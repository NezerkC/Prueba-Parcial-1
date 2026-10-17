import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import IdentidadCard from '../components/nosotros/IdentidadCard';
import ValorItem from '../components/nosotros/ValorItem';

const IDENTIDAD = [
  {
    icono: '🌊',
    titulo: 'Nuestra Historia',
    texto: (
      <>
        Fundada en 2015 en el corazón comercial de Viña del Mar,{' '}
        <strong>Sonido Vivo</strong> surgió como respuesta a la falta de
        asesoría técnica calificada en la Región de Valparaíso. Empezamos con
        un modesto stock de cuerdas y guitarras acústicas, y hoy somos el
        distribuidor autorizado de más de 300 referencias de clase mundial.
      </>
    ),
  },
  {
    icono: '🎯',
    titulo: 'Misión',
    texto:
      'Proveer a músicos principiantes, profesionales, escuelas de música y salas de eventos de instrumentos de la más alta calidad, acompañados de un servicio personalizado de luthería y soporte posventa transparente.',
  },
  {
    icono: '🚀',
    titulo: 'Visión',
    texto:
      'Ser reconocidos como el ecosistema de audio e instrumentos musicales más confiable y moderno de Chile, integrando la experiencia cálida de nuestra tienda física con una plataforma web ágil y moderna.',
  },
];

const SELLOS = [
  'Asesoría Técnica Personalizada',
  'Taller de Luthería Propio',
  'Alianza Formativa Duoc UC',
];

const VALORES = [
  {
    titulo: 'Taller de Luthería Propio',
    texto:
      'Cada instrumento es desempacado, inspeccionado y calibrado según la humedad costera de nuestra zona antes de ser entregado.',
  },
  {
    titulo: 'Alianza con Duoc UC',
    texto:
      'Brindamos beneficios exclusivos y asesoría a las carreras de música, sonido y diseño de la sede Viña del Mar.',
  },
  {
    titulo: 'Stock Real y Garantizado',
    texto:
      'Lo que ves en nuestro catálogo digital está efectivamente en nuestras bodegas físicas de Viña del Mar.',
  },
];

function Nosotros() {
  return (
    <>
      {/* Hero Sección Nosotros */}
      <section className="hero-section nosotros-hero">
        <div className="hero-content">
          <span className="hero-tag">Nuestra Identidad Musical</span>
          <h1 className="hero-title">
            11 Años Equipando a los Músicos de <span>Viña del Mar</span>
          </h1>
          <p className="hero-subtitle">
            Nacimos de la pasión por los escenarios en vivo, las salas de ensayo
            y el compromiso de entregar instrumentos calibrados de verdad.
          </p>
        </div>
      </section>

      {/* Misión, Visión y Trayectoria */}
      <Row className="g-4 nosotros-identidad">
        {IDENTIDAD.map((item) => (
          <Col md={6} lg={4} key={item.titulo}>
            <IdentidadCard icono={item.icono} titulo={item.titulo}>
              {item.texto}
            </IdentidadCard>
          </Col>
        ))}
      </Row>

      {/* Sección: El Problema y Nuestra Solución */}
      <section className="form-card nosotros-panel nosotros-panel--destacado">
        <div className="solution-grid">
          <div>
            <span className="badge badge-category nosotros-solucion-badge">
              Origen &amp; Solución
            </span>
            <h2 className="nosotros-solucion-title">
              El Problema que Detectamos y Cómo lo Solucionamos
            </h2>
            <p className="nosotros-text mb-3">
              Durante años, los músicos, estudiantes y docentes de Viña del Mar
              y la Región de Valparaíso enfrentaron un problema constante:
              adquirir instrumentos sin ajuste técnico previo a las duras
              condiciones de humedad costera, en tiendas sin personal
              especializado para guiarlos.
            </p>
            <p className="nosotros-text mb-3">
              <strong>Nuestra solución fue clara y contundente:</strong> crear
              una tienda-taller atendida exclusivamente por músicos calificados,
              con servicio de luthería integrado y convenios de apoyo directo a
              la comunidad académica de Duoc UC.
            </p>
            <div className="nosotros-sellos">
              {SELLOS.map((sello) => (
                <span className="badge badge-ok" key={sello}>
                  ✓ {sello}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="video-card-container nosotros-video">
              <video
                controls
                poster="/assets/img/thumb_ayuda.jpg"
                preload="metadata"
                playsInline
                className="responsive-video"
              >
                <source
                  src="/assets/img/Persona_contando_ayuda.mp4"
                  type="video/mp4"
                />
                Tu navegador no soporta reproducción de video HTML5.
              </video>
            </div>
            <p className="nosotros-video-caption">
              Explicación y testimonio: Cómo resolvemos las necesidades técnicas
              de nuestra comunidad musical
            </p>
          </div>
        </div>
      </section>

      {/* Valores y Compromiso Local */}
      <section className="form-card nosotros-panel">
        <h2 className="mb-3">¿Por Qué Elegir Sonido Vivo?</h2>
        <Row as="ul" className="g-3 list-unstyled mb-0">
          {VALORES.map((valor) => (
            <Col as="li" md={6} lg={4} key={valor.titulo}>
              <ValorItem titulo={valor.titulo} texto={valor.texto} />
            </Col>
          ))}
        </Row>
      </section>

      {/* Llamado a la acción */}
      <div className="d-flex flex-wrap justify-content-center gap-3 my-4">
        <Link to="/productos" className="btn btn-primary">
          Ver Nuestro Catálogo Disponible
        </Link>
        <Link to="/contacto" className="btn btn-secondary">
          Visitar Nuestra Tienda
        </Link>
      </div>
    </>
  );
}

export default Nosotros;
